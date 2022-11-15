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

const getPeopleClass = (request, response) => {
  pool.query('SELECT pc.*, pcn1.name name_rus, pcn2.name name_eng, pcn1.descr descr_rus, pcn2.descr descr_eng FROM nucl.people_class pc '+
  'join nucl.people_class_nls pcn1 on pc.id=pcn1.people_class_id and pcn1.lang_id=1 '+
  'join nucl.people_class_nls pcn2 on pc.id=pcn2.people_class_id '+
  'and pcn2.lang_id=2 '+
  'ORDER BY pc.id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPeopleClassById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM nucl.data_source WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createPeopleClass = (request, response) => {
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

const deletePeopleClass = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, atomic_num } = request.body

  pool.query('DELETE FROM nucl.data_source WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Источник данных не удален: ${error.message}`);
    }
    else {
      //response.status(200).send(`Источник данных удален, ID: ${id} : удалено строк: ${results.rowCount} `)
      if (results.rowCount == 1)
        response.status(200).send(`Источник данных ${id} удален: cтрок удалено: ${results.rowCount} `);
      if (results.rowCount == 0)
        response.status(400).send(`Запись с кодом ${id} не найдена `)
    }
  })
}

const updatePeopleClass = (request, response) => {
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
  getPeopleClass,
  getPeopleClassById,
  createPeopleClass,
  deletePeopleClass,
  updatePeopleClass
}
