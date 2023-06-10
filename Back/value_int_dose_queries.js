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

  var select_fields = 'select vid.*, ds.title as "data_source_title", o_nls.name as "organ_name_rus", '+
    'in2.name as "irradiation_name_rus", i.title as "isotope_title", ip.name as "integral_period_name_rus", '+
    'dr.title  as "dose_ratio_title", lln."name" as "let_level_name_rus", an.name as "agegroup_name_rus",  '+
    'sfn."name" as "subst_form_name_rus", asn."name" as "aerosol_sol_name_rus", aan."name" as "aerosol_amad_name_rus", '+
    'esn."name" as "exp_scenario_name_rus", pcn."name" as "people_class_name_rus", ccgn."name" as "chem_comp_group_name_rus"';
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
    'left join nucl.chem_comp_gr_nls ccgn on ccgn.chem_comp_gr_id = vid.chem_comp_gr_id and ccgn.lang_id =1 ' +
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
    `limit 1000 offset (${page}-1)*${pagesize}`;
  pool.query( s_query, (error, results) => {
    if(error) {
        return console.error('error running query', error);
    }
      response.set('X-Total-Count','9999999');
      response.status(200).json(results.rows)
    });
}

const updateValueIntDose = (request, response, table_name) => {
  const id = parseInt(request.params.id);
  const { dose_ratio_id, dr_value, chem_comp_gr_id } = request.body;

  pool.query(
    `UPDATE nucl.value_int_dose SET dose_ratio_id = $1, dr_value=$2, updatetime = NOW(),
    chem_comp_gr_id=$3 WHERE id = $4`,
    [dose_ratio_id, dr_value, chem_comp_gr_id, id],
    (err, res) => {
      if (err) {
        console.error(`Ошибка при обновлении записи`, err.stack);
        response.status(400).send(`Ошибка при обновлении записи`, err.stack);
      } else {
        console.log(`Запись с кодом ${id} сохранена`);
        response.status(200).send(`Запись с кодом ${id} сохранена`);
      }
    }
  );
}


/* const updateValueIntDose = (request, response, table_name ) => {
  pool.connect((err, client, done) => {
    //id
    const id = parseInt(request.params.id);
    const { dose_ratio_id, dr_value, chem_comp_gr_id } = request.body;
    client.query(`BEGIN`, err => {
      client.query(`UPDATE nucl.value_int_dose SET dose_ratio_id = $1, dr_value=$2, updatetime = NOW(),
        chem_comp_gr_id=$3 WHERE id = $4`, [dose_ratio_id, dr_value, chem_comp_gr_id, id], (err, res) => {
            client.query(`COMMIT`, err => {
              if (err) {
                console.error(`Ошибка при подтверждении транзакции`, err.stack);
                response.status(400).send(`Ошибка при подтверждении транзакции`, err.stack);
              }
              else {
                console.log(`Запись с кодом ${id} сохранена`); 
                response.status(200).send(`Запись с кодом ${id} сохранена`);
              }
              done()
        }); 
      })
    })
  })
} */


const createValueIntDose= (request, response) => {
  const { dose_ratio_id, dr_value, chem_comp_gr_id, people_class_id, isotope_id, integral_period_id, organ_id, 
    let_level_id, agegroup_id, data_source_id, subst_form_id, aerosol_sol_id, aerosol_amad_id, exp_scenario_id, 
    irradiation_id } = request.body;
 
  pool.query(`INSERT INTO nucl.value_int_dose (dose_ratio_id, dr_value, chem_comp_gr_id, people_class_id, 
    isotope_id, integral_period_id, organ_id, let_level_id, agegroup_id, data_source_id, subst_form_id, 
    aerosol_sol_id, aerosol_amad_id, exp_scenario_id, irradiation_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`, 
    [dose_ratio_id, dr_value, chem_comp_gr_id, people_class_id, isotope_id, integral_period_id, organ_id, 
     let_level_id, agegroup_id, data_source_id, subst_form_id, aerosol_sol_id, aerosol_amad_id, exp_scenario_id, 
     irradiation_id], (error, results) => {
      
    console.log(results);
    if (error) 
    {
      response.status(400).send(`Запись не добавлена. Ошибка: `+error.message);
    } 
    else 
    {
      console.log(`Запись добавлена`); 
      response.status(200).send(`Запись добавлена`);
    }
  })
}



const deleteValueIntDose = (request, response) => {
  const id = parseInt(request.params.id)

  if (isNaN(id)) {
    return response.status(400).send('Invalid ID');
  }

  pool.query('DELETE FROM nucl.value_int_dose WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.error(error.message);
      return response.status(500).send('Server error');
    }
    
    if (results.rowCount == 1) {
      return response.status(200).send(`Запись с кодом ${id} удалена`);
    }

    if (results.rowCount == 0) {
      return response.status(404).send(`Запись с кодом ${id} не найдена`);
    }
  })
}


module.exports = {
  getValueIntDose,
  updateValueIntDose,
  createValueIntDose,
  deleteValueIntDose
}
