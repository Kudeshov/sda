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
  'left join nucl.people_class_nls pcn1 on pc.id=pcn1.people_class_id and pcn1.lang_id=1 '+
  'left join nucl.people_class_nls pcn2 on pc.id=pcn2.people_class_id and pcn2.lang_id=2 '+
  'ORDER BY pc.id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPeopleClassById = (request, response) => {
  const id = parseInt(request.params.id||0);
  pool.query('SELECT pc.*, pcn1.name name_rus, pcn2.name name_eng, pcn1.descr descr_rus, pcn2.descr descr_eng FROM nucl.people_class pc '+
  'left join nucl.people_class_nls pcn1 on pc.id=pcn1.people_class_id and pcn1.lang_id=1 '+
  'left join nucl.people_class_nls pcn2 on pc.id=pcn2.people_class_id and pcn2.lang_id=2 '+
  'where pc.id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createPeopleClass = (request, response) => {
  pool.connect((err, client, done) => {
    const shouldAbort = (err, response) => {
      if (err) {
        console.error('Ошибка создания записи', err.message)
        const { errormsg } = err.message;
        console.error('Rollback')
        client.query('ROLLBACK', err => {
          console.error('Rollback прошел')
          if (err) {
            console.error('Ошибка при откате транзакции')
            response.status(400).send('Ошибка при откате транзакции');
            return;
          }
          else {
            console.error('Транзакция отменена')
          }
        })
        response.status(400).send(`Ошибка: ` + err.message);
        // release the client back to the pool
        done()
      }
      return !!err
    }

    const { title, name_rus, name_eng, descr_rus, descr_eng } = request.body;
    client.query('BEGIN', err => {
      if (shouldAbort(err, response)) return;
      client.query('INSERT INTO nucl.people_class( title ) VALUES ($1) RETURNING id', [title], (err, res) => {
        if (shouldAbort(err, response)) return;      
        const { id } = res.rows[0];
        console.log('Id = '+id);
        client.query('INSERT INTO nucl.people_class_nls( name, descr, people_class_id, lang_id ) '+
                  'VALUES ($1, $2, $3, 1)', [name_rus, descr_rus, id], (err, res) => {
          console.log('rus добавляется');         
          if (shouldAbort(err, response)) return;
          console.log('rus добавлен');
          client.query('INSERT INTO nucl.people_class_nls( name, descr, people_class_id, lang_id ) '+
          'VALUES ($1, $2, $3, 2)', [name_eng, descr_eng, id], (err, res) => {
            console.log('eng добавляется');  
            if (shouldAbort(err, response)) return;
            console.log('eng добавлен');
            console.log('начинаем Commit');     
            client.query('COMMIT', err => {
              if (err) {
                console.error('Ошибка при подтверждении транзакции', err.stack);
                response.status(400).send('Ошибка при подтверждении транзакции', err.stack);
              }
              else {
                console.log(`Тип облучаемых лиц добавлен, ID: ${id}`); 
                response.status(201).send(`Тип облучаемых лиц добавлен, ID: ${id}`);
              }
              done()
            })
          }); 
        });
      })
    })
  })
}

