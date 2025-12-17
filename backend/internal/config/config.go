package config

import (
	"fmt"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
)

type (
	Config struct {
		Environment string `yaml:"environment" env:"APP_ENV" env-default:"dev"`
		LogLevel    string `yaml:"log_level" env-default:"info"`
		LogSource   bool   `yaml:"log_source" env-default:"false"`
		Postgres    PostgresConfig
		Redis       RedisConfig
		Auth        AuthConfig
		Keycloak    KeycloakConfig
		MinIO       MinIOConfig
		SMTP        SMTPConfig
		Emails      EmailsConfig
		Links       LinksConfig
		Http        HttpConfig
		Limiter     LimiterConfig
		// ErrorBot    ErrorBotConfig
	}

	HttpConfig struct {
		Host               string        `yaml:"host" env:"HOST" env-default:"localhost"`
		Port               string        `yaml:"port" env:"PORT" env-default:"9001"`
		ReadTimeout        time.Duration `yaml:"read_timeout" env:"READ_TIMEOUT" env-default:"10s"`
		WriteTimeout       time.Duration `yaml:"write_timeout" env:"WRITE_TIMEOUT" env-default:"10s"`
		MaxHeaderMegabytes int           `yaml:"max_header_bytes" env-default:"1"`
	}

	RedisConfig struct {
		Host     string `yaml:"host" env:"REDIS_HOST"`
		Port     string `yaml:"port" env:"REDIS_PORT"`
		DB       int    `yaml:"db" env:"REDIS_DB"`
		Password string `env:"REDIS_PASSWORD"`
	}

	PostgresConfig struct {
		Host     string `yaml:"host" env:"POSTGRES_HOST"`
		Port     string `yaml:"port" env:"POSTGRES_PORT"`
		Username string `yaml:"username" env:"POSTGRES_NAME"`
		Password string `env:"POSTGRES_PASSWORD"`
		DbName   string `yaml:"db_name" env:"POSTGRES_DB"`
		SSLMode  string `yaml:"ssl_mode" env:"POSTGRES_SSL"`
	}

	AuthConfig struct {
		AccessTokenTTL  time.Duration `yaml:"access_token_ttl" env-default:"10m"`
		RefreshTokenTTL time.Duration `yaml:"refresh_token_ttl" env-default:"24h"`
		LimitAuthTTL    time.Duration `yaml:"limit_auth_ttl" env-default:"30m"`
		CountAttempt    int32         `yaml:"count_attempt" env-default:"5"`
		ConfirmTTL      time.Duration `yaml:"confirm_ttl" env-default:"1h"`
		Secure          bool          `yaml:"secure" env-default:"false"`
		Domain          string        `yaml:"domain" env-default:"sealur.ru"`
		// Key             string        `env:"KEY_PEM"`
		PublicKey  string `env:"PUBLIC_KEY_PEM"`
		PrivateKey string `env:"PRIVATE_KEY_PEM"`
	}

	KeycloakConfig struct {
		Url string `yaml:"keycloak_url" env:"KEYCLOAK_URL"`
		// ClientId string `env:"KEYCLOAK_CLIENT_ID"`
		// ClientSecret string `env:"KEYCLOAK_CLIENT_SECRET"`
		// Realm    string      `yaml:"keycloak_realm" env:"KEYCLOAK_REALM"`
		Root     string      `env:"KEYCLOAK_ROOT"`
		RootPass string      `env:"KEYCLOAK_ROOT_PASS"`
		Public   RealmConfig `yaml:"public" env-prefix:"PUBLIC_"`
		Private  RealmConfig `yaml:"private" env-prefix:"PRIVATE_"`
	}
	RealmConfig struct {
		ClientId string `env:"CLIENT_ID"`
		Realm    string `yaml:"realm" env:"REALM"`
	}

	MinIOConfig struct {
		Endpoint           string   `yaml:"endpoint" env:"MINIO_ENDPOINT"`
		AccessKey          string   `yaml:"accessKey" env:"MINIO_ACCESS_KEY"`
		SecretKey          string   `yaml:"secretKey" env:"MINIO_SECRET_KEY"`
		UseSSL             bool     `yaml:"useSSL"`
		Bucket             string   `yaml:"bucket" env:"MINIO_BUCKET"`
		DisabledFileTypes  []string `yaml:"disabledFileTypes"`
		DisabledExtensions []string `yaml:"disabledExtensions"`
	}

	SMTPConfig struct {
		Sender   string `yaml:"sender" env:"SMTP_SENDER"`
		User     string `yaml:"user" env:"SMTP_USER"`
		Password string `yaml:"password" env:"SMTP_PASSWORD"`
		Host     string `yaml:"host" env:"SMTP_HOST"`
		Port     int    `yaml:"port" env:"SMTP_PORT"`
	}

	EmailsConfig struct {
		Feedback string `yaml:"feedback" env:"FEEDBACK_EMAIL"`
		Support  string `yaml:"support" env:"SUPPORT_EMAIL"`
	}
	LinksConfig struct {
		Orders string `yaml:"orders" env:"ORDERS_LINK"`
		App    string `yaml:"app" env:"APP_LINK"`
	}

	LimiterConfig struct {
		RPS   int           `yaml:"rps" env:"RPS" env-default:"10"`
		Burst int           `yaml:"burst" env:"BURST" env-default:"30"`
		TTL   time.Duration `yaml:"ttl" env:"TTL" env-default:"10m"`
	}

	ErrorBotConfig struct {
		Url string `yaml:"err_bot_url" env:"ERR_BOT_URL" env-default:"http://route.sealur.ru:11000/api/v1/mattermost/send"`
	}
)

func Init(path string) (*Config, error) {
	var conf Config

	if err := cleanenv.ReadConfig(path, &conf); err != nil {
		return nil, fmt.Errorf("failed to read config file. error: %w", err)
	}

	// if err := cleanenv.ReadEnv(&conf); err != nil {
	// 	return nil, fmt.Errorf("failed to read env file. error: %w", err)
	// }

	return &conf, nil
}
