-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.snp_data
(
    id uuid NOT NULL,
    type_id uuid NOT NULL,
    standard_id uuid,
    has_inner_ring boolean NOT NULL DEFAULT true,
    has_frame boolean NOT NULL DEFAULT true,
    has_outer_ring boolean NOT NULL DEFAULT true,
    has_hole boolean NOT NULL DEFAULT false,
    has_jumper boolean NOT NULL DEFAULT false,
    has_mounting boolean NOT NULL DEFAULT true,
    CONSTRAINT snp_data_pkey PRIMARY KEY (id),
    CONSTRAINT snp_data_type_id_fkey FOREIGN KEY (type_id)
        REFERENCES public.snp_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.snp_data
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.snp_data;
-- +goose StatementEnd
