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
