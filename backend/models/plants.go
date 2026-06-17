package models

type Plant struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	SeedSeason   string    `json:"seed_season"`
	FruitSeason  string    `json:"fruit_season"`
	Owned        bool      `json:"owned"`
	Amount       int64     `json:"amount"`
	Score        float64   `json:"score"`
	Planted      bool      `json:"planted"`
	Status       string    `json:"status"`
}
