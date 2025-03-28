-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_material
(
    id uuid NOT NULL,
    putg_standard_id uuid NOT NULL,
    material_id uuid NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean,
    code text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT putg_material_pkey PRIMARY KEY (id),
    CONSTRAINT putg_material_material_id_fkey FOREIGN KEY (material_id)
        REFERENCES public.material (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT putg_material_putg_standard_id_fkey FOREIGN KEY (putg_standard_id)
        REFERENCES public.putg_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_material
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_material;
-- +goose StatementEnd
