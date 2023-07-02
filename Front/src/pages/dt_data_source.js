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
import { Box, IconButton } from '@mui/material';
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
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import { DataTableDataSourceClassRef } from './dt_data_source_class_ref';

const DataTableDataSource = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling

  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();

  const [valueShortName, setValueShortName] = React.useState();
  const [valueFullName, setValueFullName] = React.useState();
  const [valueDescr, setValueDescr] = React.useState();
  const [valueExternalDS, setValueExternalDS] = React.useState(true);

  const [valueShortNameInitial, setValueShortNameInitial] = React.useState();
  const [valueFullNameInitial, setValueFullNameInitial] = React.useState();
  const [valueDescrInitial, setValueDescrInitial] = React.useState();
  const [valueExternalDSInitial, setValueExternalDSInitial] = React.useState();

  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState([false]);

  const [isEmpty, setIsEmpty] = useState([false]);

  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [lastId, setLastId] = useState(0);  

  const valuesExtDS = [
    { label: 'Целевая БД', value: 'false' },
    { label: 'Внешний источник', value: 'true' } ];

  useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueShortName)&&(''===valueFullName)&&(''===valueDescr)&&(''===valueExternalDS)   );
    }, [ valueTitle, valueShortName, valueFullName, valueDescr, valueExternalDS]); 

  useEffect(() => {
    setEditStarted((valueTitleInitial!==valueTitle)||(valueShortNameInitial!==valueShortName)||(valueFullNameInitial!==valueFullName)
      ||(valueDescrInitial!==valueDescr)||(valueExternalDSInitial!==valueExternalDS));
    }, [valueTitleInitial, valueTitle, valueShortNameInitial, valueShortName, valueFullNameInitial, valueFullName, 
      valueDescrInitial, valueDescr, valueExternalDSInitial, valueExternalDS]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        setRowSelectionModel([tableData[0].id]);
        setValueID(tableData[0].id);

        setValueTitle(tableData[0].title);
        setValueShortName(tableData[0].shortname);
        setValueFullName(tableData[0].fullname || "" );
        setValueExternalDS(tableData[0].external_ds);
        setValueDescr(tableData[0].descr || "" );

        setValueTitleInitial(tableData[0].title);
        setValueShortNameInitial(tableData[0].shortname);
        setValueFullNameInitial(tableData[0].fullname || "" );
        setValueExternalDSInitial(tableData[0].external_ds);
        setValueDescrInitial(tableData[0].descr || "" ); 
      }
    }
    }, [ isLoading, tableData, lastId] );

  const [prevRowSelectionModel, setPrevRowSelectionModel] = useState([]);

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
    if (params.row.id === valueId  ) {
      // Если данные не изменились, просто выходим из функции
      return;
    }

    setOpenAlert(false);
    if (editStarted&&(!isEmpty))
    {
      setDialogType('save');//handleClickSave(params);
    } 
    else 
    {
      setValueID(params.row.id);
      setValueTitle(params.row.title);
      setValueShortName(params.row.shortname);
      setValueFullName( params.row.fullname || "" );
      setValueExternalDS(params.row.external_ds);
      setValueDescr( params.row.descr  || "" );
      setValueTitleInitial(params.row.title);
      setValueShortNameInitial(params.row.shortname);
      setValueFullNameInitial( params.row.fullname || "" );
      setValueExternalDSInitial(params.row.external_ds);
      setValueDescrInitial( params.row.descr  || "" );
    }
  }; 

  const handleClearClick = (params) => {
    if (editStarted&&(!isEmpty))
    {
      //handleClickSaveWhenNew(params);
      setDialogType('save');
    } 
    else 
    {
      setValueID('');
      setValueTitle('');
      setValueShortName('');
      setValueFullName('');
      setValueExternalDS(true);
      setValueDescr('');
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data)); 
  }, [props.table_name])


