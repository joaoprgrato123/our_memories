package service

import (
	"errors"
	"our-memories/models"
	"our-memories/repository"
)

type PlantService interface {
	GetAll() ([]models.Plant, error)
	GetByID(id int64) (models.Plant, error)
	Create(plant models.Plant) (models.Plant, error)
	Update(plant models.Plant) (models.Plant, error)
	Delete(id int64) error
}

func NewPlantService(repo repository.PlantRepository) PlantService {
	return &plantsService{repo: repo}
}

type plantsService struct {
	repo repository.PlantRepository
}

func (s *plantsService) GetAll() ([]models.Plant, error) {
	return s.repo.GetAll()
}

func (s *plantsService) GetByID(id int64) (models.Plant, error) {

	return s.repo.GetByID(id)
}

func (s *plantsService) Create(plant models.Plant) (models.Plant, error) {
	// Validation
	if plant.Name == "" {
		return models.Plant{}, errors.New("card name is required")
	}

	// Get existing cards
	plants, err := s.repo.GetAll()
	if err != nil {
		return models.Plant{}, err
	}

	// Find max ID
	var maxID int64 = 0
	for _, p := range plants {
		if p.ID > maxID {
			maxID = p.ID
		}
	}

	// Assign new ID
	plant.ID = maxID + 1

	newPlan, err := s.repo.Create(plant)
	return newPlan, err
}

func (s *plantsService) Update(plant models.Plant) (models.Plant, error) {

	// Validation
	if plant.Name == "" {
		return models.Plant{}, errors.New("card name is required")
	}

	return s.repo.Update(plant)
}

func (s *plantsService) Delete(id int64) error {

	return s.repo.Delete(id)
}
