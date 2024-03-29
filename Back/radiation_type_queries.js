var express = require(`express`);
var app = express();

const bodyParser = require(`body-parser`)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const { Pool } = require(`pg`);
const e = require(`express`);

var config = require(`./config.json`);
const c_c = require('./common_queries');

const pool = new Pool(config);
pool.on(`error`, function (err, client) {
    console.error(`idle client error`, err.message, err.stack);
});

const getRadiationType = (request, response, table_name ) => { //getNLSQueryRadType
  pool.query(`SELECT pc.*, pcn1.name name_rus, pcn2.name name_eng, pcn1.descr descr_rus, pcn2.descr descr_eng FROM nucl.radiation_type pc 
   left join nucl.radiation_type_nls pcn1 on pc.code=pcn1.rad_type_code and pcn1.lang_id=1  
   left join nucl.radiation_type_nls pcn2 on pc.code=pcn2.rad_type_code and pcn2.lang_id=2  
   ORDER BY pc.title ASC`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createRadiationType = (request, response, table_name )=> {
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

    const { code, title, name_rus, name_eng, descr_rus, descr_eng } = request.body;
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;
      client.query(`INSERT INTO nucl.radiation_type( code, title ) VALUES ($1,$2) RETURNING id`, [code, title], (err, res) => {
        if (shouldAbort(err, response)) return;      
        const { id } = res.rows[0];
        console.log(`Id = `+id);
        client.query( c_c.getNLSQueryRadType(name_rus||'', descr_rus||'', code, 1), (err, res) => {
          if (shouldAbort(err, response)) return;
          client.query( c_c.getNLSQueryRadType(name_eng||'', descr_eng||'', code, 2), (err, res) => {
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
}

const deleteRadiationType = (request, response, table_name ) => {
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
          client.query(`DELETE FROM nucl.radiation_type_nls WHERE rad_type_code = (select code from nucl.radiation_type where id = $1)`, [id], (err, res) => {
            if (shouldAbort(err, response)) return;      
            console.log(`Id = `+id);
            client.query(`DELETE FROM nucl.radiation_type WHERE id = $1`, [id], (err, res) => {
              console.log(`DELETE FROM nucl.radiation_type`);         
              if (shouldAbort(err, response)) return;
              console.log(`DELETE FROM nucl.radiation_type готово`);
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

const updateRadiationType = (request, response, table_name ) => {
  pool.connect((err, client, done) => {
    const shouldAbort = (err, response) => {
      if (err) {
        console.error(`Ошибка изменения записи`, err.message)
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
    const id = request.params.id;
    const { code, title, name_rus, name_eng, descr_rus, descr_eng } = request.body;
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;
      client.query(`UPDATE nucl.radiation_type SET title = $1, code = $2 WHERE id = $3`, [title, code, id], (err, res) => {
        if (shouldAbort(err, response)) return;      
        var s_q = c_c.getNLSQueryRadType(name_rus||'', descr_rus||'', code, 1);
        console.log(s_q);  
        client.query( c_c.getNLSQueryRadType(name_rus||'', descr_rus||'', code, 1), (err, res) => {
          console.log(`rus изменяется`); 

          if (shouldAbort(err, response)) return;
          console.log(`rus изменен`);

          var s_q = c_c.getNLSQueryRadType(name_eng||'', descr_eng||'', code, 2);
          console.log(s_q);          
          client.query( c_c.getNLSQueryRadType(name_eng||'', descr_eng||'', code, 2), (err, res) => {
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
  getRadiationType,
  createRadiationType,
  deleteRadiationType,
  updateRadiationType
}
