package handler

import (
	"encoding/json"
	"net/http"
	"our-memories/models"
	"our-memories/repository"
	"our-memories/service"
	"strconv"
)

func NewSerieHandler(s service.SerieService) *SerieHandler {
	return &SerieHandler{service: s}
}

type SerieHandler struct {
	service service.SerieService
}

func (h *SerieHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	cards, err := h.service.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, cards)
}

func (h *SerieHandler) GetByID(w http.ResponseWriter, r *http.Request) {
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

func (h *SerieHandler) Create(w http.ResponseWriter, r *http.Request) {
	var serie models.Serie

	if err := json.NewDecoder(r.Body).Decode(&serie); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	created, err := h.service.Create(serie)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, http.StatusCreated, created)
}

func (h *SerieHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var serie models.Serie
	if err := json.NewDecoder(r.Body).Decode(&serie); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	serie.ID = id

	updated, err := h.service.Update(serie)
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

func (h *SerieHandler) Delete(w http.ResponseWriter, r *http.Request) {
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
