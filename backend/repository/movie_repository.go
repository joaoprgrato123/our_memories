package repository

import (
	"encoding/json"
	"os"
	"our-memories/models"
)

// interface
type MovieRepository interface {
	GetAll() ([]models.Movie, error)
	GetByID(id int64) (models.Movie, error)
	Create(movie models.Movie) (models.Movie, error)
	Update(movie models.Movie) (models.Movie, error)
	Delete(id int64) error
}

// constructor
func NewMovieRepository(db *models.JSONStorage) MovieRepository {
	return &movieRepository{db: db}
}

// implementation
type movieRepository struct {
	db *models.JSONStorage
}

func (r *movieRepository) GetAll() ([]models.Movie, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return []models.Movie{}, err
	}

	if len(file) == 0 {
		return []models.Movie{}, ErrFileEmpty
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return []models.Movie{}, err
	}

	return data.Movies, nil
}

func (r *movieRepository) GetByID(id int64) (models.Movie, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Movie{}, err
	}

	if len(file) == 0 {
		return models.Movie{}, ErrCardNotFound
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Movie{}, err
	}

	for _, movie := range data.Movies {
		if movie.ID == id {
			return movie, nil
		}
	}

	return models.Movie{}, nil
}

func (r *movieRepository) Create(movie models.Movie) (models.Movie, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Movie{}, err
	}

	if len(file) > 0 {
		if err := json.Unmarshal(file, &data); err != nil {
			return models.Movie{}, err
		}
	}

	data.Movies = append(data.Movies, movie)

	// transform data into json format with pretty ident
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Movie{}, err
	}

	// write into file the new jsondata with read write permissions
	if err := os.WriteFile(r.db.FilePath, jsonData, 0644); err != nil {
		return models.Movie{}, err
	}

	return movie, nil
}

func (r *movieRepository) Update(movie models.Movie) (models.Movie, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Movie{}, err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Movie{}, err
	}

	found := false

	for i, p := range data.Movies {
		if p.ID == movie.ID {
			data.Movies[i] = movie
			found = true
			break
		}
	}

	if !found {
		return models.Movie{}, os.ErrNotExist
	}

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Movie{}, err
	}

	if err := os.WriteFile(r.db.FilePath, updated, 0644); err != nil {
		return models.Movie{}, err
	}

	return movie, nil
}

func (r *movieRepository) Delete(id int64) error {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return err
	}

	index := -1
	for i, p := range data.Movies {
		if p.ID == id {
			index = i
			break
		}
	}

	if index == -1 {
		return os.ErrNotExist
	}

	// remove element
	data.Movies = append(data.Movies[:index], data.Movies[index+1:]...)

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.db.FilePath, updated, 0644)
}
