package main

import (
	"log"
	"net/http"
	"our-memories/handler"
	"our-memories/models"
	"our-memories/repository"
	"our-memories/service"
)

func main() {
	// Storage initialization
	storage := &models.JSONStorage{
		FilePath: "data.json",
	}

	mux := http.NewServeMux()
	// Repositories
	// dependency = storage
	mtgRepo := repository.NewMTGRepository(storage)

	// Services
	mtgService := service.NewMTGService(mtgRepo)

	// Handlers
	mtgHandler := handler.NewMTGHandler(mtgService)

	// Routes
	mux.HandleFunc("GET /cards", mtgHandler.GetAll)
	mux.HandleFunc("POST /cards", mtgHandler.Create)

	mux.HandleFunc("GET /cards/{id}", mtgHandler.GetByID)
	mux.HandleFunc("PUT /cards/{id}", mtgHandler.Update)
	mux.HandleFunc("DELETE /cards/{id}", mtgHandler.Delete)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))

}
