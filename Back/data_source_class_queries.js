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
var config = {
    user: 'postgres', 
    database: 'sda', 
    password: 'system', 
    host: 'localhost', 
    port: 5432, 
    max: 10,  
    idleTimeoutMillis: 30000
};
const pool = new Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

const getDataSourceClass = (request, response) => {
  const { rec_id, table_name } = request.query;
  console.log( request.query );  
  //const rec_id = 1; //parseInt(request.params.rec_id);
  //const table_name = 'people_class'; //request.params.table_name;
  pool.query('SELECT data_source_class.*, data_source.title  FROM nucl.data_source_class '+
    'JOIN nucl.data_source on data_source.id = data_source_class.data_source_id ' +
    'where table_name = $1 and rec_id = $2', [table_name, rec_id||0], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getDataSourceClassById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM nucl.data_source_class WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createDataSourceClass = (request, response) => {
  console.log(  request );
  const { id, title, shortname, fullname, descr, external_ds } = request.body;

  pool.query('INSERT INTO nucl.data_source (id, title, shortname, fullname, descr, external_ds) VALUES ($1, $2, $3, $4, $5, $6)', [id, title, shortname, fullname, descr, external_ds], (error, results) => {
    if (error) {
      response.status(400).send(`Источник данных не добавлен: ${error.message}`);
    } else {
      response.status(201).send(`Источник данных добавлен, ID: ${results.insertId}`)
    }
  })
}

const deleteDataSourceClass = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('DELETE FROM nucl.data_source WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Источник данных не удален: ${error.message}`);
    }
    else {
      if (results.rowCount == 1)
        response.status(200).send(`Источник данных ${id} удален: cтрок удалено: ${results.rowCount} `);
      if (results.rowCount == 0)
        response.status(400).send(`Запись с кодом ${id} не найдена `)
    }
  })
}

const updateDataSourceClass = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, shortname, fullname, descr, external_ds } = request.body
//  console.log( 'id='+id );

  pool.query(
    'UPDATE nucl.data_source SET title = $1, shortname = $2, fullname = $3, descr = $4, external_ds = $5 WHERE id = $6',
    [title, shortname, fullname, descr, external_ds, id],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Источник данных с кодом ${id} не изменен: ${error.message} `)
      }
      else
      {
        if (results.rowCount == 1)
          response.status(200).send(`Источник данных ${id} изменен. Строк изменено: ${results.rowCount} `);
        if (results.rowCount == 0)
          response.status(400).send(`Источник данных с кодом ${id} не найден `)
      }
    }
  )
}

module.exports = {
  getDataSourceClass,
  getDataSourceClassById,
  createDataSourceClass,
  deleteDataSourceClass,
  updateDataSourceClass
}
