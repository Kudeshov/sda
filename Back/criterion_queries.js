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

const getCriterion = (request, response, table_name ) => {
  console.log('getCriterion');
  pool.query(`WITH RECURSIVE tree AS (
    SELECT DISTINCT gr.id, gr.title, gr.parent_id, nls.name AS name_rus
    FROM nucl.criterion_gr gr
    LEFT JOIN nucl.criterion_gr_nls nls ON gr.id = nls.criterion_gr_id AND nls.lang_id = 1
    WHERE gr.id IN (SELECT DISTINCT criterion_gr_id FROM nucl.criterion)
    UNION
    SELECT DISTINCT g.id, g.title, g.parent_id, nls.name AS name_rus
    FROM nucl.criterion_gr g
    JOIN tree t ON g.id = t.parent_id
    LEFT JOIN nucl.criterion_gr_nls nls ON g.id = nls.criterion_gr_id AND nls.lang_id = 1
    )
    SELECT DISTINCT tree.id, tree.title, tree.parent_id, 0 AS crit, 0 AS calcfunction_id, 0 AS irradiation_id, 0 AS people_class_id, 0 AS integral_period_id, 0 AS organ_id,
      0 AS agegroup_id, 0 AS exp_scenario_id, 0 AS isotope_id, 0 AS subst_form_id, 0 AS chem_comp_gr_id, 0 AS aerosol_sol_id, 0 AS aerosol_amad_id, 0 AS timeend,
        0 AS action_level_id, 0 AS data_source_id, 0 AS cr_value, tree.name_rus, null as name_eng, null as descr_rus, null as descr_eng
    FROM tree
    UNION
    SELECT DISTINCT c.id, c.title, c.criterion_gr_id, 1 AS crit, c.calcfunction_id, c.irradiation_id, c.people_class_id, c.integral_period_id, c.organ_id, c.agegroup_id, c.exp_scenario_id, c.isotope_id, c.subst_form_id, c.chem_comp_gr_id, c.aerosol_sol_id, c.aerosol_amad_id, c.timeend, c.action_level_id, c.data_source_id, c.cr_value, pcn1.name name_rus, pcn2.name name_eng, pcn1.descr descr_rus, pcn2.descr descr_eng
    FROM nucl.criterion c
    left join nucl.criterion_nls pcn1 on c.id=pcn1.criterion_id and pcn1.lang_id=1 
    left join nucl.criterion_nls pcn2 on c.id=pcn2.criterion_id and pcn2.lang_id=2 
    ORDER BY crit, id
    `, (error, results) => {
    if (error) {
      throw error //WHERE id IN (SELECT DISTINCT criterion_gr_id FROM nucl.criterion)
    }
    response.status(200).json(results.rows)
  })
}

function emptyStringToNull(value) {
  if (value === '') return null;
  return value;
}

