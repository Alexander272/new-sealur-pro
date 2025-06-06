-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.jacketed_filler
(
    id uuid NOT NULL,
    temperature_id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    designation text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT jacketed_filler_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.jacketed_filler
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.jacketed_filler;
-- +goose StatementEnd
