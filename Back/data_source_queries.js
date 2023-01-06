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
var config = require('./config.json');
const pool = new Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

const getDataSource = (request, response) => {
  pool.query('SELECT * FROM nucl.data_source ORDER BY Id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getDataSourceById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM nucl.data_source WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createDataSource = (request, response) => {
  const { title, shortname, fullname, descr, external_ds } = request.body;

  pool.query('INSERT INTO nucl.data_source (title, shortname, fullname, descr, external_ds) VALUES ($1, $2, $3, $4, $5) RETURNING id', [title, shortname, fullname, descr, external_ds], (error, res) => {
  if (error) {
      response.status(400).send(`Запись не добавлена: ${error.message}`);
    } else {
      const { id } = res.rows[0];
      response.status(201).send(`Запись с кодом ${id} добавлена`)
    }
  })
}

const deleteDataSource = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, atomic_num } = request.body

  pool.query('DELETE FROM nucl.data_source WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Запись с кодом не удалена: ${error.message}`);
    }
    else {
      if (results.rowCount == 1)
        response.status(200).send(`Запись с кодом ${id} удален: cтрок удалено: ${results.rowCount} `);
      if (results.rowCount == 0)
        response.status(400).send(`Запись с кодом ${id} не найдена`)
    }
  })
}

const updateDataSource = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, shortname, fullname, descr, external_ds } = request.body
  pool.query(
    'UPDATE nucl.data_source SET title = $1, shortname = $2, fullname = $3, descr = $4, external_ds = $5 WHERE id = $6',
    [title, shortname, fullname, descr, external_ds, id],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Запись с кодом ${id} не сохранена: ${error.message} `)
      }
      else
      {
        if (results.rowCount == 1)
          response.status(200).send(`Запись с кодом ${id} сохранена`);
        if (results.rowCount == 0)
          response.status(400).send(`Запись с кодом ${id} не найдена `)
      }
    }
  )
}

module.exports = {
  getDataSource,
  getDataSourceById,
  createDataSource,
  deleteDataSource,
  updateDataSource
}
