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
import { ReactComponent as InfoLightIcon } from "./../icons/info.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { table_names } from './sda_types';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastAddedId = 0;
var lastRecID = 0;
var lastID = 0;

function DataTableActionCriterion(props)  {
  const [open, setOpen] = React.useState(false);

  const handleClickEdit = () => {
    setOpen(true);
  };

  const handleClickAdd = () => {
    setValueActionCriterionId(null);
    setValueActionId(null);
    //setValueID(null);
    //setValueDataSourceId(null);
/*     setValueRecID(props.rec_id);
    setValueTableName(props.table_name);
    setValueTitleSrc("");
    setValueNameSrc(""); */
    setOpen(true);
  };

  const handleCloseYes = () => {
    setOpen(false);
    saveRec();
  };

  const handleCloseNo = () => {
    setOpen(false);

    console.log(lastID);  
    //setValueId(lastID);
    var filteredData = tableDataSrcClass.filter(function(element) {
      return element.id === lastID;
    });
    if (filteredData.length > 0) {
      setValueActionCriterionId(lastID);
      setValueTitleSrc(filteredData[0].title_src);
      setValueNameSrc(filteredData[0].name_src);  
      //setValueDataSourceId(filteredData[0].data_source_id);
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

  const [tableDataSrcClass, setTableDataSrcClass] = useState([]);
  const [tableAction, setTableAction] = useState([]);
  useEffect(() => {
    lastRecID = props.rec_id||0;
    if (props.rec_id==='') {
      lastRecID = -1;
    }
    
    setlastSrcClassID(0);
    setIsLoading(true);
    console.log(`/action_criterion?criterion_id=${lastRecID}`);
    //console.log( lastRecID );
    fetch(`/action_criterion?criterion_id=${lastRecID}`)
      .then((data) => data.json())
      .then((data) => setTableDataSrcClass(data));
    setlastSrcClassID(0);
    setIsLoading(false);
    }, [props.table_name, props.rec_id])


  useEffect(() => {
    fetch(`/action`)
      .then((data) => data.json())
      .then((data) => setTableAction(data));
  }, [])

const columns_src = [
  { field: 'id', headerName: 'Код', width: 60 },
  { field: 'action_id', headerName: 'Код действия', width: 100 },
  { field: 'criterion_id', headerName: 'Код критерия', width: 100 },
  { field: 'title', headerName: 'Обозначение', width: 200 },
  { field: 'name_rus', headerName: 'Название (рус)', width: 200 },
  { field: 'name_eng', headerName: 'Название (англ)', width: 180, hideable: false },
  { field: 'descr_rus', headerName: 'Описание (рус)', width: 250 },
  { field: 'descr_eng', headerName: 'Описание (англ)', width: 250 },
]
/* [{"id":30576,"action_id":4,"criterion_id":30,"name_rus":"ограничение потребления важнейших продуктов","name_eng":"limiting the consumption of essential food","descr_rus":
"Ограничения в отношении пищевых продуктов, молока и питьевой воды должны применяться  в период  до проведения отбора проб и анализа пищевых продуктов, молока и питьевой воды. 
Такие ограничения применяются до тех пор, пока имеются в наличии заменители пищевых продуктов, молока и питьевой воды или другие альтернативные варианты, с целью обеспечения 
того, чтобы они не приводили к острому недоеданию, обезвоживанию или другим тяжелым последствиям для здоровья.","descr_eng":"Restrictions on food, milk 
and drinking water are to be applied before sampling and analysis of food, milk and drinking water are carried out. Such restrictions apply as long as replacements of food, 
milk and drinking water or other alternatives are available to ensure they would not result in severe malnutrition, dehydration or other severe health impacts."}]
 */
//const [valueId, setValueID] = React.useState();
//const [valueDataSourceId, setValueDataSourceId] = React.useState();
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
const [valueActionCriterionId,  setValueActionCriterionId] = React.useState();
const [valueActionId,  setValueActionId] = React.useState();

useEffect(() => {
  if ((!isLoading) && (tableDataSrcClass) && (tableDataSrcClass.length))
  {
    setSelectionModel([tableDataSrcClass[0].id]); //выбрать первую строку при перегрузке таблицы
    lastID = tableDataSrcClass[0].id;
    setValueActionCriterionId(tableDataSrcClass[0].id);   //обновить переменные
    //setValueDataSourceId(tableDataSrcClass[0].data_source_id);
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
    const response = await fetch(`/action_criterion?criterion_id=${lastRecID}`);
     if (!response.ok) {
      alertText =  'Ошибка при обновлении данных';
      alertSeverity = "false";
      setOpenAlert(true);  
      throw new Error(`Error! status: ${response.status}`);
    }  
    const result = await response.json();
    setlastSrcClassID(0);
    setTableDataSrcClass(result);
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
    id: valueActionCriterionId,
    title: valueTitle,
  });
  setIsLoading(true);
  try {
    const response = await fetch('/action_criterion/'+valueActionCriterionId, {
      
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
    action_criterion_id: valueActionCriterionId,
    action_id: valueActionId,

  });
  if (!valueActionCriterionId) { //если значение не задано - добавить запись
    addRec();
    return;
  }
  setIsLoading(true);
  try {
    const response = await fetch('/action_criterion/'+valueActionCriterionId, {
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
    action_id: valueActionId,
    criterion_id: props.rec_id     
  });
  setIsLoading(true);
  try {
    const response = await fetch('/action_criterion/', {
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
      setValueActionCriterionId(lastAddedId);
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
  setOpenAlert(false);/* 
  setValueID(params.row.id);
  lastID = params.row.id;
  setValueDataSourceId(params.row.data_source_id);
  setValueTableName(params.row.table_name);
  setValueRecID(params.row.rec_id);
  setValueTitle(params.row.title);
  setValueTitleSrc(params.row.title_src);
  setValueNameSrc(params.row.name_src);
  setValueShortName(params.row.shortname);  
  setValueFullName(params.row.fullname);  
  setValueDescr(params.row.descr);  
  setValueExternalDS(params.row.external_ds); */  
  setValueActionCriterionId(params.row.id);
  setValueActionId(params.row.action_id);

  console.log(params.row.id);
  console.log(params.row.action_id);
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
      /></td>
      <td style={{ height: 270, width: 100, verticalAlign: 'top' }}>
      &nbsp;<IconButton onClick={()=>handleClickAdd()} disabled={(lastRecID===-1)||(props.rec_id==='-1000000')} color="primary" size="small" title="Добавить связь с источником данных">
        <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleClickEdit()} disabled={noRecords} color="primary" size="small" title="Редактировать связь с источником данных">
        <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleClickDelete()} disabled={noRecords} color="primary" size="small" title="Удалить связь с источником данных">
        <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleOpenDSInfo()} disabled={noRecords} color="primary" size="small" title="Информация по источнику данных">
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
      <DialogTitle>Действие</DialogTitle>  
        <DialogContent style={{height:'280px', width: '700px'}}>
          <DialogContentText>
            Задать действие
          </DialogContentText>
        <p></p>        
        <FormControl fullWidth>
            <InputLabel id="demo-controlled-open-select-label" required >Действие</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              value={valueActionId  || "" }
              label="Действие"
              defaultValue={true}
              fullWidth
              onChange={e => setValueActionId(e.target.value)}
            >
            {tableAction?.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title ?? option.id}
                  </MenuItem>
                );
            })}
            </Select>
          </FormControl>
          </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseNo}>Отмена</Button>
          <Button variant="outlined" disabled={! valueActionId===null } onClick={handleCloseYes}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              В таблице "{table_names['data_source_class']}" предложена к удалению следующая запись:<p></p><b>{valueTitleSrc}</b>; Код в БД = <b>{valueActionCriterionId}</b><p></p>
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
              Код: <b>{valueActionCriterionId}</b><p></p>
              Обозначение: <b>{valueTitle}</b><p></p>
              Название (рус.яз): <b>{valueShortName}</b><p></p> 
              Название (англ.яз): <b>{valueFullName}</b><p></p> 
              Комментарий (рус.яз): <b>{valueDescr}</b><p></p> 
              Комментарий (англ.яз): <b>{valueDescr}</b><p></p> 
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
 export  { DataTableActionCriterion }
