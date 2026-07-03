package service

import (
	"errors"
	"our-memories/models"
	"our-memories/repository"
)

type MovieService interface {
	GetAll() ([]models.Movie, error)
	GetByID(id int64) (models.Movie, error)
	Create(movie models.Movie) (models.Movie, error)
	Update(movie models.Movie) (models.Movie, error)
	Delete(id int64) error
}

func NewMovieService(repo repository.MovieRepository) MovieService {
	return &movieService{repo: repo}
}

type movieService struct {
	repo repository.MovieRepository
}

func (s *movieService) GetAll() ([]models.Movie, error) {
	return s.repo.GetAll()
}

func (s *movieService) GetByID(id int64) (models.Movie, error) {

	return s.repo.GetByID(id)
}

func (s *movieService) Create(movie models.Movie) (models.Movie, error) {
	// Validation
	if movie.Title == "" {
		return models.Movie{}, errors.New("movie name is required")
	}

	// Get existing cards
	movies, err := s.repo.GetAll()
	if err != nil {
		return models.Movie{}, err
	}

	// Find max ID
	var maxID int64 = 0
	for _, p := range movies {
		if p.ID > maxID {
			maxID = p.ID
		}
	}

	// Assign new ID
	movie.ID = maxID + 1

	newMovie, err := s.repo.Create(movie)
	return newMovie, err
}

func (s *movieService) Update(movie models.Movie) (models.Movie, error) {

	// Validation
	if movie.Title == "" {
		return models.Movie{}, errors.New("movie name is required")
	}

	return s.repo.Update(movie)
}

func (s *movieService) Delete(id int64) error {

	return s.repo.Delete(id)
}
