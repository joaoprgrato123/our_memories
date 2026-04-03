package service

import (
	"errors"
	"our-memories/models"
	"our-memories/repository"
)

type MTGService interface {
	GetAll() ([]models.MTGCard, error)
	GetByID(id int64) (models.MTGCard, error)
	Create(card models.MTGCard) (models.MTGCard, error)
	Update(card models.MTGCard) (models.MTGCard, error)
	Delete(id int64) error
}

func NewMTGService(repo repository.MTGRepository) MTGService {
	return &mtgService{repo: repo}
}

type mtgService struct {
	repo repository.MTGRepository
}

func (s *mtgService) GetAll() ([]models.MTGCard, error) {
	return s.repo.GetAll()
}

func (s *mtgService) GetByID(id int64) (models.MTGCard, error) {

	return s.repo.GetByID(id)
}

func (s *mtgService) Create(card models.MTGCard) (models.MTGCard, error) {
	// Validation
	if card.Name == "" {
		return models.MTGCard{}, errors.New("card name is required")
	}

	// Get existing cards
	cards, err := s.repo.GetAll()
	if err != nil {
		return models.MTGCard{}, err
	}

	// Find max ID
	var maxID int64 = 0
	for _, c := range cards {
		if c.ID > maxID {
			maxID = c.ID
		}
	}

	// Assign new ID
	card.ID = maxID + 1

	newCard, err := s.repo.Create(card)
	return newCard, err
}

func (s *mtgService) Update(card models.MTGCard) (models.MTGCard, error) {

	if card.Name == "" {
		return models.MTGCard{}, errors.New("card name is required")
	}

	return s.repo.Update(card)
}

func (s *mtgService) Delete(id int64) error {

	return s.repo.Delete(id)
}
