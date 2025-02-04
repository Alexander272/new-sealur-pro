package auth

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/Nerzal/gocloak/v13"
)

type KeycloakClient struct {
	Client       *gocloak.GoCloak // keycloak client
	ClientId     string           // clientId specified in Keycloak
	ClientSecret string           // client secret specified in Keycloak
	Realm        string           // realm specified in Keycloak
	name         string
	pass         string
}

type Deps struct {
	Url       string
	ClientId  string
	Realm     string
	AdminName string
	AdminPass string
}

func NewKeycloakClient(deps *Deps) *KeycloakClient {
	client := gocloak.NewClient(deps.Url)

	ctx := context.Background()

	token, err := client.LoginAdmin(ctx, deps.AdminName, deps.AdminPass, deps.Realm)
	if err != nil {
		slog.Error("failed to login admin to keycloak.", slog.String("error", err.Error()))
	}

	// store, err := client.GetKeyStoreConfig()
	// store.ActiveKeys.RS256

	clients, err := client.GetClients(ctx, token.AccessToken, deps.Realm, gocloak.GetClientsParams{ClientID: &deps.ClientId})
	if err != nil {
		slog.Error("failed to get clients to keycloak.", slog.String("error", err.Error()))
	}
	//logger.Debug(clients)

	var secret string
	if len(clients) > 0 && clients[0].Secret != nil {
		secret = *clients[0].Secret
	}

	return &KeycloakClient{
		Client:       client,
		ClientId:     deps.ClientId,
		ClientSecret: secret,
		Realm:        deps.Realm,
		name:         deps.AdminName,
		pass:         deps.AdminPass,
	}
}

func (k *KeycloakClient) GetToken(ctx context.Context) (string, error) {
	token, err := k.Client.LoginAdmin(ctx, k.name, k.pass, k.Realm)
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
