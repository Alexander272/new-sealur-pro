-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_jacketed
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    standard_id uuid NOT NULL,
    flange_type_id uuid NOT NULL,
    type_id uuid NOT NULL,
    construction_id uuid NOT NULL,
    filler_id uuid NOT NULL,
    shell_id uuid NOT NULL,
    size_id uuid NOT NULL,
    d4 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d3 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d2 text COLLATE pg_catalog."default" DEFAULT ''::text,
    d1 text COLLATE pg_catalog."default" DEFAULT ''::text,
    h text COLLATE pg_catalog."default" DEFAULT ''::text,
    drawing text COLLATE pg_catalog."default" DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT position_jacketed_pkey PRIMARY KEY (id),
    CONSTRAINT position_jacketed_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_jacketed;
-- +goose StatementEnd
