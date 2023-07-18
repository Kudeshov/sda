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
  console.log('getIsotope');
  pool.query('SELECT * FROM nucl.isotope order by title', (error, results) => {
    if(error) {
        return console.error('error running query', error);
    }
    response.status(200).json(results.rows)
    });
}

const getIsotopeTree = (request, response ) => {
  const isotope_id = parseInt(request.params.id||0);
  console.log('getIsotopeTree');  
  pool.query(
    'WITH RECURSIVE subordinates AS ( '+
    'select ist.id, null parent_id, 0 decay_prob, ist.title, ist.half_life_value, ist.half_life_period, NULL children from nucl.isotope ist where ist.id = $1 ' +
    'union '+ 
    'select i_d.child_id id, i_d.parent_id, i_d.decay_prob, i.title, i.half_life_value, i.half_life_period, NULL children from nucl.isotope_decay i_d join nucl.isotope i on i.id = i_d.child_id where i_d.parent_id = $1 '+
    'union '+ 
    'select i_d_r.child_id id, i_d_r.parent_id, i_d_r.decay_prob, i1.title, i1.half_life_value, i1.half_life_period, NULL children from nucl.isotope_decay i_d_r join nucl.isotope i1 on i1.id = i_d_r.child_id '+  
    'inner join subordinates s on s.id  = i_d_r.parent_id) '+ 
    'select * from subordinates ', [isotope_id], (error, res) => {
    if(error) {
       return console.error('error running query', error);
    }
    response.status(200).json(res.rows);
  });  
} 

const getIsotopeNodes = (request, response ) => {
  console.log('getIsotopeNodes'); 
  var isotope_id = 0;
  if (request.params.id) 
    isotope_id = parseInt(request.params.id);
  isotope_id = isotope_id || 0;  
  pool.query(
    "WITH RECURSIVE subordinates AS ( "+
    "select ist.id, ist.title || '\n'  || ist.half_life_value || ist.half_life_period as " +
    '"label", ist.half_life_value, ist.half_life_period, NULL children from nucl.isotope ist where ist.id = $1 ' +
    'union '+
    "select i_d.child_id id, i.title || '\n' || i.half_life_value || i.half_life_period as "+
    '"label", i.half_life_value, i.half_life_period, NULL children from nucl.isotope_decay i_d join nucl.isotope i on i.id = i_d.child_id where i_d.parent_id = $1 '+
    'union '+ 
    "select i_d_r.child_id id, i1.title || '\n' || i1.half_life_value || i1.half_life_period as "+
    
    '"label", i1.half_life_value, i1.half_life_period, NULL children from nucl.isotope_decay i_d_r join nucl.isotope i1 on i1.id = i_d_r.child_id '+  
    'inner join subordinates s on s.id  = i_d_r.parent_id) '+ 
    'select * from subordinates order by id ', [isotope_id], (error, res) => {
    if(error) {
       return console.error('error running query', error);
    }
    response.status(200).json(res.rows);
  });  
} 

const getIsotopeEdges = (request, response ) => {
  console.log('getIsotopeEdges'); 
  var isotope_id = 0;
  if (request.params.id) 
    isotope_id = parseInt(request.params.id);
  isotope_id = isotope_id || 0;  
    
  pool.query(
    'WITH RECURSIVE subordinates AS ( '+
    'select i_d.id id, i_d.child_id as "to", i_d.parent_id as "from", i_d.decay_prob as "label", i.title, i.half_life_value, i.half_life_period, NULL children from nucl.isotope_decay i_d join nucl.isotope i on i.id = i_d.child_id where i_d.parent_id = $1 '+
    'union '+ 
    'select i_d_r.id id, i_d_r.child_id as "to", i_d_r.parent_id as "from", i_d_r.decay_prob as "label", i1.title, i1.half_life_value, i1.half_life_period, NULL children from nucl.isotope_decay i_d_r join nucl.isotope i1 on i1.id = i_d_r.child_id '+  
    'inner join subordinates s on "to"  = i_d_r.parent_id) '+ 
    'select * from subordinates order by id ', [isotope_id], (error, res) => {
    if(error) {
       return console.error('error running query', error);
    }
    response.status(200).json(res.rows);
  });  
} 

const updateIsotope = (request, response) => {
  const id = parseInt(request.params.id);
  let { title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst } = request.body;
  console.log(request.body);
  if (half_life_value==='') {half_life_value=null}
  if (n_index===''||n_index===' ') {n_index=null}
  
  pool.query(  
    'UPDATE nucl.isotope SET title = $1, nuclide_id = $2, n_index = $3, half_life_value = $4, half_life_period = $5, decayconst = $6 where id = $7',
    [title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst, id ],
    (error, results) => {
      if (error) {
        console.log( error.message);
        let invalidValue = error.message.split(": ")[1]; 
        switch (error.code) {
          case '22P02':  // код ошибки для "invalid input syntax for type numeric"
            response.status(400).send(`Запись с кодом ${id} не изменена: неверный формат числового значения ${invalidValue}.`);
            break;
          // Добавьте здесь другие коды ошибок, которые вы хотите обрабатывать
          default:
            response.status(400).send(`Запись с кодом ${id} не изменена: ` + error.message);
        }
      } else { 
        response.status(200).send(`Запись с кодом ${id} сохранена.`);
      }
    }
  )
}

const createIsotope = (request, response) => {
  console.log( request.body );
  let { title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst } = request.body;
  if (half_life_value==='') {half_life_value=null}

  pool.query('INSERT INTO nucl.isotope (title, nuclide_id, n_index, half_life_value, half_life_period, decayconst) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
  [title, nuclide_id, n_index,  half_life_value, half_life_period,  decayconst], 
  (error, results) => {
    if (error) {
      switch (error.code) {
        case '22P02':  // код ошибки для "invalid input syntax for type numeric"
          response.status(400).send(`Запись не добавлена: неверный формат числового значения.`);
          break;
        default:
          response.status(400).send(`Запись не добавлена: ` + error.message);
      }
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
