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
        response.status(400).send(`Ошибка: ` + err.message);
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
        // const { id } = res.rows[0];
        //console.log(`Id = `+id);
        client.query(`UPDATE nucl.${table_name}_nls SET name = $1, descr=$2 WHERE ${table_name}_id = $3 and lang_id=$4`, 
                     [name_rus, descr_rus, id, 1], (err, res) => {
          console.log(`rus изменяется`);         
          if (shouldAbort(err, response)) return;
          console.log(`rus изменен`);
          client.query(`UPDATE nucl.${table_name}_nls SET name = $1, descr=$2 WHERE ${table_name}_id = $3 and lang_id=$4`, 
                     [name_eng, descr_eng, id, 2], (err, res) => {
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
                console.log(`Химическое соединение изменено, ID: ${id}`); 
                response.status(200).send(`Химическое соединение изменено, ID: ${id}`);
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
  updateChemCompGr
}
