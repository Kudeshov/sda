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

var config = require(`./config.json`);
const c_c = require('./common_queries');

const pool = new Pool(config);
pool.on(`error`, function (err) {
    console.error(`idle client error`, err.message, err.stack);
});

const getCriterionGr = (request, response, table_name ) => {
  pool.query(`SELECT pc.*, pcn1.name name_rus, pcn2.name name_eng, esc.title as parent_name, pcn1.descr descr_rus, pcn2.descr descr_eng, n.title as normativ_title, null children FROM nucl.${table_name} pc `+
  `left join nucl.${table_name}_nls pcn1 on pc.id=pcn1.${table_name}_id and pcn1.lang_id=1 `+
  `left join nucl.${table_name}_nls pcn2 on pc.id=pcn2.${table_name}_id and pcn2.lang_id=2 `+
  `left join nucl.${table_name} esc on pc.parent_id = esc.id ` +
  `left join public.normativ n on pc.normativ_id = n.id ` +
  `ORDER BY pc.title ASC`, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCriterionGrById = (request, response, table_name ) => {
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

const createCriterionGr = (request, response, table_name )=> {
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

    const { title, name_rus, name_eng, descr_rus, descr_eng, parent_id, normativ_id } = request.body;
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;

      console.log( request.body);
      client.query(`INSERT INTO nucl.${table_name}( title, parent_id, normativ_id ) VALUES ($1,$2,$3) RETURNING id`, [title, parent_id, normativ_id], (err, res) => {
        if (shouldAbort(err, response)) return;      
        const { id } = res.rows[0];
        console.log(`Id = `+id);
        client.query( c_c.getNLSQuery(name_rus||'', descr_rus||'', id, 1, table_name), (err) => {
          if (shouldAbort(err, response)) return;
          client.query( c_c.getNLSQuery(name_eng||'', descr_eng||'', id, 2, table_name), (err) => {
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

const deleteCriterionGr = (request, response, table_name ) => {
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
          client.query(`DELETE FROM nucl.${table_name}_nls WHERE ${table_name}_id = $1`, [id], (err) => {
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
                      response.status(200).send(`Запись с кодом ${id} удалена; cтрок удалено: ${res.rowCount} `);
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

const updateCriterionGr = (request, response, table_name ) => {
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
    const { title, name_rus, name_eng, descr_rus, descr_eng, parent_id, normativ_id } = request.body;
    console.log( request.body);
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;
      client.query(`UPDATE nucl.${table_name} SET title = $1, parent_id = $2, normativ_id = $3 WHERE id = $4`, [title, parent_id, normativ_id, id], (err) => {
        if (shouldAbort(err, response)) return;      
        //console.log(s_q);  
        client.query( c_c.getNLSQuery(name_rus||'', descr_rus||'', id, 1, table_name), (err) => {
          console.log(`rus изменяется`); 

          if (shouldAbort(err, response)) return;
          console.log(`rus изменен`);

          //console.log(s_q);          
          client.query( c_c.getNLSQuery(name_eng||'', descr_eng||'', id, 2, table_name), (err) => {
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
  getCriterionGr,
  getCriterionGrById,
  createCriterionGr,
  deleteCriterionGr,
  updateCriterionGr
}
