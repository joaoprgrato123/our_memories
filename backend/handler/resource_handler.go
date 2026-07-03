package handler

import (
	"encoding/json"
	"net/http"
	"our-memories/models"
	"our-memories/repository"
	"our-memories/service"
	"strconv"
)

func NewResourceHandler(s service.ResourceService) *ResourceHandler {
	return &ResourceHandler{service: s}
}

type ResourceHandler struct {
	service service.ResourceService
}

func (h *ResourceHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	cards, err := h.service.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, cards)
}

func (h *ResourceHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	card, err := h.service.GetByID(id)
	if err != nil {
		if err == repository.ErrCardNotFound {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, card)
}

func (h *ResourceHandler) Create(w http.ResponseWriter, r *http.Request) {
	var resource models.Resource

	if err := json.NewDecoder(r.Body).Decode(&resource); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	created, err := h.service.Create(resource)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, http.StatusCreated, created)
}

func (h *ResourceHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var resource models.Resource
	if err := json.NewDecoder(r.Body).Decode(&resource); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	resource.ID = id

	updated, err := h.service.Update(resource)
	if err != nil {
		if err == repository.ErrCardNotFound {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, http.StatusOK, updated)
}

func (h *ResourceHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	err = h.service.Delete(id)
	if err != nil {
		if err == repository.ErrCardNotFound {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
