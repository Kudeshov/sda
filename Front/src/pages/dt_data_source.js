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
import { table_names } from './sda_types';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

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
        //console.log('isLoading, tableData[0].external_ds '+tableData[0].external_ds);
        lastId = tableData[0].id;
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
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {
    setOpenAlert(false);
    if (editStarted&&(!isEmpty))
    {
      handleClickSave(params);
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
      handleClickSaveWhenNew(params);
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
      .then((data) => setTableData(data))
      .then((data) => {/* console.log('fetch ok'); console.log(data);  */lastId = 0;} ); 
  }, [props.table_name])

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    if (formRef.current.reportValidity() )
    {
    const js = JSON.stringify({
      title: valueTitle,
      shortname: valueShortName,
      fullname: valueFullName,
      external_ds: valueExternalDS,
      descr: valueDescr         
   });
    if (!valueId) {
      addRec();
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/${props.table_name}/`+valueId, {
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
     if (fromToolbar) 
     {
       setValueTitleInitial(valueTitle);       
       setValueShortNameInitial(valueShortName);
       setValueFullNameInitial(valueFullName);
       setValueExternalDSInitial(valueExternalDS);
       setValueDescrInitial(valueDescr);           
     }
    reloadData();     
   }
  }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      shortname: valueShortName,
      fullname: valueFullName,
      external_ds: valueExternalDS,
      descr: valueDescr         
   });
    setIsLoading(true);
    //console.log(js);
    try {
      const response = await fetch(`/${props.table_name}/`, {
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
        lastId = id;  
        //console.log('добавлено lastid = ' + lastId);
        setValueID(lastId);
        setOpenAlert(true);  
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
      reloadData();
      console.log('addRec setScrollToIndex lastId = ' + lastId);
      scrollToIndexRef.current = lastId; //setScrollToIndex(lastId);  
      //Refresh initial state
      setValueTitle(valueTitle);       
      setValueShortName(valueShortName);
      setValueFullName(valueFullName);
      setValueExternalDS(valueExternalDS);
      setValueDescr(valueDescr);       
      setValueTitleInitial(valueTitle);       
      setValueShortNameInitial(valueShortName);
      setValueFullNameInitial(valueFullName);
      setValueExternalDSInitial(valueExternalDS);
      setValueDescrInitial(valueDescr);          
    }
  };

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
  const delRec =  async () => {
    //console.log('delrec clicked');
    const js = JSON.stringify({
        id: valueId,
        title: valueTitle,
    });
    setIsLoading(true);
    //console.log(js);
    try {
      const response = await fetch(`/${props.table_name}/`+valueId, {
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
        reloadData();
        setRowSelectionModel([tableData[0].id ]);  
        setValueID(tableData[0].id);

        setValueTitle(tableData[0].title);
        setValueShortName(tableData[0].shortname);
        setValueFullName( tableData[0].fullname || "" );
        setValueExternalDS(tableData[0].external_ds);
        setValueDescr( tableData[0].descr || "" );

        setValueTitleInitial(tableData[0].title);
        setValueShortNameInitial(tableData[0].shortname);
        setValueFullNameInitial( tableData[0].fullname || "" );
        setValueExternalDSInitial(tableData[0].external_ds);
        setValueDescrInitial( tableData[0].descr || "" );  
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
    }
  };  

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////
  const reloadDataAlert =  async () => {
    alertSeverity = "info";
    alertText =  'Данные успешно обновлены';
    try 
    {
      await reloadData();
    } catch(e)
    {
      alertSeverity = "error";
      alertText =  'Ошибка при обновлении данных: '+e.message;      
      setOpenAlert(true);
      return;
    }
    setOpenAlert(true);        
  }

  const reloadData = async () => {
    try {
      const response = await fetch(`/${props.table_name}/`);
       if (!response.ok) {
        //console.log('response not ok');
        alertText = `Ошибка при обновлении данных: ${response.status}`;
        alertSeverity = "false";
        const error = response.status + ' (' +response.statusText+')';  
        throw new Error(`${error}`);
      }
      else
      {  
        const result = await response.json();
        setTableData(result);
      }
    } catch (err) {
      //console.log('catch err');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /////////////////////////////////////////
  const [openDel, setOpenDel] = React.useState(false); 
  const [openSave, setOpenSave] = React.useState(false); 
  const [openSaveWhenNew, setOpenSaveWhenNew] = React.useState(false); 

  const handleClickDelete = () => {
    setOpenDel(true);
  };

  const handleCloseDelNo = () => {
    setOpenDel(false);
  };

  const handleCloseDelYes = () => {
    setOpenDel(false);
    delRec();
  };

  const handleClickSave = () => {
    setOpenSave(true);
  };

  const handleCloseSaveNo = () => {
    setOpenSave(false);
    handleCancelClick();
  };

  const handleCloseSaveYes = () => {
    setOpenSave(false);
    saveRec(false);
    handleCancelClick();
  };

  const handleClickSaveWhenNew = () => {
    setOpenSaveWhenNew(true);
  };

  const handleCloseSaveWhenNewNo = () => {
    setOpenSaveWhenNew(false);

    setValueID('');
    setValueTitle('');
    setValueShortName('');
    setValueFullName('');
    setValueExternalDS(true);
    setValueDescr('');
  };

  const handleCloseSaveWhenNewYes = () => {
    setOpenSaveWhenNew(false);
    saveRec(true);
    setValueID('');
    setValueTitle('');
    setValueShortName('');
    setValueFullName('');
    setValueExternalDS(true);
    setValueDescr('');
  };


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
    const selectedIDs = new Set(rowSelectionModel);
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
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });

  useEffect(() => {
    console.log(paginationModel.page);
  }, [paginationModel]);
  
  const handleScrollToRow = React.useCallback((v_id) => {
    const sortedRowIds = apiRef.current.getSortedRowIds(); //получаем список отсортированных строк грида
    const index = sortedRowIds.indexOf(parseInt(v_id));    //ищем в нем номер нужной записи
    if (index !== -1) {
      const pageSize = paginationModel.pageSize; // определяем текущую страницу и индекс строки в этой странице
      const currentPage = paginationModel.page;
      const rowPageIndex = Math.floor(index / pageSize);
      if (currentPage !== rowPageIndex) { // проверяем, нужно ли изменять страницу
        apiRef.current.setPage(rowPageIndex);
      }
      setRowSelectionModel([v_id]); //это устанавливает фокус на выбранной строке (подсветка)
      setTimeout(function() {       //делаем таймаут в 0.1 секунды, иначе скроллинг тупит
        apiRef.current.scrollToIndexes({ rowIndex: index, colIndex: 0 });
      }, 100);
    }
  }, [apiRef, paginationModel, setRowSelectionModel]);
  
  const scrollToIndexRef = React.useRef(null); //тут хранится значение (айди) добавленной записи

  useEffect(() => {
    //событие, которое вызовет скроллинг грида после изменения данных в tableData
    if (!scrollToIndexRef.current) return; //если значение не указано, то ничего не делаем
    if (scrollToIndexRef.current===-1) return;
    // console.log('scrollToIndex index '+ scrollToIndexRef.current);
    handleScrollToRow(scrollToIndexRef.current);
    scrollToIndexRef.current = null; //обнуляем значение
  }, [tableData, handleScrollToRow]);


  function CustomToolbar1() {
    const handleExport = (options/* : GridCsvExportOptions */) =>
       apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>saveRec(true)}  color="primary" size="small" title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
        <IconButton onClick={()=>handleClickDelete()}  color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>reloadDataAlert(valueId)} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleExport({ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} color="primary" 
            size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
{/*     <IconButton onClick={()=>handleScrollToRow(valueId)} color="primary" size="small" title="Переместиться на строку 1">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton> 
        <IconButton onClick={()=>handleScrollToRow(valueId)} color="primary" size="small" title="Переместиться на строку 0">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>*/}
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
        components={{ Toolbar: CustomToolbar1 }}
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

      <TextField  id="ch_descr" sx={{ width: '100ch' }} size="small" label="Комментарий" multiline rows={7} variant="outlined"   value={valueDescr || ''} onChange={e => setValueDescr(e.target.value)}/>
      <p></p> 

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

  <Dialog open={openDel} onClose={handleCloseDelNo} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
          В таблице "{table_names[props.table_name]}" предложена к удалению следующая запись:<p></p><b>{valueTitle}</b>; Код в БД = <b>{valueId}</b><p></p>
          Вы желаете удалить указанную запись?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseDelNo} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleCloseDelYes} >Да</Button>
      </DialogActions>
  </Dialog>
 
  <Dialog open={openSave} onClose={handleCloseSaveNo} fullWidth={true}>
    <DialogTitle>
        Внимание
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
        {valueId?
          `В запись таблицы "${table_names[props.table_name]}" внесены изменения.`:
          `В таблицу "${table_names[props.table_name]}" внесена новая несохраненная запись.`} 
            <p></p>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveYes} >Да</Button>
    </DialogActions>
  </Dialog>

  <Dialog open={openSaveWhenNew} onClose={handleCloseSaveWhenNewNo} fullWidth={true}>
    <DialogTitle>
        Внимание
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
        {valueId?
          `В запись таблицы "${table_names[props.table_name]}" внесены изменения.`:
          `В таблицу "${table_names[props.table_name]}" внесена новая несохраненная запись.`}          
            {/* {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p> */}
            <p></p>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewYes} >Да</Button>
    </DialogActions>
  </Dialog>
  </form>
 </div>     
  )
}

export { DataTableDataSource, lastId }
