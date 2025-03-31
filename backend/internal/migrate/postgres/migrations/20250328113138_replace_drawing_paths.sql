-- +goose Up
-- +goose StatementBegin
UPDATE public.position_putg
	SET drawing='/files?group='||split_part(drawing, '/', 4)||
	    '&name='||split_part(drawing, '/', 5)||'_'||replace(split_part(drawing, '/', 6), ' ', '_')||
	    '&orig='||split_part(drawing, '/', 6)
	WHERE array_length(string_to_array(drawing, '/'),1)>2;

UPDATE public.position_snp
	SET drawing='/files?group='||split_part(drawing, '/', 4)||
	    '&name='||split_part(drawing, '/', 5)||'_'||replace(split_part(drawing, '/', 6), ' ', '_')||
	    '&orig='||split_part(drawing, '/', 6)
	WHERE array_length(string_to_array(drawing, '/'),1)>2
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
