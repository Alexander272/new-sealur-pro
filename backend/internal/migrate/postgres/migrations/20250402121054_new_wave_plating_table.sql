-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.wave_plating
(
    id uuid NOT NULL,
    temperature_id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    designation text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT wave_plating_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wave_plating
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.wave_plating;
-- +goose StatementEnd
