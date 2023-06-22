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

const getActionCriterion = (request, response) => {
  let { criterion_id } = request.query;
  if (!criterion_id||criterion_id==='NaN')
  {
    //response.status(400).send(`Некорректный код родительской записи`);  
    //return;
    criterion_id=0;
    response.status(400).send(`Ошибка - criterion_id не задан `) 
    return; 
  }
  console.log( request.query );  
  pool.query(`SELECT pc.*, a.title, pcn1.name name_rus, pcn2.name name_eng, pcn1.descr descr_rus, pcn2.descr descr_eng FROM nucl.action_criterion pc
  join nucl.action a on pc.action_id = a.id
  left join nucl.action_nls pcn1 on pc.action_id=pcn1.action_id and pcn1.lang_id=1 
  left join nucl.action_nls pcn2 on pc.action_id=pcn2.action_id and pcn2.lang_id=2 where criterion_id = $1`+
  `ORDER BY pc.id ASC`, [criterion_id||0], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getActionCriterionMin = (request, response) => {
  console.log( request.query );  
  pool.query(
    'SELECT id, data_source_id, table_name, rec_id FROM nucl.data_source_class' , (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getActionCriterionById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT id, data_source_id, table_name, rec_id FROM nucl.data_source_class WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const  createActionCriterion = (request, response) => {
  console.log( 'createActionCriterion', request.body );
  const { action_id, criterion_id } = request.body;
  pool.query('INSERT INTO nucl.action_criterion ( action_id, criterion_id ) VALUES ($1, $2) RETURNING id', [ action_id, criterion_id ], (error, results) => {
    if (error) {
      const s=error.message;
      if (s.includes("action_criterion_uk")) 
      {
        response.status(400).send(`Связь с действием не добавлена: Для записи классификатора может существовать только одна связь с выбранным действием. Такая связь уже существует.`);
      }
      else
      { if (s.includes("data_source_class_tuk")) 
        response.status(400).send(`Невозможно сохранить запись. Нарушено требование уникальности. Для выбранного действия установленное значение в поле "Обозначение" уже существует`);
      }

    } else {
      const { id } = results.rows[0]; 
      //response.status(201).send(`Связь с источником данных добавлена, код: ${id}`)
      response.status(201).json({id: `${id}`}); 
    }
  })
}


const deleteActionCriterion = (request, response) => {
  const id = parseInt(request.params.id)
  //const { title, atomic_num } = request.body
  console.log('delrec ' + id);
  pool.query('DELETE FROM nucl.action_criterion WHERE id = $1', [id], (error, results) => {
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

const updateActionCriterion = (request, response) => {
  const id = parseInt(request.params.id)
  const { action_id, action_criterion_id } = request.body;

  console.log( 'updateActionCriterion id='+id );
  pool.query( //поля table_name rec_id не должны меняться
    'UPDATE nucl.action_criterion SET action_id = $1 where id = $2',
    [action_id, action_criterion_id ],
    (error, results) => {
      if (error) 
      {
        const s=error.message;
        console.log( s );

            response.status(400).send(`Невозможно сохранить запись. Нарушено требование уникальности. Для выбранного действия установленное значение в поле "Обозначение" уже существует.`)
            /* Невозможно сохранить запись. Нарушено требование уникальности. Для выбранного источника данных установленное значение в поле "Обозначение" уже существует.*/ 

      }
      else
      { 
        if (results.rowCount == 1)
          response.status(200).send(`Связь с действием  ${id} сохранена.`);
        if (results.rowCount == 0)
          response.status(400).send(`Связь с действием с кодом ${id} не найдена`)
      }
    }
  )
}

module.exports = {
  getActionCriterion,
  getActionCriterionMin,
  getActionCriterionById,
  createActionCriterion,
  deleteActionCriterion,
  updateActionCriterion
}
