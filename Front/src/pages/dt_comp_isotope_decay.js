import React,  { useState, useEffect } from 'react'
import { DataGrid, ruRU } from '@mui/x-data-grid'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { table_names } from './sda_types';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastAddedId = 0;
var lastID = 0;

function DataTableIsotopeDecay(props)  {
const columns_decay = [
  { field: 'id', headerName: 'Код', width: 70 },
  { field: 'parent_id', headerName: 'Код родительского изотопа', width: 80 },
  { field: 'child_id', headerName: 'Код дочернего изотопа', width: 80 },
  { field: 'parent_title', headerName: 'Родительский изотоп', width: 170, hideable: false },
  { field: 'decay_prob', headerName: 'Вероятность распада', width: 130 },
  { field: 'child_title', headerName: 'Дочерний изотоп', width: 150 },
  { field: 'n_index', headerName: 'Индекс', width: 80 },
  { field: 'half_life_value', headerName: 'Период полураспада', width: 180 },
  { field: 'half_life_period', headerName: 'Единица измерения периода полураспада', width: 180 },
  { field: 'decayconst', headerName: 'Постоянная распада 1/сек', width: 180 },
]

const [valueIsotopeDecayId, setValueIsotopeDecayId] = React.useState();
const [valueChildIsotopeId, setValueChildIsotopeId] = React.useState();
//const [valueParentIsotopeId, setValueParentIsotopeId] = React.useState();
const [valueChildTitle, setValueChildTitle] = React.useState();
const [valueParentTitle, setValueParentTitle] = React.useState();
const [valueDecayProb, setValueDecayProb] = React.useState();
const [tableIsotope, setTableIsotope] = useState([]); 
const [openDecay, setOpenDecay] = useState(false); 
const [openConfirmDeleteDecay, setOpenConfirmDeleteDecay] = useState(false); 
const [noRecordsDecay, setNoRecordsDecay] = useState(true);
const [selectionModelDecay, setSelectionModelDecay] = React.useState([]);
const [tableDecay, setTableDecay] = useState([]); 
const [openAlertDecay, setOpenAlertDecay] = React.useState(false, '');
const [isLoading, setIsLoading] = React.useState(false);

useEffect(() => {
  fetch(`/isotope_min`)
    .then((data) => data.json())
    .then((data) => setTableIsotope(data))
    .then((data) => { /* console.log('load isotope') */ } ); 
}, [])

useEffect(() => {
  var rid = 0; 
  if (props.rec_id) 
    rid = props.rec_id;
  fetch(`/isotope_decay/`+rid)
    .then((data) => data.json())
    .then((data) => setTableDecay(data))
    .then( /* console.log('грузим decay') */ );
}, [props.rec_id])

/* useEffect(() => {
  setNoRecordsDecay(!tableDecay.length);
}, [tableDecay]); 
 */
  const handleRowClickDecay = (params) => {
    setOpenAlertDecay(false);
    //console.log('child title' + params.row.child_title);
    setValueIsotopeDecayId(params.row.id);
    lastID = params.row.id;
    setValueChildIsotopeId(params.row.child_id);
    //setValueParentIsotopeId(params.row.parent_id);
    setValueChildTitle(params.row.child_title);
    //setValueParentTitle(params.row.parent_title);
    setValueDecayProb(params.row.decay_prob);
  }; 

  useEffect(() => {
    setValueParentTitle(props.table_name);
  }, [props.table_name]);

  const handleClickEditDecay = () => {
    setOpenDecay(true);
  };

  const handleClickAddDecay = () => {
    setValueIsotopeDecayId(null);
    setValueChildIsotopeId(null);
    setValueDecayProb(null);
    setOpenDecay(true);
  };

  const handleCloseYesDecay = () => {
    setOpenDecay(false);
    saveRecDecay();
  };

  const handleCloseNoDecay = () => {
    setOpenDecay(false);
    //console.log(lastID);  
    setValueIsotopeDecayId(lastID);
    var filteredDecay = tableDecay.filter(function(element) {
      return element.id === lastID;
    });
    if (filteredDecay.length > 0) {
      setValueChildIsotopeId(filteredDecay[0].child_id);
      setValueChildTitle(filteredDecay[0].child_title);
      setValueDecayProb(filteredDecay[0].decay_prob); 
      //console.log(filteredDecay[0].child_title);  
    }
  };

  const handleClickDeleteDecay = () => {
    setOpenConfirmDeleteDecay(true);
  };
  
  const handleCloseConfirmDeleteDecay = () => {
    setOpenConfirmDeleteDecay(false);
  };
  
  const handleCloseConfirmDeleteYesDecay = () => {
    setOpenConfirmDeleteDecay(false);
    delRecDecay();
  };
//====================================================================================
 useEffect(() => {
  if ((!isLoading) && (tableDecay) && (tableDecay.length))
  {
    setSelectionModelDecay([tableDecay[0].id]); //выбрать первую строку при перегрузке таблицы
    lastID = tableDecay[0].id;
    setValueIsotopeDecayId(tableDecay[0].id);
    setValueChildIsotopeId(tableDecay[0].child_id);
    //setValueParentIsotopeId(tableDecay[0].parent_id);
    setValueChildTitle(tableDecay[0].child_title);
    //setValueParentTitle(tableDecay[0].parent_title);
    setValueDecayProb(tableDecay[0].decay_prob);    
  }
  if ((!isLoading) && (tableDecay) )
  {
    //обновить блокировку кнопок "Редактировать" и "Удалить" в зависимости от наличия записей в таблице
    setNoRecordsDecay(!tableDecay.length);
  }
}, [isLoading, tableDecay]); 

const reloadDataDecay = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`/isotope_decay/`+props.rec_id);
     if (!response.ok) {
      alertText =  'Ошибка при обновлении данных';
      alertSeverity = "false";
      setOpenAlertDecay(true);  
      throw new Error(`Error! status: ${response.status}`);
    }  
    const result = await response.json();
    //setlastSrcClassID(0);
    setTableDecay(result);
  } catch (err) {
  } finally {
    setIsLoading(false);
  }
};
/////////////////////////////////////////////////////////////////// DELETE /////////////////////
const delRecDecay =  async () => {
  const js = JSON.stringify({
    id: valueIsotopeDecayId,
  });
  setIsLoading(true);
  try {
    const response = await fetch('/isotope_decay/'+valueIsotopeDecayId, {
      method: 'DELETE',
      body: js,
      headers: {
        'Content-Type': 'Application/json',
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      alertSeverity = 'error';
      alertText = await response.text();
      setOpenAlertDecay(true);          
    }
    else
    {
      alertSeverity = "success";
      alertText = await response.text();
      setOpenAlertDecay(true);  
    }
  } catch (err) {
  } finally {
    setIsLoading(false);
    reloadDataDecay();
  }
};  
///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
const saveRecDecay = async () => {
  const js = JSON.stringify({
    child_id: valueChildIsotopeId,
    decay_prob: valueDecayProb,     
  });
  if (!valueIsotopeDecayId) { //если значение не задано - добавить запись
    addRecDecay();
    return;
  }
  setIsLoading(true);

  try {
    const response = await fetch('/isotope_decay/'+valueIsotopeDecayId, {
      method: 'PUT',
      body: js,
      headers: {
        'Content-Type': 'Application/json',
        Accept: 'Application/json',
     },
   });
   if (!response.ok) {
      alertSeverity = 'error';
      alertText = await response.text();
      setOpenAlertDecay(true);          
    }
    else
    {
      alertSeverity = "success";
      alertText = await response.text();
      setOpenAlertDecay(true);  
    }
 } catch (err) {
  alertText = err.message;
  alertSeverity = 'error';
  setOpenAlertDecay(true);
 } finally {
   setIsLoading(false);
   reloadDataDecay();      
 }
};

/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
const addRecDecay = async ()  => {
  const js = JSON.stringify({
   parent_id: props.rec_id,
   child_id: valueChildIsotopeId,
   decay_prob: valueDecayProb,          
  });
  setIsLoading(true);
  try {
    const response = await fetch('/isotope_decay/', {
      method: 'POST',
      body: js,
      headers: {
        'Content-Type': 'Application/json',
        Accept: 'Application/json',
      },
    });
    if (!response.ok) {
      alertSeverity = 'error';
      alertText = await response.text();
      setOpenAlertDecay(true);          
    }
    else
    {
      alertSeverity = "success";
      const { id } = await response.json();
      alertText = `Добавлена запись с кодом ${id}`;
      lastAddedId =  id;
      setValueIsotopeDecayId(lastAddedId); 
      setOpenAlertDecay(true);  
    }
  } catch (err) {
    alertText = err.message;
    alertSeverity = 'error';
    setOpenAlertDecay(true);
  } finally {
    setIsLoading(false);
    reloadDataDecay(); 
  }
};

const [heightVal, setHeightVal] = React.useState(260);
useEffect(() => {
  if (openAlertDecay)
  {
    setHeightVal(290)  
  }
  else 
  {
    setHeightVal(260)  
  } 
}, [openAlertDecay]); 


return (
    <div style={{ height: {heightVal} , width: 886 }}> 
    <table cellSpacing={0} cellPadding={0} style={{ height: 270, width: 886, verticalAlign: 'top' }} border="0"><tbody><tr>
      <td style={{ height: 250, width: 800, verticalAlign: 'top' }}>
      <DataGrid
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableDecay}
        label="Обозначение" 
        loading={isLoading}
        columns={columns_decay}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModelDecay(newSelectionModel);
        }}
        selectionModel={selectionModelDecay}        
        initialState={{
          columns: {
            columnVisibilityModel: {
              parent_id: false,
              child_id: false
            },
          },
        }}        
        onRowClick={handleRowClickDecay} {...tableDecay} 
      />            
    </td>
    <td style={{ height: 210, width: 100, verticalAlign: 'top' }}>
    &nbsp;<IconButton onClick={()=>handleClickAddDecay()} disabled={(!props.rec_id)} color="primary" size="small" title="Добавить связь с источником данных">
      <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton><br/>
    &nbsp;<IconButton onClick={()=>handleClickEditDecay()} disabled={noRecordsDecay} color="primary" size="small" title="Редактировать связь с источником данных">
      <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton><br/>
    &nbsp;<IconButton onClick={()=>handleClickDeleteDecay()} disabled={noRecordsDecay} color="primary" size="small" title="Удалить связь с источником данных">
      <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton><br/>
    </td></tr>
    <tr>
      <td>
      <Box sx={{ width: '100%' }}>
      <Collapse in={openAlertDecay}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlertDecay(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertText}
        </Alert>
      </Collapse>
      <div style={{
      marginLeft: '40%',
      }}>
      </div>
    </Box>
      </td>
    </tr>
    </tbody></table>

    <Dialog open={openDecay} onClose={handleCloseNoDecay} fullWidth={false} maxWidth="800px">
    <DialogTitle>Радиоактивные ряды (элемент)</DialogTitle>  
      <DialogContent>
{/*             <DialogContentText>
          Радиоактивные ряды (элемент)
        </DialogContentText> */}
        <p></p>
        <TextField  sx={{width: '50ch', input: {background: '#EEEEEE'}}}
          variant="outlined"
          margin="dense"
          id="title"
          label="Родительский изотоп"
          value={valueParentTitle || ''}
          fullWidth
          onChange={e => setValueParentTitle(e.target.value)}
          inputProps={
            { readOnly: true, }
          }
        />
        <p></p>                    
        <FormControl sx={{ width: '50ch' }}>
          <InputLabel id="demo-controlled-open-select-label">Дочерний изотоп</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={valueChildIsotopeId || "" }
            label="Дочерний изотоп"
            defaultValue={true}
            onChange={e => setValueChildIsotopeId(e.target.value)}
          >
          {tableIsotope?.map(option => {
              return (
                <MenuItem key={option.id} value={option.id}>
                  {option.title ?? option.id}
                </MenuItem>
              );
          })}
          </Select>
        </FormControl>  
        <p></p> 
        <TextField
          variant="outlined"
          type="number"
          id="name_src"
          label="Вероятность распада"
          value={valueDecayProb || ''}
          InputProps={{
            inputProps: {
              type: 'number',
              min: 0, max: 1,
            },
          }}          
          fullWidth
          onChange={e => setValueDecayProb(e.target.value)}
        />        
        </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseNoDecay}>Отмена</Button>
        <Button variant="outlined" disabled={!valueDecayProb||!valueChildIsotopeId} onClick={handleCloseYesDecay}>Сохранить</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={openConfirmDeleteDecay} onClose={handleCloseConfirmDeleteDecay} fullWidth={true}>
    <DialogTitle>
        Внимание
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
            В таблице "{table_names['isotope_decay']}" предложена к удалению следующая запись:<p></p><b>{valueParentTitle + '->' + valueChildTitle}</b>; Код в БД = <b>{valueIsotopeDecayId}</b><p></p>
            Вы желаете удалить указанную запись?        
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseConfirmDeleteDecay} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseConfirmDeleteYesDecay} >Да</Button>
    </DialogActions>

    </Dialog>
  </div>
  )
}
 export  { DataTableIsotopeDecay }
