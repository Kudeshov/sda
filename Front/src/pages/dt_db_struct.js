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
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);

  useEffect(() => {
    fetch('/dose_ratio/')
      .then(response => response.json())
      .then(data => {
        setTableDoseRatio(data);
        setIsLoading(false);  // закончили загрузку данных
      });

    // Загрузка данных для Autocomplete
    fetch('/data_source/')
      .then(response => response.json())
      .then(data => {
        const filteredData = data.filter(item => item.external_ds !== true);
        setTargetDB(filteredData);
      });

  }, []); 

  useEffect(() => {
    setIsLoading(true);
    if (selectedDB) {
      fetch('/data_source_class_min/')
        .then(response => response.json())
        .then(data => {
          const filteredData = data.filter(item => item.table_name === "dose_ratio" && item.data_source_id === selectedDB.id);
          const rightItems = tableDoseRatio.filter(dr => filteredData.some(fd => fd.rec_id === dr.id)).map(item => item.title);
          const leftItems = tableDoseRatio.filter(dr => !filteredData.some(fd => fd.rec_id === dr.id)).map(item => item.title);
          console.log('leftItems', leftItems);
          setLeftItems(leftItems);
          setRightItems(rightItems);
          setIsLoading(false);  // закончили загрузку данных
          setSelectedItem(0);
        });
    }
  }, [selectedDB, tableDoseRatio]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // состояние для полей редактирования
  const [editFields, setEditFields] = useState({
    title_src: '',
    name_src: '',
    title: '',
  });
  const [selectedItem, setSelectedItem] = useState(null);

  // обновление данных на сервере
  const handleSave = () => {
    fetch(`/data_source_class/${selectedItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFields),
    })
      .then(response => response.json())
      .then(data => console.log(data));
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
              {isLoading ? 'Загрузка...' : <TransferList left={leftItems} right={rightItems} />}
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
                <Button variant="contained" color="primary" onClick={handleSave}>Сохранить</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: '10px' }}>Сохранить все</Button>
                <TextField
                  id="title-src-field"
                  label="Код"
                  variant="outlined"
                  value={editFields.title_src}
                  onChange={(e) => setEditFields({ ...editFields, title_src: e.target.value })}
                />
                <TextField
                  id="name-src-field"
                  label="Отображение"
                  variant="outlined"
                  value={editFields.name_src}
                  onChange={(e) => setEditFields({ ...editFields, name_src: e.target.value })}
                />
                <TextField
                  id="title-field"
                  label="Название"
                  variant="outlined"
                  value={editFields.title}
                  onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                />
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
