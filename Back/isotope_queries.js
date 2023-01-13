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

const getIsotope = (request, response ) => {
  pool.query('SELECT * FROM nucl.isotope order by title', (error, results) => {
    if(error) {
        return console.error('error running query', error);
    }
    console.log(results.rows);
    response.status(200).json(results.rows)
    });
}

const getIsotopeTree = (request, response ) => {
  const isotope_id = parseInt(request.params.id||0);  
  console.log('getIsotopeTree');
  console.log(request.params);
  pool.query(
    'WITH RECURSIVE subordinates AS ( '+
    'select ist.id, null parent_id, 0 decay_prob, ist.title, ist.half_life_value, ist.half_life_period, NULL children from nucl.isotope ist where ist.id = $1 ' +
//    'select i_d.id aa, i_d.parent_id id, null parent_id, i_d.decay_prob, i.title, NULL children from nucl.isotope_decay i_d join nucl.isotope i on i.id = i_d.parent_id where i_d.parent_id = $1 '+
    'union '+ 
    'select i_d.child_id id, i_d.parent_id, i_d.decay_prob, i.title, i.half_life_value, i.half_life_period, NULL children from nucl.isotope_decay i_d join nucl.isotope i on i.id = i_d.child_id where i_d.parent_id = $1 '+
    'union '+ 
    'select i_d_r.child_id id, i_d_r.parent_id, i_d_r.decay_prob, i1.title, i1.half_life_value, i1.half_life_period, NULL children from nucl.isotope_decay i_d_r join nucl.isotope i1 on i1.id = i_d_r.child_id '+  
    'inner join subordinates s on s.id  = i_d_r.parent_id) '+ 
    'select * from subordinates ', [isotope_id], (error, res) => {
    if(error) {
       return console.error('error running query', error);
    }
   //console.log(res.rows);
    response.status(200).json(res.rows);
  });  
} 
/* 
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
  console.log( request.body );
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
} */

module.exports = {
  getIsotope,
  getIsotopeTree
}