const createCriterion = (request, response, table_name )=> {
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

    const { title, name_rus, name_eng, descr_rus, descr_eng , criterion_gr_id, calcfunction_id, irradiation_id, agegroup_id,  
      exp_scenario_id, integral_period_id, organ_id, data_source_id, aerosol_amad_id,
      aerosol_sol_id, chem_comp_gr_id, subst_form_id, isotope_id, action_level_id, 
      people_class_id, cr_value, timeend
    } = request.body;

    console.log(request.body);

    const validatedTitle = emptyStringToNull(title);
    const validatedCriterionGrId = emptyStringToNull(criterion_gr_id);
    const validatedCalcFunctionId = emptyStringToNull(calcfunction_id);
    const validatedIrradiationId = emptyStringToNull(irradiation_id);
    const validatedAgeGroupId = emptyStringToNull(agegroup_id);
    const validatedExpScenarioId = emptyStringToNull(exp_scenario_id);
    const validatedIntegralPeriodId = emptyStringToNull(integral_period_id);
    const validatedOrganId = emptyStringToNull(organ_id);
    const validatedDataSourceId = emptyStringToNull(data_source_id);
    const validatedAerosolAmadId = emptyStringToNull(aerosol_amad_id);
    const validatedAerosolSolId = emptyStringToNull(aerosol_sol_id);
    const validatedChemCompGrId = emptyStringToNull(chem_comp_gr_id);
    const validatedSubstFormId = emptyStringToNull(subst_form_id);
    const validatedIsotopeId = emptyStringToNull(isotope_id);
    const validatedActionLevelId = emptyStringToNull(action_level_id);
    const validatedPeopleClassId = emptyStringToNull(people_class_id);
    const validatedCrValue = emptyStringToNull(cr_value);
    const validatedTimeend = emptyStringToNull(timeend);
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;

      client.query(`
      INSERT INTO nucl.${table_name}( 
        title, criterion_gr_id, calcfunction_id, irradiation_id, agegroup_id, 
        exp_scenario_id, integral_period_id, organ_id, data_source_id, aerosol_amad_id,
        aerosol_sol_id, chem_comp_gr_id, subst_form_id, isotope_id, action_level_id, 
        people_class_id, cr_value, timeend
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
      ) RETURNING id`, 
      [
        validatedTitle, validatedCriterionGrId, validatedCalcFunctionId, validatedIrradiationId, validatedAgeGroupId, 
        validatedExpScenarioId, validatedIntegralPeriodId, validatedOrganId, validatedDataSourceId, validatedAerosolAmadId,
        validatedAerosolSolId, validatedChemCompGrId, validatedSubstFormId, validatedIsotopeId, validatedActionLevelId, 
        validatedPeopleClassId, validatedCrValue, validatedTimeend
      ], (err, res) => {
        if (shouldAbort(err, response)) return;      
        const { id } = res.rows[0];
        console.log(`Id = `+id);

        //console.log(`getNLSQuery ` );

        let s_query = c_c.getNLSQuery(name_rus||'', descr_rus||'', id, 1, table_name);
        console.log(s_query);

        //console.log( c_c.getNLSQuery(name_rus||'', descr_rus||'', id, 1, table_name) );
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

const deleteCriterion = (request, response, table_name ) => {
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

const updateCriterion = (request, response, table_name ) => {
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
    const { title, name_rus, name_eng, descr_rus, descr_eng, criterion_gr_id, calcfunction_id, irradiation_id, agegroup_id,  exp_scenario_id, integral_period_id, organ_id, data_source_id, aerosol_amad_id,
      aerosol_sol_id, chem_comp_gr_id, subst_form_id, isotope_id, action_level_id, people_class_id, cr_value, timeend  } = request.body;
    client.query(`BEGIN`, err => {
      if (shouldAbort(err, response)) return;

      console.log(request.body);

      const updateQuery = `UPDATE nucl.${table_name} SET title = $1, criterion_gr_id = $2, calcfunction_id = $3, irradiation_id = $4, agegroup_id = $5, exp_scenario_id = $6,
       integral_period_id = $7, organ_id = $8, data_source_id = $9, aerosol_amad_id = $10, aerosol_sol_id = $11, chem_comp_gr_id = $12, subst_form_id = $13,
        isotope_id = $14, action_level_id = $15, people_class_id = $16, cr_value = $17, timeend = $18 WHERE id = $19`;

      const queryParams = [
        title,
        criterion_gr_id,
        calcfunction_id,
        irradiation_id,
        agegroup_id,
        exp_scenario_id,
        integral_period_id,
        organ_id,
        data_source_id,
        aerosol_amad_id,
        aerosol_sol_id,
        chem_comp_gr_id,
        subst_form_id,
        isotope_id,
        action_level_id,
        people_class_id,
        cr_value,
        timeend,
        id
      ];
      
      const formattedQuery = updateQuery.replace(/\$(\d+)/g, (match, index) => {
        return queryParams[index - 1];
      });
      
      console.log(formattedQuery);

      client.query(`UPDATE nucl.${table_name} SET title = $1, criterion_gr_id = $2, calcfunction_id = $3, irradiation_id = $4, agegroup_id = $5, exp_scenario_id = $6, integral_period_id = $7, organ_id = $8, 
      data_source_id = $9, aerosol_amad_id = $10, aerosol_sol_id = $11, chem_comp_gr_id = $12, subst_form_id = $13, isotope_id = $14, action_level_id = $15, people_class_id = $16, cr_value = $17, timeend = $18 WHERE id = $19`, 
       [title, criterion_gr_id, calcfunction_id, irradiation_id, agegroup_id,  exp_scenario_id, integral_period_id, organ_id, data_source_id, aerosol_amad_id,
        aerosol_sol_id, chem_comp_gr_id, subst_form_id, isotope_id, action_level_id, people_class_id, cr_value, timeend, id ], (err, res) => {
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
    getCriterion,
    createCriterion,
    deleteCriterion,
    updateCriterion,
  }

