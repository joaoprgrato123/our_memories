package service

import (
	"errors"
	"our-memories/models"
	"our-memories/repository"
)

type ResourceService interface {
	GetAll() ([]models.Resource, error)
	GetByID(id int64) (models.Resource, error)
	Create(resource models.Resource) (models.Resource, error)
	Update(resource models.Resource) (models.Resource, error)
	Delete(id int64) error
}

func NewResourceService(repo repository.ResourceRepository) ResourceService {
	return &resourceService{repo: repo}
}

type resourceService struct {
	repo repository.ResourceRepository
}

func (s *resourceService) GetAll() ([]models.Resource, error) {
	return s.repo.GetAll()
}

func (s *resourceService) GetByID(id int64) (models.Resource, error) {

	return s.repo.GetByID(id)
}

func (s *resourceService) Create(resource models.Resource) (models.Resource, error) {
	// Validation
	if resource.Name == "" {
		return models.Resource{}, errors.New("resource name is required")
	}

	// Get existing cards
	resources, err := s.repo.GetAll()
	if err != nil {
		return models.Resource{}, err
	}

	// Find max ID
	var maxID int64 = 0
	for _, p := range resources {
		if p.ID > maxID {
			maxID = p.ID
		}
	}

	// Assign new ID
	resource.ID = maxID + 1

	newResource, err := s.repo.Create(resource)
	return newResource, err
}

func (s *resourceService) Update(resource models.Resource) (models.Resource, error) {

	// Validation
	if resource.Name == "" {
		return models.Resource{}, errors.New("resource name is required")
	}

	return s.repo.Update(resource)
}

func (s *resourceService) Delete(id int64) error {

	return s.repo.Delete(id)
}
