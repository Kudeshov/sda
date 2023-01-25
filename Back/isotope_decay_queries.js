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

const pool = new Pool(config);
pool.on(`error`, function (err, client) {
    console.error(`idle client error`, err.message, err.stack);
});

const getIsotopeDecayByIsotope = (request, response ) => {
  const isotope_id = parseInt(request.params.id||0);  
  //console.log(request.params);
  pool.query(
    "select id.*, i_p.title as parent_title, i_c.title as child_title, i_c.n_index, i_c.half_life_value, i_c.half_life_period, i_c.decayconst "+
    "from nucl.isotope_decay id join nucl.isotope i_p on i_p.id = id.parent_id  join nucl.isotope i_c on i_c.id = id.child_id "+
    "where id.parent_id = $1 order by id.child_id ", [isotope_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateIsotopeDecay = (request, response) => {
  const id = parseInt(request.params.id);
  const { child_id, decay_prob } = request.body;

  pool.query(  
    'UPDATE nucl.isotope_decay SET child_id = $1, decay_prob = $2 where id = $3',
    [child_id, decay_prob, id ],
    (error, results) => {
      if (error) 
      {
        response.status(400).send(`Запись с кодом ${id} не изменена: ${error.message} `)
      }
      else
      { 
        response.status(200).send(`Запись с кодом ${id} сохранена.`);
      }
    }
  )
}

const createIsotopeDecay = (request, response) => {
  //console.log( request.body );
  const { parent_id, child_id, decay_prob } = request.body;
  pool.query('INSERT INTO nucl.isotope_decay (parent_id, child_id, decay_prob) VALUES ($1, $2, $3) RETURNING id', [parent_id, child_id, decay_prob], (error, results) => {
    if (error) {
      response.status(400).send(`Запись не добавлена: ` + error.message);
    } else {
      const { id } = results.rows[0]; 
      response.status(201).json({id: `${id}`}); 
    }
  })
}

const deleteIsotopeDecay = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('DELETE from nucl.isotope_decay where id = $1 ', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Запись не удалена: ` + error.message);
    } else {
      response.status(200).send(`Запись с кодом ${id} удалена`); 
    }
  })
}

module.exports = {
  getIsotopeDecayByIsotope,
  updateIsotopeDecay,
  createIsotopeDecay,
  deleteIsotopeDecay
}
