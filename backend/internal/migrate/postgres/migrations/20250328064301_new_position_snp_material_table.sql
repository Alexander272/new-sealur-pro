-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_snp_material
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    filler_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    frame_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    inner_ring_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    outer_ring_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    filler_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    frame_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    inner_ring_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    outer_ring_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    frame_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    inner_ring_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    outer_ring_title text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT position_snp_material_pkey PRIMARY KEY (id),
    CONSTRAINT position_snp_material_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_snp_material
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_snp_material;
-- +goose StatementEnd
