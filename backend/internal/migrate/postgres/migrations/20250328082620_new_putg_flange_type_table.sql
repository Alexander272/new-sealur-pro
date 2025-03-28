-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_flange_type
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    putg_standard_id uuid NOT NULL,
    CONSTRAINT putg_flange_type_pkey PRIMARY KEY (id),
    CONSTRAINT putg_flange_type_putg_standard_id_fkey FOREIGN KEY (putg_standard_id)
        REFERENCES public.putg_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_flange_type
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_flange_type;
-- +goose StatementEnd
