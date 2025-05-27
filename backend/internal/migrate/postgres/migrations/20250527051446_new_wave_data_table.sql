-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.wave_data
(
    id uuid NOT NULL,
    standard_id uuid NOT NULL,
    has_jumper boolean DEFAULT false,
    has_hole boolean DEFAULT false,
    has_coating boolean DEFAULT false,
    with_retainer boolean DEFAULT false,
    CONSTRAINT wave_data_pkey PRIMARY KEY (id),
    CONSTRAINT wave_data_standard_id_fkey FOREIGN KEY (standard_id)
        REFERENCES public.wave_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wave_data
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.wave_data;
-- +goose StatementEnd
