/**
 * Модуль, предоставляющий функции для работы с данными о дозах внутреннего облучения в базе данных PostgreSQL.
 * Обслуживает теблицу БД: value_Ext_dose
 * Включает в себя следующие функции:
 * 
 * getValueExtDose - получение данных о дозах внутреннего облучения на основе переданных параметров.
 * updateValueExtDose - обновление данных о дозах внутреннего облучения в базе данных.
 * createValueExtDose - добавление новых данных о дозах внутреннего облучения в базу данных.
 * deleteValueExtDose - удаление данных о дозах внутреннего облучения из базы данных.
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

const getValueRelation = (request, response, table_name) => {
  pool.query(` SELECT * from nucl.value_relation_mv where source_table = $1`, [table_name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getValueExtDose = (request, response) => {
  // Список параметров, которые могут быть использованы в SQL-запросе
  const params = [
    'data_source_id',
    'organ_id',
    'irradiation_id',
    'isotope_id',
    'dose_ratio_id',
    'people_class_id'
  ];

  // Создание объекта, в котором каждому параметру из списка присваивается его значение из запроса
  const requestParams = params.reduce((obj, param) => {
    obj[param] = request.query[param] || null;
    return obj;
  }, {});
 
  // Формирование условий для SQL-запроса на основе полученных параметров
  const whereParts = params.reduce((arr, param) => {
    if (requestParams[param] && requestParams[param].toLowerCase() !== 'null') {
      arr.push(`vid.${param} in (${requestParams[param]})`);
    }
    return arr;
  }, []);

  // Создание строки условий для SQL-запроса
  const whereClause = whereParts.length ? `where ${whereParts.join(' and ')}` : '';

  // Формирование полного SQL-запроса, включая выборку, соединение таблиц и условия
  const select_fields = `select vid.*, ds.title as "data_source_title", o_nls.name as "organ_name_rus",
    in2.name as "irradiation_name_rus", i.title as "isotope_title".,
    dr.title  as "dose_ratio_title"`;

  const s_query = `${select_fields}
    from nucl.value_ext_dose vid
    left join nucl.data_source ds on ds.id = vid.data_source_id
    left join nucl.organ_nls o_nls on o_nls.organ_id = vid.organ_id and o_nls.lang_id = 1
    left join nucl.irradiation_nls in2 on in2.irradiation_id = vid.irradiation_id and in2.lang_id = 1
    left join nucl.isotope i on i.id = vid.isotope_id
    left join nucl.dose_ratio dr on dr.id = vid.dose_ratio_id
    left join nucl.people_class_nls pcn on pcn.people_class_id = vid.people_class_id and pcn.lang_id = 1
    ${whereClause}
    order by id
    limit 100000`;
    
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

const updateValueExtDose = (request, response, table_name) => {
  const id = parseInt(request.params.id); // Извлечение значения id из параметров запроса
  const { dose_ratio_id, dr_value, chem_comp_gr_id } = request.body; // Деструктуризация полей из тела запроса

  pool.query(
    `UPDATE nucl.value_ext_dose SET dose_ratio_id = $1, dr_value=$2, updatetime = NOW(),
    chem_comp_gr_id=$3 WHERE id = $4`, // Запрос на обновление записи в таблице nucl.value_int_dose
    [dose_ratio_id, dr_value, chem_comp_gr_id, id], // Параметры для запроса
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

const createValueExtDose = (request, response) => {
  const { dose_ratio_id, dr_value, people_class_id, isotope_id, organ_id, data_source_id,
    irradiation_id } = request.body;

  const values = [
    dose_ratio_id,
    dr_value,
    people_class_id,
    isotope_id,
    organ_id,
    data_source_id,
    irradiation_id
  ];



  const s_query = `INSERT INTO nucl.value_ext_dose (dose_ratio_id, dr_value, people_class_id, 
    isotope_id, organ_id, data_source_id, irradiation_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;

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


const deleteValueExtDose = (request, response) => {
  const id = parseInt(request.params.id)

  if (isNaN(id)) {
    return response.status(400).send('Invalid ID');
  }

  pool.query('DELETE FROM nucl.value_ext_dose WHERE id = $1', [id], (error, results) => {
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

const getExtDoseAttr = (request, response) => {
  pool.query(` SELECT * from nucl.ext_dose_attr_mv `, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getValueExtDose,
  updateValueExtDose,
  createValueExtDose,
  deleteValueExtDose,
  getValueRelation,
  getExtDoseAttr 
}
