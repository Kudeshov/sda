import React,  { useState, useEffect } from 'react'
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { table_names } from './table_names';
import { Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import Divider from '@mui/material/Divider';

function DataTableDataSourceClassRef(props)  {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const [open, setOpen] = React.useState(false);
  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [addedId, setAddedId] = useState(null);
  const [originalTableData, setOriginalTableData] = useState([]);
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
    { field: 'ref_title', headerName: 'Запись классификатора', width: 170 },
    /* { field: 'table_name_verbose', headerName: 'Имя классификатора', width: 230 },
   */  { field: 'title_src', headerName: 'Обозначение', width: 150, hideable: false },
    { field: 'name_src', headerName: 'Название', width: 150 },
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
      setOriginalTableData(updatedData);  // обновляем исходные данные
      //setTableData(updatedData);  // обновляем отображаемые данные
    });    
    setlastSrcClassID(0);
    setIsLoading(false);
  }, [props.rec_id])

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
const [tableRef, setTableRef] = useState([]);
const [selectedClassifier, setSelectedClassifier] = useState(null);  

useEffect(() => {

  console.log('selectedClassifier', `/ref_table?table_name=${selectedClassifier}`);
  if(selectedClassifier) {
    setValueTableName(selectedClassifier[0]);
     fetch(`/ref_table?table_name=${selectedClassifier[0]}`)
    .then(response => response.json())
    .then(data => setTableRef(data))
    .catch(error => console.log(error)); 
  }  
}, [selectedClassifier]);

