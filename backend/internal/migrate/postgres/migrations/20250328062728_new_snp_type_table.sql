-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.snp_type
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    flange_type_id uuid NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    snp_standard_id uuid NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    has_d4 boolean DEFAULT false,
    has_d3 boolean DEFAULT true,
    has_d2 boolean DEFAULT true,
    has_d1 boolean DEFAULT false,
    CONSTRAINT snp_type_pkey PRIMARY KEY (id),
    CONSTRAINT snp_type_flange_type_id_fkey FOREIGN KEY (flange_type_id)
        REFERENCES public.flange_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT snp_type_snp_standard_id_fkey FOREIGN KEY (snp_standard_id)
        REFERENCES public.snp_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.snp_type
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.snp_type;
-- +goose StatementEnd
