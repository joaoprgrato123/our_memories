package models

import "time"

type Plan struct {
	ID                int64     `json:"id"`
	Title             string    `json:"title"`
	AddedDate         time.Time `json:"added_date"`
	Location          string    `json:"location"`
	AchievedDateStart time.Time `json:"achieved_date_start"`
	AchievedDateEnd   time.Time `json:"achieved_date_end"`
	OccursStart       time.Time `json:"occurs_start"`
	OccursEnd         time.Time `json:"occurs_end"`
	Hotel             string    `json:"hotel"`
	Images            string    `json:"images"`
	Pdfs              string    `json:"pdf"`
	Status            string    `json:"status"`
	Category          string    `json:"category"`
}