// Функция saveRec
const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    const data = {
      title: valueTitle,
      shortname: valueShortName,
      fullname: valueFullName,
      external_ds: valueExternalDS,
      descr: valueDescr
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
        setLastId(newId);
        setValueID(newId);
        setAlertText(`Добавлена запись с кодом ${newId}`);
      } else {
        setLastId(valueId);
        setAlertText(responseData || 'Success');
      }
      
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);
    } finally {
      setIsLoading(false);
      setOpenAlert(true);
      setValueTitleInitial(valueTitle);
      setValueShortNameInitial(valueShortName);
      setValueFullNameInitial(valueFullName);
      setValueExternalDSInitial(valueExternalDS);
      setValueDescrInitial(valueDescr);
      reloadData();
    }
  }
};

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
      setLastId(tableData[0].id); 
      setValueTitle(tableData[0].title);
      setValueShortName(tableData[0].shortname);
      setValueFullName(tableData[0].fullname || "");
      setValueExternalDS(tableData[0].external_ds);
      setValueDescr(tableData[0].descr || "");
      
      setValueTitleInitial(tableData[0].title);
      setValueShortNameInitial(tableData[0].shortname);
      setValueFullNameInitial(tableData[0].fullname || "");
      setValueExternalDSInitial(tableData[0].external_ds);
      setValueDescrInitial(tableData[0].descr || "");  
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
                Выйти без сохранения изменений?
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
                Выйти без сохранения изменений?
              </>
            );            
          }
        }
      default:
        return '';
    }
  };

  const handleCloseNo = () => {
    switch (dialogType) {
      case 'save':
        handleCancelClick();
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
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'title', headerName: 'Обозначение', width: 180 },
    { field: 'shortname', headerName: 'Краткое название', width: 280 },
    { field: 'fullname', headerName: 'Полное название', width: 280 },
    { field: 'descr', headerName: 'Комментарий', width: 280 },
    { field: 'external_ds', headerName: 'Внешний источник', width: 120 },
  ]

  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    const selectedIDs = new Set(rowSelectionModel.map(Number));
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    if (selectedRowData.length)
    {
      setValueID(selectedRowData[0].id);

      setValueTitle(selectedRowData[0].title);
      setValueShortName(selectedRowData[0].shortname);
      setValueFullName( selectedRowData[0].fullname || "" );
      setValueExternalDS(selectedRowData[0].external_ds);
      setValueDescr( selectedRowData[0].descr  || "" );

      setValueTitleInitial(selectedRowData[0].title);
      setValueShortNameInitial(selectedRowData[0].shortname);
      setValueFullNameInitial( selectedRowData[0].fullname || "" );
      setValueExternalDSInitial(selectedRowData[0].external_ds);
      setValueDescrInitial( selectedRowData[0].descr  || "" );
    }
  }

  // Scrolling and positionning
  const { paginationModel, setPaginationModel, scrollToIndexRef } = useGridScrollPagination(apiRef, tableData, setRowSelectionModel);

  useEffect(() => {
    if (lastId !== null) {
        scrollToIndexRef.current = lastId;
    }
  }, [lastId, scrollToIndexRef]);

  function GridToolbar() {
    const handleExport = (options) =>
       apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>saveRec(true)}  color="primary" size="small" title="Сохранить запись в БД">
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
    
    <div style={{ height: 640, width: 1500 }}>

    <form ref={formRef}>  
    <table border = "0" style={{ height: 550, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 640, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 486, width: 585 }}>
      <DataGrid
        sx={{
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "rgba(0, 0, 0, 0.11)", // Зеленый цвет с 50% прозрачностью
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
        }}
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
              fullname: false,
              external_ds: false,
              descr: false,
            },
          },
        }}        
        onRowClick={handleRowClick} {...tableData} 
      />
      </div>
      <Box sx={{ width: 585 }}>
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
        >
          {alertText}
        </Alert>
      </Collapse>
      </Box>
      </td>
      <td style={{ height: 550, width: 900, verticalAlign: 'top' }}>
      <TextField  id="ch_id"  disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={valueId || ''} size="small" onChange={e => setValueID(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
      <p></p>
      <TextField  id="ch_shortname" sx={{ width: '100ch' }} label="Краткое название" required size="small" variant="outlined" value={valueShortName || ''} onChange={e => setValueShortName(e.target.value)}/>
      <p></p>
      <TextField  id="ch_fullname" sx={{ width: '100ch' }} label="Полное название" size="small" variant="outlined" value={valueFullName || ''} onChange={e => setValueFullName(e.target.value)}/>
      <p></p>
      <FormControl sx={{ width: '40ch' }} size="small">
        <InputLabel required id="demo-controlled-open-select-label">Тип источника</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          required
          value={valueExternalDS}
          label="Тип источника"
          defaultValue={true}
          onChange={e => setValueExternalDS(e.target.value)}
        >
        {valuesExtDS?.map(option => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.label ?? option.value}
              </MenuItem>
            );
        })}
        </Select>
      </FormControl>  
      <p></p> 

      <TextField  id="ch_descr" sx={{ width: '100ch' }} size="small" label="Комментарий" multiline rows={4} variant="outlined"   value={valueDescr || ''} onChange={e => setValueDescr(e.target.value)}/>
      <p></p> 
      <div style={{ height: 300, width: 800 }}>
        <td>Связанные с источником классификаторы<br/>
        <DataTableDataSourceClassRef rec_id={valueId||0} />
        </td>
      </div>
    </td>
  </tr>
  </tbody>
  </table>

  {(isLoading) && 

  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={isLoading}
  >
    <CircularProgress color="inherit" />
  </Backdrop> } 

  <Dialog open={dialogType !== ''} onClose={handleCloseNo} fullWidth={true}>
    <DialogTitle>
        Внимание
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
          {getDialogContentText()}
        </DialogContentText>
    </DialogContent>
    <DialogActions>
      <DialogButtons />
    </DialogActions>
  </Dialog>
  </form>
 </div>     
  )
}

export { DataTableDataSource }
