package models

import "time"

type Serie struct {
	ID        int64     `json:"id"`
	Genre     string    `json:"genre"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	AddedDate time.Time `json:"added_date"`
	Score     time.Time `json:"score"`
	Duration  string    `json:"duration"`
	Status    string    `json:"status"`
}
