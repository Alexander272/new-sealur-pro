-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_type
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    filler_id uuid NOT NULL,
    min_thickness real,
    max_thickness real,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    type_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT putg_type_pkey PRIMARY KEY (id),
    CONSTRAINT putg_type_filler_id_fkey FOREIGN KEY (filler_id)
        REFERENCES public.putg_filler_base (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_type
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_type;
-- +goose StatementEnd
