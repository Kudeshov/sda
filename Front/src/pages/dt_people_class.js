import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
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
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { table_names } from './table_names';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import { DataTableDataSourceClass } from './dt_data_source_class';

const DataTablePeopleClass = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling

  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();
  const [valueNameRus, setValueNameRus] = React.useState();
  const [valueNameRusInitial, setValueNameRusInitial] = React.useState();
  const [valueNameEng, setValueNameEng] = React.useState();
  const [valueNameEngInitial, setValueNameEngInitial] = React.useState();
  const [valueDescrEng, setValueDescrEng] = React.useState();
  const [valueDescrEngInitial, setValueDescrEngInitial] = React.useState();
  const [valueDescrRus, setValueDescrRus] = React.useState();
  const [valueDescrRusInitial, setValueDescrRusInitial] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState(false);
  //const [isEmpty, setIsEmpty] = useState([false]);

  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [currentId, setCurrentId] = useState(null);  

  const [addedId, setAddedId] = useState(null);  

/*   useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueNameRus)&&(''===valueNameEng)&&(''===valueDescrEng)&&(''===valueDescrRus));
    }, [ valueTitle, valueNameRus, valueNameEng, valueDescrEng, valueDescrRus, ]); 
     */
        
  useEffect(() => {

    console.log('editStarted currentId', currentId)

    if (typeof currentId !== 'number') {
      setEditStarted(false);
      return;
    }  

    const editStarted1 = (valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
    ||(valueDescrEngInitial!==valueDescrEng)||(valueDescrRusInitial!==valueDescrRus);
    console.log('editStarted1', editStarted1)
    
    setEditStarted(editStarted1);      

  }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
      valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, currentId]); 

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
    if (editStarted/* &&(!isEmpty) */)
    {
      setDialogType('save');
    } 
    else 
    {
      setValueID(``);
      setValueTitle(``);
      setValueNameRus(``);
      setValueNameEng(``);
      setValueDescrRus(``);
      setValueDescrEng(`` );
      // Даем фокус TextField после обновления состояния
      inputRef.current.focus();
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data)); 
  }, [props.table_name])

const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    const data = {
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
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
    setValueTitleInitial(row.title);
    setValueNameRus(row.name_rus);
    setValueNameRusInitial(row.name_rus);
    setValueNameEng(row.name_eng);
    setValueNameEngInitial(row.name_eng);
    setValueDescrRus(row.descr_rus);
    setValueDescrRusInitial(row.descr_rus);
    setValueDescrEng(row.descr_eng);
    setValueDescrEngInitial(row.descr_eng);
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
    { field: 'title', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 250 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'descr_rus', headerName: 'Комментарий (рус.яз)', width: 180 },
    { field: 'descr_eng', headerName: 'Комментарий (англ.яз)', width: 180 },
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
      setValueNameRus(selectedRowData[0].name_rus);
      setValueNameEng(selectedRowData[0].name_eng );
      setValueDescrRus(selectedRowData[0].descr_rus);
      setValueDescrEng(selectedRowData[0].descr_eng);
      setValueTitleInitial(selectedRowData[0].title);
      setValueNameRusInitial(selectedRowData[0].name_rus);
      setValueNameEngInitial(selectedRowData[0].name_eng );
      setValueDescrRusInitial(selectedRowData[0].descr_rus);
      setValueDescrEngInitial(selectedRowData[0].descr_eng);       
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

  const formRef = React.useRef();
  return (
    <Box sx={{ border: '0px solid purple', width: 1445, height: 650, padding: 1 }}>
      <Grid container spacing={1}>
        <Grid item sx={{width: 583, border: '0px solid green', ml: 1 }}>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            apiRef={apiRef}
            hideFooterSelectedRowCount={true}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            rowHeight={25}
            pageSize={5}
            rows={tableData}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            initialState={{
              columns: {
            columnVisibilityModel: {
              name_eng: false,
              descr_rus: false,
              descr_eng: false,
            },
              },
            }}        
            onRowClick={handleRowClick} {...tableData}
            style={{ width: 570, height: 500, border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '4px' }}
            sx={{
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: dialogType !== ''||((typeof valueId === 'number' || '')==='') ? "transparent" : "rgba(0, 0, 0, 0.11)",
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
              <TextField id="ch_id" disabled={true} fullWidth label="Код"  variant="outlined" value={valueId || ''} size="small" />
            </Grid>  
            <Grid item xs={10}>
              <TextField id="ch_name" inputRef={inputRef} fullWidth label="Обозначение" required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
            </Grid>
            <Grid item xs={12}>
              <TextField  id="ch_name_rus" fullWidth size="small" label="Название (рус.яз)" required variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
            </Grid>            
            <Grid item xs={12}>
              <TextField  id="ch_name_eng" fullWidth size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
            </Grid>            
            <Grid item xs={12}>
              <TextField  id="ch_descr_rus" fullWidth label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} onChange={e => setValueDescrRus(e.target.value)}/>
            </Grid>            
            <Grid item xs={12}>
              <TextField  id="ch_descr_rus" fullWidth label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} onChange={e => setValueDescrEng(e.target.value)}/>
            </Grid>            
          </Grid>
        </form>
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

export { DataTablePeopleClass }