package repository

import (
	"encoding/json"
	"os"
	"our-memories/models"
)

// interface
type MTGRepository interface {
	GetAll() ([]models.MTGCard, error)
	//"Create(card models.MTGCard) (models.MTGCard, error)"
}

// constructor
func NewMTGRepository(db *models.JSONStorage) MTGRepository {
	return &mtgRepository{db: db}
}

// implementation
type mtgRepository struct {
	db *models.JSONStorage
}

func (r *mtgRepository) GetAll() ([]models.MTGCard, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return nil, err
	}

	//if not data then return an empty slice
	if len(file) == 0 {
		return []models.MTGCard{}, ErrFileEmpty
	}

	err = json.Unmarshal(file, &data)

	if data.Cards == nil {
		return []models.MTGCard{}, nil
	}

	return data.Cards, nil
}

func (r *mtgRepository) GetByID(id int64) (models.MTGCard, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.MTGCard{}, err
	}

	if len(file) == 0 {
		return models.MTGCard{}, ErrCardNotFound
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.MTGCard{}, err
	}

	for _, card := range data.Cards {
		if card.ID == id {
			return card, nil
		}
	}

	return models.MTGCard{}, nil
}

func (r *mtgRepository) Create(card models.MTGCard) (models.MTGCard, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.MTGCard{}, err
	}

	if len(file) > 0 {
		if err := json.Unmarshal(file, &data); err != nil {
			return models.MTGCard{}, err
		}
	}

	data.Cards = append(data.Cards, card)

	// transform data into json format with pretty ident
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.MTGCard{}, err
	}

	// write into file the new jsondata with read write permissions
	if err := os.WriteFile(r.db.FilePath, jsonData, 0644); err != nil {
		return models.MTGCard{}, err
	}

	return card, nil
}

func (r *mtgRepository) Update(card models.MTGCard) (models.MTGCard, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.MTGCard{}, err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.MTGCard{}, err
	}

	found := false

	for i, c := range data.Cards {
		if c.ID == card.ID {
			data.Cards[i] = card
			found = true
			break
		}
	}

	if !found {
		return models.MTGCard{}, os.ErrNotExist
	}

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.MTGCard{}, err
	}

	if err := os.WriteFile(r.db.FilePath, updated, 0644); err != nil {
		return models.MTGCard{}, err
	}

	return card, nil
}

func (r *mtgRepository) Delete(id int64) error {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return err
	}

	index := -1
	for i, c := range data.Cards {
		if c.ID == id {
			index = i
			break
		}
	}

	if index == -1 {
		return os.ErrNotExist
	}

	// remove element
	data.Cards = append(data.Cards[:index], data.Cards[index+1:]...)

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.db.FilePath, updated, 0644)
}
