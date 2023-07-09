import React,  { useState, useEffect } from 'react'
import { DataGrid, useGridApiRef, ruRU } from '@mui/x-data-grid'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
//import { ReactComponent as InfoLightIcon } from "./../icons/info.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { table_names } from './table_names';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import { Typography } from '@mui/material';

function DataTableDataSourceClassRef(props)  {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const [open, setOpen] = React.useState(false);
  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  // Scrolling and positionning
  const [addedId, setAddedId] = useState(null);
  const [tableData, setTableData] = useState([]); 
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);   
  const {paginationModel, setPaginationModel, scrollToIndexRef} = useGridScrollPagination(apiRef, tableData, setRowSelectionModel);
  const [clickedRowId, setClickedRowId] = useState(null);

  useEffect(() => {
    if (addedId !== null){  
        scrollToIndexRef.current = addedId;
        setAddedId(null);
        setRowSelectionModel([addedId]);
    }
  }, [addedId, scrollToIndexRef]);

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
    setValueID(clickedRowId);
  };

  const columns_src = [
    { field: 'id', headerName: 'Код', width: 60 },
    { field: 'data_source_id', headerName: 'Код источника данных', width: 100 },
    { field: 'table_name_verbose', headerName: 'Имя классификатора', width: 230 },
    { field: 'title_src', headerName: 'Обозначение', width: 150, hideable: false },
    { field: 'name_src', headerName: 'Название', width: 150 },
    { field: 'ref_title', headerName: 'Запись классификатора', width: 170 },
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
      setTableData(updatedData);
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
const [valueTitleSrc, setValueTitleSrc] = React.useState();
const [valueNameSrc, setValueNameSrc] = React.useState();

/* const [valueTitle, setValueTitle] = React.useState();
const [valueShortName, setValueShortName] = React.useState();
const [valueFullName, setValueFullName] = React.useState();
const [valueDescr, setValueDescr] = React.useState();
const [valueExternalDS, setValueExternalDS] = React.useState(); */

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
/*   if ((!isLoading) && (tableDataSrcClass) && (tableDataSrcClass.length))
  {
     setSelectionModel([tableDataSrcClass[0].id]); //выбрать первую строку при перегрузке таблицы
    lastID = tableDataSrcClass[0].id;
    setValueID(tableDataSrcClass[0].id);   //обновить переменные
    setValueDataSourceId(tableDataSrcClass[0].data_source_id);
    setValueTableName(tableDataSrcClass[0].table_name);
    setValueRecID(tableDataSrcClass[0].rec_id);
    setValueTitleSrc(tableDataSrcClass[0].title_src);
    setValueNameSrc(tableDataSrcClass[0].name_src);

     setValueTitle(tableDataSrcClass[0].title);    
    setValueShortName(tableDataSrcClass[0].shortname);
    setValueFullName(tableDataSrcClass[0].fullname);
    setValueDescr(tableDataSrcClass[0].descr);
    setValueExternalDS(tableDataSrcClass[0].external_ds);      
  } */
  if ((!isLoading) && (tableData) )
  {
    //обновить блокировку кнопок "Редактировать" и "Удалить" в зависимости от наличия записей в таблице
    setNoRecords(tableData.length===0);
  }
}, [isLoading, tableData, lastSrcClassID]); 

const reloadDataSrcClass = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`/data_source_class_ref/${props.rec_id||0}`);
    if (!response.ok) {
      setAlertText('Ошибка при обновлении данных');
      setAlertSeverity('error')
      setOpenAlert(true);  
      throw new Error(`Error! status: ${response.status}`);
    }  
    const data = await response.json();
    const updatedData = data.map(item => ({
      ...item,
      table_name_verbose: table_names[item.table_name] || 'Неизвестно'
    }));
    setlastSrcClassID(0);
    setTableData(updatedData);
  } catch (err) {
  } finally {
    setIsLoading(false);
  }
};

