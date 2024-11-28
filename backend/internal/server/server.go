package server

import (
	"context"
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/config"
)

type Server struct {
	httpServer *http.Server
}

func NewServer(conf *config.HttpConfig, handler http.Handler) *Server {
	return &Server{
		httpServer: &http.Server{
			Addr:           ":" + conf.Port,
			Handler:        handler,
			ReadTimeout:    conf.ReadTimeout,
			WriteTimeout:   conf.WriteTimeout,
			MaxHeaderBytes: conf.MaxHeaderMegabytes << 20,
		},
	}
}

func (s *Server) Run() error {
	return s.httpServer.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	return s.httpServer.Shutdown(ctx)
}
