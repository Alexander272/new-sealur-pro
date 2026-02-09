package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/ekomobile/dadata/v2"
	"github.com/ekomobile/dadata/v2/api/suggest"
	"github.com/ekomobile/dadata/v2/client"
)

type CompanyService struct {
	apiConfig config.DataApiConfig
	dataApi   *suggest.Api
}

func NewCompanyService(conf config.DataApiConfig) *CompanyService {
	creds := client.Credentials{
		ApiKeyValue:    conf.Token,
		SecretKeyValue: conf.Secret,
	}

	api := dadata.NewSuggestApi(client.WithCredentialProvider(&creds))

	return &CompanyService{
		apiConfig: conf,
		dataApi:   api,
	}
}

type Company interface {
	FindCompanies(ctx context.Context, query string) ([]*suggest.PartySuggestion, error)
}

func (s *CompanyService) FindCompanies(ctx context.Context, query string) ([]*suggest.PartySuggestion, error) {
	params := &suggest.RequestParams{Query: query, Count: 10}

	result, err := s.dataApi.Party(context.Background(), params)
	if err != nil {
		return nil, fmt.Errorf("failed to get companies from api. error: %w", err)
	}
	return result, nil
}
