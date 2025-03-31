-- +goose Up
-- +goose StatementBegin
ALTER TABLE public."user"
RENAME COLUMN date TO date_text;

ALTER TABLE public."user"
ADD COLUMN IF NOT EXISTS nickname text COLLATE pg_catalog."default" DEFAULT ''::text,
ADD COLUMN IF NOT EXISTS realm text COLLATE pg_catalog."default" DEFAULT ''::text,
ADD COLUMN IF NOT EXISTS provider_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
ADD COLUMN IF NOT EXISTS date integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS visit_date integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

UPDATE public."user"
	SET created_at=TO_TIMESTAMP(CAST(date_text as bigint) / 1000), date=CAST(date_text as bigint) / 1000
	WHERE date_text!='';

UPDATE public."user"
	SET visit_date=CAST(last_visit as bigint) / 1000
	WHERE last_visit!='';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public."user"
DROP COLUMN nickname,
DROP COLUMN realm,
DROP COLUMN provider_id,
DROP COLUMN date,
DROP COLUMN visit_date,
DROP COLUMN created_at;

ALTER TABLE public."user"
RENAME COLUMN date_text TO date;
-- +goose StatementEnd