const deletePeopleClass = (request, response) => {
  pool.connect((err, client, done) => {
    const shouldAbort = (err, response) => {
      if (err) {
        console.error('Ошибка удаления записи', err.message)
        const { errormsg } = err.message;
        console.error('Rollback')
        client.query('ROLLBACK', err => {
          console.error('Rollback прошел')
          if (err) {
            console.error('Ошибка при откате транзакции')
            response.status(400).send('Ошибка при откате транзакции');
            return;
          }
          else {
            console.error('Транзакция отменена')
          }
        })
        response.status(400).send(`Ошибка: ` + err.message);
        // release the client back to the pool
        done()
      }
      return !!err
    }

    const id = parseInt(request.params.id||0);

    client.query('BEGIN', err => {
      if (shouldAbort(err, response)) return;
      client.query('DELETE FROM nucl.people_class_nls WHERE people_class_id = $1', [id], (err, res) => {
        if (shouldAbort(err, response)) return;      
        console.log('Id = '+id);
        client.query('DELETE FROM nucl.people_class WHERE id = $1', [id], (err, res) => {
          console.log('DELETE FROM nucl.people_class');         
          if (shouldAbort(err, response)) return;
          console.log('DELETE FROM nucl.people_class готово');
            client.query('COMMIT', err => {
              if (err) {
                console.error('Ошибка при подтверждении транзакции', err.stack);
                response.status(400).send('Ошибка при подтверждении транзакции', err.stack);
              }
              else {
                console.log(`Тип облучаемых лиц удален, ID: ${id}`); 
                if (res.rowCount == 1)
                  response.status(200).send(`Тип облучаемых лиц ${id} удален; cтрок удалено: ${res.rowCount} `);
                if (res.rowCount == 0)
                  response.status(400).send(`Запись с кодом ${id} не найдена `)
                //response.status(200).send(`Тип облучаемых лиц удален, ID: ${id}`);
              }
              done()
            })
         // }); 
        });
      })
    })
  })
}


/*
const deletePeopleClass = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, atomic_num } = request.body
  pool.query('DELETE FROM nucl.people_class_nls WHERE people_class_id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Тип облучаемых лиц (языковые ресурсы) не удален: ${error.message}`);
    }
    else {
      //response.status(200).send(`Источник данных удален, ID: ${id} : удалено строк: ${results.rowCount} `)
      //if (results.rowCount == 1)
      //  response.status(200).send(`Тип облучаемых лиц (языковые ресурсы)  ${id} удален: cтрок удалено: ${results.rowCount} `);
      //if (results.rowCount == 0)
      //  response.status(400).send(`Запись с кодом ${id} не найдена `)
    }
  })

  pool.query('DELETE FROM nucl.people_class WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Тип облучаемых лиц не удален: ${error.message}`);
    }
    else {
      //response.status(200).send(`Источник данных удален, ID: ${id} : удалено строк: ${results.rowCount} `)
      if (results.rowCount == 1)
        response.status(200).send(`Тип облучаемых лиц ${id} удален: cтрок удалено: ${results.rowCount} `);
      if (results.rowCount == 0)
        response.status(400).send(`Запись с кодом ${id} не найдена `)
    }
  }) 
}
*/

/*
const updatePeopleClass = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, name_rus, name_eng, descr_rus, descr_eng } = request.body
  console.log( 'updatePeopleClass id='+id );
  pool.query(
    'UPDATE nucl.people_class SET title = $1 WHERE id = $2; '+
    'UPDATE nucl.people_class_nls SET name = $3, descr=$4 WHERE people_class_id = $5 and lang_id=$6; '+
    'UPDATE nucl.people_class_nls SET name = $7, descr=$8 WHERE people_class_id = $9 and lang_id=$10; ',
    [title, id, name_rus, descr_rus, id, 1, name_eng, descr_eng, id, 2],
    (error, results) => {
      if (error) 
      {
        console.log( 'дерьмо' ); 
        response.status(400).send(`Тип облучаемых лиц с кодом ${id} не изменен: ${error.message} `);
        return;
      }
      else
      {
       // if (results.rowCount == 1)
       //   response.status(200).send(`Тип облучаемых лиц ${id} изменен. Строк изменено: ${results.rowCount} `);
       console.log( 'хорошо' ); 
       if (results.rowCount == 0) 
        {
          console.log( 'нуль' ); 
          response.status(400).send(`Тип облучаемых лиц с кодом ${id} не найден `);
          return;
        }
        else 
        {
          response.status(200).send(`Тип облучаемых лиц (англ.) ${id} изменен. Строк изменено: ${results.rowCount} `);
        }
      }
    }
  )
}
*/

