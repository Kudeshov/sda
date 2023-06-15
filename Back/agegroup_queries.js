
/**
 * Модуль, предоставляющий функции для работы с данными о возрастных группах населения в базе данных PostgreSQL.
 * Обслуживает таблицу БД: AgeGroup
 * Включает в себя следующие функции:
 * 
 * getAgeGroup - получение данных о возрастных группах населения на основе переданных параметров.
 * getAgeGroupById - получение данных о возрастной группе по ее уникальному идентификатору.
 * createAgeGroup - добавление новых данных о возрастных группах населения в базу данных.
 * deleteAgeGroup - удаление данных о возрастной группе из базы данных.
 * updateAgeGroup - обновление данных о возрастной группе в базе данных.
 * 
 * Этот модуль подразумевает использование веб-сервера Express и клиента базы данных node-postgres.
 */

// Импорт необходимых модулей
const express = require('express');  // Express для обработки маршрутизации и серверной функциональности
const bodyParser = require('body-parser');  // Body parser для обработки JSON и url-encoded данных
const { Pool } = require('pg');  // Клиент PostgreSQL для взаимодействия с базой данных
const config = require('./config.json');  // Конфигурация для клиента PostgreSQL
const c_c = require('./common_queries');  // Файл, содержащий общие запросы к базе данных

// Создание приложения express
const app = express();

// Включение обработки JSON и URL-encoded тела для POST-запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Создание пула клиентов PostgreSQL с использованием предоставленной конфигурации
const pool = new Pool(config);

// Обработчик ошибок для неактивных клиентов в пуле
pool.on('error', (err) => {
  console.error('Ошибка неактивного клиента', err.message, err.stack);
});

