import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  GridToolbarDensitySelector, 
  GridToolbarExport,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';


import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { DataTableIsotopeDecay } from './dt_comp_isotope_decay';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { table_names } from './table_names';
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import Backdrop from '@mui/material/Backdrop';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import { DataTableDataSourceClass } from './dt_data_source_class';

const DataTableIsotope = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling

  // Поля БД
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();

  //Специфика нуклидов
  const [valueNIndex, setValueNIndex] = React.useState();
  const [valueNIndexInitial, setValueNIndexInitial] = React.useState();
  const [valueHalfLifeValue, setValueHalfLifeValue] = React.useState();
  const [valueHalfLifeValueInitial, setValueHalfLifeValueInitial] = React.useState();
  const [valueHalfLifePeriod, setValueHalfLifePeriod] = React.useState();
  const [valueHalfLifePeriodInitial, setValueHalfLifePeriodInitial] = React.useState();
  const [valueDecayConst, setValueDecayConst] = React.useState();
  const [valueDecayConstInitial, setValueDecayConstInitial] = React.useState();

  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [currentId, setCurrentId] = useState(null);  

  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [valueNuclideId, setValueNuclideId] = React.useState();
  const [valueNuclideIdInitial, setValueNuclideIdInitial] = React.useState();
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState(false);  

  const [addedId, setAddedId] = useState(null);  

  /* const [isEmpty, setIsEmpty] = useState([false]); // я думаю это ненужно
   useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueNameRus)&&(''===valueNameEng)&&(''===valueDescrEng)&&(''===valueDescrRus));
    }, [ valueTitle, valueNameRus, valueNameEng, valueDescrEng, valueDescrRus, ]); 
     */
      
  useEffect(() => {
    setEditStarted((valueTitleInitial!==valueTitle)||(valueNIndexInitial!==valueNIndex)||(valueHalfLifeValueInitial!==valueHalfLifeValue)
      ||(valueHalfLifePeriodInitial!==valueHalfLifePeriod)||(valueDecayConstInitial!==valueDecayConst)||(valueNuclideIdInitial!==valueNuclideId));

    }, [valueTitleInitial, valueTitle, valueNIndexInitial, valueNIndex, valueHalfLifeValueInitial, valueHalfLifeValue, 
        valueHalfLifePeriodInitial, valueHalfLifePeriod, valueDecayConstInitial, valueDecayConst, valueNuclideIdInitial, valueNuclideId]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length) && tableData[0].id>-1) {
      if (typeof currentId !== 'number') 
      {
        console.log('Выбрано ', tableData[0].id);
        setRowSelectionModel([tableData[0].id]);
        setCurrentId(tableData[0].id);
        setValueID(tableData[0].id);
      }
    }
    }, [ isLoading, tableData, currentId] );

  const [prevRowSelectionModel, setPrevRowSelectionModel] = useState([]);
  const [clickedRowId, setClickedRowId] = useState(null);

   useEffect(() => {
    // Если редактирование начато, не меняем выбранную строку
    if (editStarted) {
      setRowSelectionModel(prevRowSelectionModel);
    } else {
      // Здесь сохраняем предыдущую выбранную строку
      setPrevRowSelectionModel(rowSelectionModel);
    }
  }, [rowSelectionModel, prevRowSelectionModel, editStarted]);    

  const handleRowClick = (params) => {

    console.log('handleRowClick', params.row.id, valueId);
    if (params.row.id === valueId  ) {
      // Если данные не изменились, просто выходим из функции
      return;
    }
    setOpenAlert(false);

    //console.log('editStarted isEmpty', editStarted, isEmpty);
    //if (editStarted&&(!isEmpty))
    if (editStarted)
    {
      setClickedRowId(params.row.id);
      setDialogType('save');
    } 
    else 
    {
      setValueID(params.row.id);
    }
  }; 

  const inputRef = React.useRef();

  const handleClearClick = (params) => {
    if (editStarted/* &&(!isEmpty) */) {
      setDialogType('save');
    } else {
      setValueID(``);
      setValueTitle(``);
      setValueNIndex(``);
      setValueHalfLifeValue(``);
      setValueDecayConst(``);
      setValueHalfLifePeriod(`` );
      setValueNuclideId(`` );
      // Даем фокус TextField после обновления состояния
      inputRef.current.focus();
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data)); 
  }, [props.table_name])

  const [tableNuclide, setTableNuclide] = useState([]); 

  // Получаем текущее выбранное значение для радиоизотопа
  const currentNuclide = tableNuclide.find((option) => option.id === valueNuclideId);

  // Используем хук эффекта для обновления поля Обозначение при изменении радиоизотопа или индекса
  useEffect(() => {
    //if (valueId === '') { // проверяем, пустое ли поле Код
      const nuclideTitle = currentNuclide ? currentNuclide.title : ''; // проверяем, выбран ли радиоизотоп
      const indexTitle = valueNIndex ? valueNIndex : ''; // проверяем, выбран ли радиоизотоп
      setValueTitle(nuclideTitle + indexTitle); // обновляем поле Обозначение
    //}
  }, [valueId, currentNuclide, valueNIndex]);   

  useEffect(() => {
    fetch(`/nuclide`)
      .then((data) => data.json())
      .then((data) => setTableNuclide(data));
  }, [])

  const valuesMbae = [
    { title: 'n', id: 'n' },
    { title: 'm', id: 'm' }, 
    { title: 'd', id: 'd' },
    { title: 'y', id: 'y' },
    { title: 's', id: 's' },
    { title: 'us', id: 'us' },
    { title: 'ms', id: 'ms' },
    { title: 'h', id: 'h' } ];
