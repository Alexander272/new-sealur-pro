-- +goose Up
-- +goose StatementBegin
ALTER TABLE public."order" RENAME COLUMN date TO date_text;
ALTER TABLE public."order" RENAME COLUMN work_date TO work_date_text;
ALTER TABLE public."order" RENAME COLUMN finish_date TO finish_date_text;

ALTER TABLE public."order"
ADD COLUMN IF NOT EXISTS date integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS work_date integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS finish_date integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

UPDATE public."order"
	SET created_at=TO_TIMESTAMP(CAST(date_text as bigint) / 1000), date=CAST(date_text as bigint) / 1000
	WHERE date_text!='';

UPDATE public."order"
	SET work_date=CAST(work_date_text as bigint) / 1000
	WHERE work_date_text!='';
UPDATE public."order"
	SET finish_date=CAST(finish_date_text as bigint) / 1000
	WHERE finish_date_text!='';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public."order"
DROP COLUMN date,
DROP COLUMN work_date,
DROP COLUMN finish_date,
DROP COLUMN created_at;

ALTER TABLE public."user"
RENAME COLUMN date_text TO date,
RENAME COLUMN work_date_text TO work_date,
RENAME COLUMN finish_date_text TO finish_date;
-- +goose StatementEnd
