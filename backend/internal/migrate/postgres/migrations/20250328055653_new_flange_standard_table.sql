-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.flange_standard
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT flange_standard_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.flange_standard
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.flange_standard;
-- +goose StatementEnd
