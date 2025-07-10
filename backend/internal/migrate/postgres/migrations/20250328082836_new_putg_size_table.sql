-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_size
(
    id uuid NOT NULL,
    flange_type_id uuid NOT NULL,
    base_construction_id uuid NOT NULL,
    count integer,
    dn text COLLATE pg_catalog."default" NOT NULL,
    dn_alt integer NOT NULL,
    pn text COLLATE pg_catalog."default" DEFAULT ''::text,
    pn_alt text COLLATE pg_catalog."default" DEFAULT ''::text,
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    h text[] COLLATE pg_catalog."default" DEFAULT ARRAY[]::text[],
    base_fillers_id uuid[] DEFAULT ARRAY[]::uuid[],
    CONSTRAINT putg_size_pkey PRIMARY KEY (id),
    CONSTRAINT putg_size_base_construction_id_fkey FOREIGN KEY (base_construction_id)
        REFERENCES public.putg_construction_base (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT putg_size_flange_type_id_fkey FOREIGN KEY (flange_type_id)
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
