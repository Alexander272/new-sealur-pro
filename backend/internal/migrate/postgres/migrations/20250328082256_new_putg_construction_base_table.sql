-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_construction_base
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    has_d4 boolean DEFAULT false,
    has_d3 boolean DEFAULT true,
    has_d2 boolean DEFAULT true,
    has_d1 boolean DEFAULT false,
    has_rotary_plug boolean DEFAULT false,
    has_inner_ring boolean DEFAULT false,
    has_outer_ring boolean DEFAULT false,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    min_width real DEFAULT 0,
    jumper_width_range integer[] DEFAULT '{-1,-1}'::integer[],
    width_range text[] COLLATE pg_catalog."default" DEFAULT '{}'::text[],
    min_size integer DEFAULT 20,
    CONSTRAINT putg_construction_type_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_construction_base
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_construction_base;
-- +goose StatementEnd
