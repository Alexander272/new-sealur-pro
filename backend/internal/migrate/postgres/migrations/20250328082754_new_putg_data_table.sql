-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.putg_data
(
    id uuid NOT NULL,
    filler_id uuid NOT NULL,
    has_jumper boolean DEFAULT false,
    has_hole boolean DEFAULT true,
    has_removable boolean DEFAULT true,
    has_mounting boolean DEFAULT false,
    has_coating boolean DEFAULT true,
    CONSTRAINT putg_data_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.putg_data
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.putg_data;
-- +goose StatementEnd
