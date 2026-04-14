package handler

import (
	"encoding/json"
	"net/http"
	"our-memories/models"
	"our-memories/repository"
	"our-memories/service"
	"strconv"
)

func NewMovieHandler(s service.MovieService) *MovieHandler {
	return &MovieHandler{service: s}
}

type MovieHandler struct {
	service service.MovieService
}

func (h *MovieHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	cards, err := h.service.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, cards)
}

func (h *MovieHandler) GetByID(w http.ResponseWriter, r *http.Request) {
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

func (h *MovieHandler) Create(w http.ResponseWriter, r *http.Request) {
	var movie models.Movie

	if err := json.NewDecoder(r.Body).Decode(&movie); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	created, err := h.service.Create(movie)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, http.StatusCreated, created)
}

func (h *MovieHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var movie models.Movie
	if err := json.NewDecoder(r.Body).Decode(&movie); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	movie.ID = id

	updated, err := h.service.Update(movie)
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

func (h *MovieHandler) Delete(w http.ResponseWriter, r *http.Request) {
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
