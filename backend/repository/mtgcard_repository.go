package repository

import (
	"encoding/json"
	"os"
	"our-memories/models"
)

type MTGRepository interface {
	GetAll() ([]models.MTGCard, error)
	//"Create(card models.MTGCard) (models.MTGCard, error)"
}

func NewMTGRepository(db *models.JSONStorage) MTGRepository {
	return &mtgRepository{db: db}
}

type mtgRepository struct {
	db *models.JSONStorage
}

func (r *mtgRepository) GetAll() ([]models.MTGCard, error) {
	var cards []models.MTGCard

	data, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return nil, err
	}

	if len(data) == 0 {
		return cards, nil
	}

	err = json.Unmarshal(data, &cards)
	return cards, err
}
