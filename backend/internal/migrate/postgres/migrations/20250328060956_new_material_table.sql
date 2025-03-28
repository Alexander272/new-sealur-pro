-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.material
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    short_en text COLLATE pg_catalog."default" DEFAULT ''::text,
    short_rus text COLLATE pg_catalog."default" DEFAULT ''::text,
    count integer NOT NULL DEFAULT 1,
    CONSTRAINT material_pkey PRIMARY KEY (id),
    CONSTRAINT material_code_key UNIQUE (code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.material
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.material;
-- +goose StatementEnd
