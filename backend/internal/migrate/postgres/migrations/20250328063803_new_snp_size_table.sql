-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.snp_size
(
    id uuid NOT NULL,
    snp_type_id uuid NOT NULL,
    count integer NOT NULL,
    dn text COLLATE pg_catalog."default" NOT NULL,
    dn_mm text COLLATE pg_catalog."default" DEFAULT ''::text,
    pn_mpa text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    pn_kg text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    h text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    s2 text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    s3 text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    CONSTRAINT snp_size_pkey PRIMARY KEY (id),
    CONSTRAINT snp_size_snp_type_id_fkey FOREIGN KEY (snp_type_id)
        REFERENCES public.snp_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.snp_size
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.snp_size;
-- +goose StatementEnd
