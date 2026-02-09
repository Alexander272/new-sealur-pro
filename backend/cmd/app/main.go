package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/analytics"
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/files"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed"
	"github.com/Alexander272/new-sealur-pro/internal/mail"
	"github.com/Alexander272/new-sealur-pro/internal/migrate"
	"github.com/Alexander272/new-sealur-pro/internal/orders"
	"github.com/Alexander272/new-sealur-pro/internal/putg"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/internal/serrated"
	"github.com/Alexander272/new-sealur-pro/internal/server"
	"github.com/Alexander272/new-sealur-pro/internal/services"
	"github.com/Alexander272/new-sealur-pro/internal/snp"
	transport "github.com/Alexander272/new-sealur-pro/internal/transport/http"
	"github.com/Alexander272/new-sealur-pro/internal/wave"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
	"github.com/Alexander272/new-sealur-pro/pkg/database/postgres"
	"github.com/Alexander272/new-sealur-pro/pkg/database/redis"
	"github.com/Alexander272/new-sealur-pro/pkg/hasher"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/subosito/gotenv"
)

func main() {
	//* Init config
	if err := gotenv.Load("../.env"); err != nil {
		log.Fatalf("error loading env variables: %s", err.Error())
	}

	conf, err := config.Init("configs/config.yaml")
	if err != nil {
		log.Fatalf("error initializing configs: %s", err.Error())
	}
	logger.NewLogger(logger.WithLevel(conf.LogLevel), logger.WithAddSource(conf.LogSource))

	//* Dependencies
	db, err := postgres.NewPostgresDB(postgres.Config{
		Host:     conf.Postgres.Host,
		Port:     conf.Postgres.Port,
		Username: conf.Postgres.Username,
		Password: conf.Postgres.Password,
		DBName:   conf.Postgres.DbName,
		SSLMode:  conf.Postgres.SSLMode,
	})
	if err != nil {
		log.Fatalf("failed to initialize db: %s", err.Error())
	}

	memDB, err := redis.NewRedisClient(redis.Config{
		Host:     conf.Redis.Host,
		Port:     conf.Redis.Port,
		DB:       conf.Redis.DB,
		Password: conf.Redis.Password,
	})
	if err != nil {
		log.Fatalf("failed to initialize redis %s", err.Error())
	}

	tokenManager, err := auth.NewManager(conf.Auth.PublicKey, conf.Auth.PrivateKey)
	if err != nil {
		log.Fatalf("failed to initialize token manager: %s", err.Error())
	}
	hasher := hasher.NewSHA256Hasher(10)

	keycloak := auth.NewKeycloakClient(&auth.Deps{
		Url:       conf.Keycloak.Url,
		ClientIds: map[string]string{conf.Keycloak.Public.Realm: conf.Keycloak.Public.ClientId, conf.Keycloak.Private.Realm: conf.Keycloak.Private.ClientId},
		Realms:    []string{conf.Keycloak.Public.Realm, conf.Keycloak.Private.Realm},
		AdminName: conf.Keycloak.Root,
		AdminPass: conf.Keycloak.RootPass,
	})

	if err := migrate.Migrate(db.DB); err != nil {
		log.Fatalf("failed to migrate: %s", err.Error())
	}

	//* Services, Repos & API Handlers
	repos := repository.NewRepository(db, memDB)

	snpModule := snp.NewSnpModule(db, conf)
	putgModule := putg.NewPutgModule(db, conf)
	waveModule := wave.NewWaveModule(db)
	serratedModule := serrated.NewSerratedModule(db)
	jacketedModule := jacketed.NewJacketedModule(db)
	filesModule := files.NewFilesModule(db, conf)
	mailModule := mail.NewMailModule(conf)

	services := services.NewServices(services.Deps{
		Repos:        repos,
		TokenManager: tokenManager,
		Hasher:       hasher,
		Keycloak:     keycloak,
		Mail:         mailModule.Services,
		ConfirmTTL:   conf.Auth.ConfirmTTL,
		LimitTTL:     conf.Limiter.TTL,
		Links:        conf.Links,
		DataApi:      conf.DataApi,
	})
	handlers := transport.NewHandler(services, keycloak, tokenManager)

	ordersModule := orders.NewOrdersModule(&orders.Deps{
		DB:    db,
		Conf:  conf,
		Files: filesModule.Services,
		Mail:  mailModule.Services,
		User:  services.User,
	})
	analyticsModule := analytics.NewAnalyticsModule(db, conf)

	// handlers.Modules = append(handlers.Modules, snpModule)

	handlers.Modules = []transport.Modules{
		snpModule, putgModule, waveModule, serratedModule, jacketedModule,
		filesModule, mailModule,
		ordersModule, analyticsModule,
	}

	//* HTTP Server
	srv := server.NewServer(&conf.Http, handlers.Init(conf))
	go func() {
		if err := srv.Run(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("error occurred while running http server: %s\n", err.Error())
		}
	}()
	logger.Info("Application started on port: " + conf.Http.Port)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	<-quit

	const timeout = 5 * time.Second

	ctx, shutdown := context.WithTimeout(context.Background(), timeout)
	defer shutdown()

	if err := srv.Stop(ctx); err != nil {
		logger.Error("failed to stop server", logger.ErrAttr(err))
	}
}
