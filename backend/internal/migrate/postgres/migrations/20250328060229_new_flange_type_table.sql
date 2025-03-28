-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.flange_type
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    code text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    basis boolean NOT NULL DEFAULT false,
    CONSTRAINT flange_type_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.flange_type
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.flange_type;
-- +goose StatementEnd
