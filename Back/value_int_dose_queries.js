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

const getValueIntDose = (request, response ) => {
  console.log('getValueIntDose');
  console.log(request.query);

  var data_source_id = "";
  data_source_id = request.query.data_source_id;
  data_source_id = data_source_id || "";  
  var organ_id = "";
  organ_id = request.query.organ_id;
  organ_id = organ_id || "";
  console.log(data_source_id+ ' ' + organ_id);

  var s_query =  
  'select vid.*, ds.title as "data_source_title", o_nls.name as "organ_name_rus" from nucl.value_int_dose vid  '+
  'left join nucl.data_source ds on ds.id = vid.data_source_id '+
  'left join nucl.organ_nls o_nls on o_nls.organ_id = vid.organ_id and o_nls.lang_id = 1 '+
  ((data_source_id)?`where `:` `) +
  (data_source_id?`vid.data_source_id in (${data_source_id}) `:'')+
  ((data_source_id&&organ_id)?`and `:((organ_id)?`where `:` `)) +
  (organ_id?`vid.organ_id in (${organ_id}) `:'')+
  'limit 200 ';
  console.log(s_query);
  pool.query( s_query, (error, results) => {
    if(error) {
        return console.error('error running query', error);
    }
/*     console.log(results.rows); */
    response.status(200).json(results.rows)
    });
}

module.exports = {
  getValueIntDose
}
