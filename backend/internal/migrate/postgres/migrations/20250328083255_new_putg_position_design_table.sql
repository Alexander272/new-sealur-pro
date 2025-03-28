-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_putg_design
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    has_jumper boolean DEFAULT false,
    jumper_code text COLLATE pg_catalog."default" DEFAULT 'A'::text,
    jumper_width text COLLATE pg_catalog."default" DEFAULT ''::text,
    has_hole boolean DEFAULT false,
    has_removable boolean DEFAULT false,
    has_mounting boolean DEFAULT false,
    mounting_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    drawing text COLLATE pg_catalog."default" DEFAULT ''::text,
    has_coating boolean DEFAULT false,
    CONSTRAINT position_putg_design_pkey PRIMARY KEY (id),
    CONSTRAINT position_putg_design_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_putg_design
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_putg_design;
-- +goose StatementEnd
