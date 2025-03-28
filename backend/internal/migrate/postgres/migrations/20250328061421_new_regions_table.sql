-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.regions
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    manager_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    count_query integer DEFAULT 0,
    CONSTRAINT regions_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.regions
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.regions;
-- +goose StatementEnd
