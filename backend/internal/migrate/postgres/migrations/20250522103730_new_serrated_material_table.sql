-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.serrated_material
(
    id uuid NOT NULL,
    material_id uuid NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean,
    CONSTRAINT serrated_material_pkey PRIMARY KEY (id),
    CONSTRAINT serrated_material_material_id_fkey FOREIGN KEY (material_id)
        REFERENCES public.material (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.serrated_material
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.serrated_material;
-- +goose StatementEnd