const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    const data = {
      id: valueId,
      title: valueTitle,
      nuclide_id: valueNuclideId,     
      n_index: valueNIndex,
      half_life_value: valueHalfLifeValue,
      half_life_period: valueHalfLifePeriod,
      decayconst: valueDecayConst   
    };
    setIsLoading(true);
    
    const url = `/${props.table_name}/` + (valueId ? valueId : '');
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
      
      // Проверяем тип контента
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      let responseData;
      
      // Обрабатываем ответ в зависимости от типа контента
      if (isJson) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      // Обрабатываем ответ в зависимости от статуса
      if (!response.ok) {
        throw new Error(responseData);
      }
      
      setAlertSeverity('success');
      
      // Если это POST запрос, получаем и устанавливаем новый ID
      if (method === 'POST') {
        const newId = responseData.id;
        
        if (clickedRowId===null) {
          setValueID(newId);
          setAddedId(newId);
        }
        else {
          setValueID(clickedRowId);
        }
          
        setAlertText(`Добавлена запись с кодом ${newId}`);

      } else {
        if (clickedRowId) {
          setValueID(clickedRowId);
        }
        setAlertText(responseData || 'Success');
      }
      
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);

      if (clickedRowId!==null) {
        setValueID(clickedRowId);
      }
    } finally {
      setIsLoading(false);
      setOpenAlert(true);

      await reloadData();
    }
  }
}

useEffect(() => {
  const rowData = tableData.find(row => row.id === valueId);
  if (rowData) {
    setValues(rowData);
  }
}, [tableData, valueId]);

