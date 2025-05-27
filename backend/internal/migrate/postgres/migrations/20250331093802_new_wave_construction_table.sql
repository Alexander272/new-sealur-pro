-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.wave_construction_base
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    allowed_types text[] COLLATE pg_catalog."default" DEFAULT '{}'::text[],
    CONSTRAINT wave_construction_base_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wave_construction_base
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.wave_construction_base;
-- +goose StatementEnd
