/**
 * Модуль, предоставляющий функции для работы с данными о дозах внутреннего облучения в базе данных PostgreSQL.
 * Обслуживает теблицу БД: value_int_dose
 * Включает в себя следующие функции:
 * 
 * getValueIntDose - получение данных о дозах внутреннего облучения на основе переданных параметров.
 * updateValueIntDose - обновление данных о дозах внутреннего облучения в базе данных.
 * createValueIntDose - добавление новых данных о дозах внутреннего облучения в базу данных.
 * deleteValueIntDose - удаление данных о дозах внутреннего облучения из базы данных.
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

const getValueIntDose = (request, response) => {
  // Список параметров, которые могут быть использованы в SQL-запросе
  const params = [
    'data_source_id',
    'organ_id',
    'irradiation_id',
    'isotope_id',
    'integral_period_id',
    'dose_ratio_id',
    'let_level_id',
    'agegroup_id',
    'subst_form_id',
    'aerosol_sol_id',
    'aerosol_amad_id',
    'exp_scenario_id',
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
  const select_fields = `select vid.*, ds.title as "data_source_title", o_nls.name as "organ_name_rus",
    in2.name as "irradiation_name_rus", i.title as "isotope_title", ip.name as "integral_period_name_rus",
    dr.title  as "dose_ratio_title", lln."name" as "let_level_name_rus", an.name as "agegroup_name_rus",
    sfn."name" as "subst_form_name_rus", asn."name" as "aerosol_sol_name_rus", aan."name" as "aerosol_amad_name_rus",
    esn."name" as "exp_scenario_name_rus", pcn."name" as "people_class_name_rus", ccgn."name" as "chem_comp_group_name_rus"`;

  const s_query = `${select_fields}
    from nucl.value_int_dose vid
    left join nucl.data_source ds on ds.id = vid.data_source_id
    left join nucl.organ_nls o_nls on o_nls.organ_id = vid.organ_id and o_nls.lang_id = 1
    left join nucl.irradiation_nls in2 on in2.irradiation_id = vid.irradiation_id and in2.lang_id = 1
    left join nucl.isotope i on i.id = vid.isotope_id
    left join nucl.integral_period_nls ip on ip.integral_period_id = vid.integral_period_id and ip.lang_id = 1
    left join nucl.dose_ratio dr on dr.id = vid.dose_ratio_id
    left join nucl.let_level_nls lln on lln.let_level_id = vid.let_level_id and lln.lang_id = 1
    left join nucl.agegroup_nls an on an.agegroup_id = vid.agegroup_id and an.lang_id = 1
    left join nucl.subst_form_nls sfn on sfn.subst_form_id = vid.subst_form_id and sfn.lang_id = 1
    left join nucl.aerosol_sol_nls asn on asn.aerosol_sol_id = vid.aerosol_sol_id and asn.lang_id = 1
    left join nucl.aerosol_amad_nls aan on aan.aerosol_amad_id = vid.aerosol_amad_id and aan.lang_id = 1
    left join nucl.exp_scenario_nls esn on esn.exp_scenario_id = vid.exp_scenario_id and esn.lang_id = 1
    left join nucl.people_class_nls pcn on pcn.people_class_id = vid.people_class_id and pcn.lang_id = 1
    left join nucl.chem_comp_gr_nls ccgn on ccgn.chem_comp_gr_id = vid.chem_comp_gr_id and ccgn.lang_id = 1
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

const updateValueIntDose = (request, response, table_name) => {
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

const createValueIntDose = (request, response) => {
  const { dose_ratio_id, dr_value, chem_comp_gr_id, people_class_id, isotope_id, integral_period_id, organ_id, 
    let_level_id, agegroup_id, data_source_id, subst_form_id, aerosol_sol_id, aerosol_amad_id, exp_scenario_id, 
    irradiation_id } = request.body;

  const values = [
    dose_ratio_id,
    dr_value,
    chem_comp_gr_id,
    people_class_id,
    isotope_id,
    integral_period_id,
    organ_id,
    let_level_id,
    agegroup_id,
    data_source_id,
    subst_form_id,
    aerosol_sol_id,
    aerosol_amad_id,
    exp_scenario_id,
    irradiation_id
  ];

  const s_query = `INSERT INTO nucl.value_int_dose (dose_ratio_id, dr_value, chem_comp_gr_id, people_class_id, 
    isotope_id, integral_period_id, organ_id, let_level_id, agegroup_id, data_source_id, subst_form_id, 
    aerosol_sol_id, aerosol_amad_id, exp_scenario_id, irradiation_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`;

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


const deleteValueIntDose = (request, response) => {
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

const getIntDoseAttr = (request, response) => {
  pool.query(` SELECT * from nucl.int_dose_attr_mv `, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getValueIntDose,
  updateValueIntDose,
  createValueIntDose,
  deleteValueIntDose,
  getValueRelation,
  getIntDoseAttr 
}
