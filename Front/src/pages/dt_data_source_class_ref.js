import React,  { useState, useEffect } from 'react'
import { DataGrid, ruRU } from '@mui/x-data-grid'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
/* import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material"; */
import { Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as InfoLightIcon } from "./../icons/info.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { table_names } from './table_names';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastAddedId = 0;
var lastRecID = 0;
var lastID = 0;

function DataTableDataSourceClassRef(props)  {
  const [open, setOpen] = React.useState(false);

  const handleClickEdit = () => {
    setOpen(true);
  };

  const handleClickAdd = () => {
    console.log('handleClickAdd');
    setValueID(null);
    setValueDataSourceId(null);
    setValueRecID(null);
    setValueTableName(null);
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

    console.log(lastID);  
    var filteredData = tableDataSrcClass.filter(function(element) {
      return element.id === lastID;
    });
    if (filteredData.length > 0) {
      setValueID(lastID);
      setValueTitleSrc(filteredData[0].title_src);
      setValueNameSrc(filteredData[0].name_src);  
      setValueDataSourceId(filteredData[0].data_source_id);
      setValueTableName(filteredData[0].table_name);
      setValueRecID(filteredData[0].rec_id);
      setValueTitle(filteredData[0].title);    
      setValueTitleSrc(filteredData[0].title_src);
      setValueNameSrc(filteredData[0].name_src);
      setValueShortName(filteredData[0].shortname);
      setValueFullName(filteredData[0].fullname);
      setValueDescr(filteredData[0].descr);
      setValueExternalDS(filteredData[0].external_ds);    
    }    
  };
/* 
  const [tableDataSrc, setTableDataSrc] = useState([]); */

  const [tableDataSrcClass, setTableDataSrcClass] = useState([]);
  const columns_src = [
    { field: 'id', headerName: 'Код', width: 60 },
    { field: 'data_source_id', headerName: 'Код источника данных', width: 100 },
    { field: 'table_name_verbose', headerName: 'Имя классификатора', width: 230 },
/*    { field: 'table_name', headerName: 'Имя таблицы БД', width: 180 },
     { field: 'rec_id', headerName: `Идентификатор записи в таблице ${props.table_name}`, width: 100 },
    { field: 'title', headerName: 'Источник', width: 200 }, */
    { field: 'title_src', headerName: 'Обозначение', width: 150, hideable: false },
    { field: 'name_src', headerName: 'Название', width: 150 },
    { field: 'ref_title', headerName: 'Запись классификатора', width: 170 },
  /*   { field: 'shortname', headerName: 'Краткое название', width: 250 },
    { field: 'fullname', headerName: 'Полное название', width: 250 },
    { field: 'descr', headerName: 'Комментарий', width: 250 },
    { field: 'external_ds', headerName: 'Внешний источник данных', width: 250 }, */
  ]

  useEffect(() => {
    setOpenAlert(false);
    setlastSrcClassID(0);
    setIsLoading(true);
    fetch(`/data_source_class_ref/${props.rec_id||0}`)  
    .then((data) => data.json())
    .then((data) => {
      const updatedData = data.map(item => ({
        ...item,
        table_name_verbose: table_names[item.table_name] || 'Неизвестно'
      }));
      setTableDataSrcClass(updatedData);
    });    
    setlastSrcClassID(0);
    setIsLoading(false);
  }, [props.rec_id])

/*   useEffect(() => {
    fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => setTableDataSrc(data));
  }, []) */

const [valueId, setValueID] = React.useState();
const [valueDataSourceId, setValueDataSourceId] = React.useState();
const [valueRecId, setValueRecID] = React.useState();
const [valueTableName, setValueTableName] = React.useState();
const [valueTitle, setValueTitle] = React.useState();
const [valueTitleSrc, setValueTitleSrc] = React.useState();
const [valueNameSrc, setValueNameSrc] = React.useState();

const [valueShortName, setValueShortName] = React.useState();
const [valueFullName, setValueFullName] = React.useState();
const [valueDescr, setValueDescr] = React.useState();
const [valueExternalDS, setValueExternalDS] = React.useState();

const [isLoading, setIsLoading] = React.useState(false);
const [openAlert, setOpenAlert] = React.useState(false, '');
const [selectionModel, setSelectionModel] = React.useState([]);
const [lastSrcClassID, setlastSrcClassID] = React.useState([0]);

const [tableRef, setTableRef] = useState([]);
//const [selectedRefItem, setSelectedRefItem] = useState(null);

useEffect(() => {

  console.log(valueTableName);

  if(valueTableName) {
    fetch(`/ref_table?table_name=${valueTableName}`)
    .then(response => response.json())
    .then(data => setTableRef(data))
    .catch(error => console.log(error));
  }
}, [valueTableName]);

useEffect(() => {
  if ((!isLoading) && (tableDataSrcClass) && (tableDataSrcClass.length))
  {
    setSelectionModel([tableDataSrcClass[0].id]); //выбрать первую строку при перегрузке таблицы
    lastID = tableDataSrcClass[0].id;
    setValueID(tableDataSrcClass[0].id);   //обновить переменные
    setValueDataSourceId(tableDataSrcClass[0].data_source_id);
    setValueTableName(tableDataSrcClass[0].table_name);
    setValueRecID(tableDataSrcClass[0].rec_id);
    setValueTitle(tableDataSrcClass[0].title);    
    setValueTitleSrc(tableDataSrcClass[0].title_src);
    setValueNameSrc(tableDataSrcClass[0].name_src);
    setValueShortName(tableDataSrcClass[0].shortname);
    setValueFullName(tableDataSrcClass[0].fullname);
    setValueDescr(tableDataSrcClass[0].descr);
    setValueExternalDS(tableDataSrcClass[0].external_ds);      
  }
  if ((!isLoading) && (tableDataSrcClass) )
  {
    //обновить блокировку кнопок "Редактировать" и "Удалить" в зависимости от наличия записей в таблице
    setNoRecords(!tableDataSrcClass.length);
  }
}, [isLoading, tableDataSrcClass, lastSrcClassID]); 

const reloadDataSrcClass = async () => {
  setIsLoading(true);
  try {
    lastRecID = props.rec_id;
    const response = await fetch(`/data_source_class_ref/${props.rec_id||0}`);
    if (!response.ok) {
      alertText =  'Ошибка при обновлении данных';
      alertSeverity = "false";
      setOpenAlert(true);  
      throw new Error(`Error! status: ${response.status}`);
    }  
    const data = await response.json();
    const updatedData = data.map(item => ({
      ...item,
      table_name_verbose: table_names[item.table_name] || 'Неизвестно'
    }));
    setlastSrcClassID(0);
    setTableDataSrcClass(updatedData);
  } catch (err) {
  } finally {
    setIsLoading(false);
  }
};

const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false); 
const [openDSInfo, setOpenDSInfo] = React.useState(false); 
const handleOpenDSInfo = () => {
  setOpenDSInfo(true);
};