const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false); 
/*
const [openDSInfo, setOpenDSInfo] = React.useState(false); 
 const handleOpenDSInfo = () => {
  setOpenDSInfo(true);
};

const handleCloseDSInfo = () => {
  setOpenDSInfo(false);
};
*/
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
      setAlertSeverity('error');
      setAlertText(await response.text());
      setOpenAlert(true);          
    }
    else
    {
      setAlertSeverity('success');
      setAlertText(await response.text());
      setOpenAlert(true);  
    }
  } catch (err) {
  } finally {
    setIsLoading(false);
    // Переключаемся на первую запись после удаления
    if (tableData[0]) {
      setValueID(tableData[0].id);
      setAddedId(tableData[0].id);
    }     
    reloadDataSrcClass();
  }
};  

const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    const data = {
      id: valueId,
      data_source_id: valueId ? valueDataSourceId : props.rec_id,
      table_name: valueTableName,
      rec_id: valueRecId,
      title_src: valueTitleSrc,
      name_src: valueNameSrc         
    };

    setIsLoading(true);

    const url = '/data_source_class/' + (valueId ? valueId : '');
    const method = valueId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'Application/json',
          Accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (method === 'POST') {
        const { id } = await response.json();
        setAlertText(`Добавлена запись с кодом ${id}`);
        setAddedId(id);
        setValueID(id);
      } else {
        setAlertText(await response.text());
      }

      setAlertSeverity('success');

    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);
      setSelectionModel([clickedRowId]);
      setValueID(selectionModel[0]);
    } finally {
      setIsLoading(false);
      setOpenAlert(true);
      reloadDataSrcClass();  
    }
  }
};

const handleRowClick = (params) => {
  setOpenAlert(false);
  console.log('click', params.row.table_name, params.row.id);
  setValueID(params.row.id);
  setClickedRowId(params.row.id);
  setRowSelectionModel([params.row.id]);
}; 

const setValues = (row) => {
  setValueDataSourceId(row.data_source_id);
  setValueTableName(row.table_name);
  setValueRecID(row.rec_id);
  setValueTitleSrc(row.title_src);
  setValueNameSrc(row.name_src);
};

useEffect(() => {
  const rowData = tableData.find(row => row.id === valueId);
  if (rowData) {
    setValues(rowData);
  }
}, [tableData, valueId]);

const [noRecords, setNoRecords] = useState(true);

const allowedRefs = [
  'dose_ratio',
  'irradiation',
  'organ',
  'integral_period',
  'subst_form',
  'chem_comp_gr',
  'people_class',
  'aerosol_sol',
  'aerosol_amad',
  'let_level',
  'exp_scenario',
  'agegroup',
];

const optionsRefs = Object.entries(table_names)
  .filter(([key, value]) => allowedRefs.includes(key));