const getAgeGroup = (request, response, table_name ) => {
  pool.query(`SELECT pc.*, pcn1.name name_rus, pcn2.name name_eng, pcn1.descr descr_rus, pcn2.descr descr_eng FROM nucl.${table_name} pc `+
  `left join nucl.${table_name}_nls pcn1 on pc.id=pcn1.${table_name}_id and pcn1.lang_id=1 `+
  `left join nucl.${table_name}_nls pcn2 on pc.id=pcn2.${table_name}_id and pcn2.lang_id=2 `+
  `ORDER BY pc.id ASC`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAgeGroupById = (request, response, table_name ) => {
  const id = parseInt(request.params.id||0);
  pool.query(`SELECT pc.*, pcn1.name name_rus, pcn2.name name_eng, pcn1.descr descr_rus, pcn2.descr descr_eng FROM nucl.${table_name} pc `+
  `left join nucl.${table_name}_nls pcn1 on pc.id=pcn1.${table_name}_id and pcn1.lang_id=1 `+
  `left join nucl.${table_name}_nls pcn2 on pc.id=pcn2.${table_name}_id and pcn2.lang_id=2 `+
  `where pc.id = $1`, [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

/* 
const createAgeGroup = (request, response, table_name )=> {
  pool.connect((err, client, done) => {
    const shouldAbort = (err, response) => {
      if (err) {
        console.error(`Ошибка создания записи`, err.message)
        const { errormsg } = err.message;
        console.error(`Rollback`)
        client.query(`ROLLBACK`, err => {
          console.error(`Rollback прошел`)
          if (err) {
            console.error(`Ошибка при откате транзакции`)
            response.status(400).send(`Ошибка при откате транзакции`);
            return;
          }
          else {
            console.error(`Транзакция отменена`)
          }
        })
        response.status(400).send(`Ошибка: ` + err.message);
        // release the client back to the pool
        done()
      }
      return !!err
    }

    var { title, name_rus, name_eng, descr_rus, descr_eng, resp_rate, resp_year, indoor } = request.body;
    if (indoor==="") indoor=1
    if (resp_year==="") resp_year=null
    if (resp_rate==="") resp_rate=null    
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;
      client.query(`INSERT INTO nucl.${table_name}( title, resp_rate, resp_year, indoor  ) VALUES ($1,$2,$3,$4) RETURNING id`, [title, resp_rate, resp_year, indoor ], (err, res) => {
        if (shouldAbort(err, response)) return;      
        const { id } = res.rows[0];
        console.log(`Id = `+id);
        client.query( c_c.getNLSQuery(name_rus||'', descr_rus||'', id, 1, table_name), (err, res) => {
          if (shouldAbort(err, response)) return;
          client.query( c_c.getNLSQuery(name_eng||'', descr_eng||'', id, 2, table_name), (err, res) => {
            if (shouldAbort(err, response)) return;
            console.log(`начинаем Commit`);     
            client.query(`COMMIT`, err => {
              if (err) {
                console.error(`Ошибка при подтверждении транзакции`, err.stack);
                response.status(400).send(`Ошибка при подтверждении транзакции`, err.stack);
              }
              else {
                console.log(`Запись добавлена, код: ${id}`); 
                response.status(201).json({id: `${id}`}); 
              }
              done()
            })
          }); 
        });
      })
    })
  })
} */

const createAgeGroup = (request, response, table_name) => {
  pool.connect((err, client, done) => {
    if (err) throw err;

    // Объявление функции для отмены транзакции и обработки ошибок
    const shouldAbort = (err, response) => {
      if (err) {
        console.error('Ошибка создания записи', err.message);
        response.status(400).send('Ошибка: ' + err.message);
        client.query('ROLLBACK', err => {
          if (err) {
            console.error('Ошибка при откате транзакции');
            response.status(400).send('Ошибка при откате транзакции');
          } else {
            console.error('Транзакция отменена');
          }
          done();
        });
      }
      return !!err;
    };

    // Извлекаем данные из тела запроса
    const { title, name_rus, name_eng, descr_rus, descr_eng, resp_rate, resp_year, indoor } = request.body;

    client.query('BEGIN', err => {
      if (shouldAbort(err, response)) return;
      const query = `INSERT INTO nucl.${table_name}(title, resp_rate, resp_year, indoor) VALUES ($1,$2,$3,$4) RETURNING id`;
      const values = [title, resp_rate || null, resp_year || null, indoor || 1];
      client.query(query, values, (err, res) => {
        if (shouldAbort(err, response)) return;

        const { id } = res.rows[0];
        console.log('Id = ' + id);

        client.query(c_c.getNLSQuery(name_rus || '', descr_rus || '', id, 1, table_name), (err, res) => {
          if (shouldAbort(err, response)) return;

          client.query(c_c.getNLSQuery(name_eng || '', descr_eng || '', id, 2, table_name), (err, res) => {
            if (shouldAbort(err, response)) return;

            console.log('начинаем Commit');

            client.query('COMMIT', err => {
              if (err) {
                console.error('Ошибка при подтверждении транзакции', err.stack);
                response.status(400).send('Ошибка при подтверждении транзакции');
              } else {
                console.log('Запись добавлена, код: ' + id);
                response.status(201).json({ id: `${id}` });
              }
              done();
            });
          });
        });
      });
    });
  });
};


const deleteAgeGroup = (request, response, table_name ) => {
  pool.connect((err, client, done) => {
    const shouldAbort = (err, response) => {
      if (err) {
        console.error(`Ошибка удаления записи`, err.message)
        const { errormsg } = err.message;
        console.error(`Rollback`)
        client.query(`ROLLBACK`, err => {
          console.error(`Rollback прошел`)
          if (err) {
            console.error(`Ошибка при откате транзакции`)
            response.status(400).send(`Ошибка при откате транзакции`);
            return;
          }
          else {
            console.error(`Транзакция отменена`)
          }
        })
        response.status(400).send(`Ошибка: ` + err.message);
        // release the client back to the pool
        done()
      }
      return !!err
    }

    const id = parseInt(request.params.id||0);

    client.query(`select count(id) as cnt from nucl.data_source_class where table_name = $1 and rec_id = $2 `, [table_name,id], (err, res) => {
      const { cnt } = res.rows[0];
      console.log(`Cnt = ` + cnt );   
      if (cnt > 1) {
        response.status(400).send(`Запись классификатора с кодом ${id} не может быть удалена, так как для нее существуют связи с источниками данных`);
        return;
      } else if (cnt > 0) {
        response.status(400).send(`Запись классификатора с кодом ${id} не может быть удалена, так как для нее существует связь с источником данных`);
        return;
      } else 
      {
        client.query(`BEGIN`, err => {
          if (shouldAbort(err, response)) return;
          client.query(`DELETE FROM nucl.${table_name}_nls WHERE ${table_name}_id = $1`, [id], (err, res) => {
            if (shouldAbort(err, response)) return;      
            console.log(`Id = `+id);
            client.query(`DELETE FROM nucl.${table_name} WHERE id = $1`, [id], (err, res) => {
              console.log(`DELETE FROM nucl.${table_name}`);         
              if (shouldAbort(err, response)) return;
              console.log(`DELETE FROM nucl.${table_name} готово`);
                client.query(`COMMIT`, err => {
                  if (err) {
                    console.error(`Ошибка при подтверждении транзакции`, err.stack);
                    response.status(400).send(`Ошибка при подтверждении транзакции`, err.stack);
                  }
                  else {
                    console.log(`Запись с кодом ${id} удалена`); 
                    if (res.rowCount == 1)
                      response.status(200).send(`Запись с кодом ${id} удалена; cтрок удалено: ${res.rowCount}`);
                    if (res.rowCount == 0)
                      response.status(400).send(`Запись с кодом ${id} не найдена `)
                  }
                  done()
                })
            });
          })
        })
      }
    })
  })
}

const updateAgeGroup = (request, response, table_name ) => {
  pool.connect((err, client, done) => {
    const shouldAbort = (err, response) => {
      if (err) {
        console.error(`Ошибка сохранения записи`, err.message)
        const { errormsg } = err.message;
        console.error(`Rollback`)
        client.query(`ROLLBACK`, err => {
          console.error(`Rollback прошел`)
          if (err) {
            console.error(`Ошибка при откате транзакции`)
            response.status(400).send(`Ошибка при откате транзакции`);
            return;
          }
          else {
            console.error(`Транзакция отменена`)
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
 
    var { title, name_rus, name_eng, descr_rus, descr_eng, resp_rate, resp_year, indoor } = request.body; //, ext_cloud, ext_ground
    console.log(request.body) 
    if (indoor==="") indoor=1
    if (resp_year==="") resp_year=null
    if (resp_rate==="") resp_rate=null
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;
      client.query(`UPDATE nucl.${table_name} SET title = $1, resp_rate=$3, resp_year=$4, indoor=$5 WHERE id = $2`, [title, id, resp_rate, resp_year, indoor], (err, res) => {
        if (shouldAbort(err, response)) return;   
        
        var s_q = c_c.getNLSQuery(name_rus||'', descr_rus||'', id, 1, table_name);
        console.log(s_q);  
        client.query( c_c.getNLSQuery(name_rus||'', descr_rus||'', id, 1, table_name), (err, res) => {
          console.log(`rus изменяется`); 

          if (shouldAbort(err, response)) return;
          console.log(`rus изменен`);

          var s_q = c_c.getNLSQuery(name_eng||'', descr_eng||'', id, 2, table_name);
          console.log(s_q);          
          client.query( c_c.getNLSQuery(name_eng||'', descr_eng||'', id, 2, table_name), (err, res) => {
            console.log(`eng изменяется`);  
            if (shouldAbort(err, response)) return;
            console.log(`eng изменен`);
            console.log(`начинаем Commit`);     
            client.query(`COMMIT`, err => {
              if (err) {
                console.error(`Ошибка при подтверждении транзакции`, err.stack);
                response.status(400).send(`Ошибка при подтверждении транзакции`, err.stack);
              }
              else {
                console.log(`Запись с кодом ${id} сохранена`); 
                response.status(200).send(`Запись с кодом ${id} сохранена`);
              }
              done()
            })
          }); 
        });
      })
    })
  })
}

module.exports = {
  getAgeGroup,
  getAgeGroupById,
  createAgeGroup,
  deleteAgeGroup,
  updateAgeGroup
}
