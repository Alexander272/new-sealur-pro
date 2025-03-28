-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_snp_size
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    dn text COLLATE pg_catalog."default" NOT NULL,
    pn_mpa text COLLATE pg_catalog."default" DEFAULT ''::text,
    pn_kg text COLLATE pg_catalog."default" DEFAULT ''::text,
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    h text COLLATE pg_catalog."default" DEFAULT ''::text,
    s2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    s3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    another text COLLATE pg_catalog."default" DEFAULT ''::text,
    dn_mm text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT position_snp_size_pkey PRIMARY KEY (id),
    CONSTRAINT position_snp_size_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_snp_size
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_snp_size;
-- +goose StatementEnd
