package handler

import (
	"encoding/json"
	"net/http"
	"our-memories/models"
	"our-memories/repository"
	"our-memories/service"
	"strconv"
)

func NewPlanHandler(s service.PlanService) *PlanHandler {
	return &PlanHandler{service: s}
}

type PlanHandler struct {
	service service.PlanService
}

func (h *PlanHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	cards, err := h.service.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, cards)
}

func (h *PlanHandler) GetByID(w http.ResponseWriter, r *http.Request) {
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

func (h *PlanHandler) Create(w http.ResponseWriter, r *http.Request) {
	var plan models.Plan

	if err := json.NewDecoder(r.Body).Decode(&plan); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	created, err := h.service.Create(plan)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, http.StatusCreated, created)
}

func (h *PlanHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var plan models.Plan
	if err := json.NewDecoder(r.Body).Decode(&plan); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	plan.ID = id

	updated, err := h.service.Update(plan)
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

func (h *PlanHandler) Delete(w http.ResponseWriter, r *http.Request) {
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
