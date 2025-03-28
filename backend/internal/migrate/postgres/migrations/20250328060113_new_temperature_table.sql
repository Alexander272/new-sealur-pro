-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.temperature
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT temperature_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.temperature
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.temperature;
-- +goose StatementEnd
