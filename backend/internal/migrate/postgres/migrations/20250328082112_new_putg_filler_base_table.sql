-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_filler_base
(
    id uuid NOT NULL,
    temperature_id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    designation text COLLATE pg_catalog."default" DEFAULT ''::text,
    code text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT putg_filler_base_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_filler_base
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_filler_base;
-- +goose StatementEnd
