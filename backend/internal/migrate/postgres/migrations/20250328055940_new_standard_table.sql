-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.standard
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    format text[] COLLATE pg_catalog."default",
    is_default boolean DEFAULT false,
    CONSTRAINT standard_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.standard
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.standard;
-- +goose StatementEnd
