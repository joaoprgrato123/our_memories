package models

type Resource struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
	Link string `json:"link"`
	Icon string `json:"icon"`
}
