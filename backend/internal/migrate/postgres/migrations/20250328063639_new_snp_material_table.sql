-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.snp_material
(
    id uuid NOT NULL,
    standard_id uuid NOT NULL,
    material_id uuid NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean DEFAULT false,
    code text COLLATE pg_catalog."default" NOT NULL,
    is_standard boolean DEFAULT true,
    CONSTRAINT snp_material_pkey PRIMARY KEY (id),
    CONSTRAINT snp_material_material_id_fkey FOREIGN KEY (material_id)
        REFERENCES public.material (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT snp_material_standard_id_fkey FOREIGN KEY (standard_id)
        REFERENCES public.standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.snp_material
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.snp_material;
-- +goose StatementEnd
