package repository

import (
	"encoding/json"
	"os"
	"our-memories/models"
)

// interface
type PlanRepository interface {
	GetAll() ([]models.Plan, error)
	GetByID(id int64) (models.Plan, error)
	Create(plan models.Plan) (models.Plan, error)
	Update(plan models.Plan) (models.Plan, error)
	Delete(id int64) error
}

// constructor
func NewPlanRepository(db *models.JSONStorage) PlanRepository {
	return &planRepository{db: db}
}

// implementation
type planRepository struct {
	db *models.JSONStorage
}

func (r *planRepository) GetAll() ([]models.Plan, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return []models.Plan{}, err
	}

	if len(file) == 0 {
		return []models.Plan{}, ErrFileEmpty
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return []models.Plan{}, err
	}

	return data.OurPlans, nil
}

func (r *planRepository) GetByID(id int64) (models.Plan, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Plan{}, err
	}

	if len(file) == 0 {
		return models.Plan{}, ErrCardNotFound
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Plan{}, err
	}

	for _, plan := range data.OurPlans {
		if plan.ID == id {
			return plan, nil
		}
	}

	return models.Plan{}, nil
}

func (r *planRepository) Create(plan models.Plan) (models.Plan, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Plan{}, err
	}

	if len(file) > 0 {
		if err := json.Unmarshal(file, &data); err != nil {
			return models.Plan{}, err
		}
	}

	data.OurPlans = append(data.OurPlans, plan)

	// transform data into json format with pretty ident
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Plan{}, err
	}

	// write into file the new jsondata with read write permissions
	if err := os.WriteFile(r.db.FilePath, jsonData, 0644); err != nil {
		return models.Plan{}, err
	}

	return plan, nil
}

func (r *planRepository) Update(plan models.Plan) (models.Plan, error) {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return models.Plan{}, err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return models.Plan{}, err
	}

	found := false

	for i, p := range data.OurPlans {
		if p.ID == plan.ID {
			data.OurPlans[i] = plan
			found = true
			break
		}
	}

	if !found {
		return models.Plan{}, os.ErrNotExist
	}

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return models.Plan{}, err
	}

	if err := os.WriteFile(r.db.FilePath, updated, 0644); err != nil {
		return models.Plan{}, err
	}

	return plan, nil
}

func (r *planRepository) Delete(id int64) error {
	var data models.AppData

	file, err := os.ReadFile(r.db.FilePath)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(file, &data); err != nil {
		return err
	}

	index := -1
	for i, p := range data.OurPlans {
		if p.ID == id {
			index = i
			break
		}
	}

	if index == -1 {
		return os.ErrNotExist
	}

	// remove element
	data.OurPlans = append(data.OurPlans[:index], data.OurPlans[index+1:]...)

	updated, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.db.FilePath, updated, 0644)
}
