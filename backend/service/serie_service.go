package service

import (
	"errors"
	"our-memories/models"
	"our-memories/repository"
)

type SerieService interface {
	GetAll() ([]models.Serie, error)
	GetByID(id int64) (models.Serie, error)
	Create(serie models.Serie) (models.Serie, error)
	Update(serie models.Serie) (models.Serie, error)
	Delete(id int64) error
}

func NewSerieService(repo repository.SerieRepository) SerieService {
	return &serieService{repo: repo}
}

type serieService struct {
	repo repository.SerieRepository
}

func (s *serieService) GetAll() ([]models.Serie, error) {
	return s.repo.GetAll()
}

func (s *serieService) GetByID(id int64) (models.Serie, error) {

	return s.repo.GetByID(id)
}

func (s *serieService) Create(serie models.Serie) (models.Serie, error) {
	// Validation
	if serie.Title == "" {
		return models.Serie{}, errors.New("card name is required")
	}

	// Get existing cards
	series, err := s.repo.GetAll()
	if err != nil {
		return models.Serie{}, err
	}

	// Find max ID
	var maxID int64 = 0
	for _, p := range series {
		if p.ID > maxID {
			maxID = p.ID
		}
	}

	// Assign new ID
	serie.ID = maxID + 1

	newSerie, err := s.repo.Create(serie)
	return newSerie, err
}

func (s *serieService) Update(serie models.Serie) (models.Serie, error) {

	// Validation
	if serie.Title == "" {
		return models.Serie{}, errors.New("card name is required")
	}

	return s.repo.Update(serie)
}

func (s *serieService) Delete(id int64) error {

	return s.repo.Delete(id)
}