const formRef = React.useRef();
  return (
    <div style={{ height: 270, width: 886 }}>
      <form ref={formRef}>
      <Box sx={{ border: '0px solid purple', height: 250, width: 886 }}>
        <Grid container spacing={1}>
          <Grid item sx={{width: 780, border: '0px solid black', ml: 0 }}>
            <DataGrid
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor: ((valueId || '')==='') ? "transparent" : "rgba(0, 0, 0, 0.11)",
                },
                "& .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
              }}          
              localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
              rowHeight={25}
              apiRef={apiRef}
              columns={columns_src}
              rows={tableData}
              disableMultipleSelection={true}
              onPaginationModelChange={setPaginationModel}
              onRowClick={handleRowClick} {...tableData} 
              hideFooterSelectedRowCount={true}
              selectionModel={selectionModel}
              paginationModel={paginationModel}
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
              loading={isLoading}        
              pageSize={25} // number of rows per page
              style={{ height: '270px', width: '786px' }} // set height of the DataGrid
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
          </Grid>

          <Grid item sx={{width: 45, border: '0px solid green', ml: 1 }}> 
            <Box sx={{ border: '0px solid purple', display: 'flex', flexDirection: 'column', gap: 0.1, alignItems: 'center', justifyContent: 'center' }}>
              <IconButton onClick={handleClickAdd} disabled={false}/* {!props.rec_id}  */color="primary" size="small" title="Добавить связь с классификатором">
                <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox />
              </IconButton>
              <IconButton onClick={handleClickEdit} disabled={noRecords} color="primary" size="small" title="Редактировать связь с классификатором">
                <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox />
              </IconButton>
              <IconButton onClick={handleClickDelete} disabled={noRecords} color="primary" size="small" title="Удалить связь с классификатором">
                <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox />
              </IconButton>
{/*               <IconButton onClick={handleOpenDSInfo} disabled={noRecords} color="primary" size="small" title="Информация по классификатору">
                <SvgIcon fontSize="small" component={InfoLightIcon} inheritViewBox />
              </IconButton> */}
            </Box>
          </Grid>
        </Grid>

        <Collapse in={openAlert}>
          <Alert
            style={{ width: '786px' }}
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
          >
            {alertText}
          </Alert>
        </Collapse>
    </Box>        

    <Dialog open={open} onClose={handleCloseNo} fullWidth={false} maxWidth="800px">
      <DialogTitle>Связь с классификатором</DialogTitle>
      <DialogContent style={{height:'480px', width: '700px'}}>
        <Box sx={{ mt: 2, border: '0px solid red', padding: 0, display: 'flex', flexDirection: 'column', gap: 1.5}}>
          <Autocomplete
            size="small"
            id="table-name-autocomplete"
            options={optionsRefs} 
            getOptionLabel={(option) => option[1]}
            onChange={(event, newValue) => {
              setValueTableName(newValue ? newValue[0] : "");
            }}
            value={optionsRefs.find(([key, value]) => key === valueTableName) || null}
            renderInput={(params) => <TextField {...params} variant="outlined" label="Классификатор" size="small" required />}
          />
          <Autocomplete
            size="small"
            disabled={!valueTableName}
            id="table-ref-autocomplete"
            options={tableRef}
            getOptionLabel={(option) => option.name_rus}
            value={tableRef.find((item) => item.id === valueRecId) || null}
            onChange={(event, newValue) => {
              setValueRecID(newValue ? newValue.id : null);
            }}
            renderInput={(params) => <TextField {...params} variant="outlined" label="Запись классификатора" size="small" required/>}
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
          <TextField
            variant="outlined"
            disabled={!valueRecId}
            id="title"
            label="Обозначение" required
            value={valueTitleSrc || ''}
            fullWidth
            size="small"
            onChange={e => setValueTitleSrc(e.target.value)}
          />
          <TextField
            variant="outlined"
            disabled={!valueRecId}
            id="name_src"
            label="Название"
            value={valueNameSrc || ''}
            fullWidth
            size="small"
            onChange={e => setValueNameSrc(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" disabled={!valueTitleSrc||!valueTableName} onClick={handleCloseYes}>Сохранить</Button>
        <Button variant="outlined" onClick={handleCloseNo}>Отмена</Button>
      </DialogActions>
    </Dialog>

{/*       <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} fullWidth={true}>
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
      </Dialog> */}

      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} fullWidth={true}>
        <DialogTitle>
          Внимание
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{marginBottom: "1em"}}>
            В таблице "{table_names['data_source_class']}" предложена к удалению следующая запись:
          </Typography>
          <Typography variant="body1" style={{fontWeight: "bold", marginBottom: "1em"}}>
            {valueTitleSrc}; Код в БД = {valueId}
          </Typography>
          <Typography variant="body1">
            Вы желаете удалить указанную запись?        
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseConfirmDeleteYes}>Да</Button>
          <Button variant="outlined" onClick={handleCloseConfirmDelete} autoFocus>Нет</Button>
        </DialogActions>
      </Dialog>      

{/*         <Dialog open={openDSInfo} onClose={handleCloseDSInfo} fullWidth={true}>
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
        </Dialog> */}
      </form>
    </div>
    )
}
 export  { DataTableDataSourceClassRef }
