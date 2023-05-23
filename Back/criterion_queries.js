var express = require(`express`);
var app = express();
var PORT = 3001;

const bodyParser = require(`body-parser`)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const { Pool } = require(`pg`);
const e = require(`express`);

var config = require(`./config.json`);

const pool = new Pool(config);
pool.on(`error`, function (err, client) {
    console.error(`idle client error`, err.message, err.stack);
});

const getCriterion = (request, response, table_name ) => {
  pool.query(`SELECT id, title, parent_id, 0 AS crit, NULL AS calcfunction_id, NULL AS irradiation_id, NULL AS people_class_id, NULL AS integral_period_id, NULL AS organ_id, NULL AS agegroup_id, NULL AS exp_scenario_id, NULL AS isotope_id, NULL AS subst_form_id, NULL AS chem_comp_gr_id, NULL AS aerosol_sol_id, NULL AS aerosol_amad_id, NULL AS timeend, NULL AS action_level_id, NULL AS data_source_id, NULL AS cr_value, null as name_rus, null as name_eng, null as descr_rus, null as descr_eng
  FROM nucl.criterion_gr
  UNION ALL
  SELECT c.id, c.title, c.criterion_gr_id, 1 AS crit, c.calcfunction_id, c.irradiation_id, c.people_class_id, c.integral_period_id, c.organ_id, c.agegroup_id, c.exp_scenario_id, c.isotope_id, c.subst_form_id, c.chem_comp_gr_id, c.aerosol_sol_id, c.aerosol_amad_id, c.timeend, c.action_level_id, c.data_source_id, c.cr_value, pcn1.name name_rus, pcn2.name name_eng, pcn1.descr descr_rus, pcn2.descr descr_eng
  FROM nucl.criterion c
   left join nucl.criterion_nls pcn1 on c.id=pcn1.criterion_id and pcn1.lang_id=1 
   left join nucl.criterion_nls pcn2 on c.id=pcn2.criterion_id and pcn2.lang_id=2 
  ORDER BY crit, id`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
    getCriterion
}
