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

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/internal/server"
	"github.com/Alexander272/new-sealur-pro/internal/services"
	"github.com/Alexander272/new-sealur-pro/internal/snp"
	transport "github.com/Alexander272/new-sealur-pro/internal/transport/http"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
	"github.com/Alexander272/new-sealur-pro/pkg/database/postgres"
	"github.com/Alexander272/new-sealur-pro/pkg/database/redis"
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

	tokenManager, err := auth.NewManager(conf.Auth.Key)
	if err != nil {
		log.Fatalf("failed to initialize token manager: %s", err.Error())
	}

	//* Services, Repos & API Handlers
	repos := repository.NewRepository(db, memDB)
	services := services.NewServices(services.Deps{
		Repos:           repos,
		TokenManager:    tokenManager,
		AccessTokenTTL:  conf.Auth.AccessTokenTTL,
		RefreshTokenTTL: conf.Auth.RefreshTokenTTL,
		ConfirmTTL:      conf.Auth.ConfirmTTL,
		LimitTTL:        conf.Limiter.TTL,
	})
	handlers := transport.NewHandler(services)

	snpModule := snp.NewSnpModule(db, conf)
	// handlers.Modules = append(handlers.Modules, snpModule)

	handlers.Modules = []transport.Modules{snpModule}

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
