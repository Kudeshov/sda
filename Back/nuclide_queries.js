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

const getNuclideByChelement = (request, response ) => {
  const chelement_id = parseInt(request.params.id||0);  
  console.log(request.params);
  pool.query("select n.*, concat(concat(c.title, ' - '), n.mass_number) as name from nucl.nuclide n join nucl.chelement c on c.id = n.chelement_id where n.chelement_id = $1", [chelement_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createNuclide= (request, response) => {
  console.log( request.body );
  const { chelement_id, mass_number } = request.body;
  pool.query('INSERT INTO nucl.nuclide (chelement_id, mass_number) VALUES ($1, $2) RETURNING id', [chelement_id, mass_number], (error, results) => {
    if (error) 
    {
      response.status(400).send(`Нуклид не добавлен. Ошибка: `+error.message);
    } 
    else 
    {
      const { id } = results.rows[0]; 
      response.status(201).send(`Нуклид добавлен, код: ${id}`)
    }
  })
}

const deleteNuclide = (request, response) => {
  const id = parseInt(request.params.id)
  console.log('del nuclide ' + id);
  pool.query('DELETE FROM nucl.nuclide WHERE id = $1', [id], (error, results) => {
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

const updateNuclide = (request, response) => {
  const id = parseInt(request.params.id)
  const { mass_number } = request.body;
  pool.query( //поля table_name rec_id не должны меняться
    'UPDATE nucl.nuclide SET mass_number = $1  where id = $2',
    [mass_number, id ],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Связь с источником данных с кодом ${id} не изменена: ${error.message} `)
      }
      else
      { 
        response.status(200).send(`Связь с источником данных ${id} изменена. Строк изменено: ${results.rowCount} `);
      }
    }
  )
}


module.exports = {
  getNuclideByChelement,
  createNuclide,
  deleteNuclide,
  updateNuclide
}
