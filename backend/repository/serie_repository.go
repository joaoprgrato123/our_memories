package repository

import (
	"encoding/json"
	"os"
	"our-memories/models"
)

// interface
type SerieRepository interface {
	GetAll() ([]models.Serie, error)
	GetByID(id int64) (models.Serie, error)
	Create(serie models.Serie) (models.Serie, error)
	Update(serie models.Serie) (models.Serie, error)
	Delete(id int64) error
}

// constructor
func NewSerieRepository(db *models.JSONStorage) SerieRepository {
	return &serieRepository{db: db}
}

// implementation
type serieRepository struct {
	db *models.JSONStorage
}

func (r *serieRepository) GetAll() ([]models.Serie, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return []models.Serie{}, err
	}

	if len(file) == 0 {
		return []models.Serie{}, ErrFileEmpty
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return []models.Serie{}, err
	}

	return data.Series, nil
}

func (r *serieRepository) GetByID(id int64) (models.Serie, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Serie{}, err
	}

	if len(file) == 0 {
		return models.Serie{}, ErrCardNotFound
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Serie{}, err
	}

	for _, serie := range data.Series {
		if serie.ID == id {
			return serie, nil
		}
	}

	return models.Serie{}, nil
}

func (r *serieRepository) Create(serie models.Serie) (models.Serie, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Serie{}, err
	}

	if len(file) > 0 {
		if err := json.Unmarshal(file, &data); err != nil {
			return models.Serie{}, err
		}
	}

	data.Series = append(data.Series, serie)

	// transform data into json format with pretty ident
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Serie{}, err
	}

	// write into file the new jsondata with read write permissions
	if err := os.WriteFile(r.db.FilePath, jsonData, 0644); err != nil {
		return models.Serie{}, err
	}

	return serie, nil
}

func (r *serieRepository) Update(serie models.Serie) (models.Serie, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Serie{}, err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Serie{}, err
	}

	found := false

	for i, p := range data.Series {
		if p.ID == serie.ID {
			data.Series[i] = serie
			found = true
			break
		}
	}

	if !found {
		return models.Serie{}, os.ErrNotExist
	}

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Serie{}, err
	}

	if err := os.WriteFile(r.db.FilePath, updated, 0644); err != nil {
		return models.Serie{}, err
	}

	return serie, nil
}

func (r *serieRepository) Delete(id int64) error {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return err
	}

	index := -1
	for i, p := range data.Series {
		if p.ID == id {
			index = i
			break
		}
	}

	if index == -1 {
		return os.ErrNotExist
	}

	// remove element
	data.Series = append(data.Series[:index], data.Series[index+1:]...)

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.db.FilePath, updated, 0644)
}
