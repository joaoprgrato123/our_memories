package models

import "time"

type Movie struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	Genre     string    `json:"genre"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	AddedDate time.Time `json:"added_date"`
	Score     float64 	`json:"score"`
	Duration  int64     `json:"duration"`
	Status    string    `json:"status"`
}
