-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.wave_size
(
    id uuid NOT NULL,
    type_id uuid NOT NULL,
    count integer,
    dn text COLLATE pg_catalog."default" NOT NULL,
    dn_alt integer NOT NULL,
    pn_mpa text COLLATE pg_catalog."default" DEFAULT ''::text,
    pn_kg text COLLATE pg_catalog."default" DEFAULT ''::text,
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    h text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT wave_size_pkey PRIMARY KEY (id),
    CONSTRAINT wave_size_type_id_fkey FOREIGN KEY (type_id)
        REFERENCES public.wave_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wave_size
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.wave_size;
-- +goose StatementEnd
