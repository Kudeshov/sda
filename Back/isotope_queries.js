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
/*     console.log(results.rows); */
    response.status(200).json(results.rows)
    });
}

const getIsotopeTree = (request, response ) => {
  const isotope_id = parseInt(request.params.id||0);  
/*   console.log('getIsotopeTree');
  console.log(request.params); */
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

const getIsotopeNodes = (request, response ) => {
  const isotope_id = parseInt(request.params.id||0);  
/*   console.log('getIsotopeTree');
  console.log(request.params); */
  pool.query(
    'WITH RECURSIVE subordinates AS ( '+
    'select ist.id, ist.title as "label", ist.half_life_value, ist.half_life_period, NULL children from nucl.isotope ist where ist.id = $1 ' +
//    'select i_d.id aa, i_d.parent_id id, null parent_id, i_d.decay_prob, i.title, NULL children from nucl.isotope_decay i_d join nucl.isotope i on i.id = i_d.parent_id where i_d.parent_id = $1 '+
    'union '+ 
    'select i_d.child_id id, i.title as "label", i.half_life_value, i.half_life_period, NULL children from nucl.isotope_decay i_d join nucl.isotope i on i.id = i_d.child_id where i_d.parent_id = $1 '+
    'union '+ 
    'select i_d_r.child_id id, i1.title as "label", i1.half_life_value, i1.half_life_period, NULL children from nucl.isotope_decay i_d_r join nucl.isotope i1 on i1.id = i_d_r.child_id '+  
    'inner join subordinates s on s.id  = i_d_r.parent_id) '+ 
    'select * from subordinates order by id ', [isotope_id], (error, res) => {
    if(error) {
       return console.error('error running query', error);
    }
   //console.log(res.rows);
    response.status(200).json(res.rows);
  });  
} 

const getIsotopeEdges = (request, response ) => {
  const isotope_id = parseInt(request.params.id||0);  
  pool.query(
    'WITH RECURSIVE subordinates AS ( '+
    'select i_d.id id, i_d.child_id as "to", i_d.parent_id as "from", i_d.decay_prob, i.title as "label", i.half_life_value, i.half_life_period, NULL children from nucl.isotope_decay i_d join nucl.isotope i on i.id = i_d.child_id where i_d.parent_id = $1 '+
    'union '+ 
    'select i_d_r.id id, i_d_r.child_id as "to", i_d_r.parent_id as "from", i_d_r.decay_prob, i1.title as "label", i1.half_life_value, i1.half_life_period, NULL children from nucl.isotope_decay i_d_r join nucl.isotope i1 on i1.id = i_d_r.child_id '+  
    'inner join subordinates s on "to"  = i_d_r.parent_id) '+ 
    'select * from subordinates order by id ', [isotope_id], (error, res) => {
    if(error) {
       return console.error('error running query', error);
    }
   //console.log(res.rows);
    response.status(200).json(res.rows);
  });  
} 

const updateIsotope = (request, response) => {
  const id = parseInt(request.params.id);
  const { title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst } = request.body;

  pool.query(  
    'UPDATE nucl.isotope SET title = $1, nuclide_id = $2, n_index = $3, half_life_value = $4, half_life_period = $5, decayconst = $6 where id = $7',
    [title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst, id ],
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


const createIsotope = (request, response) => {
  console.log( request.body );
  const { title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst } = request.body;
  pool.query('INSERT INTO nucl.isotope (title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
  [title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst], 
  (error, results) => {
    if (error) {
      response.status(400).send(`Запись не добавлена: ` + error.message);
    } else {
      const { id } = results.rows[0]; 
      response.status(201).json({id: `${id}`}); 
    }
  })
}


const deleteIsotope = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('DELETE from nucl.isotope where id = $1 ', [id], (error, results) => {
    if (error) {
      response.status(400).send(`Запись не удалена: ` + error.message);
    } else {
      response.status(200).send(`Запись с кодом ${id} удалена`); 
    }
  })
} 

module.exports = {
  getIsotope,
  getIsotopeTree,
  updateIsotope,
  deleteIsotope,
  createIsotope,
  getIsotopeNodes,
  getIsotopeEdges
}
