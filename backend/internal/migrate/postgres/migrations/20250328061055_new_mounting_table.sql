-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.mounting
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT mounting_pkey PRIMARY KEY (id),
    CONSTRAINT mounting_title_key UNIQUE (title)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.mounting
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.mounting;
-- +goose StatementEnd
