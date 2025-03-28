-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_size
(
    id uuid NOT NULL,
    putg_flange_type_id uuid NOT NULL,
    base_construction_id uuid NOT NULL,
    count integer,
    dn text COLLATE pg_catalog."default" NOT NULL,
    dn_mm text COLLATE pg_catalog."default" DEFAULT ''::text,
    pn_mpa text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    pn_kg text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    h text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    base_fillers_id uuid[] DEFAULT ARRAY[]::uuid[],
    CONSTRAINT putg_size_new_pkey PRIMARY KEY (id),
    CONSTRAINT putg_size_new_putg_flange_type_id_fkey FOREIGN KEY (putg_flange_type_id)
        REFERENCES public.putg_flange_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_size
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_size;
-- +goose StatementEnd
