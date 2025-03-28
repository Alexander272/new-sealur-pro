-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public."position"
(
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    amount text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL DEFAULT 'Snp'::text,
    count integer NOT NULL,
    info text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT position_pkey PRIMARY KEY (id),
    CONSTRAINT position_order_id_fkey FOREIGN KEY (order_id)
        REFERENCES public."order" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."position"
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public."position";
-- +goose StatementEnd