// Функция delRec
const delRec = async () => {
  setIsLoading(true);

  try {
    const response = await fetch(`/${props.table_name}/${valueId}`, {
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

  } catch (err) {
    setAlertSeverity('error');
    setAlertText(err.message);
  } finally {
    setIsLoading(false);
    setOpenAlert(true);
    
    // Переключаемся на первую запись после удаления
    if (tableData[0]) {
      setValueID(tableData[0].id);
      setAddedId(tableData[0].id);
    } 
    reloadData();
  }
};

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////
  const reloadDataAlert =  async () => {
    setAlertSeverity('info');
    setAlertText('Данные успешно обновлены');
    try 
    {
      await reloadData();
    } catch(e)
    {
      setAlertSeverity('error');
      setAlertText('Ошибка при обновлении данных: '+e.message);      
      setOpenAlert(true);
      return;
    }
    setOpenAlert(true);        
  }

  const reloadData = async () => {
    setIsLoading(true);  // запускаем индикатор загрузки
    try {
      const response = await fetch(`/${props.table_name}/`);
  
      if (!response.ok) {
        setAlertSeverity('error');
        setAlertText(`Ошибка при обновлении данных: ${response.status}`);
        const error = response.status + ' (' + response.statusText + ')';
        throw new Error(`${error}`);
      } else {
        const result = await response.json();
        setTableData(result);
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);  // останавливаем индикатор загрузки
    }
  };

  ///////////////////////////////////////// DIALOG
  const [dialogType, setDialogType] = useState('');

  const getDialogContentText = () => {
    const allRequiredFieldsFilled = formRef.current?.checkValidity();
    switch (dialogType) {
      case 'delete':
        return (
          <>
            В таблице "{table_names[props.table_name]}" предложена к удалению следующая запись: 
            <br />
            {valueTitle}; Код в БД = {valueId}. 
            <br />
            Вы желаете удалить указанную запись?
          </>);
      case 'save':
        if (!valueId) { // если это новая запись
          if (allRequiredFieldsFilled) {
            return `Создана новая запись, сохранить?`;
          } else {
            return (
              <>
                Не заданы обязательные поля, запись не будет создана.
                <br />
                Перейти без сохранения изменений?
              </>
            );
          }
        } else { // если это редактируемая запись
          if (allRequiredFieldsFilled) {
            return `В запись внесены изменения, сохранить изменения?`;
          } else {
            return (
              <>
                Не заданы обязательные поля, изменения не будут сохранены
                <br />
                Перейти без сохранения изменений?
              </>
            );            
          }
        }
      default:
        return '';
    }
  };

  const setValues = (row) => {
    setValueTitle(row.title);
    setValueNIndex(row.n_index);
    setValueHalfLifeValue(row.half_life_value);
    setValueDecayConst(row.decayconst);
    setValueHalfLifePeriod(row.half_life_period);
    setValueNuclideId(row.nuclide_id);

    setValueTitleInitial(row.title);       
    setValueNIndexInitial(row.n_index);
    setValueHalfLifeValueInitial(row.half_life_value);
    setValueDecayConstInitial(row.decayconst);
    setValueHalfLifePeriodInitial(row.half_life_period);
    setValueNuclideIdInitial(row.nuclide_id);
  };
  

  const handleCloseNo = () => {
    switch (dialogType) {
      case 'save':
        setEditStarted(false);
        setValueID(clickedRowId);
        setRowSelectionModel([clickedRowId]);
        break;
      default:
        break;
    }
    setDialogType('');
};

  const handleCloseCancel = () => {
    switch (dialogType) {
      case 'save':
        break;
      default:
        break;
    }
    setDialogType('');
  };
  
  const handleCloseYes = () => {
    switch (dialogType) {
      case 'delete':
        delRec();
        break;
      case 'save':
        saveRec(false);
        break;
      default:
        break;
    }
    
    setDialogType('');

    if (clickedRowId>0) {
      setEditStarted(false);
      setRowSelectionModel([clickedRowId]);
      const rowData = tableData.find(row => row.id === clickedRowId);
      setValues(rowData);
      setEditStarted(false);
    }
  };

  function DialogButtons() {
    const allRequiredFieldsFilled = formRef.current?.checkValidity();
  
    if (dialogType === 'save' && !allRequiredFieldsFilled) {
      return (
        <>
          <Button variant="outlined" onClick={handleCloseNo} >Да</Button>
          <Button variant="outlined" onClick={handleCloseCancel} >Отмена</Button>
        </>
      );
    } else {
      return (
        <>
          <Button variant="outlined" onClick={handleCloseYes} >Да</Button>
          <Button variant="outlined" onClick={handleCloseNo} >Нет</Button>
          {dialogType !== 'delete' && <Button variant="outlined" onClick={handleCloseCancel} >Отмена</Button>}
        </>
      );
    }
  }

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 130, hideable: false },
    { field: 'n_index', headerName: 'Индекс', width: 85 },
    { field: 'half_life_value', headerName: 'Период полураспада', width: 180 },
    { field: 'half_life_period', headerName: 'Единица измерения периода полураспада', width: 180 },
    { field: 'decayconst', headerName: 'Постоянная распада, 1/сек', width: 180 },
  ]

  const [openAlert, setOpenAlert] = React.useState(false, '');

  const handleCancelClick = () => 
  {
    console.log(rowSelectionModel);
    
    const selectedIDs = new Set(rowSelectionModel.map(Number));
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    if (selectedRowData.length)
    {
      setValueID(selectedRowData[0].id);
      setValueTitle(selectedRowData[0].title);
      setValueNIndex(selectedRowData[0].n_index);
      setValueHalfLifeValue(selectedRowData[0].half_life_value );
      setValueDecayConst(selectedRowData[0].decayconst);
      setValueHalfLifePeriod(selectedRowData[0].half_life_period);
      setValueNuclideId(selectedRowData[0].nuclide_id);

      setValueTitleInitial(selectedRowData[0].title);
      setValueNIndexInitial(selectedRowData[0].n_index);
      setValueHalfLifeValueInitial(selectedRowData[0].half_life_value );
      setValueDecayConstInitial(selectedRowData[0].decayconst);
      setValueHalfLifePeriodInitial(selectedRowData[0].half_life_period);
      setValueNuclideIdInitial(selectedRowData[0].nuclide_id);
    }
  }


  // Scrolling and positionning
  const { paginationModel, setPaginationModel, scrollToIndexRef } = useGridScrollPagination(apiRef, tableData, setRowSelectionModel);

  useEffect(() => {
    if (addedId !== null){  
        scrollToIndexRef.current = addedId;
        setAddedId(null);
        setEditStarted(false);
        setRowSelectionModel([addedId]);
    }
  }, [addedId, scrollToIndexRef]);

  function GridToolbar() {
    const handleExport = (options) =>
       apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClearClick()} disabled={editStarted} color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>{setClickedRowId(null); saveRec(true)}}  color="primary" size="small" title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
        <IconButton onClick={()=>setDialogType('delete')}  color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>reloadDataAlert(valueId)} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleExport({ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} color="primary" 
            size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
      </GridToolbarContainer>
    );
  }

  const CustomFooter = props => {
    return (
      <GridToolbarContainer style={{ justifyContent: 'flex-end' }}>
        Всего строк: {tableData.length}
      </GridToolbarContainer>
    );
  };

  const formRef = React.useRef();
  return (
    <Box sx={{ border: '0px solid purple', width: 1445, height: 650, padding: 1 }}>
      <Grid container spacing={1}>
        <Grid item sx={{width: 583, border: '0px solid green', ml: 1 }}>
          <DataGrid
            components={{ Footer: CustomFooter, Toolbar: GridToolbar }}
            apiRef={apiRef}
            hideFooterSelectedRowCount={true}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            rowHeight={25}
            /* pageSize={5} */
            rows={tableData}
            columns={columns}
            /* paginationModel={paginationModel} */
           /*  pagination={false}  */
            pageSize={tableData.length}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            hideFooterPagination
            initialState={{
              columns: {
            columnVisibilityModel: {
              //half_life_value: false,
              //decayconst: false,
              half_life_period: true,
            },
              },
            }}        
            onRowClick={handleRowClick} {...tableData}
            style={{ width: 570, height: 500, border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '4px' }}
            sx={{
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: dialogType !== ''||!(valueId >=0)  ? "transparent" : "rgba(0, 0, 0, 0.11)",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
            }}
          />

          <Collapse in={openAlert}>
            <Alert
              item sx={{width: 571}}
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
        </Grid>
        <Grid sx={{ width: 801, padding: 1 }}>
        <form ref={formRef}>
          <Grid container spacing={1.5}>
            <Grid item xs={2}>
              <TextField id="ch_id" fullWidth disabled={true} label="Код" variant="outlined" value={valueId || ''} size="small"  onChange={e => setValueID(e.target.value)}/>
            </Grid>  
            <Grid item xs={6}>
              <TextField id="ch_name" fullWidth disabled={true} label="Обозначение" required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-nuclide"
                value={tableNuclide.find((option) => option.id === valueNuclideId)||'' }
                disableClearable
                isOptionEqualToValue={(option, value) => option.id === value.id }  
                onChange={(event, newValueAC) => {setValueNuclideId(newValueAC?newValueAC.id:-1) } }
                options={tableNuclide}
                getOptionLabel={option => option?option.title:""}
                renderInput={(params) => <TextField {...params} label="Радиоизотоп" required/>}
              />
            </Grid>            
            <Grid item xs={2}>
              <TextField fullWidth inputProps={{maxLength: 1}} id="ch_n_index" size="small" label="Индекс"  variant="outlined"  value={valueNIndex || ''} onChange={e => setValueNIndex(e.target.value)} />
            </Grid>            
            <Grid item xs={9}>
              <TextField fullWidth id="ch_half_life_value" size="small" label="Период полураспада" required variant="outlined" value={valueHalfLifeValue || ''} onChange={e => setValueHalfLifeValue(e.target.value)}/>
            </Grid>            
            <Grid item xs={3}>
              <FormControl size="small" fullWidth>
              <InputLabel id="type" required>Ед. изм.</InputLabel>
                <Select fullWidth labelId="type" id="type1"  label="Ед. изм." required defaultValue={true} value={valueHalfLifePeriod  || "" } onChange={e => setValueHalfLifePeriod(e.target.value)}>
                  {valuesMbae?.map(option => {
                      return (
                        <MenuItem key={option.id} value={option.id}>
                          {option.title ?? option.id}
                        </MenuItem>
                      );
                      })}
                </Select>
              </FormControl>    
            </Grid>
{/*             <Grid item xs={3}>
	    
            </Grid>   */}          
            <Grid item xs={12}>
              <TextField fullWidth id="ch_decayconst" label="Постоянная распада, 1/сек" required size="small" maxRows={4} variant="outlined" value={valueDecayConst || ''} onChange={e => setValueDecayConst(e.target.value)}/>
            </Grid>
{/*             <Grid item xs={12}>
	    
            </Grid>  */}           
          </Grid>
        </form>
          <Box sx={{ marginTop: '0.4rem' }}>
            Радиоактивные ряды<br/>
              <DataTableIsotopeDecay table_name={valueTitle} rec_id={valueId} />
          </Box>
          <Box sx={{ marginTop: '0.4rem' }}>
            Источники данных<br/>
              <DataTableDataSourceClass table_name={props.table_name} rec_id={valueId} />
          </Box>
        </Grid>
      </Grid>
      {(isLoading) && 
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop> 
      } 

      <Dialog open={dialogType !== ''} onClose={handleCloseCancel} fullWidth={true}>
        <DialogTitle>Внимание</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getDialogContentText()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <DialogButtons />
        </DialogActions>
      </Dialog>
    </Box>
  )
  }

export { DataTableIsotope }
