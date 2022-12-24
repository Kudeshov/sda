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

const getNormativ = (request, response, table_name ) => {
  pool.query(`SELECT * FROM public.${table_name} `, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getNormativ
}
