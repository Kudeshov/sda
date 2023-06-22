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

const getDataSourceClassMin = (request, response) => {
  console.log( request.query );  
  pool.query(
    'SELECT id, data_source_id, table_name, rec_id FROM nucl.data_source_class' , (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getDataSourceClassById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT id, data_source_id, table_name, rec_id FROM nucl.data_source_class WHERE id = $1', [id], (error, results) => {
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
        response.status(400).send(`Связь с источником данных не добавлена: Для записи классификатора может существовать только одна связь с выбранным источником данных. Такая связь уже существует.`);
        //Связь с источником данных не добавлена: Для одной записи в таблице ${table_name} может существовать только одна запись в таблице "Связь с источником данных" для одного источника`);
      }
      else
      { if (s.includes("data_source_class_tuk")) 
        response.status(400).send(`Невозможно сохранить запись. Нарушено требование уникальности. Для выбранного источника данных установленное значение в поле "Обозначение" уже существует`);
      }

    } else {
      const { id } = results.rows[0]; 
      //response.status(201).send(`Связь с источником данных добавлена, код: ${id}`)
      response.status(201).json({id: `${id}`}); 
    }
  })
}

const deleteDataSourceClass = (request, response) => {
  function delRec(id) {
    console.log('delrec ' + id);
    pool.query('DELETE FROM nucl.data_source_class WHERE id = $1', [id], (error, results) => {
      if (error) {
        console.log(5);
        response.status(400).send(`Связь с источником данных не удалена: ${error.message}`);
      }
      else {
        if (results.rowCount === 1) {
          console.log('5');
          response.status(200).send(`Связь с источником данных ${id} удалена: cтрок удалено: ${results.rowCount} `);
        }
          
        if (results.rowCount === 0) {
          console.log('6');
          response.status(400).send(`Запись с кодом ${id} не найдена `);
        }
      }
    });
  }

  const id = parseInt(request.params.id);
  pool.query(' SELECT data_source_id, rec_id, table_name FROM nucl.data_source_class where id = $1 LIMIT 1', [id], async (err, res) => {
    if (res.rowCount > 0) {
      const { data_source_id, rec_id, table_name } = res.rows[0];
      console.log('table_name, rec_id, data_source_id=' + table_name + ' ' + rec_id + ' ' + data_source_id);

      const tables = ['value_int_dose', 'value_ratio_git', 'value_ext_dose', 'criterion'];
      const responses = ['"Значения дозовых коэффициентов для внутреннего облучения"', '"Значения коэффициента поглощения в желудочно-кишечном тракте (ЖКТ)"', '"Значения дозовых коэффициентов для внешнего облучения"', '"Критерии"'];

      for (let i = 0; i < tables.length; i++) {
        try {
          const columnExistsRes = await pool.query('SELECT 1 FROM information_schema.columns '+
            'WHERE table_schema=$1 AND table_name=$2 AND column_name=$3', ['nucl', tables[i], table_name+'_id']);

          if (columnExistsRes.rowCount > 0) {
            const linkedRecordRes = await pool.query('select coalesce( (SELECT id FROM nucl.'+tables[i]+' WHERE data_source_id = $1 and '+table_name+'_id = $2 limit 1), 0) AS id1 '+
              'FROM nucl.'+tables[i]+' LIMIT 1', [data_source_id, rec_id]);

            if (linkedRecordRes.rowCount > 0) {
              const { id1 } = linkedRecordRes.rows[0];
              console.log('id=', id1);

              if (id1 != 0) {
                console.log(1);
                return response.status(400).send(`Запись с кодом ${id} не удалена, так как для нее существуют связанные записи в таблице ${responses[i]}`);
              }
            } else {
              console.log(2);
              return response.status(400).send(`Запись с кодом ${id}: ошибка при проверке связанных таблиц`);
            }
          }
        } catch(err) {
          console.log(3);
          return response.status(400).send(`Ошибка при проверке наличия поля: ${err.message}`);
        }
      }

      delRec(id);
    } else {
      console.log(4);
      response.status(400).send(`Запись с кодом ${id} не найдена`);
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
        const s=error.message;
        if (s.includes("data_source_class_uk")) 
        {
          response.status(400).send(`Связь с источником данных не сохранена: Для записи классификатора может существовать только одна связь с выбранным источником данных. Такая связь уже существует`);
          //Связь с источником данных не добавлена: Для одной записи в таблице ${table_name} может существовать только одна запись в таблице "Связь с источником данных" для одного источника`);
        }
        else
        { 
          if (s.includes("data_source_class_tuk")) 
            response.status(400).send(`Связь с источником данных не сохранена: Для записи классификатора может существовать только одна связь с выбранным источником данных. Такая связь уже существует.`);
          else
            //response.status(400).send(`Связь с источником данных с кодом ${id} не сохранена: ${error.message} `)
            response.status(400).send(`Невозможно сохранить запись. Нарушено требование уникальности. Для выбранного источника данных установленное значение в поле "Обозначение" уже существует.`)
            /* Невозможно сохранить запись. Нарушено требование уникальности. Для выбранного источника данных установленное значение в поле "Обозначение" уже существует.*/ 
        }
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
  getDataSourceClassMin,
  getDataSourceClassById,
  createDataSourceClass,
  deleteDataSourceClass,
  updateDataSourceClass
}
