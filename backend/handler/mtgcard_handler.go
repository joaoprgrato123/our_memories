package handler

import (
	"encoding/json"
	"net/http"
	"our-memories/models"
	"our-memories/repository"
	"our-memories/service"
	"strconv"
)

func NewMTGHandler(s service.MTGService) *MTGHandler {
	return &MTGHandler{service: s}
}

type MTGHandler struct {
	service service.MTGService
}

func (h *MTGHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	cards, err := h.service.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, cards)
}

func (h *MTGHandler) GetByID(w http.ResponseWriter, r *http.Request) {
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

func (h *MTGHandler) Create(w http.ResponseWriter, r *http.Request) {
	var card models.MTGCard

	if err := json.NewDecoder(r.Body).Decode(&card); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	created, err := h.service.Create(card)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, http.StatusCreated, created)
}

func (h *MTGHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var card models.MTGCard
	if err := json.NewDecoder(r.Body).Decode(&card); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	card.ID = id

	updated, err := h.service.Update(card)
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

func (h *MTGHandler) Delete(w http.ResponseWriter, r *http.Request) {
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

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
