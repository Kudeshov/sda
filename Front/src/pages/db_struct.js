import React from 'react';
import { Grid } from '@mui/material';
import MyStepper from './dt_db_struct';

function DbStruct() {
  
  //useDocumentTitle(table_names['data_source']);
  return (
    <div className="App">
      <h3>&nbsp;&nbsp;Состав и структура целевой базы данных дозовых коэффициентов</h3>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={8}>
          <MyStepper />
        </Grid>

      </Grid>
    </div>
  );
}

export default DbStruct;