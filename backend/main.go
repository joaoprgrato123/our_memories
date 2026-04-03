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
	planRepo := repository.NewPlanRepository(storage)
	// Services
	mtgService := service.NewMTGService(mtgRepo)
	planService := service.NewPlanService(planRepo)
	// Handlers
	mtgHandler := handler.NewMTGHandler(mtgService)
	planHandler := handler.NewPlanHandler(planService)
	// Routes

	// card routes
	mux.HandleFunc("GET /cards", mtgHandler.GetAll)
	mux.HandleFunc("POST /card", mtgHandler.Create)
	mux.HandleFunc("GET /cards/{id}", mtgHandler.GetByID)
	mux.HandleFunc("PUT /cards/{id}", mtgHandler.Update)
	mux.HandleFunc("DELETE /cards/{id}", mtgHandler.Delete)

	// planroutes
	mux.HandleFunc("GET /plans", planHandler.GetAll)
	mux.HandleFunc("POST /plan", planHandler.Create)
	mux.HandleFunc("GET /plan/{id}", planHandler.GetByID)
	mux.HandleFunc("PUT /plan/{id}", planHandler.Update)
	mux.HandleFunc("DELETE /plan/{id}", planHandler.Delete)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))

}
