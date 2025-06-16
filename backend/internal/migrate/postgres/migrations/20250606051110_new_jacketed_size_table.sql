-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.jacketed_size
(
    id uuid NOT NULL,
    flange_id uuid NOT NULL,
    count integer,
    dn text COLLATE pg_catalog."default" NOT NULL,
    dn_alt integer NOT NULL,
    pn text COLLATE pg_catalog."default" DEFAULT ''::text,
    pn_alt text COLLATE pg_catalog."default" DEFAULT ''::text,
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT jacketed_size_pkey PRIMARY KEY (id),
    CONSTRAINT jacketed_size_flange_id_fkey FOREIGN KEY (flange_id)
        REFERENCES public.jacketed_flange_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.jacketed_size
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.jacketed_size;
-- +goose StatementEnd
