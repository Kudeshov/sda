var express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors')
var app = express();
var PORT = 3001;

app.use(cors())
const corsOptions = {
  origin: 'http://localhost:3000/',
}
const configuredCors = cors(corsOptions);
app.options('*', configuredCors);

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const ch_q = require('./chelement_queries');
const ds_q = require('./data_source_queries');
const pc_q = require('./people_class_queries');
const dsc_q = require('./data_source_class_queries');
const gn_q = require('./generic_nls_queries');
const ag_q = require('./agegroup_queries');
const dr_q = require('./dose_ratio_queries');
const pp_q = require('./physparam_queries');
const cf_q = require('./calcfunction_queries');
const es_q = require('./exp_scenario_queries');
const no_q = require('./normativ_queries');
const ccg_q = require('./chem_comp_gr_queries');
const pcm_q = require('./phchform_chelem_queries');
const nuc_q = require('./nuclide_queries');
const cr_q = require('./criterion_queries');
const cg_q = require('./criterion_gr_queries');
const id_q = require('./isotope_decay_queries');
const i_q = require('./isotope_queries');
const vid_q = require('./value_int_dose_queries');
const ac_q = require('./action_criterion_queries')

const { Pool } = require('pg');
//var msg = 'a';
var config = require('./config.json');
const { request, response } = require('express');

const pool = new Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

//CHELEMENT interface
app.get('/chelement', (req, res) => {ch_q.getChelement(req, res, 'chelement')});           //list all
app.get('/chelement/:id', (req, res) => {ch_q.getChelementById(req, res, 'chelement')});   //list 1
app.post('/chelement', (req, res) => {ch_q.createChelement(req, res, 'chelement')});       //create
app.put('/chelement/:id', (req, res) => {ch_q.updateChelement(req, res, 'chelement')});    //update
app.delete('/chelement/:id', (req, res) => {ch_q.deleteChelement(req, res, 'chelement')}); //delete

//DATA_SOURCE interface
app.get('/data_source', ds_q.getDataSource);           //list all
app.get('/data_source/:id', ds_q.getDataSourceById);   //list 1
app.post('/data_source', ds_q.createDataSource);       //create
app.put('/data_source/:id', ds_q.updateDataSource);    //update
app.delete('/data_source/:id', ds_q.deleteDataSource); //delete

