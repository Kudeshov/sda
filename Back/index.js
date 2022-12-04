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

const { Pool } = require('pg');
//var msg = 'a';
var config = require('./config.json');
const { request, response } = require('express');

const pool = new Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

//CHELEMENT interface - first attempt
app.get('/chelement', ch_q.getChelement);           //list all
app.get('/chelement/:id', ch_q.getChelementById);   //list 1
app.post('/chelement', ch_q.createChelement);       //create
app.put('/chelement/:id', ch_q.updateChelement);    //update
app.delete('/chelement/:id', ch_q.deleteChelement); //delete

//DATA_SOURCE interface
app.get('/data_source', ds_q.getDataSource);           //list all
app.get('/data_source/:id', ds_q.getDataSourceById);   //list 1
app.post('/data_source', ds_q.createDataSource);       //create
app.put('/data_source/:id', ds_q.updateDataSource);    //update
app.delete('/data_source/:id', ds_q.deleteDataSource); //delete

//PEOPLE_CLASS interface
app.get('/people_class', pc_q.getPeopleClass);           //list all
app.get('/people_class/:id', pc_q.getPeopleClassById);   //list 1
app.post('/people_class', pc_q.createPeopleClass);       //create
app.put('/people_class/:id', pc_q.updatePeopleClass);    //update
app.delete('/people_class/:id', pc_q.deletePeopleClass); //delete

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
 
//data_source_class_queries
app.get('/data_source_class', dsc_q.getDataSourceClass);           //list all
app.post('/data_source_class', dsc_q.createDataSourceClass);       //create
app.put('/data_source_class/:id', dsc_q.updateDataSourceClass);    //update
app.delete('/data_source_class/:id', dsc_q.deleteDataSourceClass); //delete 


app.get('/criterion', function(req, resp){
      pool.query('SELECT * FROM nucl.criterion', (error, res) => {
        if(error) {
           return console.error('error running query', error);
        }
       console.log(res.rows);
       resp.json(res.rows);
       });
});

/* app.delete('/', (req, res) => {
  res.send("DELETE root Request Called")
}) */

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
 
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

