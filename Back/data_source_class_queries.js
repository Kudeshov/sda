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
  console.log( request.body );
  //id":126,"data_source_id":1,"table_name":"people_class","rec_id":1,"title_src":"public","name_src":null,"title":"IBRAE"
  const { data_source_id, table_name, rec_id, title_src, name_src } = request.body;

  pool.query('INSERT INTO nucl.data_source_class (data_source_id, table_name, rec_id, title_src, name_src) VALUES ($1, $2, $3, $4, $5)', [data_source_id, table_name, rec_id, title_src, name_src], (error, results) => {
    if (error) {
      response.status(400).send(`Связь с источником данных не добавлена: ${error.message}`);
    } else {
      response.status(201).send(`Связь с источником данных добавлена, ID: ${results.insertId}`)
    }
  })
}

const deleteDataSourceClass = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('DELETE FROM nucl.data_source_class WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Связь с источником данных не удалена: ${error.message}`);
    }
    else {
      if (results.rowCount == 1)
        response.status(200).send(`Связь с источником данных ${id} удалена: cтрок удалено: ${results.rowCount} `);
      if (results.rowCount == 0)
        response.status(400).send(`Запись с кодом ${id} не найдена `)
    }
  })
}

const updateDataSourceClass = (request, response) => {
  const id = parseInt(request.params.id)
  const { data_source_id, table_name, title_src, name_src } = request.body;

  console.log( 'updateDataSourceClass id='+id );
  //id":126,"data_source_id":1,"table_name":"people_class","rec_id":1,"title_src":"public","name_src":null,"title":"IBRAE"
  pool.query( //поля table_name rec_id не должны меняться
    'UPDATE nucl.data_source_class SET title_src = $1, name_src = $2, table_name = $3, data_source_id = $4 where id = $5',
    [title_src, name_src, table_name, data_source_id, id ],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Связь с источником данных с кодом ${id} не изменена: ${error.message} `)
      }
      else
      {
        if (results.rowCount == 1)
          response.status(200).send(`Связь с источником данных ${id} изменена. Строк изменено: ${results.rowCount} `);
        if (results.rowCount == 0)
          response.status(400).send(`Связь с источником данных с кодом ${id} не найдена`)
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
