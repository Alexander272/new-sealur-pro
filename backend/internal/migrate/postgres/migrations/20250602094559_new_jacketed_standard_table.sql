-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.jacketed_standard
(
    id uuid NOT NULL,
    count integer DEFAULT 0,
    dn_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    pn_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    flange_standard_id uuid NOT NULL,
    standard_id uuid,
    CONSTRAINT jacketed_standard_pkey PRIMARY KEY (id),
    CONSTRAINT jacketed_standard_flange_standard_id_fkey FOREIGN KEY (flange_standard_id)
        REFERENCES public.flange_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.jacketed_standard
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.jacketed_standard;
-- +goose StatementEnd
