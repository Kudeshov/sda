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
  var dose_ratio_id = "";
  dose_ratio_id = request.query.dose_ratio_id;
  dose_ratio_id = dose_ratio_id || "";

  var let_level_id = "";
  let_level_id = request.query.let_level_id;
  let_level_id = let_level_id || "";  
  var agegroup_id = "";
  agegroup_id = request.query.agegroup_id;
  agegroup_id = agegroup_id || "";
  var subst_form_id = "";
  subst_form_id = request.query.subst_form_id;
  subst_form_id = subst_form_id || "";
  var aerosol_sol_id = "";
  aerosol_sol_id = request.query.aerosol_sol_id;
  aerosol_sol_id = aerosol_sol_id || "";
  var aerosol_amad_id = "";
  aerosol_amad_id = request.query.aerosol_amad_id;
  aerosol_amad_id = aerosol_amad_id || "";
  var exp_scenario_id = "";
  exp_scenario_id = request.query.exp_scenario_id;
  exp_scenario_id = exp_scenario_id || "";
  var people_class_id = "";
  people_class_id = request.query.people_class_id;
  people_class_id = people_class_id || "";

  //console.log(data_source_id+ ' ' + organ_id);
  console.log( ' page = ' + page); 
  console.log( ' page = ' + page); 
  var select_fields = 'select vid.*, ds.title as "data_source_title", o_nls.name as "organ_name_rus", '+
    'in2.name as "irradiation_name_rus", i.title as "isotope_title", ip.name as "integral_period_name_rus", '+
    'dr.title  as "dose_ratio_title", lln."name" as "let_level_name_rus", an.name as "agegroup_name_rus",  '+
    'sfn."name" as "subst_form_name_rus", asn."name" as "aerosol_sol_name_rus", aan."name" as "aerosol_amad_name_rus", '+
    'esn."name" as "exp_scenario_name_rus", pcn."name" as "people_class_name_rus" ';
  //var select_count = 'select count (vid.id) ';
  var s_query = select_fields +  
    'from nucl.value_int_dose vid '+
    'left join nucl.data_source ds on ds.id = vid.data_source_id '+
    'left join nucl.organ_nls o_nls on o_nls.organ_id = vid.organ_id and o_nls.lang_id = 1 '+
    'left join nucl.irradiation_nls in2 on in2.irradiation_id = vid.irradiation_id and in2.lang_id = 1 '+
    'left join nucl.isotope i on i.id  = vid.isotope_id '+
    'left join nucl.integral_period_nls ip on ip.integral_period_id = vid.integral_period_id and ip.lang_id = 1 '+
    'left join nucl.dose_ratio dr on dr.id = vid.dose_ratio_id  '+
    'left join nucl.let_level_nls lln on lln.let_level_id = vid.let_level_id and lln.lang_id = 1  '+
    'left join nucl.agegroup_nls an on an.agegroup_id = vid.agegroup_id and an.lang_id = 1  '+
    'left join nucl.subst_form_nls sfn on sfn.subst_form_id = vid.subst_form_id and sfn.lang_id = 1 ' +
    'left join nucl.aerosol_sol_nls asn on asn.aerosol_sol_id = vid.aerosol_sol_id and asn.lang_id = 1 '+
    'left join nucl.aerosol_amad_nls aan on aan.aerosol_amad_id = vid.aerosol_amad_id and aan.lang_id = 1 ' +
    'left join nucl.exp_scenario_nls esn on esn.exp_scenario_id = vid.exp_scenario_id and esn.lang_id = 1 ' +
    'left join nucl.people_class_nls pcn on pcn.people_class_id = vid.people_class_id and pcn.lang_id = 1 ' +
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
    (((data_source_id||organ_id||irradiation_id||isotope_id||integral_period_id)&&dose_ratio_id)?`and `:((dose_ratio_id)?`where `:` `)) +
    (dose_ratio_id?`vid.dose_ratio_id in (${dose_ratio_id}) `:'')+
    (((data_source_id||organ_id||irradiation_id||isotope_id||integral_period_id||dose_ratio_id)&&let_level_id)?`and `:((let_level_id)?`where `:` `)) +    
    (let_level_id?`vid.let_level_id in (${let_level_id}) `:'')+
    (((data_source_id||organ_id||irradiation_id||isotope_id||integral_period_id||dose_ratio_id||let_level_id)&&agegroup_id)?`and `:((agegroup_id)?`where `:` `)) +    
    (agegroup_id?`vid.agegroup_id in (${agegroup_id}) `:'')+
    (((data_source_id||organ_id||irradiation_id||isotope_id||integral_period_id||dose_ratio_id||let_level_id||agegroup_id)&&subst_form_id)?`and `:((subst_form_id)?`where `:` `)) +    
    (subst_form_id?`vid.subst_form_id in (${subst_form_id}) `:'')+
    (((data_source_id||organ_id||irradiation_id||isotope_id||integral_period_id||dose_ratio_id||let_level_id||agegroup_id||subst_form_id)&&aerosol_sol_id)?`and `:((aerosol_sol_id)?`where `:` `)) +    
    (aerosol_sol_id?`vid.aerosol_sol_id in (${aerosol_sol_id}) `:'')+
    (((data_source_id||organ_id||irradiation_id||isotope_id||integral_period_id||dose_ratio_id||let_level_id||agegroup_id||subst_form_id||aerosol_sol_id)&&aerosol_amad_id)?`and `:((aerosol_amad_id)?`where `:` `)) +    
    (aerosol_amad_id?`vid.aerosol_amad_id in (${aerosol_amad_id}) `:'')+
    (((data_source_id||organ_id||irradiation_id||isotope_id||integral_period_id||dose_ratio_id||let_level_id||agegroup_id||subst_form_id||aerosol_sol_id||aerosol_amad_id)&&exp_scenario_id)?`and `:((exp_scenario_id)?`where `:` `)) +    
    (exp_scenario_id?`vid.exp_scenario_id in (${exp_scenario_id}) `:'')+
    (((data_source_id||organ_id||irradiation_id||isotope_id||integral_period_id||dose_ratio_id||let_level_id||agegroup_id||subst_form_id||aerosol_sol_id||aerosol_amad_id||exp_scenario_id)&&people_class_id)?`and `:((people_class_id)?`where `:` `)) +    
    (people_class_id?`vid.people_class_id in (${people_class_id}) `:'')+
    `order by id `+
    `limit ${pagesize} offset (${page}-1)*${pagesize}`;

  console.log(s_query);
  pool.query( s_query, (error, results) => {
    if(error) {
        return console.error('error running query', error);
    }
/*     console.log(results.rows); */
      //response.set('Content-Range','items 1-100/23123');
      response.set('X-Total-Count','9999999');
      
      response.status(200).json(results.rows)
    });
}

module.exports = {
  getValueIntDose
}
