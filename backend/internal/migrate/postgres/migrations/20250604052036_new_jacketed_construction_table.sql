-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.jacketed_construction
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    has_material boolean DEFAULT true,
    CONSTRAINT jacketed_construction_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.jacketed_construction
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.jacketed_construction;
-- +goose StatementEnd
