-- +goose Up
-- +goose StatementBegin
ALTER TABLE public."position"
ADD COLUMN created_at timestamp with time zone DEFAULT now();

UPDATE public."position" AS p
	SET created_at=(SELECT created_at FROM public."order" WHERE p.order_id=id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public."position"
DROP COLUMN created_at;
-- +goose StatementEnd
