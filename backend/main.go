package main

import (
	"log"
	"net/http"
	"our-memories/handler"
	"our-memories/models"
	"our-memories/repository"
	"our-memories/service"

	"github.com/joho/godotenv"
)

func main() {
	// Storage initialization
	storage := &models.JSONStorage{
		FilePath: "data.json",
	}

	//load .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal(" error loading .env file")

	}

	mux := http.NewServeMux()
	// Repositories
	// dependency = storage
	planRepo := repository.NewPlanRepository(storage)
	movieRepo := repository.NewMovieRepository(storage)
	serieRepo := repository.NewSerieRepository(storage)
	mtgRepo := repository.NewMTGRepository(storage)
	plantRepo := repository.NewPlantRepository(storage)
	resourceRepo := repository.NewResourceRepository(storage)

	// Services
	planService := service.NewPlanService(planRepo)
	movieService := service.NewMovieService(movieRepo)
	serieService := service.NewSerieService(serieRepo)
	mtgService := service.NewMTGService(mtgRepo)
	plantService := service.NewPlantService(plantRepo)
	resourceService := service.NewResourceService(resourceRepo)

	// Handlers
	planHandler := handler.NewPlanHandler(planService)
	movieHandler := handler.NewMovieHandler(movieService)
	serieHandler := handler.NewSerieHandler(serieService)
	mtgHandler := handler.NewMTGHandler(mtgService)
	plantHandler := handler.NewPlantHandler(plantService)
	resourceHandler := handler.NewResourceHandler(resourceService)
	userHandler := handler.NewUserHandler()

	// Routes
	// plan routes
	mux.HandleFunc("GET /plans", planHandler.GetAll)
	mux.HandleFunc("POST /plans", planHandler.Create)
	mux.HandleFunc("GET /plans/{id}", planHandler.GetByID)
	mux.HandleFunc("PUT /plans/{id}", planHandler.Update)
	mux.HandleFunc("DELETE /plans/{id}", planHandler.Delete)

	// movie routes
	mux.HandleFunc("GET /movies", movieHandler.GetAll)
	mux.HandleFunc("POST /movies", movieHandler.Create)
	mux.HandleFunc("GET /movies/{id}", movieHandler.GetByID)
	mux.HandleFunc("PUT /movies/{id}", movieHandler.Update)
	mux.HandleFunc("DELETE /movies/{id}", movieHandler.Delete)

	// serie routes
	mux.HandleFunc("GET /series", serieHandler.GetAll)
	mux.HandleFunc("POST /series", serieHandler.Create)
	mux.HandleFunc("GET /series/{id}", serieHandler.GetByID)
	mux.HandleFunc("PUT /series/{id}", serieHandler.Update)
	mux.HandleFunc("DELETE /series/{id}", serieHandler.Delete)

	// card routes
	mux.HandleFunc("GET /cards", mtgHandler.GetAll)
	mux.HandleFunc("POST /cards", mtgHandler.Create)
	mux.HandleFunc("GET /cards/{id}", mtgHandler.GetByID)
	mux.HandleFunc("PUT /cards/{id}", mtgHandler.Update)
	mux.HandleFunc("DELETE /cards/{id}", mtgHandler.Delete)

	// plants routes
	mux.HandleFunc("GET /plants", plantHandler.GetAll)
	mux.HandleFunc("POST /plants", plantHandler.Create)
	mux.HandleFunc("GET /plants/{id}", plantHandler.GetByID)
	mux.HandleFunc("PUT /plants/{id}", plantHandler.Update)
	mux.HandleFunc("DELETE /plants/{id}", plantHandler.Delete)

	//resource routes
	mux.HandleFunc("GET /resources", resourceHandler.GetAll)
	mux.HandleFunc("POST /resources", resourceHandler.Create)
	mux.HandleFunc("GET /resources/{id}", resourceHandler.GetByID)
	mux.HandleFunc("PUT /resources/{id}", resourceHandler.Update)
	mux.HandleFunc("DELETE /resources/{id}", resourceHandler.Delete)

	//user routes
	mux.HandleFunc("POST /login", userHandler.Login)

	// Wrap mux with CORS middleware
	handler := corsMiddleware(mux)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Allow your frontend origin
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

		// Allowed methods
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Allowed headers
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
