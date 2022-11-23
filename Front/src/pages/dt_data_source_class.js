import React,  { useState, useEffect } from 'react'
import { DataGrid, ruRU } from '@mui/x-data-grid'
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
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
import CircularProgress from '@material-ui/core/CircularProgress';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastAddedId = 0;
var lastRecID = 0;

function DataTableDataSourceClass(props)  {
  const [open, setOpen] = React.useState(false);

  const handleClickEdit = () => {
    setOpen(true);
  };

  const handleClickAdd = () => {
    setValueID(null);
    setValueDataSourceId(null);
    setValueRecID(props.rec_id);
    setValueTableName(props.table_name);
    setValueTitleSrc("");
    setValueNameSrc("");
    setOpen(true);
  };

  const handleCloseYes = () => {
    setOpen(false);
    saveRec();
  };

  const handleCloseNo = () => {
    setOpen(false);
  };

  const [tableDataSrcClass, setTableDataSrcClass] = useState([])
  const [tableDataSrc, setTableDataSrc] = useState([])
  useEffect(() => {
    lastRecID = props.rec_id;
    setlastSrcClassID(0);
    setIsLoading(true);
    fetch(`/data_source_class?table_name=people_class&rec_id=${props.rec_id??0}`)
      .then((data) => data.json())
      .then((data) => setTableDataSrcClass(data));
    setlastSrcClassID(0);
    setIsLoading(false);
    }, [ props.rec_id])


  useEffect(() => {
    fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => setTableDataSrc(data));
  }, [])

const columns_src = [
  { field: 'id', headerName: 'Код', width: 60 },
  { field: 'data_source_id', headerName: 'Код источника данных', width: 100 },
  { field: 'table_name', headerName: 'Имя таблицы БД', width: 180 },
  { field: 'rec_id', headerName: `Идентификатор записи в таблице ${props.table_name}`, width: 100 },
  { field: 'title', headerName: 'Источник', width: 200 },
  { field: 'title_src', headerName: 'Обозначение', width: 180, hideable: false },
  { field: 'name_src', headerName: 'Название', width: 250 },
]

const [valueId, setValueID] = React.useState();
const [valueDataSourceId, setValueDataSourceId] = React.useState();
const [valueRecId, setValueRecID] = React.useState();
const [valueTableName, setValueTableName] = React.useState();
const [valueTitleSrc, setValueTitleSrc] = React.useState();
const [valueNameSrc, setValueNameSrc] = React.useState();
const [isLoading, setIsLoading] = React.useState(false);
const [openAlert, setOpenAlert] = React.useState(false, '');
const [selectionModel, setSelectionModel] = React.useState([]);
const [lastSrcClassID, setlastSrcClassID] = React.useState([0]);

useEffect(() => {
  if ((!isLoading) && (tableDataSrcClass) && (tableDataSrcClass.length))
  {
    setSelectionModel(tableDataSrcClass[0].id); //выбрать первую строку при перегрузке таблицы
    setValueID(`${tableDataSrcClass[0].id}`);   //обновить переменные
    setValueDataSourceId(`${tableDataSrcClass[0].data_source_id}`);
    setValueTableName(`${tableDataSrcClass[0].table_name}`);
    setValueRecID(`${tableDataSrcClass[0].rec_id}`);
    setValueTitleSrc(`${tableDataSrcClass[0].title_src}`);
    setValueNameSrc(`${tableDataSrcClass[0].name_src}`); 
  }
  if ((!isLoading) && (tableDataSrcClass) )
  {
    //обновить блокировку кнопок "Редактировать" и "Удалить" в зависимости от наличия записей в таблице
    setSelection(!tableDataSrcClass.length);
  }
}, [isLoading, tableDataSrcClass, lastSrcClassID]); 

const reloadDataSrcClass = async () => {
  setIsLoading(true);
  try {
    lastRecID = props.rec_id;
    
    console.log('reloadDataSrcClass lastRecID =');
    console.log(lastRecID);
    const response = await fetch(`/data_source_class?table_name=people_class&rec_id=${props.rec_id??0}`);
     if (!response.ok) {
      alertText =  'Ошибка при обновлении данных';
      alertSeverity = "false";
      setOpenAlert(true);  
      throw new Error(`Error! status: ${response.status}`);
    }  
    const result = await response.json();
    setlastSrcClassID(0);
    //lastSrcClassID = 0;
    setTableDataSrcClass(result);
  } catch (err) {
  } finally {
    setIsLoading(false);
  }
};

const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false); 
const handleClickDelete = () => {
  setOpenConfirmDelete(true);
};

const handleCloseConfirmDelete = () => {
  setOpenConfirmDelete(false);
};

