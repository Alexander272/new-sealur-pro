-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_filler
(
    id uuid NOT NULL,
    base_filler_id uuid NOT NULL,
    putg_standard_id uuid NOT NULL,
    CONSTRAINT putg_filler_pkey PRIMARY KEY (id),
    CONSTRAINT putg_filler_base_filler_id_fkey1 FOREIGN KEY (base_filler_id)
        REFERENCES public.putg_filler_base (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT putg_filler_putg_standard_id_fkey FOREIGN KEY (putg_standard_id)
        REFERENCES public.putg_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_filler
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_filler;
-- +goose StatementEnd
