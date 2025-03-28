-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.snp_standard
(
    id uuid NOT NULL,
    standard_id uuid NOT NULL,
    flange_standard_id uuid NOT NULL,
    dn_title text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    pn_title text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    has_d2 boolean DEFAULT false,
    count integer,
    CONSTRAINT standard_snp_pkey PRIMARY KEY (id),
    CONSTRAINT snp_standard_standard_id_fkey FOREIGN KEY (standard_id)
        REFERENCES public.standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT standard_snp_flange_standard_id_fkey FOREIGN KEY (flange_standard_id)
        REFERENCES public.flange_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.snp_standard
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.snp_standard;
-- +goose StatementEnd
