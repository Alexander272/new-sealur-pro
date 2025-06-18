package order

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/constants"
	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service services.Order
}

func NewHandler(service services.Order) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Order, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	orders := api.Group("")
	{
		orders.GET("", handler.getByUser)
		orders.GET("/current", handler.getCurrent)
		orders.PUT("/info", handler.setInfo)
		orders.POST("/save", handler.save)
		orders.POST("/copy/:id", handler.copy)

		manager := orders.Group("", middleware.CheckAccess(constants.AllowManager))
		{
			manager.GET("/:id", handler.getById)
			manager.GET("/:id/download", handler.download)
			manager.GET("/all", handler.getAll)
			manager.GET("/by-manager", handler.getByManager)
			manager.POST("/finish", handler.finish)
			manager.POST("/manager/change", handler.changeManager)
		}
	}
}

func (h *Handler) getByUser(c *gin.Context) {
	page, size := c.DefaultQuery("page", "1"), c.DefaultQuery("size", "10")

	limit, _ := strconv.Atoi(size)
	offset, _ := strconv.Atoi(page)

	u, exists := c.Get(constants.CtxUser)
	if !exists {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "сессия не найдена")
		return
	}
	user := u.(base.User)
	dto := &models.GetOrdersByUserDTO{
		UserId: user.Id,
		Limit:  limit,
		Offset: (offset - 1) * limit,
	}

	data, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}

	total := 0
	if len(data) > 0 {
		total = int(data[0].Total)
	}

	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: total})
}

func (h *Handler) getCurrent(c *gin.Context) {
	u, exists := c.Get(constants.CtxUser)
	if !exists {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "сессия не найдена")
		return
	}
	user := u.(base.User)
	dto := &models.GetCurrentOrderDTO{UserId: user.Id}

	data, err := h.service.GetCurrent(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handler) getById(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.GetOrderDTO{Id: id}
	data, err := h.service.GetById(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handler) getAll(c *gin.Context) {
	page, size := c.DefaultQuery("page", "1"), c.DefaultQuery("size", "15")
	sortLine := c.Query("sort_by")
	filters := c.QueryMap("filters")

	limit, _ := strconv.Atoi(size)
	offset, _ := strconv.Atoi(page)
	params := &models.GetAllOrdersDTO{
		Limit:   limit,
		Offset:  (offset - 1) * limit,
		Sort:    []*models.Sort{},
		Filters: []*models.Filter{},
	}

	if sortLine != "" {
		for _, v := range strings.Split(sortLine, ",") {
			t := "ASC"
			if strings.HasPrefix(v, "-") {
				v = strings.TrimPrefix(v, "-")
				t = "DESC"
			}
			params.Sort = append(params.Sort, &models.Sort{Field: v, Type: t})
		}
	}

	for k := range filters {
		valueMap := c.QueryMap(k)
		for key, value := range valueMap {
			f := &models.Filter{
				Field:       k,
				CompareType: key,
				Value:       value,
			}

			params.Filters = append(params.Filters, f)
		}
	}

	data, err := h.service.GetAll(c, params)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), params)
		return
	}

	total := 0
	if len(data) > 0 {
		total = int(data[0].Total)
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: total})
}

func (h *Handler) getByManager(c *gin.Context) {
	u, exists := c.Get(constants.CtxUser)
	if !exists {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "сессия не найдена")
		return
	}
	user := u.(base.User)
	onlyOpen := c.Query("onlyOpen")

	dto := &models.GetOrdersByManagerDTO{ManagerId: user.Id, OnlyOpen: onlyOpen != "false"}
	data, err := h.service.GetByManager(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), data)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) download(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.GetOrderDTO{Id: id}
	data, err := h.service.Download(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Debug("download", logger.AnyAttr("data", data))

	defer os.Remove(data.Name)
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Length", fmt.Sprintf("%d", data.Size))
	c.Header("Content-Disposition", "attachment; filename="+data.Name)
	c.File(data.Name)
}

func (h *Handler) setInfo(c *gin.Context) {
	dto := &models.SetInfoDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.SetInfo(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Информация обновлена"})
}

func (h *Handler) save(c *gin.Context) {
	dto := &models.SaveOrderDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	u, exists := c.Get(constants.CtxUser)
	if !exists {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "сессия не найдена")
		return
	}
	user := u.(base.User)
	dto.UserId = user.Id

	if err := h.service.Save(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Заказ сохранен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Заказ сохранен"})
}

func (h *Handler) copy(c *gin.Context) {
	dto := &models.CopyOrderDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Copy(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Заказ скопирован", logger.StringAttr("id", c.Param("id")), logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Заказ скопирован"})
}

func (h *Handler) finish(c *gin.Context) {
	dto := &models.SetStatusDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	dto.Status = models.StatusFinish

	if err := h.service.SetStatus(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Заказ закрыт", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Заказ закрыт"})
}

func (h *Handler) changeManager(c *gin.Context) {
	dto := &models.SetManagerDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.SetManager(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Менеджер у заказа изменен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Менеджер изменен"})
}
