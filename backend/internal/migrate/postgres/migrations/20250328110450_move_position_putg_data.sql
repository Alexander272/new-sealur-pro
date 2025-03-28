-- +goose Up
-- +goose StatementBegin
INSERT INTO public.position_putg(
	id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, pn_index, h, d4, d3, d2, d1, filler_id, 
	type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, has_coating, 
	has_removable, mounting, drawing, has_rounding, use_dimensions)
	
	SELECT ps.id, ps.position_id, putg_standard_id, flange_type_id, configuration_id, 
	COALESCE(size_id, '00000000-0000-0000-0000-000000000000'), COALESCE(pn_index, -1), 
	ps.h, ps.d4, ps.d3, ps.d2, ps.d1, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
	jumper, jumper_width, has_hole, has_coating, has_removable, mounting, drawing, false, use_dimensions
	FROM public.position_putg_size AS ps
	LEFT JOIN LATERAL (SELECT putg_standard_id, flange_type_id, configuration_id FROM position_putg_main 
		WHERE position_id=ps.position_id) AS m ON true
	LEFT JOIN LATERAL (SELECT filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id FROM position_putg_material
		WHERE position_id=ps.position_id) AS mat ON true
 	LEFT JOIN LATERAL (SELECT (CASE WHEN has_jumper THEN jumper_code ELSE '' END) AS jumper, jumper_width,
		(CASE WHEN has_mounting THEN mounting_code ELSE '' END) AS mounting, has_hole, has_removable, has_coating, drawing 
		FROM position_putg_design WHERE position_id=ps.position_id) AS d ON true

	LEFT JOIN LATERAL (SELECT id AS size_id, array_position(pn_mpa, ps.pn_mpa) AS pn_index, d4, d3, d2, d1, h
		FROM putg_size LEFT JOIN LATERAL (SELECT construction_id FROM putg_construction WHERE id=mat.construction_id) AS c ON true
		WHERE putg_flange_type_id=m.flange_type_id AND base_construction_id=construction_id 
		AND dn=ps.dn AND ps.pn_mpa=ANY(pn_mpa)) AS s ON true;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM public.position_putg WHERE position_id IN (SELECT position_id FROM public.position_putg_main);
-- +goose StatementEnd
