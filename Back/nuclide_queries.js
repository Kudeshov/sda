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

module.exports = {
  getNuclideByChelement
}
