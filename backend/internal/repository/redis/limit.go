package redis

import (
	"context"
	"encoding/json"
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/go-redis/redis/v8"
)

type LimitRepo struct {
	client *redis.Client
}

func NewLimitRepo(client *redis.Client) *LimitRepo {
	return &LimitRepo{
		client: client,
	}
}

type Limit interface {
	Create(ctx context.Context, clientIP string, limit time.Duration) error
	Get(ctx context.Context, clientIP string) (data *models.LimitData, err error)
	AddAttempt(ctx context.Context, clientIP string, limit time.Duration) error
	Remove(ctx context.Context, clientIP string) error
}

func (r *LimitRepo) UnMarshalBinary(str string) *models.LimitData {
	data := &models.LimitData{}
	json.Unmarshal([]byte(str), data)
	return data
}

func (r *LimitRepo) Create(ctx context.Context, clientIP string, limit time.Duration) error {
	data := &models.LimitData{
		ClientIP: clientIP,
		Count:    1,
		Exp:      limit,
	}

	if err := r.client.Set(ctx, clientIP, data, data.Exp).Err(); err != nil {
		return err
	}
	return nil
}

func (r *LimitRepo) Get(ctx context.Context, clientIP string) (data *models.LimitData, err error) {
	cmd := r.client.Get(ctx, clientIP)
	if cmd.Err() != nil {
		if cmd.Err() == redis.Nil {
			return data, models.ErrClientIPNotFound
		}
		return data, cmd.Err()
	}

	str, err := cmd.Result()
	if err != nil {
		return data, err
	}
	return r.UnMarshalBinary(str), nil
}

func (r *LimitRepo) AddAttempt(ctx context.Context, clientIP string, limit time.Duration) error {
	cmd := r.client.Get(ctx, clientIP)
	if cmd.Err() != nil {
		if cmd.Err() == redis.Nil {
			return models.ErrClientIPNotFound
		}
		return cmd.Err()
	}
	str, err := cmd.Result()
	if err != nil {
		return err
	}

	data := r.UnMarshalBinary(str)
	data.Count += 1
	data.Exp = limit
	if err := r.client.Set(ctx, clientIP, data, data.Exp).Err(); err != nil {
		return err
	}
	return nil
}

func (r *LimitRepo) Remove(ctx context.Context, clientIP string) error {
	if err := r.client.Del(ctx, clientIP).Err(); err != nil {
		return err
	}
	return nil
}
