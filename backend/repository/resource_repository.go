package repository

import (
	"encoding/json"
	"os"
	"our-memories/models"
)

// interface
type ResourceRepository interface {
	GetAll() ([]models.Resource, error)
	GetByID(id int64) (models.Resource, error)
	Create(resource models.Resource) (models.Resource, error)
	Update(resource models.Resource) (models.Resource, error)
	Delete(id int64) error
}

// constructor
func NewResourceRepository(db *models.JSONStorage) ResourceRepository {
	return &resourceRepository{db: db}
}

// implementation
type resourceRepository struct {
	db *models.JSONStorage
}

func (r *resourceRepository) GetAll() ([]models.Resource, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return []models.Resource{}, err
	}

	if len(file) == 0 {
		return []models.Resource{}, ErrFileEmpty
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return []models.Resource{}, err
	}

	return data.Resources, nil
}

func (r *resourceRepository) GetByID(id int64) (models.Resource, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Resource{}, err
	}

	if len(file) == 0 {
		return models.Resource{}, ErrCardNotFound
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Resource{}, err
	}

	for _, resource := range data.Resources {
		if resource.ID == id {
			return resource, nil
		}
	}

	return models.Resource{}, nil
}

func (r *resourceRepository) Create(resource models.Resource) (models.Resource, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Resource{}, err
	}

	if len(file) > 0 {
		if err := json.Unmarshal(file, &data); err != nil {
			return models.Resource{}, err
		}
	}

	data.Resources = append(data.Resources, resource)

	// transform data into json format with pretty ident
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Resource{}, err
	}

	// write into file the new jsondata with read write permissions
	if err := os.WriteFile(r.db.FilePath, jsonData, 0644); err != nil {
		return models.Resource{}, err
	}

	return resource, nil
}

func (r *resourceRepository) Update(resource models.Resource) (models.Resource, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Resource{}, err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Resource{}, err
	}

	found := false

	for i, p := range data.Resources {
		if p.ID == resource.ID {
			data.Resources[i] = resource
			found = true
			break
		}
	}

	if !found {
		return models.Resource{}, os.ErrNotExist
	}

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Resource{}, err
	}

	if err := os.WriteFile(r.db.FilePath, updated, 0644); err != nil {
		return models.Resource{}, err
	}

	return resource, nil
}

func (r *resourceRepository) Delete(id int64) error {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return err
	}

	index := -1
	for i, p := range data.Resources {
		if p.ID == id {
			index = i
			break
		}
	}

	if index == -1 {
		return os.ErrNotExist
	}

	// remove element
	data.Resources = append(data.Resources[:index], data.Resources[index+1:]...)

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.db.FilePath, updated, 0644)
}
