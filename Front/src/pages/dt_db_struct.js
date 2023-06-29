import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import TransferList from '../component/TransferList'; 

// Компонент TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'} variant={'body2'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function MyStepper() {
  const [value, setValue] = useState(0);
  const [tableDoseRatio, setTableDoseRatio] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);  // новое состояние для отслеживания загрузки данных
  const [targetDB, setTargetDB] = useState([]);
  const [selectedDB, setSelectedDB] = useState(null);

  useEffect(() => {
    fetch('/dose_ratio/')
      .then(response => response.json())
      .then(data => {
        const items = data.map(item => item.title);
        setTableDoseRatio(items);
        setIsLoading(false);  // закончили загрузку данных
      });

    // Загрузка данных для Autocomplete
    fetch('/data_source/')
      .then(response => response.json())
      .then(data => {
        const filteredData = data.filter(item => item.external_ds === true);
        setTargetDB(filteredData);
      });

  }, []); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  

  return (
    <div className="App">

      <Autocomplete
        id="target-db"
        options={targetDB}
        getOptionLabel={(option) => option.title}
        style={{ width: 300 }}
        onChange={(event, newValue) => {
          setSelectedDB(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Целевая БД" variant="outlined" />}
      />
{/*       <h3>&nbsp;&nbsp;Состав и структура целевой базы данных дозовых коэффициентов</h3> */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Дозовые коэффициенты" />
            <Tab label="Классификаторы" />
            <Tab label="Список нуклидов" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
            <Grid item xs={12} md={9} style={{flexGrow: 1}}>
              {isLoading ? 'Загрузка...' : <TransferList left={tableDoseRatio} right={[]} />}
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
                <Button variant="contained" color="primary">Сохранить</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: '10px' }}>Сохранить все</Button>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Классификаторы
        </TabPanel>
        <TabPanel value={value} index={2}>
          Список нуклидов
        </TabPanel>
      </Box>
    </div>
  );
}
