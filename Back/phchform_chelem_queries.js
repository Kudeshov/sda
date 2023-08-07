var express = require(`express`);
var app = express();

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

const getPhchFormChelem = (request, response ) => {
  pool.query('select pc.*, sf.title as subst_form_title, sfn."name" as subst_form_nls_name, sfn.descr as subst_form_nls_descr, '+
  'ccg.title as chem_comp_gr_title, ccg.formula as chem_comp_gr_formula, ccgn."name" as chem_comp_gr_nls_name, '+
  'ccgn.descr as chem_comp_gr_nls_descr, c.title as chelement_title, c.atomic_num as chelement_atomic_num '+
  'from nucl.phchform_chelem pc '+
  'join nucl.subst_form sf on sf.id = pc.subst_form_id '+
  'left join nucl.subst_form_nls sfn on sfn.subst_form_id = sf.id and sfn.lang_id = 1 '+
  'left join nucl.chem_comp_gr ccg on ccg.id = pc.chem_comp_gr_id '+
  'left join nucl.chem_comp_gr_nls ccgn on ccgn.chem_comp_gr_id = ccg.id and ccgn.lang_id = 1 '+
  'join nucl.chelement c on c.id = pc.chelement_id '+
  'order by pc.chelement_id, sf.title', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getPhchFormChelem
}
