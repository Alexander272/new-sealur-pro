-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.serrated_type
(
    id uuid NOT NULL,
    flange_id uuid NOT NULL,
    base_id uuid NOT NULL,
    code text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT serrated_type_pkey PRIMARY KEY (id),
    CONSTRAINT serrated_type_base_id_fkey FOREIGN KEY (base_id)
        REFERENCES public.serrated_type_base (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT serrated_type_flange_id_fkey FOREIGN KEY (flange_id)
        REFERENCES public.serrated_flange_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.serrated_type
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.serrated_type;
-- +goose StatementEnd
