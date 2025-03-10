package files

import (
	"bufio"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/files/models"
	"github.com/Alexander272/new-sealur-pro/internal/files/services"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service services.Files
	conf    config.MinIOConfig
}

func NewHandler(service services.Files, conf config.MinIOConfig) *Handler {
	return &Handler{
		service: service,
		conf:    conf,
	}
}

type Deps struct {
	Service    services.Files
	Config     config.MinIOConfig
	Middleware *middleware.Middleware
}

func Register(api *gin.RouterGroup, deps *Deps) {
	handlers := NewHandler(deps.Service, deps.Config)

	files := api.Group("/files", deps.Middleware.VerifyToken)
	{
		files.GET("", handlers.get)
		files.GET("/group/:id", handlers.getByGroup)
		files.POST("", handlers.create)
		files.POST("/copy/:id", handlers.copy)
		files.POST("/copy-group/:id", handlers.copyGroup)
		files.DELETE("/:id", handlers.delete)
		files.DELETE("/group/:id", handlers.deleteGroup)
	}
}

func (h *Handler) get(c *gin.Context) {
	group := c.Query("group")
	name := c.Query("name")
	id := c.Query("id")

	if group != "" || name != "" || id != "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Параметры не заданы")
		return
	}

	req := &models.GetFileDTO{
		Bucket: h.conf.Bucket,
		Group:  group,
		Id:     id,
		Name:   name,
	}

	data, err := h.service.Get(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить файл")
		error_bot.Send(c, err.Error(), req)
		return
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", "attachment; filename="+name)
	c.Data(http.StatusOK, data.ContentType, data.Bytes)
}

func (h *Handler) getByGroup(c *gin.Context) {
	c.JSON(http.StatusBadGateway, "not implemented")
}

func (h *Handler) create(c *gin.Context) {
	file, err := c.FormFile("drawing")
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Не удалось получить файл")
		return
	}

	fileType := file.Header.Get("Content-Type")

	for _, v := range h.conf.DisabledFileTypes {
		if v == fileType {
			response.NewErrorResponse(c, http.StatusBadRequest, "forbidden file", "Недопустимый формат файла")
			return
		}
	}
	for _, v := range h.conf.DisabledExtensions {
		if strings.Contains(file.Filename, v) {
			response.NewErrorResponse(c, http.StatusBadRequest, "forbidden file", "Недопустимый формат файла")
			return
		}
	}

	group := c.Request.FormValue("group")
	if group == "" {
		gId := uuid.New()
		group = gId.String()
	}

	f, err := file.Open()
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Не удалось прочитать файл")
		return
	}
	defer f.Close()

	reader := bufio.NewReader(f)
	buffer := make([]byte, 1024)

	_, err = io.ReadFull(reader, buffer)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Не удалось прочитать файл")
		return
	}

	dto := &models.FileDTO{
		Bucket:      h.conf.Bucket,
		Group:       group,
		Name:        file.Filename,
		ContentType: fileType,
		Size:        file.Size,
		Bytes:       buffer,
	}
	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось сохранить файл")
		error_bot.Send(c, err.Error(), dto)
		return
	}

	res := response.FileResponse{
		Id:       dto.Id,
		Name:     dto.Name,
		Group:    dto.Group,
		OrigName: file.Filename,
		Link:     fmt.Sprintf("/files?group=%s&id=%s&name=%s", dto.Group, dto.Id, file.Filename),
		// Link:      fmt.Sprintf("/files/%s/%s/%s/%s", dto.Bucket, dto.Group, dto.Id, file.Filename),
	}
	c.JSON(http.StatusCreated, res)
}

func (h *Handler) copy(c *gin.Context) {
	c.JSON(http.StatusBadGateway, "not implemented")
}

func (h *Handler) copyGroup(c *gin.Context) {
	c.JSON(http.StatusBadGateway, "not implemented")
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	group := c.Query("group")
	name := c.Query("name")

	if id == "" || group == "" || name == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Параметры не заданы")
		return
	}

	dto := &models.DeleteFileDTO{
		Bucket: h.conf.Bucket,
		Group:  group,
		Id:     id,
		Name:   name,
	}

	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить файл")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *Handler) deleteGroup(c *gin.Context) {
	c.JSON(http.StatusBadGateway, "not implemented")
}
