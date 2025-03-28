-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_putg_material
(
    id uuid NOT NULL,
    filler_id uuid NOT NULL,
    filler_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    type_id uuid NOT NULL,
    construction_id uuid NOT NULL,
    construction_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    rotary_plug_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    rotary_plug_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    inner_ring_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    inner_ring_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    outer_ring_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    outer_ring_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    position_id uuid NOT NULL,
    rotary_plug_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    inner_ring_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    outer_ring_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    type_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT position_putg_material_pkey PRIMARY KEY (id),
    CONSTRAINT position_putg_material_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_putg_material
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_putg_material;
-- +goose StatementEnd
