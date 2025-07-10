-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.wave_type
(
    id uuid NOT NULL,
    flange_id uuid NOT NULL,
    base_id uuid NOT NULL,
    priority integer NOT NULL,
    dn_range text[] COLLATE pg_catalog."default" DEFAULT '{}'::text[],
    code text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT wave_type_pkey PRIMARY KEY (id),
    CONSTRAINT wave_type_base_id_fkey FOREIGN KEY (base_id)
        REFERENCES public.wave_type_base (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT wave_type_flange_id_fkey FOREIGN KEY (flange_id)
        REFERENCES public.wave_flange_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wave_type
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.wave_type;
-- +goose StatementEnd