const updatePeopleClass = (request, response) => {
  pool.connect((err, client, done) => {
    const shouldAbort = (err, response) => {
      if (err) {
        console.error('Ошибка изменения записи', err.message)
        const { errormsg } = err.message;
        console.error('Rollback')
        client.query('ROLLBACK', err => {
          console.error('Rollback прошел')
          if (err) {
            console.error('Ошибка при откате транзакции')
            response.status(400).send('Ошибка при откате транзакции');
            return;
          }
          else {
            console.error('Транзакция отменена')
          }
        })
        response.status(400).send(`Ошибка: ` + err.message);
        // release the client back to the pool
        done()
      }
      return !!err
    }
    //id
    const id = parseInt(request.params.id);
    const { title, name_rus, name_eng, descr_rus, descr_eng } = request.body;
    client.query('BEGIN', err => {
      if (shouldAbort(err, response)) return;
      client.query('UPDATE nucl.people_class SET title = $1 WHERE id = $2', [title, id], (err, res) => {
        if (shouldAbort(err, response)) return;      
        // const { id } = res.rows[0];
        //console.log('Id = '+id);
        client.query('UPDATE nucl.people_class_nls SET name = $1, descr=$2 WHERE people_class_id = $3 and lang_id=$4', 
                     [name_rus, descr_rus, id, 1], (err, res) => {
          console.log('rus изменяется');         
          if (shouldAbort(err, response)) return;
          console.log('rus изменен');
          client.query('UPDATE nucl.people_class_nls SET name = $1, descr=$2 WHERE people_class_id = $3 and lang_id=$4', 
                     [name_eng, descr_eng, id, 2], (err, res) => {
            console.log('eng изменяется');  
            if (shouldAbort(err, response)) return;
            console.log('eng изменен');
            console.log('начинаем Commit');     
            client.query('COMMIT', err => {
              if (err) {
                console.error('Ошибка при подтверждении транзакции', err.stack);
                response.status(400).send('Ошибка при подтверждении транзакции', err.stack);
              }
              else {
                console.log(`Тип облучаемых лиц изменен, ID: ${id}`); 
                response.status(200).send(`Тип облучаемых лиц изменен, ID: ${id}`);
              }
              done()
            })
          }); 
        });
      })
    })
  })
}
 
const updatePeopleClass1 = (request, response) => {
  const id = parseInt(request.params.id)
  const { title, name_rus, name_eng, descr_rus, descr_eng } = request.body
  console.log( 'updatePeopleClass id='+id );

  pool.query(
    'UPDATE nucl.people_class SET title = $1 WHERE id = $2',
    [title, id],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Тип облучаемых лиц с кодом ${id} не изменен: ${error.message} `);
        return;
      }
      else
      {
       // if (results.rowCount == 1)
       //   response.status(200).send(`Тип облучаемых лиц ${id} изменен. Строк изменено: ${results.rowCount} `);
        if (results.rowCount == 0) 
        {
          response.status(400).send(`Тип облучаемых лиц с кодом ${id} не найден `);
          return;
        }
      }
    }
  )
  pool.query(
    'UPDATE nucl.people_class_nls SET name = $1, descr=$2 WHERE people_class_id = $3 and lang_id=$4',
    [name_rus, descr_rus, id, 1],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Тип облучаемых лиц (рус.) с кодом ${id} не изменен: ${error.message} `);
        return;
      }
      else
      {
       // if (results.rowCount == 1)
       //   response.status(200).send(`Тип облучаемых лиц (рус.) ${id} изменен. Строк изменено: ${results.rowCount} `);
        if (results.rowCount == 0)
        {
          response.status(400).send(`Тип облучаемых лиц (рус.) с кодом ${id} не найден `);
          return;
        }
      }
    }
  )
  pool.query(
    'UPDATE nucl.people_class_nls SET name = $1, descr=$2 WHERE people_class_id = $3 and lang_id=$4',
    [name_eng, descr_eng, id, 2],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Тип облучаемых лиц (англ.) с кодом ${id} не изменен: ${error.message} `);
        return;
      }
      else
      {
        if (results.rowCount == 1)
          response.status(200).send(`Тип облучаемых лиц (англ.) ${id} изменен. Строк изменено: ${results.rowCount} `);
        if (results.rowCount == 0)
        {
          response.status(400).send(`Тип облучаемых лиц (англ.) с кодом ${id} не найден `);
          return;
        }
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
