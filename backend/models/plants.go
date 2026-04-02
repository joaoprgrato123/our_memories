package models

import "time"

type Plants struct {
	Name      string    `json:"id"`
	Genre     string    `json:"genre"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	AddedDate time.Time `json:"added_date"`
	Score     time.Time `json:"score"`
	Duration  string    `json:"duration"`
	Status    string    `json:"status"`
}