useEffect(() => {
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
    setOriginalTableData(updatedData);  // обновляем исходные данные

    //setTableData(updatedData);
  } catch (err) {
    setAlertText('Ошибка при обновлении данных');
    setAlertSeverity('error')
    setOpenAlert(true); 
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
const delRec = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`/data_source_class/${valueId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    setAlertSeverity('success');
    setAlertText(await response.text());
    // Переключаемся на первую запись после удаления
    if (tableData[0]) {
      setValueID(tableData[0].id);
      setAddedId(tableData[0].id);
    }      
  } catch (err) {
    setAlertSeverity('error');
    setAlertText(err.message);
  } finally {
    setIsLoading(false);
    setOpenAlert(true);
    reloadDataSrcClass(); 
  }
};

const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    const data = {
      id: valueId,
      data_source_id: valueId ? valueDataSourceId : props.rec_id,
      table_name: selectedClassifier[0],
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

  const CustomFooter = props => {
    return (
      <span>
        <Divider />
        <GridToolbarContainer 
          style={{ 
            justifyContent: 'flex-end', 
            paddingRight: '20px', // Отступ справа
            alignItems: 'center', 
            height: '56px' // Фиксированная высота
        }}
      >
        Всего строк: {tableData.length}
      </GridToolbarContainer>
    </span>
    );
  };  

const handleRowClick = (params) => {
  setOpenAlert(false);
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



const [isFirstLoad, setIsFirstLoad] = useState(true);
 
// Инициализация selectedClassifier
useEffect(() => {
  if (optionsRefs.length > 0 && isFirstLoad) {
    const firstClassifier = optionsRefs[0];
    setSelectedClassifier(firstClassifier);
    setIsFirstLoad(false);
  }
}, [optionsRefs, isFirstLoad]);

// Фильтрация данных
useEffect(() => {
  if (selectedClassifier) {
    const filteredData = originalTableData.filter(row => row.table_name === selectedClassifier[0]);
    setTableData(filteredData);
  } else if (!isFirstLoad) {
    reloadDataSrcClass();
  }
}, [selectedClassifier, originalTableData, isFirstLoad]);

const formRef = React.useRef();
  return (
    <div style={{ height: 270, width: 890 }}>
      <form ref={formRef}>
      <Box sx={{ border: '0px solid purple', height: 250, width: 890, marginTop: 1 }}>
        <Grid container spacing={0}>
          <Grid item sx={{ width: 785, border: '0px solid black', ml: 0 }}>
            <Grid container direction="column" spacing={1.5}>
              <Grid item container direction="row" justifyContent="center" alignItems="center">
                <Typography sx={{ width: 'auto', display: 'flex', marginTop: 1.4, marginBottom: 0 }}>Классификаторы</Typography>
                <Autocomplete
                  sx={{ flexGrow: 1, marginLeft: 2, marginTop: 1.4 }} 
                  options={optionsRefs}
                  size="small"
                  getOptionLabel={(option) => option[1]}
                  value={selectedClassifier}
                  onChange={(event, newValue) => {
                    setSelectedClassifier(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Выбрать классификатор" fullWidth />}
                  disableClearable 
                />
              </Grid>
              <Grid item>
                <DataGrid
		              components={{Footer: CustomFooter }}
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
                  pageSize={tableData.length}
                  paginationMode="server"
                  hideFooterPagination
                  rows={tableData}
                  disableMultipleSelection={true}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick} {...tableData} 
                  hideFooterSelectedRowCount={true}
                  selectionModel={selectionModel}
                  /* paginationModel={paginationModel} */
                  onSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  loading={isLoading}        
                  style={{ height: '270px', width: '785px' }} // set height of the DataGrid
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
            </Grid>
          </Grid>

          <Grid item sx={{width: 45, border: '0px solid green', ml: 1 }}> 
{/*             <Box sx={{ border: '0px solid purple', display: 'flex', flexDirection: 'column', gap: 0.1, alignItems: 'center', justifyContent: 'center' }}>
              <IconButton onClick={handleClickAdd} disabled={!props.rec_id} color="primary" size="small" title="Добавить связь с классификатором">
                <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox />
              </IconButton>
              <IconButton onClick={handleClickEdit} disabled={!props.rec_id||noRecords} color="primary" size="small" title="Редактировать связь с классификатором">
                <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox />
              </IconButton>
              <IconButton onClick={handleClickDelete} disabled={!props.rec_id||noRecords} color="primary" size="small" title="Удалить связь с классификатором">
                <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox />
              </IconButton>
            </Box> */}
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
            value={selectedClassifier} // Устанавливаем значение на основе выбранного классификатора
            disabled={true} // Делаем поле неизменяемым
            //value={optionsRefs.find(([key, value]) => key === selectedClassifier) || null}  
            renderInput={(params) => <TextField {...params} variant="outlined" label="Классификатор" size="small" required />}
          />          
          <Autocomplete
            size="small"
            //disabled={!valueTableName}
            disabled={valueId !== null || !selectedClassifier}
            //disabled={!selectedClassifier}
            id="table-ref-autocomplete"
            options={tableRef}
            getOptionLabel={(option) => `${option.name_rus} (${option.title})`} // Обновлено
            value={tableRef.find((item) => item.id === valueRecId) || null}
            onChange={(event, newValue) => {
              setValueRecID(newValue ? newValue.id : null);
            }}
            renderInput={(params) => <TextField {...params} variant="outlined" label="Запись классификатора" size="small" required />}
            renderOption={(props, option) => (
              <li {...props}>
                <Tooltip title={option.name_eng}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <span>{`${option.name_rus} (${option.title})`}</span> {/* Обновлено */}
                  </div>
                </Tooltip>
              </li>
            )}
          />
          <TextField
            variant="outlined"
            disabled={!selectedClassifier}
            //disabled={!valueRecId}
            id="title"
            label="Обозначение" required
            value={valueTitleSrc || ''}
            fullWidth
            size="small"
            onChange={e => setValueTitleSrc(e.target.value)}
          />
          <TextField
            variant="outlined"
            disabled={!selectedClassifier}
            //disabled={!valueRecId}
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
        <Button variant="outlined" disabled={!valueTitleSrc||!selectedClassifier} onClick={handleCloseYes}>Сохранить</Button>
        <Button variant="outlined" onClick={handleCloseNo}>Отмена</Button>
      </DialogActions>
    </Dialog>

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
    </form>
  </div>
  )
}
export  { DataTableDataSourceClassRef }
