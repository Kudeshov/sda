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

  var page = request.query.page || 1;
  var pagesize = request.query.pagesize || 100;

  var data_source_id = "";
  data_source_id = request.query.data_source_id;
  data_source_id = data_source_id || "";  

  var organ_id = "";
  organ_id = request.query.organ_id;
  organ_id = organ_id || "";
  var irradiation_id = "";
  irradiation_id = request.query.irradiation_id;
  irradiation_id = irradiation_id || "";
  var isotope_id = "";
  isotope_id = request.query.isotope_id;
  isotope_id = isotope_id || "";

  var integral_period_id = "";
  integral_period_id = request.query.integral_period_id;
  integral_period_id = integral_period_id || "";  
   //console.log(data_source_id+ ' ' + organ_id);
  console.log( ' page = ' + page); 

  var s_query =  
  'select vid.*, ds.title as "data_source_title", o_nls.name as "organ_name_rus", in2.name as "irradiation_name_rus", '+
  'i.title as "isotope_title", ip.name as "integral_period_name_rus" '+
  'from nucl.value_int_dose vid '+
  'left join nucl.data_source ds on ds.id = vid.data_source_id '+
  'left join nucl.organ_nls o_nls on o_nls.organ_id = vid.organ_id and o_nls.lang_id = 1 '+
  'left join nucl.irradiation_nls in2 on in2.irradiation_id = vid.irradiation_id and in2.lang_id = 1 '+
  'left join nucl.isotope i on i.id  = vid.isotope_id '+
  'left join nucl.integral_period_nls ip on ip.integral_period_id = vid.integral_period_id and ip.lang_id = 1 '+
  ((data_source_id)?`where `:` `) +
  (data_source_id?`vid.data_source_id in (${data_source_id}) `:'')+
  ((data_source_id&&organ_id)?`and `:((organ_id)?`where `:` `)) +
  (organ_id?`vid.organ_id in (${organ_id}) `:'')+
  (((data_source_id||organ_id)&&irradiation_id)?`and `:((irradiation_id)?`where `:` `)) +
  (irradiation_id?`vid.irradiation_id in (${irradiation_id}) `:'')+
  (((data_source_id||organ_id||irradiation_id)&&isotope_id)?`and `:((isotope_id)?`where `:` `)) +
  (isotope_id?`vid.isotope_id in (${isotope_id}) `:'')+
  (((data_source_id||organ_id||irradiation_id||isotope_id)&&integral_period_id)?`and `:((integral_period_id)?`where `:` `)) +
  (integral_period_id?`vid.integral_period_id in (${integral_period_id}) `:'')+
  `order by id `+
  `limit ${pagesize} offset (${page}-1)*${pagesize}`;

  console.log(s_query);
  pool.query( s_query, (error, results) => {
    if(error) {
        return console.error('error running query', error);
    }
/*     console.log(results.rows); */
    response.set('Content-Range','items 1-100/23123');
    response.status(200).json(results.rows)
    });
}

module.exports = {
  getValueIntDose
}
