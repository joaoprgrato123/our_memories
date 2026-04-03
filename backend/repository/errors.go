package repository

import "errors"

var (
	ErrFileEmpty    = errors.New("file does not have data")
	ErrCardNotFound = errors.New("mtg card not found")
)
