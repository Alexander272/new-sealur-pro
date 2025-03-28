-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL,
    company text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    inn text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    kpp text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    region text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    city text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    "position" text COLLATE pg_catalog."default" DEFAULT ''::text,
    phone text COLLATE pg_catalog."default" DEFAULT ''::text,
    password text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    email text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    confirmed boolean DEFAULT false,
    date text COLLATE pg_catalog."default" DEFAULT ''::text,
    role_id uuid NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    address text COLLATE pg_catalog."default" DEFAULT ''::text,
    is_inner boolean DEFAULT false,
    manager_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    use_link boolean DEFAULT true,
    use_landing boolean DEFAULT false,
    last_visit text COLLATE pg_catalog."default" DEFAULT ''::text,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES public.role (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public."user";
-- +goose StatementEnd
