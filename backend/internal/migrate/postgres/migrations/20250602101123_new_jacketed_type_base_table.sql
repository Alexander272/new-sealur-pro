-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.jacketed_type_base
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    has_d4 boolean DEFAULT false,
    has_d3 boolean DEFAULT true,
    has_d2 boolean DEFAULT true,
    has_d1 boolean DEFAULT false,
    CONSTRAINT jacketed_type_base_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.jacketed_type_base
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.jacketed_type_base;
-- +goose StatementEnd
