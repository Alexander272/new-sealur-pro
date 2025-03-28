-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_configuration
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    has_standard boolean DEFAULT true,
    has_drawing boolean DEFAULT false,
    is_default boolean DEFAULT false,
    CONSTRAINT putg_configuration_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_configuration
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_configuration;
-- +goose StatementEnd
