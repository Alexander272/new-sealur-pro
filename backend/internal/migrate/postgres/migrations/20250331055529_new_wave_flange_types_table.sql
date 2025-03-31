-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.wave_flange_type
(
    id uuid NOT NULL,
    standard_id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT wave_flange_type_pkey PRIMARY KEY (id),
    CONSTRAINT wave_flange_type_standard_id_fkey FOREIGN KEY (standard_id)
        REFERENCES public.wave_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wave_flange_type
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.wave_flange_type;
-- +goose StatementEnd
