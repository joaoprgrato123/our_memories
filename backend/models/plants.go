package models

import "time"

type Plant struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Genre     string    `json:"genre"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	AddedDate time.Time `json:"added_date"`
	Score     time.Time `json:"score"`
	Duration  string    `json:"duration"`
	Status    string    `json:"status"`
}
