var express = require('express');
var app = express();
var PORT = 3001;

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const { Pool } = require('pg');
const e = require('express');
//var msg = 'a';
var config = require('./config.json');
const pool = new Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

const getChelement = (request, response) => {
  pool.query('SELECT * FROM nucl.chelement ORDER BY Id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getChelementById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM nucl.chelement WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createChelement = (request, response) => {
  console.log(  request );
  const { id, title, atomic_num } = request.body;
  console.log( 'id' );
  console.log( id );
  console.log( 'title' );
  console.log( title );
  console.log( 'atomic_num' );
  console.log( atomic_num );
//  response.status(201).send(request.body);
  pool.query('INSERT INTO nucl.chelement (id, title, atomic_num) VALUES ($1, $2, $3)', [id, title, atomic_num], (error, results) => {
    if (error) {
      response.status(400).send(`Chemical element not added: ${error.message}`);
      console.log(`Chemical element not added: ${error.message}`);
      //throw error
    } else {
      response.status(201).send(`Chemical element added with ID: ${results.insertId}`)
    }
  })
}

const deleteChelement = (request, response) => {
  console.log( 'deleteChelement params' );
//  console.log( request.body );
//  const id = parseInt(request.params.id)
//  console.log( 'params id' );
//  console.log( id );
  const id = parseInt(request.params.id)
  const { title, atomic_num } = request.body
  console.log( 'id='+id );
//  const { id } = request.body;
  console.log( request.body );
  //const { id } = request.body;
  console.log( 'id='+id );
  //response.status(200).send( request.body ) 
  //return;

  pool.query('DELETE FROM nucl.chelement WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Chemical element not deleted: ${error.message}`);
      console.log(`Chemical element not deleted: ${error.message}`);
    }
    else {
      console.log( 'affected rows=' + results.rowCount);
      if (results.rowCount == 1)
        response.status(200).send(`Chemical element deleted with ID: ${id} : deleted rows ${results.rowCount} `)
      else
        response.status(400).send(`Запись с кодом ${id} не найдена : deleted rows ${results.rowCount} `)
    }
  })
}

const updateChelement = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, atomic_num } = request.body
  console.log( 'id='+id );

  pool.query(
    'UPDATE nucl.chelement SET title = $1, atomic_num = $2 WHERE id = $3',
    [title, atomic_num, id],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Chemical element not modified with ID: ${id}: ${error.message} `)
      }
      else
      {
        response.status(200).send(`Chemical element modified with ID: ${id} `);
      }
    }
  )
}

module.exports = {
  getChelement,
  getChelementById,
  createChelement,
  deleteChelement,
  updateChelement
}
