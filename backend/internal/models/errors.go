package models

import "errors"

var (
	ErrStandAlreadyExists  = errors.New("standard with such title already exists")
	ErrFlangeAlreadyExists = errors.New("flange with such title or short already exists")

	ErrNotFound = errors.New("not found")

	ErrSessionEmpty     = errors.New("user session not found")
	ErrClientIPNotFound = errors.New("client ip not found")
	ErrToken            = errors.New("tokens do not match")

	ErrPassword        = errors.New("passwords do not match")
	ErrUsersEmpty      = errors.New("user list is empty")
	ErrUserExist       = errors.New("user already exists")
	ErrUserNotVerified = errors.New("user not verified")

	ErrUserNotFound = errors.New("user is not found")
)
