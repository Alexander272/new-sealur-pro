package redis

import (
	"context"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/go-redis/redis/v8"
)

type SessionRepo struct {
	client *redis.Client
}

func NewSessionRepo(client *redis.Client) *SessionRepo {
	return &SessionRepo{
		client: client,
	}
}

type Session interface {
	Create(ctx context.Context, sessionName string, data *models.SessionData) error
	Get(ctx context.Context, sessionName string) (data *models.SessionData, err error)
	GetDel(ctx context.Context, sessionName string) (data *models.SessionData, err error)
	Remove(ctx context.Context, sessionName string) error
}

func (r *SessionRepo) Create(ctx context.Context, sessionName string, data *models.SessionData) error {
	if err := r.client.Set(ctx, sessionName, data, data.Exp).Err(); err != nil {
		return err
	}
	return nil
}

func (r *SessionRepo) Get(ctx context.Context, sessionName string) (data *models.SessionData, err error) {
	cmd := r.client.Get(ctx, sessionName)
	if cmd.Err() != nil {
		if cmd.Err() == redis.Nil {
			return data, models.ErrSessionEmpty
		}
		logger.Error("failed to execute query", logger.ErrAttr(cmd.Err()))
		return data, cmd.Err()
	}

	str, err := cmd.Result()
	if err != nil {
		return data, err
	}
	return models.UnMarshalBinary(str), nil
}

func (r *SessionRepo) GetDel(ctx context.Context, sessionName string) (data *models.SessionData, err error) {
	cmd := r.client.GetDel(ctx, sessionName)
	if cmd.Err() != nil {
		logger.Error("failed to execute query", logger.ErrAttr(cmd.Err()))
		return data, cmd.Err()
	}

	str, err := cmd.Result()
	if err != nil {
		return data, err
	}
	return models.UnMarshalBinary(str), nil
}

func (r *SessionRepo) Remove(ctx context.Context, sessionName string) error {
	if err := r.client.Del(ctx, sessionName).Err(); err != nil {
		return err
	}
	return nil
}
