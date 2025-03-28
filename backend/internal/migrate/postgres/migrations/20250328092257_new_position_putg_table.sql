-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_putg
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    putg_standard_id uuid NOT NULL,
    flange_type_id uuid NOT NULL,
    configuration_id uuid NOT NULL,
    size_id uuid NOT NULL,
    pn_index integer DEFAULT 0,
    h text COLLATE pg_catalog."default" DEFAULT ''::text,
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    use_dimensions boolean DEFAULT false,
    filler_id uuid NOT NULL,
    type_id uuid NOT NULL,
    construction_id uuid NOT NULL,
    rotary_plug_id uuid NOT NULL,
    inner_ring_id uuid NOT NULL,
    outer_ring_id uuid NOT NULL,
    jumper text COLLATE pg_catalog."default" DEFAULT ''::text,
    jumper_width text COLLATE pg_catalog."default" DEFAULT ''::text,
    has_hole boolean DEFAULT false,
    has_coating boolean DEFAULT false,
    has_removable boolean DEFAULT false,
    has_rounding boolean DEFAULT false,
    mounting text COLLATE pg_catalog."default" DEFAULT ''::text,
    drawing text COLLATE pg_catalog."default" DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT position_putg_pkey PRIMARY KEY (id),
    CONSTRAINT position_putg_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_putg
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_putg;
-- +goose StatementEnd