const handleCloseDSInfo = () => {
  setOpenDSInfo(false);
};

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
  const js = JSON.stringify({
     id: valueId,
     table_name: props.table_name,
     master_id: props.rec_id
  });
  setIsLoading(true);
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

  if (formRef.current.reportValidity() )
    {

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
}
};
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
const addRec = async ()  => {
  const js = JSON.stringify({
    id: valueId,
    data_source_id: props.rec_id,
    table_name: valueTableName,
    rec_id: valueRecId,
    title_src: valueTitleSrc,
    name_src: valueNameSrc         
  });
  console.log(valueRecId);
  console.log(js);
  //return;
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
      const { id } = await response.json();
      alertText = `Добавлена запись с кодом ${id}`;
      lastAddedId =  id; 
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

const handleRowClick = (params) => {
  setOpenAlert(false);
  setValueID(params.row.id);
  lastID = params.row.id;
  setValueDataSourceId(params.row.data_source_id);
  setValueTableName(params.row.table_name);
  setValueRecID(params.row.rec_id);

  console.log('click', params.row.table_name, params.row.rec_id);
  setValueTitle(params.row.title);
  setValueTitleSrc(params.row.title_src);
  setValueNameSrc(params.row.name_src);
  setValueShortName(params.row.shortname);  
  setValueFullName(params.row.fullname);  
  setValueDescr(params.row.descr);  
  setValueExternalDS(params.row.external_ds);  
}; 

const [noRecords, setNoRecords] = useState(true);


const formRef = React.useRef();
  return (
    
    <div style={{ height: 270, width: 886 }}>
      <form ref={formRef}>  
      <table cellSpacing={0} cellPadding={0} style={{ height: 270, width: 886, verticalAlign: 'top' }} border="0"><tbody><tr>
        <td style={{ height: 270, width: 800, verticalAlign: 'top' }}>
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
            pageSize={25} // number of rows per page
            style={{ height: '300px', width: '786px' }} // set height of the DataGrid
            initialState={{
              columns: {
                columnVisibilityModel: {
                  data_source_id: false,
                  table_name: false,
                  rec_id: false,
                  fullname: false,
                  shortname: false,
                  external_ds: false,
                  descr: false,
                },
              },
            }}             
          />
      </td>
      <td style={{ height: 270, width: 100, verticalAlign: 'top' }}>
      &nbsp;<IconButton onClick={()=>handleClickAdd()} disabled={(lastRecID===-1)||(props.rec_id==='-1000000')} color="primary" size="small" title="Добавить связь с классификатором">
        <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleClickEdit()} disabled={noRecords} color="primary" size="small" title="Редактировать связь с классификатором">
        <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleClickDelete()} disabled={noRecords} color="primary" size="small" title="Удалить связь с классификатором">
        <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleOpenDSInfo()} disabled={noRecords} color="primary" size="small" title="Информация по классификатору">
        <SvgIcon fontSize="small" component={InfoLightIcon} inheritViewBox /></IconButton>
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
        </div>
      </Box>
        </td>
      </tr>
      </tbody></table>

      <Dialog open={open} onClose={handleCloseNo} fullWidth={false} maxWidth="800px">
  <DialogTitle>Связь с классификатором</DialogTitle>
  <DialogContent style={{height:'480px', width: '700px'}}>
    <DialogContentText>
      Задать связь с классификатором
    </DialogContentText>
    <p></p>
    <p></p>
    <Autocomplete
      size="small"
      disabled={valueId}  
      fullWidth
      id="table-name-autocomplete"
      options={Object.entries(table_names)}
      getOptionLabel={(option) => option[1]} // используем второй элемент пары [ключ, значение]
      onChange={(event, newValue) => {
        setValueTableName(newValue ? newValue[0] : ""); // в качестве значения используем ключ
      }}
      value={Object.entries(table_names).find(([key, value]) => key === valueTableName) || null}
      renderInput={(params) => <TextField {...params} label="Классификатор" size="small" required />}
    />
    <p></p>
    <p></p>
      <Autocomplete
        size="small"
        disabled={valueId}  
        id="table-ref-autocomplete"
        options={tableRef}
        getOptionLabel={(option) => option.name_rus}
        value={tableRef.find((item) => item.id === valueRecId) || null} // Ищем выбранный объект по коду
        //style={{ width: '100%' }} 
        fullWidth
        onChange={(event, newValue) => {
          setValueRecID(newValue ? newValue.id : null); // Обновляем значение при изменении
        }}
        renderInput={(params) => <TextField {...params} label="Запись классификатора" variant="outlined" size="small" required/>}
        renderOption={(props, option) => (
          <li {...props}>
            <Tooltip title={option.name_eng}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <span>{option.name_rus}</span>
              </div>
            </Tooltip>
          </li>
        )}
      />
    <p></p>
    <TextField
      variant="outlined"
      margin="dense"
      id="title"
      label="Обозначение" required
      value={valueTitleSrc || ''}
      fullWidth
      size="small"
      onChange={e => setValueTitleSrc(e.target.value)}
    />
    <p></p>
    <TextField
      variant="outlined"
      id="name_src"
      label="Название"
      value={valueNameSrc || ''}
      fullWidth
      size="small"
      onChange={e => setValueNameSrc(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button variant="outlined" onClick={handleCloseNo}>Отмена</Button>
    <Button variant="outlined" disabled={!valueTitleSrc||!valueTableName} onClick={handleCloseYes}>Сохранить</Button>
  </DialogActions>
</Dialog>

      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              В таблице "{table_names['data_source_class']}" предложена к удалению следующая запись:<p></p><b>{valueTitleSrc}</b>; Код в БД = <b>{valueId}</b><p></p>
              Вы желаете удалить указанную запись?        
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseConfirmDelete} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleCloseConfirmDeleteYes} >Да</Button>
      </DialogActions>

      </Dialog>
      <Dialog open={openDSInfo} onClose={handleCloseDSInfo} fullWidth={true}>
      <DialogTitle>
          Источник данных <b>{valueTitle}</b>
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              Код: <b>{valueDataSourceId}</b><p></p>
              Обозначение: <b>{valueTitle}</b><p></p>
              Краткое название: <b>{valueShortName}</b><p></p> 
              Полное название: <b>{valueFullName}</b><p></p> 
              Источник данных: <b>{valueExternalDS === 'false' ? 'Целевая БД' : 'Внешний источник' }</b><p></p> 
              Комментарий: <b>{valueDescr}</b><p></p> 
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseDSInfo} autoFocus>Закрыть</Button>
      </DialogActions>
      </Dialog>
      </form>
    </div>
    )
}
 export  { DataTableDataSourceClassRef }
