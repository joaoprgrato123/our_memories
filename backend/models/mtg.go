package models

type MTGCard struct {
	ID     int64  `json:"id"`
	Name   string `json:"name"`
	Amount int64  `json:"amount"`
	Owner  string `json:"owner"`
	Cost   int64  `json:"cost"`
	Owned  bool   `json:"owned"`
	Link   string `json:"link"`
}
