-- nucl.int_dose_attr_mv source

CREATE MATERIALIZED VIEW nucl.int_dose_attr_mv
TABLESPACE pg_default
AS WITH dose AS (
         SELECT value_int_dose.data_source_id,
            value_int_dose.dose_ratio_id,
            value_int_dose.irradiation_id,
            value_int_dose.people_class_id,
            COALESCE(value_int_dose.subst_form_id, '-1'::integer) AS subst_form_id,
            COALESCE(value_int_dose.organ_id, '-1'::integer) AS organ_id,
            COALESCE(value_int_dose.chem_comp_gr_id, '-1'::integer) AS chem_comp_gr_id,
            COALESCE(value_int_dose.aerosol_sol_id, '-1'::integer) AS aerosol_sol_id,
            COALESCE(value_int_dose.aerosol_amad_id, '-1'::integer) AS aerosol_amad_id,
            COALESCE(value_int_dose.let_level_id, '-1'::integer) AS let_level_id,
            COALESCE(value_int_dose.agegroup_id, '-1'::integer) AS agegroup_id,
            COALESCE(value_int_dose.exp_scenario_id, '-1'::integer) AS exp_scenario_id
           FROM nucl.value_int_dose
        )
 SELECT dose.data_source_id,
    dose.dose_ratio_id,
    dose.irradiation_id,
    dose.people_class_id,
    max(dose.subst_form_id) AS subst_form_id,
    max(dose.organ_id) AS organ_id,
    max(dose.chem_comp_gr_id) AS chem_comp_gr_id,
    max(dose.aerosol_sol_id) AS aerosol_sol_id,
    max(dose.aerosol_amad_id) AS aerosol_amad_id,
    max(dose.let_level_id) AS let_level_id,
    max(dose.agegroup_id) AS agegroup_id,
    max(dose.exp_scenario_id) AS exp_scenario_id
   FROM dose
  GROUP BY dose.data_source_id, dose.dose_ratio_id, dose.irradiation_id, dose.people_class_id, dose.subst_form_id
WITH DATA;