var express = require('express');
var app = express();
var PORT = 4001;

const https = require("https");
const fs = require("fs");

const { Pool } = require('pg');
var msg = 'a';
var config = {
    user: 'postgres', 
    database: 'ers_russia', 
    password: 'system', 
    host: 'localhost', 
    port: 5432, 
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000
};
const pool = new Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

/*const getStation = (request, response) => {
  pool.query('SELECT * FROM station', [], (error, results) => {
    response.status(200).json(results.rows);
  });
};*/
 
// Without middleware
app.get('/test', function(req, resp){
//    res.json({ user: 'geek' });
    //pool.query('SELECT rm_name AS number from rm_station', [], function(err, res));
    //console.log(res);
    //console.log('a');
    //const getAllHorrors = async (request, response) => {
      //console.log('b');
      pool.query('SELECT rm_id as id, rm_id as title, geo_x as body FROM rm_station where rm_id<3', (error, res) => {
        if(error) {
           return console.error('error running query', error);
        }
       console.log(res.rows);
       resp.json(res.rows);
       //resp.send("[\n{\n\"id\":1\n}\n]");
       });
    //};
    //{
    //if(err) {
    ///    return console.error('error running query', err);
    //}
    //  console.log('number:', res.rows[0].number);
    //};

//  pool.query('SELECT * FROM station', [], (error, results) => {
//    console.log(results);
    //res.status(200).json(results.rows);
//  });
});
 
https
  .createServer(    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },app)
  .listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

