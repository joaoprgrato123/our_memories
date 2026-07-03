package models

type AppData struct {
	Cards     []MTGCard  `json:"cards"`
	Movies    []Movie    `json:"movies"`
	Series    []Serie    `json:"series"`
	OurPlans  []Plan     `json:"plans"`
	Plants    []Plant    `json:"plants"`
	Resources []Resource `json:"resources"`
}
