-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_snp_main
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    snp_standard_id uuid NOT NULL,
    snp_type_id uuid NOT NULL,
    flange_type_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    flange_type_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT position_snp_main_pkey PRIMARY KEY (id),
    CONSTRAINT position_snp_main_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT position_snp_main_snp_standard_id_fkey FOREIGN KEY (snp_standard_id)
        REFERENCES public.snp_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT position_snp_main_snp_type_id_fkey FOREIGN KEY (snp_type_id)
        REFERENCES public.snp_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_snp_main
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_snp_main;
-- +goose StatementEnd
