package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"our-memories/models"
)

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

type UserHandler struct {
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var user models.User

	email := os.Getenv("EMAIL")
	password := os.Getenv("PASSWORD")

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if user.Email != email || user.Password != password {
		http.Error(w, "wrong credentials", http.StatusUnauthorized)
		return

	}

	writeJSON(w, http.StatusOK, nil)
}