const handleCloseConfirmDeleteYes = () => {
  setOpenConfirmDelete(false);
  delRec();
};
/////////////////////////////////////////////////////////////////// DELETE /////////////////////
const delRec =  async () => {
  console.log('delrec clicked');
  const js = JSON.stringify({
     id: valueId,
  });
  setIsLoading(true);
  console.log(js);
  try {
    const response = await fetch('/data_source_class/'+valueId, {
      method: 'DELETE',
      body: js,
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
      },
    });
    if (!response.ok) {
      alertSeverity = 'error';
      alertText = await response.text();
      setOpenAlert(true);          
    }
    else
    {
      alertSeverity = "success";
      alertText = await response.text();
      setOpenAlert(true);  
    }
  } catch (err) {
  } finally {
    setIsLoading(false);
    reloadDataSrcClass();
  }
};  
///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
const saveRec = async () => {
  const js = JSON.stringify({
    id: valueId,
    data_source_id: valueDataSourceId,
    table_name: valueTableName,
    rec_id: valueRecId,
    title_src: valueTitleSrc,
    name_src: valueNameSrc         
  });
  if (!valueId) { //если значение не задано - добавить запись
    addRec();
    return;
  }
  setIsLoading(true);
  try {
    const response = await fetch('/data_source_class/'+valueId, {
      method: 'PUT',
      body: js,
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
     },
   });
   if (!response.ok) {
      alertSeverity = 'error';
      alertText = await response.text();
      setOpenAlert(true);          
    }
    else
    {
      alertSeverity = "success";
      alertText = await response.text();
      setOpenAlert(true);  
    }
 } catch (err) {
  alertText = err.message;
  alertSeverity = 'error';
  setOpenAlert(true);
 } finally {
   setIsLoading(false);
   reloadDataSrcClass();      
 }
};
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
const addRec = async ()  => {
  const js = JSON.stringify({
    id: valueId,
    data_source_id: valueDataSourceId,
    table_name: valueTableName,
    rec_id: lastRecID,
    title_src: valueTitleSrc,
    name_src: valueNameSrc         
  });
  setIsLoading(true);
  try {
    const response = await fetch('/data_source_class/', {
      method: 'POST',
      body: js,
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
      },
    });
    if (!response.ok) {
      alertSeverity = 'error';
      alertText = await response.text();
      setOpenAlert(true);          
    }
    else
    {
      alertSeverity = "success";
      alertText =  await response.text();
      lastAddedId = parseInt( alertText.substr(alertText.lastIndexOf('ID:') + 3, 20)); 
      console.log(lastAddedId);
      setValueID(lastAddedId);
      setOpenAlert(true);  
    }
  } catch (err) {
    alertText = err.message;
    alertSeverity = 'error';
    setOpenAlert(true);
  } finally {
    setIsLoading(false);
    reloadDataSrcClass(); 
  }
};

const handleRowClick/* : GridEventListener<'rowClick'>  */ = (params) => {
  setValueID(`${params.row.id}`);
  setValueDataSourceId(`${params.row.data_source_id}`);
  setValueTableName(`${params.row.table_name}`);
  setValueRecID(`${params.row.rec_id}`);
  setValueTitleSrc(`${params.row.title_src}`);
  setValueNameSrc(`${params.row.name_src}`);  
}; 

const [select, setSelection] = useState([]);
  return (
    <div style={{ height: 270, width: 850 }}>
      <table cellSpacing={0} cellPadding={0} style={{ height: 270, width: 850, verticalAlign: 'top' }} border="0"><tbody><tr>
        <td style={{ height: 270, width: 750, verticalAlign: 'top' }}>
      <DataGrid
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        columns={columns_src}
        rows={tableDataSrcClass}
        disableMultipleSelection={true}
        onRowClick={handleRowClick} {...tableDataSrcClass} 
        hideFooterSelectedRowCount={true}
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        loading={isLoading}        
        initialState={{
          columns: {
            columnVisibilityModel: {
              data_source_id: false,
              table_name: false,
              rec_id: false,
            },
          },
        }}             
      /></td>
      <td style={{ height: 270, width: 100, verticalAlign: 'top' }}>
      <Button onClick={handleClickAdd} startIcon={<AddBoxIcon />} title="Добавить связь с источником данных"></Button>
      <p/>
      <Button disabled={select} onClick={handleClickEdit} startIcon={<EditIcon />} title="Редактировать связь с источником данных"></Button>
      <p/>
      <Button disabled={select} onClick={()=>handleClickDelete()} startIcon={<DeleteIcon />} title="Удалить связь с источником данных"></Button>
      </td></tr>
      <tr>
        <td>
        <Box sx={{ width: '100%' }}>
        <Collapse in={openAlert}>
          <Alert
            severity={alertSeverity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAlert(false);
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
        {isLoading && <CircularProgress/>} 
        {/*       {!isLoading && <h3>Successfully API Loaded Data</h3>} */}
        </div>
      </Box>
        </td>
      </tr>
      </tbody></table>

      <Dialog open={open} onClose={handleCloseNo}  
               fullWidth={false} 
               maxWidth="800px" 
      >
      <DialogTitle>Связь с источником данных</DialogTitle>  
        <DialogContent>
          <DialogContentText>
            Задать связь с источником данных
          </DialogContentText>
        <p/>        
        <FormControl sx={{ width: '40ch' }}>
            <InputLabel id="demo-controlled-open-select-label">Тип источника</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              value={valueDataSourceId  || "" }
              label="Источник данных"
              defaultValue={true}
              onChange={e => setValueDataSourceId(e.target.value)}
            >
            {tableDataSrc?.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title ?? option.id}
                  </MenuItem>
                );
            })}
            </Select>
          </FormControl>  
          <p/> 
          <TextField
            variant="outlined"
            margin="dense"
            id="title"
            label="Обозначение"
            value={valueTitleSrc || ''}
            fullWidth
            onChange={e => setValueTitleSrc(e.target.value)}
          />
          <p/>
          <TextField
            variant="outlined"
            id="name_src"
            label="Название"
            value={valueNameSrc || ''}
            fullWidth
            onChange={e => setValueNameSrc(e.target.value)}
          />        
          </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseNo}>Отмена</Button>
          <Button variant="outlined" disabled={!valueTitleSrc||!valueDataSourceId} onClick={handleCloseYes}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog
      open={openConfirmDelete}
      onClose={handleCloseConfirmDelete}
      fullWidth={true}
  >
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              В таблице "Связь с источником данных" предложена к удалению следующая запись:<p/><b>{valueTitleSrc}</b>; Код в БД = <b>{valueId}</b><p/>
              Вы желаете удалить указанную запись?        
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseConfirmDelete} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleCloseConfirmDeleteYes} >Да</Button>
      </DialogActions>
      </Dialog>
      </div>
    )
}
 export  { DataTableDataSourceClass   }
