-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_snp
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    snp_standard_id uuid NOT NULL,
    snp_type_id uuid NOT NULL,
    flange_type_id uuid NOT NULL,
    size_id uuid NOT NULL,
    pn_index integer DEFAULT 0,
    h_index integer DEFAULT 0,
    another text COLLATE pg_catalog."default" DEFAULT ''::text,
    filler_id uuid NOT NULL,
    frame_id uuid NOT NULL,
    inner_ring_id uuid NOT NULL,
    outer_ring_id uuid NOT NULL,
    jumper text COLLATE pg_catalog."default" DEFAULT ''::text,
    jumper_width text COLLATE pg_catalog."default" DEFAULT ''::text,
    has_hole boolean DEFAULT false,
    mounting text COLLATE pg_catalog."default" DEFAULT ''::text,
    drawing text COLLATE pg_catalog."default" DEFAULT ''::text,
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT position_snp_pkey PRIMARY KEY (id),
    CONSTRAINT position_snp_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_snp
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_snp;
-- +goose StatementEnd
