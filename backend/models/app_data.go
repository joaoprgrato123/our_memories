package models

type AppData struct {
	Cards  []MTGCard `json:"cards"`
	Movies []Movies  `json:"movies"`
	Series []Series  `json:"series"`
	Plans  []Plans   `json:"plans"`
	Plants []Plants  `json:"plants"`
}
