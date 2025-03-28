-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.position_putg_main
(
    id uuid NOT NULL,
    putg_standard_id uuid NOT NULL,
    flange_type_id uuid NOT NULL,
    configuration_id uuid NOT NULL,
    position_id uuid NOT NULL,
    configuration_code text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT position_putg_main_pkey PRIMARY KEY (id),
    CONSTRAINT position_putg_main_configuration_id_fkey FOREIGN KEY (configuration_id)
        REFERENCES public.putg_configuration (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT position_putg_main_flange_type_id_fkey FOREIGN KEY (flange_type_id)
        REFERENCES public.putg_flange_type (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT position_putg_main_position_id_fkey FOREIGN KEY (position_id)
        REFERENCES public."position" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT position_putg_main_putg_standard_id_fkey FOREIGN KEY (putg_standard_id)
        REFERENCES public.putg_standard (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.position_putg_main
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.position_putg_main;
-- +goose StatementEnd
