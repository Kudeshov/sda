/**
 * Модуль, предоставляющий функции для работы с данными о дозах внутреннего облучения в базе данных PostgreSQL.
 * Обслуживает теблицу БД: value_int_dose
 * Включает в себя следующие функции:
 * 
 * getValueRatioGit - получение данных о дозах внутреннего облучения на основе переданных параметров.
 * updateValueRatioGit - обновление данных о дозах внутреннего облучения в базе данных.
 * createValueRatioGit - добавление новых данных о дозах внутреннего облучения в базу данных.
 * deleteValueRatioGit - удаление данных о дозах внутреннего облучения из базы данных.
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

const getValueRatioGit = (request, response) => {
  // Список параметров, которые могут быть использованы в SQL-запросе
  const params = [
    'data_source_id',
    'chelement_id',
    'chem_comp_gr_id',
    'irradiation_id',
    'dose_ratio_id',
    'agegroup_id',
    'subst_form_id',
    'aerosol_sol_id',
    'people_class_id'
  ];

  // Создание объекта, в котором каждому параметру из списка присваивается его значение из запроса
  const requestParams = params.reduce((obj, param) => {
    obj[param] = request.query[param] || null;
    return obj;
  }, {});
 
  // Формирование условий для SQL-запроса на основе полученных параметров
  const whereParts = params.reduce((arr, param) => {
    if (requestParams[param]) {
      arr.push(`(vid.${param} in (${requestParams[param]}) OR vid.${param} IS NULL)`);
    }
    return arr;
  }, []);

  // Создание строки условий для SQL-запроса
  const whereClause = whereParts.length ? `where ${whereParts.join(' and ')}` : '';

  // Формирование полного SQL-запроса, включая выборку, соединение таблиц и условия
  const select_fields = `select vid.*, ds.title as "data_source_title",
    in2.name as "irradiation_name_rus",
    dr.title  as "dose_ratio_title", an.name as "agegroup_name_rus",
    sfn."name" as "subst_form_name_rus", asn."name" as "aerosol_sol_name_rus",
    pcn."name" as "people_class_name_rus", ccgn."name" as "chem_comp_group_name_rus"`;

  const s_query = `${select_fields}
    from nucl.value_int_dose vid
    left join nucl.data_source ds on ds.id = vid.data_source_id
    left join nucl.irradiation_nls in2 on in2.irradiation_id = vid.irradiation_id and in2.lang_id = 1
    left join nucl.dose_ratio dr on dr.id = vid.dose_ratio_id
    left join nucl.agegroup_nls an on an.agegroup_id = vid.agegroup_id and an.lang_id = 1
    left join nucl.subst_form_nls sfn on sfn.subst_form_id = vid.subst_form_id and sfn.lang_id = 1
    left join nucl.aerosol_sol_nls asn on asn.aerosol_sol_id = vid.aerosol_sol_id and asn.lang_id = 1
    left join nucl.people_class_nls pcn on pcn.people_class_id = vid.people_class_id and pcn.lang_id = 1
    left join nucl.chem_comp_gr_nls ccgn on ccgn.chem_comp_gr_id = vid.chem_comp_gr_id and ccgn.lang_id = 1
    ${whereClause}
    order by pcn."name", i.title, ip.name, o_nls.name, an.name, esn."name", sfn."name", ccgn."name", 
    asn."name", aan."name", lln."name", ds.title, vid.dr_value  
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

const updateValueRatioGit = (request, response, table_name) => {
  const id = parseInt(request.params.id); // Извлечение значения id из параметров запроса
  const { dose_ratio_id, dr_value, chem_comp_gr_id } = request.body; // Деструктуризация полей из тела запроса

  pool.query(
    `UPDATE nucl.value_int_dose SET dose_ratio_id = $1, dr_value=$2, updatetime = NOW(),
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

const createValueRatioGit = (request, response) => {

  console.log(request.body);
  const { dose_ratio_id, dr_value, chem_comp_gr_id, people_class_id, agegroup_id, data_source_id, subst_form_id, aerosol_sol_id,
    irradiation_id } = request.body;

  const values = [
    dose_ratio_id,
    dr_value,
    chem_comp_gr_id,
    people_class_id,
    agegroup_id,
    data_source_id,
    subst_form_id,
    aerosol_sol_id,
    irradiation_id
  ];

  const s_query = `INSERT INTO nucl.value_int_dose (dose_ratio_id, chem_comp_gr_id, people_class_id,
     agegroup_id, data_source_id, subst_form_id, 
    aerosol_sol_id, exp_scenario_id, irradiation_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8,) RETURNING id`;

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

const deleteValueRatioGit = (request, response) => {
  const id = parseInt(request.params.id)

  if (isNaN(id)) {
    return response.status(400).send('Invalid ID');
  }

  pool.query('DELETE FROM nucl.value_int_dose WHERE id = $1', [id], (error, results) => {
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

const getRatioGitAttr = (request, response) => {
  pool.query(` SELECT * from nucl.int_dose_attr_mv `, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getValueRatioGit,
  updateValueRatioGit,
  createValueRatioGit,
  deleteValueRatioGit,
  getValueRelation,
  getRatioGitAttr 
}
