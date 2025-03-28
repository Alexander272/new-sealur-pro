-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.snp_filler
(
    id uuid NOT NULL,
    standard_id uuid NOT NULL,
    temperature_id uuid NOT NULL,
    base_code text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" DEFAULT ''::text,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    designation text COLLATE pg_catalog."default" DEFAULT ''::text,
    disabled_types uuid[] DEFAULT ARRAY[]::uuid[],
    is_standard boolean NOT NULL DEFAULT true,
    CONSTRAINT snp_filler_pkey PRIMARY KEY (id),
    CONSTRAINT snp_filler_standard_id_fkey FOREIGN KEY (standard_id)
        REFERENCES public.standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT snp_filler_temperature_id_fkey FOREIGN KEY (temperature_id)
        REFERENCES public.temperature (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.snp_filler
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.snp_filler;
-- +goose StatementEnd
