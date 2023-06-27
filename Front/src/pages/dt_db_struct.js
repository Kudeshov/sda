import React, { useState, useEffect } from 'react';
//import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
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
  const [items, setItems] = useState([]);  // добавляем новый state

  useEffect(() => {
    fetch('/dose_ratio/')
      .then(response => response.json())
      .then(data => {
        const items = data.map(item => item.title);
        setItems(items);
      });
  }, []); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Дозовые коэффициенты" />
          <Tab label="Классификаторы" />
          <Tab label="Список нуклидов" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TransferList left={items} right={[]} />   
      </TabPanel>
      <TabPanel value={value} index={1}>
        Классификаторы
      </TabPanel>
      <TabPanel value={value} index={2}>
        Список нуклидов
      </TabPanel>
    </Box>
  );
}