//PEOPLE_CLASS interface
app.get('/people_class', (req, res) => {gn_q.getGenericNLS(req, res, 'people_class')});           //list all
app.get('/people_class/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'people_class')});   //list 1
app.post('/people_class', (req, res) => {gn_q.createGenericNLS(req, res, 'people_class')});       //create
app.put('/people_class/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'people_class')});    //update
app.delete('/people_class/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'people_class')}); //delete

/* app.get('/people_class', pc_q.getPeopleClass);           //list all
app.get('/people_class/:id', pc_q.getPeopleClassById);   //list 1
app.post('/people_class', pc_q.createPeopleClass);       //create
app.put('/people_class/:id', pc_q.updatePeopleClass);    //update
app.delete('/people_class/:id', pc_q.deletePeopleClass); //delete */

//GENERIC QUERIES on PEOPLE_CLASS 
app.get('/subst_form', (req, res) => {gn_q.getGenericNLS(req, res, 'subst_form')});           //list all
app.get('/subst_form/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'subst_form')});   //list 1
app.post('/subst_form', (req, res) => {gn_q.createGenericNLS(req, res, 'subst_form')});       //create
app.put('/subst_form/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'subst_form')});    //update
app.delete('/subst_form/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'subst_form')}); //delete

//GENERIC QUERIES on irradiation 
app.get('/irradiation', (req, res) => {gn_q.getGenericNLS(req, res, 'irradiation')});           //list all
app.get('/irradiation/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'irradiation')});   //list 1
app.post('/irradiation', (req, res) => {gn_q.createGenericNLS(req, res, 'irradiation')});       //create
app.put('/irradiation/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'irradiation')});    //update
app.delete('/irradiation/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'irradiation')}); //delete

//GENERIC QUERIES on integral_period 
app.get('/integral_period', (req, res) => {gn_q.getGenericNLS(req, res, 'integral_period')});           //list all
app.get('/integral_period/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'integral_period')});   //list 1
app.post('/integral_period', (req, res) => {gn_q.createGenericNLS(req, res, 'integral_period')});       //create
app.put('/integral_period/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'integral_period')});    //update
app.delete('/integral_period/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'integral_period')}); //delete

//GENERIC QUERIES on aerosol_sol 
app.get('/aerosol_sol', (req, res) => {gn_q.getGenericNLS(req, res, 'aerosol_sol')});           //list all
app.get('/aerosol_sol/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'aerosol_sol')});   //list 1
app.post('/aerosol_sol', (req, res) => {gn_q.createGenericNLS(req, res, 'aerosol_sol')});       //create
app.put('/aerosol_sol/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'aerosol_sol')});    //update
app.delete('/aerosol_sol/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'aerosol_sol')}); //delete

//GENERIC QUERIES on aerosol_amad 
app.get('/aerosol_amad', (req, res) => {gn_q.getGenericNLS(req, res, 'aerosol_amad')});           //list all
app.get('/aerosol_amad/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'aerosol_amad')});   //list 1
app.post('/aerosol_amad', (req, res) => {gn_q.createGenericNLS(req, res, 'aerosol_amad')});       //create
app.put('/aerosol_amad/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'aerosol_amad')});    //update
app.delete('/aerosol_amad/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'aerosol_amad')}); //delete

//GENERIC QUERIES on let_level
app.get('/let_level', (req, res) => {gn_q.getGenericNLS(req, res, 'let_level')});           //list all
app.get('/let_level/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'let_level')});   //list 1
app.post('/let_level', (req, res) => {gn_q.createGenericNLS(req, res, 'let_level')});       //create
app.put('/let_level/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'let_level')});    //update
app.delete('/let_level/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'let_level')}); //delete

//GENERIC QUERIES on agegroup
app.get('/agegroup', (req, res) => {ag_q.getAgeGroup(req, res, 'agegroup')});           //list all
app.get('/agegroup/:id', (req, res) => {ag_q.getAgeGroupById(req, res, 'agegroup')});   //list 1
app.post('/agegroup', (req, res) => {ag_q.createAgeGroup(req, res, 'agegroup')});       //create
app.put('/agegroup/:id', (req, res) => {ag_q.updateAgeGroup(req, res, 'agegroup')});    //update
app.delete('/agegroup/:id', (req, res) => {ag_q.deleteAgeGroup(req, res, 'agegroup')}); //delete

//GENERIC QUERIES on exp_scenario
app.get('/exp_scenario', (req, res) => {es_q.getExpScenario(req, res, 'exp_scenario')});           //list all
app.get('/exp_scenario/:id', (req, res) => {es_q.getExpScenarioById(req, res, 'exp_scenario')});   //list 1
app.post('/exp_scenario', (req, res) => {es_q.createExpScenario(req, res, 'exp_scenario')});       //create
app.put('/exp_scenario/:id', (req, res) => {es_q.updateExpScenario(req, res, 'exp_scenario')});    //update
app.delete('/exp_scenario/:id', (req, res) => {es_q.deleteExpScenario(req, res, 'exp_scenario')}); //delete

//GENERIC QUERIES on criterion_gr
app.get('/criterion_gr', (req, res) => {cg_q.getCriterionGr(req, res, 'criterion_gr')});           //list all
app.get('/criterion_gr/:id', (req, res) => {cg_q.getCriterionGrById(req, res, 'criterion_gr')});   //list 1
app.post('/criterion_gr', (req, res) => {cg_q.createCriterionGr(req, res, 'criterion_gr')});       //create
app.put('/criterion_gr/:id', (req, res) => {cg_q.updateCriterionGr(req, res, 'criterion_gr')});    //update
app.delete('/criterion_gr/:id', (req, res) => {cg_q.deleteCriterionGr(req, res, 'criterion_gr')}); //delete

//GENERIC QUERIES on criterion_gr
app.get('/organ', (req, res) => {es_q.getExpScenario(req, res, 'organ')});                   //list all
app.get('/organ/:id', (req, res) => {es_q.getExpScenarioById(req, res, 'organ')});           //list 1
app.post('/organ', (req, res) => {es_q.createExpScenario(req, res, 'organ')});               //create
app.put('/organ/:id', (req, res) => {es_q.updateExpScenario(req, res, 'organ')});            //update
app.delete('/organ/:id', (req, res) => {es_q.deleteExpScenario(req, res, 'organ')});         //delete

//GENERIC QUERIES on dose_ratio
app.get('/dose_ratio', (req, res) => {dr_q.getDoseRatio(req, res, 'dose_ratio')});           //list all
app.get('/dose_ratio/:id', (req, res) => {dr_q.getDoseRatioById(req, res, 'dose_ratio')});   //list 1
app.post('/dose_ratio', (req, res) => {dr_q.createDoseRatio(req, res, 'dose_ratio')});       //create
app.put('/dose_ratio/:id', (req, res) => {dr_q.updateDoseRatio(req, res, 'dose_ratio')});    //update
app.delete('/dose_ratio/:id', (req, res) => {dr_q.deleteDoseRatio(req, res, 'dose_ratio')}); //delete

//GENERIC QUERIES on physparam
app.get('/physparam', (req, res) => {pp_q.getPhysParam(req, res, 'physparam')});             //list all
app.get('/physparam/:id', (req, res) => {pp_q.getPhysParamById(req, res, 'physparam')});     //list 1
app.post('/physparam', (req, res) => {pp_q.createPhysParam(req, res, 'physparam')});         //create
app.put('/physparam/:id', (req, res) => {pp_q.updatePhysParam(req, res, 'physparam')});      //update
app.delete('/physparam/:id', (req, res) => {pp_q.deletePhysParam(req, res, 'physparam')});   //delete
 
//data_source_class_queries
app.get('/data_source_class', dsc_q.getDataSourceClass);           //list all
app.get('/data_source_class_min', dsc_q.getDataSourceClassMin);    //list all withoud additional fields
app.post('/data_source_class', dsc_q.createDataSourceClass);       //create
app.put('/data_source_class/:id', dsc_q.updateDataSourceClass);    //update
app.delete('/data_source_class/:id', dsc_q.deleteDataSourceClass); //delete 

app.get('/action_criterion', ac_q.getActionCriterion);           //list all
app.get('/action_criterion_min', ac_q.getActionCriterionMin);    //list all withoud additional fields
app.post('/action_criterion', ac_q.createActionCriterion);       //create
app.put('/action_criterion/:id', ac_q.updateActionCriterion);    //update
app.delete('/action_criterion/:id', ac_q.deleteActionCriterion); //delete 


//GENERIC QUERIES on calcfunction
app.get('/calcfunction', (req, res) => {cf_q.getCalcFunction(req, res, 'calcfunction')});           //list all
app.get('/calcfunction/:id', (req, res) => {cf_q.getCalcFunctionById(req, res, 'calcfunction')});   //list 1
app.post('/calcfunction', (req, res) => {cf_q.createCalcFunction(req, res, 'calcfunction')});       //create
app.put('/calcfunction/:id', (req, res) => {cf_q.updateCalcFunction(req, res, 'calcfunction')});    //update
app.delete('/calcfunction/:id', (req, res) => {cf_q.deleteCalcFunction(req, res, 'calcfunction')}); //delete

//GENERIC QUERIES on ACTION_LEVEL 
app.get('/action_level', (req, res) => {gn_q.getGenericNLS(req, res, 'action_level')});           //list all
app.get('/action_level/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'action_level')});   //list 1
app.post('/action_level', (req, res) => {gn_q.createGenericNLS(req, res, 'action_level')});       //create
app.put('/action_level/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'action_level')});    //update
app.delete('/action_level/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'action_level')}); //delete

//GENERIC QUERIES on ACTION 
app.get('/action', (req, res) => {gn_q.getGenericNLS(req, res, 'action')});           //list all
app.get('/action/:id', (req, res) => {gn_q.getGenericNLSById(req, res, 'action')});   //list 1
app.post('/action', (req, res) => {gn_q.createGenericNLS(req, res, 'action')});       //create
app.put('/action/:id', (req, res) => {gn_q.updateGenericNLS(req, res, 'action')});    //update
app.delete('/action/:id', (req, res) => {gn_q.deleteGenericNLS(req, res, 'action')}); //delete

//GENERIC QUERIES on normativ 
app.get('/normativ', (req, res) => {no_q.getNormativ(req, res, 'normativ')});           //list all

//GENERIC QUERIES on chem_comp_gr 
app.get('/chem_comp_gr', (req, res) => {ccg_q.getChemCompGr(req, res, 'chem_comp_gr')});            //list all
app.put('/chem_comp_gr/:id', (req, res) => {ccg_q.updateChemCompGr(req, res, 'chem_comp_gr')});     //update
app.post('/chem_comp_gr', (req, res) => {ccg_q.createChemCompGr(req, res, 'chem_comp_gr')});        //create
app.delete('/chem_comp_gr/:id', (req, res) => {ccg_q.deleteChemCompGr(req, res, 'chem_comp_gr')});  //delete
app.get('/chem_comp_gr_min', (req, res) => {ccg_q.getChemCompGrMin(req, res, 'chem_comp_gr_min')});            //list for autocomplete

//GENERIC QUERIES on phchform_chelem 
app.get('/phchform_chelem', (req, res) => {pcm_q.getPhchFormChelem(req, res, 'phchform_chelem')});  //list all

//GENERIC QUERIES on ACTION 

//GENERIC QUERIES on chem_comp_gr 
app.get('/isotope', (req, res) => {i_q.getIsotope(req, res, 'isotope')});                         //list all
app.get('/isotope_tree/:id', (req, res) => {i_q.getIsotopeTree(req, res, 'isotope')});            //list recursive decay tree
app.get('/isotope_min', function(req, resp){
  pool.query('SELECT id, title FROM nucl.isotope order by title', (error, res) => {
    if(error) {
       return console.error('error running query', error);
    }
   //console.log(res.rows);
   resp.json(res.rows);
   });
});
app.put('/isotope/:id', (req, res) => {i_q.updateIsotope(req, res, 'isotope')});          //update
app.delete('/isotope/:id', (req, res) => {i_q.deleteIsotope(req, res, 'isotope')});   //delete
app.post('/isotope', (req, res) => {i_q.createIsotope(req, res, 'isotope')});       //create
app.get('/isotope_nodes/:id', (req, res) => {i_q.getIsotopeNodes(req, res, 'isotope')});  
app.get('/isotope_edges/:id', (req, res) => {i_q.getIsotopeEdges(req, res, 'isotope')});  

/* app.get('/isotope/:id', (req, res) => {gn_q.getIsotopeById(req, res, 'isotope')});   //list 1
app.post('/isotope', (req, res) => {gn_q.createIsotope(req, res, 'isotope')});          //create
app.put('/isotope/:id', (req, res) => {gn_q.updateIsotope(req, res, 'isotope')});       //update
app.delete('/isotope/:id', (req, res) => {gn_q.deleteIsotope(req, res, 'isotope')});    //delete */


//QUERIES on nuclide 
app.get('/nuclide/:id', (req, res) => {nuc_q.getNuclideByChelement(req, res, 'nuclide')});    //select by chelement_id
app.post('/nuclide', (req, res) => {nuc_q.createNuclide(req, res, 'nuclide')});          //create
app.delete('/nuclide/:id', (req, res) => {nuc_q.deleteNuclide(req, res, 'nuclide')});   //delete
app.put('/nuclide/:id', (req, res) => {nuc_q.updateNuclide(req, res, 'nuclide')});          //update


//QUERIES on criterion 
app.get('/criterion', (req, res) => {cr_q.getCriterion(req, res, 'criterion')});    //list all
app.post('/criterion', (req, res) => {cr_q.createCriterion(req, res, 'criterion')});       //create
app.put('/criterion/:id', (req, res) => {cr_q.updateCriterion(req, res, 'criterion')}); //update
app.delete('/criterion/:id', (req, res) => {cr_q.deleteCriterion(req, res, 'criterion')});  //delete 


//QUERIES on isotope_decay 
app.get('/isotope_decay/:id', (req, res) => {id_q.getIsotopeDecayByIsotope(req, res, 'isotope_decay')});    //select by isotope_id
app.post('/isotope_decay', (req, res) => {id_q.createIsotopeDecay(req, res, 'isotope_decay')});       //create
app.put('/isotope_decay/:id', (req, res) => {id_q.updateIsotopeDecay(req, res, 'isotope_decay')}); //update
app.delete('/isotope_decay/:id', (req, res) => {id_q.deleteIsotopeDecay(req, res, 'isotope_decay')});  //delete 

app.get('/nuclide', (req, res) => {nuc_q.getNuclide(req, res, 'nuclide')});

app.get('/value_int_dose', (req, res) => {vid_q.getValueIntDose(req, res, 'value_int_dose')}); 
app.put('/value_int_dose/:id', (req, res) => {vid_q.updateValueIntDose(req, res, 'value_int_dose')}); //update
app.post('/value_int_dose', (req, res) => {vid_q.createValueIntDose(req, res, 'value_int_dose')});    //create
app.delete('/value_int_dose/:id', (req, res) => {vid_q.deleteValueIntDose(req, res, 'value_int_dose')});  //delete 

//app.get('/value_relation', (req, res) => {vid_q.getValueRelation(req, res, 'value_int_dose')}); 
//связи в таблице value_int_dose
app.get('/value_relation/:tableName', (req, res) => {vid_q.getValueRelation(req, res, req.params.tableName)});
app.get('/int_dose_attr/', (req, res) => {vid_q.getIntDoseAttr(req, res)});

/* var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
  */
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

