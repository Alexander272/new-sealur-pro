-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_standard
(
    id uuid NOT NULL,
    flange_standard_id uuid NOT NULL,
    count integer,
    dn_title text COLLATE pg_catalog."default",
    pn_title text COLLATE pg_catalog."default",
    standard_id uuid,
    CONSTRAINT putg_standard_pkey PRIMARY KEY (id),
    CONSTRAINT putg_standard_flange_standard_id_fkey FOREIGN KEY (flange_standard_id)
        REFERENCES public.flange_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_standard
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_standard;
-- +goose StatementEnd
