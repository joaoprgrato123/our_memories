package repository

import (
	"encoding/json"
	"os"
	"our-memories/models"
)

// interface
type PlantRepository interface {
	GetAll() ([]models.Plant, error)
	GetByID(id int64) (models.Plant, error)
	Create(plant models.Plant) (models.Plant, error)
	Update(plant models.Plant) (models.Plant, error)
	Delete(id int64) error
}

// constructor
func NewPlantRepository(db *models.JSONStorage) PlantRepository {
	return &plantRepository{db: db}
}

// implementation
type plantRepository struct {
	db *models.JSONStorage
}

func (r *plantRepository) GetAll() ([]models.Plant, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return []models.Plant{}, err
	}

	if len(file) == 0 {
		return []models.Plant{}, ErrFileEmpty
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return []models.Plant{}, err
	}

	return data.Plants, nil
}

func (r *plantRepository) GetByID(id int64) (models.Plant, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Plant{}, err
	}

	if len(file) == 0 {
		return models.Plant{}, ErrCardNotFound
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Plant{}, err
	}

	for _, plant := range data.Plants {
		if plant.ID == id {
			return plant, nil
		}
	}

	return models.Plant{}, nil
}

func (r *plantRepository) Create(plant models.Plant) (models.Plant, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Plant{}, err
	}

	if len(file) > 0 {
		if err := json.Unmarshal(file, &data); err != nil {
			return models.Plant{}, err
		}
	}

	data.Plants = append(data.Plants, plant)

	// transform data into json format with pretty ident
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Plant{}, err
	}

	// write into file the new jsondata with read write permissions
	if err := os.WriteFile(r.db.FilePath, jsonData, 0644); err != nil {
		return models.Plant{}, err
	}

	return plant, nil
}

func (r *plantRepository) Update(plant models.Plant) (models.Plant, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Plant{}, err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Plant{}, err
	}

	found := false

	for i, p := range data.Plants {
		if p.ID == plant.ID {
			data.Plants[i] = plant
			found = true
			break
		}
	}

	if !found {
		return models.Plant{}, os.ErrNotExist
	}

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Plant{}, err
	}

	if err := os.WriteFile(r.db.FilePath, updated, 0644); err != nil {
		return models.Plant{}, err
	}

	return plant, nil
}

func (r *plantRepository) Delete(id int64) error {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return err
	}

	index := -1
	for i, p := range data.Plants {
		if p.ID == id {
			index = i
			break
		}
	}

	if index == -1 {
		return os.ErrNotExist
	}

	// remove element
	data.Plants = append(data.Plants[:index], data.Plants[index+1:]...)

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.db.FilePath, updated, 0644)
}
