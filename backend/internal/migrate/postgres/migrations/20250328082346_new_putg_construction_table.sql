-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_construction
(
    id uuid NOT NULL,
    construction_id uuid NOT NULL,
    putg_flange_type_id uuid NOT NULL,
    filler_id uuid NOT NULL,
    CONSTRAINT putg_construction_pkey PRIMARY KEY (id),
    CONSTRAINT putg_construction_base_construction_id_fkey FOREIGN KEY (construction_id)
        REFERENCES public.putg_construction_base (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT putg_construction_filler_id_fkey FOREIGN KEY (filler_id)
        REFERENCES public.putg_filler_base (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT putg_construction_putg_flange_type_id_fkey FOREIGN KEY (putg_flange_type_id)
        REFERENCES public.putg_flange_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_construction
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_construction;
-- +goose StatementEnd
