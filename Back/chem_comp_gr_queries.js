var express = require(`express`);
var app = express();
var PORT = 3001;

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

const getChemCompGr = (request, response ) => {
  pool.query(`SELECT * from ( `+
    `SELECT ccg.id+1000000 as id, title, COALESCE(chelement_id,1000000) as parent_id, formula, ccgn1.name name_rus, ccgn2.name name_eng, ccgn1.descr descr_rus, ccgn2.descr descr_eng FROM nucl.chem_comp_gr ccg `+
    `left join nucl.chem_comp_gr_nls ccgn1 on ccg.id=ccgn1.chem_comp_gr_id and ccgn1.lang_id=1 `+ 
    `left join nucl.chem_comp_gr_nls ccgn2 on ccg.id=ccgn2.chem_comp_gr_id and ccgn2.lang_id=2 `+
    `UNION `+
    `SELECT id, title, null as parent_id, null as formula, null as name_rus, null as name_eng, null as descr_rus, null as descr_eng FROM nucl.chelement `+
    `WHERE id in (SELECT distinct chelement_id from nucl.chem_comp_gr) `+
    `UNION SELECT 1000000 as id, 'Не определено' as Title, null as parent_id, null as formula, null as name_rus, null as name_eng, null as descr_rus, null as descr_eng `+
    `) as chelement_chem `+
    `order by title `, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const createChemCompGr = (request, response, table_name )=> {
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

    const { title, name_rus, name_eng, descr_rus, descr_eng, parent_id, formula } = request.body;
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;
      client.query(`INSERT INTO nucl.${table_name}( title, chelement_id, formula ) VALUES ($1,$2,$3) RETURNING id`, [title, parent_id, formula], (err, res) => {
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
}

const deleteChemCompGr = (request, response, table_name ) => {
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
        response.status(400).send(`Запись классификатора с кодом ${id} не может быть удалена, так как для нее существуют связь с источником данных`);
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

const updateChemCompGr = (request, response, table_name ) => {
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

        //chem_comp_gr_check

        const s=err.message;
        if (s.includes("chem_comp_gr_check")) 
        {
          response.status(400).send(`Для данной записи Химический элемент не указывается`);
          //Связь с источником данных не добавлена: Для одной записи в таблице ${table_name} может существовать только одна запись в таблице "Связь с источником данных" для одного источника`);
        }
        else 
        {
          response.status(400).send(`Ошибка: ` + err.message);
        }
        // release the client back to the pool
        done()
      }
      return !!err
    }
    //id
    const id = parseInt(request.params.id);
    const { title, name_rus, name_eng, descr_rus, descr_eng, parent_id, formula } = request.body;
    client.query(`BEGIN`, err => {
      console.log(request.body);
      if (shouldAbort(err, response)) return;
      console.log(`UPDATE nucl.${table_name} SET title = $1, chelement_id = $2, formula = $3 WHERE id = $4`, [title, parent_id, formula, id]);
      client.query(`UPDATE nucl.${table_name} SET title = $1, chelement_id = $2, formula = $3 WHERE id = $4`, [title, parent_id, formula, id], (err, res) => {
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
  getChemCompGr,
  updateChemCompGr,
  createChemCompGr,
  deleteChemCompGr
}
