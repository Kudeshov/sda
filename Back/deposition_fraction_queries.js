/**
 * Модуль, предоставляющий функции для работы с данными о 7.7	Доли осаждения в RТ (deposition_fraction)
 * Обслуживает теблицу БД: deposition_fraction
 * Включает в себя следующие функции:
 * 
 * getValueDepositionFraction - получение данных о долях осаждения в RT на основе переданных параметров.
 * updateValueDepositionFraction - обновление данных о долях осаждения в RT в базе данных.
 * createValueDepositionFraction - добавление новых данных о долях осаждения в RT в базу данных.
 * deleteValueDepositionFraction - удаление данных о долях осаждения в RT из базы данных.
 * 
 * Этот модуль подразумевает использование веб-сервера Express и клиента базы данных node-postgres.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const config = require('./config.json');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool(config);
pool.on('error', (err) => {
  console.error('idle client error', err.message, err.stack);
});

const getValueDepositionFraction = (request, response) => {
  // Список параметров, которые могут быть использованы в SQL-запросе
  const params = [
    'data_source_id',
    'organ_id',
    'agegroup_id'
  ];

  // Создание объекта, в котором каждому параметру из списка присваивается его значение из запроса
  const requestParams = params.reduce((obj, param) => {
    obj[param] = request.query[param] || null;
    return obj;
  }, {});
 
  // Формирование условий для SQL-запроса на основе полученных параметров
  const whereParts = params.reduce((arr, param) => {
    if (requestParams[param]) {
      arr.push(`(df.${param} in (${requestParams[param]}) OR df.${param} IS NULL)`);
    }
    return arr;
  }, []);

  // Создание строки условий для SQL-запроса
  const whereClause = whereParts.length ? `where ${whereParts.join(' and ')}` : '';

  // Формирование полного SQL-запроса, включая выборку, соединение таблиц и условия
  const select_fields = `select df.*, ds.title as "data_source_title", o_nls.name as "organ_name_rus",
    an.name as "agegroup_name_rus" `;

  const s_query = `${select_fields}
    from nucl.deposition_fraction df
    left join nucl.data_source ds on ds.id = df.data_source_id
    left join nucl.organ_nls o_nls on o_nls.organ_id = df.organ_id and o_nls.lang_id = 1
    left join nucl.agegroup_nls an on an.agegroup_id = df.agegroup_id and an.lang_id = 1
    ${whereClause}
    order by id
    limit 50000`;
    
  console.log( s_query );
  // Выполнение SQL-запроса
  pool.query(s_query, (error, results) => {
    if (error) {
      return console.error('error running query', error);
    }
    // Отправка результатов клиенту
    response.status(200).json(results.rows)
  });
}

const updateValueDepositionFraction = (request, response, table_name) => {
  const id = parseInt(request.params.id); // Извлечение значения id из параметров запроса
  const { df_value, ad } = request.body; // Деструктуризация полей из тела запроса

  pool.query(
    `UPDATE nucl.deposition_fraction SET df_value=$1, ad=$2, updatetime = NOW()
    WHERE id = $3`, // Запрос на обновление записи в таблице nucl.deposition_fraction
    [df_value, ad, id], // Параметры для запроса
    (err, res) => {
      if (err) {
        console.error(`Ошибка при обновлении записи`, err.stack);
        response.status(400).send(`Ошибка при обновлении записи`, err.stack);
      } else {
        response.status(200).send(`Запись с кодом ${id} сохранена`);
      }
    }
  );
}

const createValueDepositionFraction = (request, response) => {
  const { df_value, ad, organ_id, agegroup_id, data_source_id } = request.body;

  const values = [
    df_value,
    ad, 
    organ_id,
    agegroup_id,
    data_source_id
  ];

  const s_query = `INSERT INTO nucl.deposition_fraction (df_value, ad, organ_id, agegroup_id, data_source_id) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;

  console.log(s_query, values); 

  pool.query(s_query, values, (error, results) => {
    if (error) {
      response.status(400).send(`Запись не добавлена. Ошибка: ` + error.message);
    } else {
      console.log(`Запись добавлена`); 
      response.status(200).send(`Запись добавлена`);
    }
  });
}


const deleteValueDepositionFraction = (request, response) => {
  const id = parseInt(request.params.id)

  if (isNaN(id)) {
    return response.status(400).send('Invalid ID');
  }

  pool.query('DELETE FROM nucl.deposition_fraction WHERE id = $1', [id], (error, results) => {
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

const getDepositionFractionAttr = (request, response) => {
  pool.query(` SELECT * from nucl.deposition_fraction_attr_mv `, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getValueDepositionFraction,
  updateValueDepositionFraction,
  createValueDepositionFraction,
  deleteValueDepositionFraction,
  getDepositionFractionAttr 
}
