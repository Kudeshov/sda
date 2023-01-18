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

const getDataSourceClass = (request, response) => {
  const { rec_id, table_name } = request.query;
  if (!rec_id||rec_id==='NaN')
  {
    //response.status(400).send(`Некорректный код родительской записи`);  
    //return;
    rec_id=0;  
  }
  console.log( request.query );  
  pool.query(
    'SELECT data_source_class.*, data_source.title, data_source.shortname, '+
    'data_source.fullname, data_source.descr, data_source.external_ds FROM nucl.data_source_class '+  
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
  const { data_source_id, table_name, rec_id, title_src, name_src } = request.body;
  pool.query('INSERT INTO nucl.data_source_class (data_source_id, table_name, rec_id, title_src, name_src) VALUES ($1, $2, $3, $4, $5) RETURNING id', [data_source_id, table_name, rec_id, title_src, name_src], (error, results) => {
    if (error) {
      const s=error.message;
      if (s.includes("data_source_class_uk")) 
      {
        response.status(400).send(`Связь с источником данных не добавлена: Для одной записи в таблице ${table_name} может существовать только одна запись в таблице "Связь с источником данных" для одного источника`);
      }
      else
      { if (s.includes("data_source_class_tuk")) 
        response.status(400).send(`Связь с источником данных не добавлена: Сочетание ${title_src} + ${table_name}  является уникальным для одного источника`);
      }

    } else {
      const { id } = results.rows[0]; 
      //response.status(201).send(`Связь с источником данных добавлена, код: ${id}`)
      response.status(201).json({id: `${id}`}); 
    }
  })
}

const deleteDataSourceClass = (request, response) => {

  function delRec( id ) {
    console.log('delrec ' + id);
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

  const id = parseInt(request.params.id);
  pool.query(' SELECT data_source_id, rec_id, table_name FROM nucl.data_source_class where id = $1 LIMIT 1', [id], (err, res) => 
  {
    if (res.rowCount>0)
    {
      const { data_source_id, rec_id, table_name } = res.rows[0];
      console.log( 'table_name, rec_id, data_source_id='+table_name + ' ' + rec_id + ' ' + data_source_id  );

      pool.query('SELECT 1 FROM information_schema.columns '+
        'WHERE table_schema=$1 AND table_name=$2 AND column_name=$3', ['nucl', 'value_int_dose', table_name+'_id'], (err, res) => 
      {
        if (err) 
        {
          response.status(400).send(`Ошибка при проверке наличия поля: ${err.message} `)
        }
        else
        if (res.rowCount>0)
        {
          pool.query('SELECT (SELECT COUNT(id) FROM nucl.value_int_dose WHERE data_source_id = $1 and '+table_name+'_id = $2) AS int_dose_count, '+
          '(SELECT COUNT(id) FROM nucl.value_ratio_git WHERE data_source_id = $1 and '+table_name+'_id = $2) AS ratio_git_count, '+
          '(SELECT COUNT(id) FROM nucl.value_ext_dose WHERE data_source_id = $1 and '+table_name+'_id = $2) AS ext_dose_count '+
          'FROM nucl.value_int_dose LIMIT 1', [data_source_id, rec_id], (err, res) => 
          {
            if (err) 
            {
              response.status(400).send(`Ошибка при проверке связей: ${err.message} `)
            }
            else
            if (res.rowCount>0)
            {
              const { int_dose_count, ratio_git_count, ext_dose_count } = res.rows[0];
              console.log( 'int_dose_count, ratio_git_count, ext_dose_count=', int_dose_count, ratio_git_count, ext_dose_count );
              if  (int_dose_count==0 && ratio_git_count==0 && ext_dose_count==0) 
              {
                delRec( id ); 
              }
              else
              {
                if (int_dose_count!=0) {
                  response.status(400).send(`Запись с кодом ${id} не удалена: имеются ${int_dose_count} связанные записи в таблице "Значения дозовых коэффициентов для внутреннего облучения" `);
                } else if (ratio_git_count!=0) {
                  response.status(400).send(`Запись с кодом ${id} не удалена: имеются ${ratio_git_count} связанные записи в таблице "Значения коэффициента поглощения в желудочно-кишечном тракте (ЖКТ)" `);
                } else if (ext_dose_count!=0) {
                  response.status(400).send(`Запись с кодом ${id} не удалена: имеются ${ext_dose_count} связанные записи в таблице "Значения дозовых коэффициентов для внешнего облучения" `);
                }
              } 
            }
            else
            {
              response.status(400).send(`Запись с кодом ${id}: ошибка при проверка связанных таблиц `);
            }
          }) 
        }
        else
        {
          delRec( id ); 
        }
      }) 
    }
    else
    {
      response.status(400).send(`Запись с кодом ${id} не найдена `)      
    }
  })
}

const updateDataSourceClass = (request, response) => {
  const id = parseInt(request.params.id)
  const { data_source_id, table_name, title_src, name_src } = request.body;

  console.log( 'updateDataSourceClass id='+id );
  pool.query( //поля table_name rec_id не должны меняться
    'UPDATE nucl.data_source_class SET title_src = $1, name_src = $2, table_name = $3, data_source_id = $4 where id = $5',
    [title_src, name_src, table_name, data_source_id, id ],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Связь с источником данных с кодом ${id} не сохранена: ${error.message} `)
      }
      else
      { 
        if (results.rowCount == 1)
          response.status(200).send(`Связь с источником данных ${id} сохранена.`);
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
