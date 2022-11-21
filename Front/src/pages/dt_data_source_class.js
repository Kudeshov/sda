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
    console.log('handleClickAdd lastRecID');
    console.log(lastRecID);    
    console.log('handleClickAdd props.rec_id');
    console.log(props.rec_id);    
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

  //const [nameState , setNameState] = useState(props);  //alert(props);
  const [tableDataSrcClass, setTableDataSrcClass] = useState([])
  const [tableDataSrc, setTableDataSrc] = useState([])
  useEffect(() => {
    lastRecID = props.rec_id;
    console.log('lastRecID =');
    console.log(lastRecID);
    setIsLoading(true);
    fetch(`/data_source_class?table_name=people_class&rec_id=${props.rec_id??0}`)
      .then((data) => data.json())
      .then((data) => setTableDataSrcClass(data));
    setIsLoading(false);
    }, [ props.rec_id /* props */])


  useEffect(() => {
    fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => setTableDataSrc(data));
  }, [ /*props.rec_id  props */])


const columns_src = [
  { field: 'id', headerName: 'Код', width: 60 },
  { field: 'data_source_id', headerName: 'Код источника данных', width: 60 },
  { field: 'table_name', headerName: 'Имя таблицы БД', width: 60 },
  { field: 'rec_id', headerName: 'Идентификатор записи в таблице table_name', width: 60 },
  { field: 'title', headerName: 'Источник', width: 200 },
  { field: 'title_src', headerName: 'Обозначение', width: 180 },
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

useEffect(() => {
  if ((!isLoading) && (tableDataSrcClass) && (tableDataSrcClass.length)) {
    setSelection(false);
    console.log('перегруз груза '+tableDataSrcClass[0].id);
    setSelectionModel(tableDataSrcClass[0].id);
    setValueID(`${tableDataSrcClass[0].id}`);
    setValueDataSourceId(`${tableDataSrcClass[0].data_source_id}`);
    setValueTableName(`${tableDataSrcClass[0].table_name}`);
    setValueRecID(`${tableDataSrcClass[0].rec_id}`);
    setValueTitleSrc(`${tableDataSrcClass[0].title_src}`);
    setValueNameSrc(`${tableDataSrcClass[0].name_src}`);  
  }
  else
  {
    console.log('перегруз груза говкно'); 
    setSelection(true);
  }  
}, [ isLoading, tableDataSrcClass] ); 

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
     //title: valueTitle,
     //shortname: valueShortName
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
    //const result = await response.json();
    //console.log('result is: ', JSON.stringify(result, null, 4));
    //setData(result);
  } catch (err) {
    //setErr(err.message);
  } finally {
    setIsLoading(false);
    reloadDataSrcClass();
    //console.log(valueId );
    //var idx = tableData.findIndex(x => x.id === valueId);
/*     console.log( 'tableData[0].id' );
    console.log( tableData[0].id );
    setSelectionModel(tableData[0].id );  
    setValueID(`${tableData[0].id}`);
    setValueTitle(`${tableData[0].title}`);
    setValueNameRus(`${tableData[0].name_rus}`);
    setValueNameEng( tableData[0].name_eng || "" );
    setValueDescrRus(`${tableData[0].descr_rus}`);
    setValueDescrEng(`${tableData[0].descr_eng}` ); */
 
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
  console.log('saverec');
  if (!valueId) {
    addRec();
    return;
  }

  setIsLoading(true);
  console.log(js);
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
  console.log('addrec executed');

  console.log('lastRecID');
  console.log(lastRecID);
  const js = JSON.stringify({
    id: valueId,
    data_source_id: valueDataSourceId,
    table_name: valueTableName,
    rec_id: lastRecID,
    title_src: valueTitleSrc,
    name_src: valueNameSrc         
  });
  console.log(js);  
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
    //setSelectionModel(lastAddedId);  
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

const [selectionModel, setSelectionModel] = React.useState([]);

/* const handleRowSelection = (newSelection) => {
   // prints correct indexes of selected rows
   // console.log('selection');
   // console.log(e.selectionModel);
    // missing the first row selected
    //setSelection(e.selectionModel);
    //console.log('select');
    //console.log(select);
     
  setSelection (newSelection.selectionModel);
     
} */

/* const handleCheckSelect = () => {
  alert(selectionModel);
  console.log('selection model');
  console.log(selectionModel);
}; */

/* useEffect(() => {
  setSelection(select);
  console.log('select');
  console.log(select); // <-- The state is updated
}, [select]);
 */
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
        //onSelectionModelChange = {handleRowSelection}
        initialState={{
          columns: {
            columnVisibilityModel: {
              data_source_id: false,
              table_name: false,
              rec_id: false,
            },
          },
        }}             
       // onselectionChange={handleRowClick} {...tableDataSrc}  
      /></td>
      <td style={{ height: 270, width: 100, verticalAlign: 'top' }}>
      <Button onClick={handleClickAdd} startIcon={<AddBoxIcon />} title="Добавить связь с источником данных"></Button>
      <p/>
      <Button disabled={select} /* {!tableDataSrcClass.length}  */onClick={handleClickEdit} startIcon={<EditIcon />} title="Редактировать связь с источником данных"></Button>
      <p/>
      <Button disabled={select}  onClick={()=>handleClickDelete()} startIcon={<DeleteIcon />} title="Удалить связь с источником данных"></Button>
{/*       //<p/>
      //<Button  onClick={()=>handleCheckSelect()} title="Проверка выборки">ФФФ</Button> */}
      </td></tr></tbody></table>

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

{/*       <Button
        disabled={openAlert}
        variant="outlined"
        onClick={() => {
          setOpenAlert(true);
        }}
      >
        На жми!
      </Button> */}
    </Box>


      <Dialog open={open} onClose={handleCloseNo} /* style={{ height: 500, width: 600 }} */   /*  sx={{ width: 800 }}  */  
               fullWidth={false} 
               maxWidth="800px" 
      >
      <DialogTitle>Источник данных</DialogTitle>  
        <DialogContent>
          <DialogContentText>
            Источник данных
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
            autoFocus
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
          <Button onClick={handleCloseNo}>Отмена</Button>
          <Button onClick={handleCloseYes}>Сохранить</Button>
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
              Вы действительно хотите удалить запись {valueId}?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCloseConfirmDelete} autoFocus>Нет</Button>
          <Button onClick={handleCloseConfirmDeleteYes} >Да</Button>
      </DialogActions>
      </Dialog>
      </div>
    )
}
 export  { DataTableDataSourceClass   }
