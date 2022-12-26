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

const getChemCompGr = (request, response ) => {
  pool.query(`SELECT * from ( `+
    `SELECT ccg.id+1000000 as id, title, COALESCE(chelement_id,1000000) as parent_id, formula, ccgn1.name name_rus, ccgn2.name name_eng, ccgn1.descr descr_rus, ccgn2.descr descr_eng FROM nucl.chem_comp_gr ccg `+
    `left join nucl.chem_comp_gr_nls ccgn1 on ccg.id=ccgn1.chem_comp_gr_id and ccgn1.lang_id=1 `+ 
    `left join nucl.chem_comp_gr_nls ccgn2 on ccg.id=ccgn2.chem_comp_gr_id and ccgn2.lang_id=2 `+
    `UNION `+
    `SELECT id, title, null as parent_id, null as formula, null as name_rus, null as name_eng, null as descr_rus, null as descr_eng FROM nucl.chelement `+
    `WHERE id in (SELECT distinct chelement_id from nucl.chem_comp_gr) `+
    `UNION SELECT 1000000 as id, 'Не определено' as Title, null as parent_id, null as formula, null as name_rus, null as name_eng, null as descr_rus, null as descr_eng `+
    `) as chelement_chem `+
    `order by title `, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getChemCompGr
}
