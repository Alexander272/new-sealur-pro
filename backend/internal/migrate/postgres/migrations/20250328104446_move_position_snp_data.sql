-- +goose Up
-- +goose StatementBegin
INSERT INTO public.position_snp(
	id, position_id, snp_standard_id, snp_type_id, flange_type_id, size_id, h_index, another, filler_id, 
	frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing, d4, d3, d2, d1)
	
	SELECT ps.id, position_id, snp_standard_id, snp_type_id, flange_type_id, COALESCE(size_id, '00000000-0000-0000-0000-000000000000'), 
	COALESCE(h_index, 0), ps.h, filler_id, frame_id, inner_ring_id, outer_ring_id,
	jumper, jumper_width, has_hole, mounting, drawing, ps.d4, ps.d3, ps.d2, ps.d1
	FROM public.position_snp_size AS ps
	LEFT JOIN LATERAL (SELECT snp_standard_id, snp_type_id, flange_type_code FROM position_snp_main 
		WHERE position_id=ps.position_id) AS m ON true
	LEFT JOIN LATERAL (SELECT filler_id, frame_id, inner_ring_id, outer_ring_id FROM position_snp_material 
		WHERE position_id=ps.position_id) AS mat ON true
	LEFT JOIN LATERAL (SELECT (CASE WHEN has_jumper THEN jumper_code ELSE '' END) AS jumper, jumper_width,
		(CASE WHEN has_mounting THEN mounting_code ELSE '' END) AS mounting, has_hole, drawing FROM position_snp_design 
		WHERE position_id=ps.position_id) AS d ON true
	
	LEFT JOIN LATERAL (SELECT id AS flange_type_id FROM flange_type WHERE code=flange_type_code) AS ft ON true
	LEFT JOIN LATERAL (SELECT id AS size_id, array_position(h, ps.h) AS h_index, d4, d3, d2, d1, h 
		FROM snp_size WHERE snp_type_id=m.snp_type_id AND dn=ps.dn AND pn=ps.pn_mpa) AS s ON true;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM public.position_snp WHERE position_id IN (SELECT position_id FROM public.position_snp_main);
-- +goose StatementEnd
