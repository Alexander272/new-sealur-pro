package auth

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/Nerzal/gocloak/v13"
)

type KeycloakClient struct {
	Client       *gocloak.GoCloak  // keycloak client
	ClientIds    map[string]string // clientId specified in Keycloak
	ClientSecret map[string]string // client secret specified in Keycloak
	Realms       []string          // realm specified in Keycloak
	name         string
	pass         string
}

type Deps struct {
	Url       string
	ClientIds map[string]string
	Realms    []string
	AdminName string
	AdminPass string
}

func NewKeycloakClient(deps *Deps) *KeycloakClient {
	client := gocloak.NewClient(deps.Url)

	ctx := context.Background()
	secrets := make(map[string]string, len(deps.Realms))

	for _, realm := range deps.Realms {
		token, err := client.LoginAdmin(ctx, deps.AdminName, deps.AdminPass, realm)
		if err != nil {
			slog.Error("failed to login admin to keycloak.", slog.String("error", err.Error()))
		}

		// store, err := client.GetKeyStoreConfig()
		// store.ActiveKeys.RS256

		clientId := deps.ClientIds[realm]
		clients, err := client.GetClients(ctx, token.AccessToken, realm, gocloak.GetClientsParams{ClientID: &clientId})
		if err != nil {
			slog.Error("failed to get clients to keycloak.", slog.String("error", err.Error()))
		}
		//logger.Debug(clients)

		if len(clients) > 0 && clients[0].Secret != nil {
			secrets[realm] = *clients[0].Secret
		}
	}

	return &KeycloakClient{
		Client:       client,
		ClientIds:    deps.ClientIds,
		ClientSecret: secrets,
		Realms:       deps.Realms,
		name:         deps.AdminName,
		pass:         deps.AdminPass,
	}
}

func (k *KeycloakClient) GetToken(ctx context.Context) (string, error) {
	token, err := k.Client.LoginAdmin(ctx, k.name, k.pass, "master")
	if err != nil {
		return "", fmt.Errorf("failed to login admin to keycloak. error: %w", err)
	}
	return token.AccessToken, nil
}

// func (k *KeycloakClient) GetCerts() ([]string, error) {
// 	cert, err := k.Client.GetCerts(context.Background(), k.Realm)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to get certs. error: %w", err)
// 	}
// 	// logger.Debug("get certs", logger.StringAttr("certs", cert.String()))
// 	// logger.Debug("get keys", logger.AnyAttr("keys", cert.Keys))
// 	certs := []string{}
// 	if cert.Keys != nil {
// 		for _, k := range *cert.Keys {
// 			certs = append(certs, k.String())
// 			// logger.Debug("get key", logger.StringAttr("keyStr", k.String()), logger.AnyAttr("keyObj", k))
// 		}
// 	}

// 	return certs, nil
// }

// func (k *KeycloakClient) GetStore() {
// 	token, err := k.Client.LoginAdmin(context.Background(), k.name, k.pass, "master")
// 	if err != nil {
// 		slog.Error("failed to login admin to keycloak.", slog.String("error", err.Error()))
// 		return
// 	}

// 	store, err := k.Client.GetKeyStoreConfig(context.Background(), token.AccessToken, k.Realm)
// 	if err != nil {
// 		slog.Error("failed to get keystore config to keycloak.", slog.String("error", err.Error()))
// 		return
// 	}

// 	slog.Debug("store", slog.Any("key", *store.ActiveKeys.RS256), slog.String("store", store.String()))
// }
