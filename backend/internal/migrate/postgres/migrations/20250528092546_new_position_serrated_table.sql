-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_serrated
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    standard_id uuid NOT NULL,
    flange_type_id uuid NOT NULL,
    type_id uuid NOT NULL,
    construction_id uuid NOT NULL,
    plating_id uuid NOT NULL,
    base_id uuid NOT NULL,
    rotary_plug_id uuid NOT NULL,
    size_id uuid NOT NULL,
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    h text COLLATE pg_catalog."default" DEFAULT ''::text,
    jumper text COLLATE pg_catalog."default" DEFAULT ''::text,
    jumper_width text COLLATE pg_catalog."default" DEFAULT ''::text,
    has_hole boolean DEFAULT false,
    has_coating boolean DEFAULT false,
    with_retainer boolean DEFAULT false,
    drawing text COLLATE pg_catalog."default" DEFAULT ''::text,
    created_at time with time zone DEFAULT now(),
    CONSTRAINT position_serrated_pkey PRIMARY KEY (id),
    CONSTRAINT position_serrated_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_serrated
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_serrated;
-- +goose StatementEnd
