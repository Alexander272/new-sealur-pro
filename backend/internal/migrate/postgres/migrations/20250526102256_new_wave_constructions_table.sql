-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.wave_constructions
(
    id uuid NOT NULL,
    base_id uuid NOT NULL,
    standard_id uuid NOT NULL,
    CONSTRAINT wave_constructions_pkey PRIMARY KEY (id),
    CONSTRAINT wave_constructions_base_id_fkey FOREIGN KEY (base_id)
        REFERENCES public.wave_construction_base (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT wave_constructions_standard_id_fkey FOREIGN KEY (standard_id)
        REFERENCES public.wave_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wave_constructions
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.wave_constructions;
-- +goose StatementEnd
