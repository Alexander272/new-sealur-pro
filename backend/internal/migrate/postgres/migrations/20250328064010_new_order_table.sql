-- +goose Up
-- +goose StatementBegin
CREATE SEQUENCE order_number_seq;

CREATE TABLE IF NOT EXISTS public."order"
(
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    date text COLLATE pg_catalog."default" DEFAULT ''::text,
    count_position integer DEFAULT 0,
    "number" bigint NOT NULL DEFAULT nextval('order_number_seq'::regclass),
    status text COLLATE pg_catalog."default" DEFAULT 'new'::text,
    finish_date text COLLATE pg_catalog."default" DEFAULT ''::text,
    work_date text COLLATE pg_catalog."default" DEFAULT ''::text,
    manager_id uuid,
    info text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT order_pkey PRIMARY KEY (id),
    CONSTRAINT order_manager_id_fkey FOREIGN KEY (manager_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT order_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."order"
    OWNER to postgres;

ALTER SEQUENCE order_number_seq OWNED BY order."number";
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public."order";
-- +goose StatementEnd
