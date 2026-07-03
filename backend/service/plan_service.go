package service

import (
	"errors"
	"our-memories/models"
	"our-memories/repository"
)

type PlanService interface {
	GetAll() ([]models.Plan, error)
	GetByID(id int64) (models.Plan, error)
	Create(plan models.Plan) (models.Plan, error)
	Update(plan models.Plan) (models.Plan, error)
	Delete(id int64) error
}

func NewPlanService(repo repository.PlanRepository) PlanService {
	return &planService{repo: repo}
}

type planService struct {
	repo repository.PlanRepository
}

func (s *planService) GetAll() ([]models.Plan, error) {
	return s.repo.GetAll()
}

func (s *planService) GetByID(id int64) (models.Plan, error) {

	return s.repo.GetByID(id)
}

func (s *planService) Create(plan models.Plan) (models.Plan, error) {
	// Validation
	if plan.Title == "" {
		return models.Plan{}, errors.New("plan name is required")
	}

	// Get existing cards
	plans, err := s.repo.GetAll()
	if err != nil {
		return models.Plan{}, err
	}

	// Find max ID
	var maxID int64 = 0
	for _, p := range plans {
		if p.ID > maxID {
			maxID = p.ID
		}
	}

	// Assign new ID
	plan.ID = maxID + 1

	newPlan, err := s.repo.Create(plan)
	return newPlan, err
}

func (s *planService) Update(plan models.Plan) (models.Plan, error) {

	// Validation
	if plan.Title == "" {
		return models.Plan{}, errors.New("plan name is required")
	}

	return s.repo.Update(plan)
}

func (s *planService) Delete(id int64) error {

	return s.repo.Delete(id)
}
