import React, { useState, useEffect } from 'react'
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
//  GridToolbarExport, 
//  GridToolbar
} from '@mui/x-data-grid';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
//import { makeStyles } from "@material-ui/core";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { DataTableDataSourceClass } from './dt_data_source_class';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTablePeopleClass = () => {

  useEffect(() => {
    console.log('run after mount?');
    //handleCancelClick();
    //setEditStarted(true);
    //setEditStarted(false);
  }, [ ]); // <-- empty array means 'run once'

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
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState([false]);

  useEffect(() => {
    console.log([valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
      valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus]); 
    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng)||(valueDescrRusInitial!==valueDescrRus));
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        console.log('isLoading, tableData ON lastId '+lastId);
        lastId = tableData[0].id;
        setSelectionModel(tableData[0].id);
        setValueID(`${tableData[0].id}`);
        setValueTitle(`${tableData[0].title}`);
        setValueNameRus(`${tableData[0].name_rus}`);
        setValueNameEng(`${tableData[0].name_eng}`);
        setValueDescrRus(`${tableData[0].descr_rus}`);
        setValueDescrEng(`${tableData[0].descr_eng}`);

        console.log('useEffect Refresh initial '+tableData[0].title+' '+tableData[0].name_rus);

        setValueTitleInitial(`${tableData[0].title}`);       
        setValueNameRusInitial(`${tableData[0].name_rus}`);
        setValueNameEngInitial(`${tableData[0].name_eng}`);
        setValueDescrRusInitial(`${tableData[0].descr_rus}`);
        setValueDescrEngInitial(`${tableData[0].descr_eng}`);
      }
      else
      {
        console.log('isLoading, tableData OFF lastId '+lastId + ' tableData.length) ' + tableData.length + 'isLoading'+isLoading);
        //console.log('useEffect Refresh initial '+tableData[0].title+' '+tableData[0].name_rus);
        //setValueTitleInitial(`${tableData[0].title}`);       
        //setValueNameRusInitial(`${tableData[0].name_rus}`);
        //console.log('useEffect Refresh initial '+valueTitleInitial+' '+valueNameRusInitial);
      }
    }
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {

   // if (valueId!== params.row.id) 
    if (editStarted)
    {
      //if (window.confirm("Запись была отредактирована. Сохранить?")) 
      handleClickSave(params);
    } 
    else 
    {
      //console.log(params);
      setValueID(`${params.row.id}`);
      setValueTitle(`${params.row.title}`);
      setValueNameRus(`${params.row.name_rus}`);
      setValueNameEng(`${params.row.name_eng}`);
      setValueDescrRus(`${params.row.descr_rus}`);
      setValueDescrEng(`${params.row.descr_eng}` );

      console.log('handleRowClick Refresh initial '+params.row.title+' '+params.row.name_rus);

      setValueTitleInitial(`${params.row.title}`);
      setValueNameRusInitial(`${params.row.name_rus}`);
      setValueNameEngInitial(`${params.row.name_eng}`);
      setValueDescrRusInitial(`${params.row.descr_rus}`);
      setValueDescrEngInitial(`${params.row.descr_eng}` );
    }
  }; 

  const handleClearClick  = (params) => {
    setValueID(``);
    setValueTitle(``);
    setValueNameRus(``);
    setValueNameEng(``);
    setValueDescrRus(``);
    setValueDescrEng(`` );
  }; 

  useEffect(() => {
    fetch("/people_class")
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => {console.log('fetch ok'); console.log(data); lastId = 0;} ); 
  }, [])

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng         
    });
    console.log('saverec');
    if (!valueId) {
      addRec();
      return;
    }
    setIsLoading(true);
    console.log(js);
    try {
      const response = await fetch('/people_class/'+valueId, {
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
     //throw {message: err.message,status:err.cod};
     alertText = err.message;
     alertSeverity = 'error';
     setOpenAlert(true);
   } finally {
     setIsLoading(false);
     if (fromToolbar) 
     {
       console.log('saveRec fromtoolbar Refresh initial '+valueTitle+' '+valueNameRus);
       setValueTitleInitial(valueTitle);       
       setValueNameRusInitial(valueNameRus); 
       setValueNameEngInitial(valueNameEng);
       setValueDescrRusInitial(valueDescrRus);
       setValueDescrEngInitial(valueDescrEng);           
     }
     else
     {
       console.log('saveRec NO fromtoolbar Refresh initial '+valueTitle+' '+valueNameRus);
      // setValueTitleInitial(valueTitle);       
      // setValueNameRusInitial(valueNameRus);     
     }
    reloadData();     
//     console.log('saveRec Refresh initial '+valueTitle+' '+valueNameRus);
//     setValueTitleInitial(valueTitle);
//     setValueNameRusInitial(valueNameRus);
   }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    console.log('addrec executed');
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng         
    });
    setIsLoading(true);
    console.log(js);
    try {
      const response = await fetch('/people_class/', {
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
        lastId = parseInt( alertText.substr(alertText.lastIndexOf('ID:') + 3, 20)); 
        console.log(lastId);
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
      setSelectionModel(lastId);
      //Refresh initial state
      console.log('addRec Refresh initial '+valueTitle+' '+valueNameRus);
      setValueTitleInitial(valueTitle);
      setValueNameRusInitial(valueNameRus);
      setValueNameEngInitial(valueNameEng);
      setValueDescrRusInitial(valueDescrRus);
      setValueDescrEngInitial(valueDescrEng);           
    }
  };

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
  const delRec =  async () => {
    console.log('delrec clicked');
    const js = JSON.stringify({
        id: valueId,
        title: valueTitle,
        //shortname: valueShortName
    });
    setIsLoading(true);
    console.log(js);
    try {
      const response = await fetch('/people_class/'+valueId, {
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
      //setErr(err.message);
    } finally {
      setIsLoading(false);
      reloadData();
      setSelectionModel(tableData[0].id );  
      setValueID(`${tableData[0].id}`);
      setValueTitle(`${tableData[0].title}`);
      setValueNameRus(`${tableData[0].name_rus}`);
      setValueNameEng(`${tableData[0].name_eng}`);
      setValueDescrRus(`${tableData[0].descr_rus}`);
      setValueDescrEng(`${tableData[0].descr_eng}`);

      console.log('delRec Refresh initial '+tableData[0].title+' '+tableData[0].name_rus);
      setValueTitleInitial(`${tableData[0].title}`);
      setValueNameRusInitial(`${tableData[0].name_rus}`);
      setValueNameEngInitial(`${tableData[0].name_eng}`);
      setValueDescrRusInitial(`${tableData[0].descr_rus}`);
      setValueDescrEngInitial(`${tableData[0].descr_eng}`);
    }
  };  

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////

  const reloadDataAlert =  async () => {
    alertSeverity = "info";
    alertText =  'Данные успешно обновлены';
    // await reloadData();
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
    //setIsLoading(true);
    try {
      const response = await fetch("/people_class");
       if (!response.ok) {
        console.log('response not ok');
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
      console.log('catch err');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /////////////////////////////////////////
  const [openDel, setOpenDel] = React.useState(false); 
  const [openSave, setOpenSave] = React.useState(false); 

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


  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 180 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'descr_rus', headerName: 'Комментарий (рус.яз)', width: 180 },
    { field: 'descr_eng', headerName: 'Комментарий (англ.яз)', width: 180 },
  ]
/* 
  const DarkerDisabledTextField = withStyles({
    root: {
      marginRight: 8,
      "& .MuiInputBase-root.Mui-disabled": {
        color: "rgba(255, 0, 0, 0.7)" // (default alpha is 0.38)
      }
    }
  })(TextField); */

  const [openAlert, setOpenAlert] = React.useState(false, '');

  const handleCancelClick = () => 
  {
    console.log('selectionModel');
    console.log(selectionModel);
    //console.log('selectionModel='+selectionModel.row.id);
    
    const selectedIDs = new Set(selectionModel);
    console.log(selectedIDs);
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    console.log(selectedRowData);

    if (selectedRowData.length)
    {
      setValueID(`${selectedRowData[0].id}`);
      setValueTitle(`${selectedRowData[0].title}`);
      setValueNameRus(`${selectedRowData[0].name_rus}`);
      setValueNameEng(`${selectedRowData[0].name_eng}` );
      setValueDescrRus(`${selectedRowData[0].descr_rus}`);
      setValueDescrEng(`${selectedRowData[0].descr_eng}` );

      console.log('handleCancelClick Refresh initial '+selectedRowData[0].title+' '+selectedRowData[0].name_rus);
      setValueTitleInitial(`${selectedRowData[0].title}`);
      setValueNameRusInitial(`${selectedRowData[0].name_rus}`);
      setValueNameEngInitial(`${selectedRowData[0].name_eng}` );
      setValueDescrRusInitial(`${selectedRowData[0].descr_rus}`);
      setValueDescrEngInitial(`${selectedRowData[0].descr_eng}` );
    }
  }

  function CustomToolbar1() {
    const apiRef = useGridApiContext();
    const handleExport = (options: GridCsvExportOptions) =>
      apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" Title="Создать запись"><AddIcon/></IconButton>
        <IconButton onClick={()=>saveRec(true) /* handleCloseSaveYes() *//* saveRec() */}  color="primary" size="small" Title="Сохранить запись в БД"><SaveIcon /></IconButton>
        <IconButton onClick={()=>handleClickDelete()}  color="primary" size="small" Title="Удалить запись"><DeleteIcon /></IconButton>
        <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" Title="Отменить редактирование"><UndoIcon /></IconButton>
        <IconButton onClick={()=>reloadDataAlert()} color="primary" size="small" Title="Обновить данные"><RefreshIcon /></IconButton>
        <IconButton onClick={()=>handleExport({ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} color="primary" size="small" Title="Сохранить в формате CSV"><SaveAltIcon /></IconButton>
{/*         <Button {...buttonAddProps} sx={{ width: 10, padding: 0, margin: 0 }} onClick={()=>handleClearClick()} Title="Создать запись"></Button>
        <Button {...buttonSaveProps} onClick={()=>saveRec()}  Title="Сохранить запись в БД"></Button>
        <Button {...buttonDelProps} onClick={()=>handleClickDelete()} Title="Удалить запись"></Button>
        <Button {...buttonUndoProps} Title="Отменить редактирование"></Button>
        <Button {...buttonRefreshProps} onClick={()=>reloadDataAlert()} Title="Обновить данные"></Button>
        <Button
        style={{ maxWidth: "44px", minWidth: "44px" }}
        classes={{ startIcon: classes.startICon }}
        variant="outlined"
        startIcon={<Add />}
        ></Button>     */}    
{/*         <GridToolbarExport Name="asd" csvOptions={{ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) }} />
 */}      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 550, width: 1500 }}>
    <table border = "0" style={{ height: 550, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 550, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 400, width: 585 }}>
      <DataGrid
        components={{ Toolbar: CustomToolbar1 }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableData}
        loading={isLoading}
        columns={columns}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}        
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
          /* sx={{ mb: 2 }} */
        >
          {alertText}
        </Alert>
      </Collapse>
{/*       <div style={{
      marginLeft: '40%',
      }}>
      </div> */}
      </Box>

{/*       <p/>
      <Button variant="outlined" startIcon={<RefreshIcon />} onClick={()=>reloadDataAlert()}>
    	   Обновить данные
	    </Button>      */}



      </td>

      <td style={{ height: 550, width: 900, verticalAlign: 'top' }}>

      <TextField  id="ch_id"  disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={valueId || ''} size="small" /* defaultValue=" " */ onChange={e => setValueID(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" size="small" variant="outlined" value={valueTitle || ''} /* defaultValue=" " */ onChange={e => setValueTitle(e.target.value)}/>
      <p/>
      <TextField  id="ch_name_rus" sx={{ width: '40ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''}  /* defaultValue=" "  */ onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '40ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} /* defaultValue=" " */ onChange={e => setValueNameEng(e.target.value)}/>
      <p/>
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} /* defaultValue=" " */ onChange={e => setValueDescrRus(e.target.value)}/>
      <p/> 
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} /* defaultValue=" " */ onChange={e => setValueDescrEng(e.target.value)}/>
{/*       <p/>

      <Button  variant="outlined" startIcon={<AddIconBox />} onClick={handleClearClick} Title="Начать ввод новой записи">Новая запись</Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button variant="outlined" disabled={!valueTitle} startIcon={<SaveIcon />} onClick={()=>saveRec()} Title="Сохранить изменения в БД">
            Сохранить
      </Button>&nbsp;&nbsp;&nbsp;&nbsp;
      <Button variant="outlined" disabled={!valueId} startIcon={<DeleteIcon />} onClick={()=>handleClickDelete()} Title="Удалить запись">
            Удалить
      </Button> */}
      <p/>
      <div style={{ height: 300, width: 800 }}>
        <DataTableDataSourceClass table_name="people_class" rec_id={valueId} />
      </div>
    </td>
  </tr>
  </tbody>
  </table>

  <Dialog open={openDel} onClose={handleCloseDelNo} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
          В таблице "Типы облучаемых лиц" предложена к удалению следующая запись:<p/><b>{valueTitle}</b>; Код в БД = <b>{valueId}</b><p/>
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
          В запись таблицы "Типы облучаемых лиц" с кодом <b>{valueId}</b> внесены изменения.<p/>
          {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p/>
          {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p/>
          <p/>Вы желаете сохранить указанную запись?
      </DialogContentText>
  </DialogContent>
  <DialogActions>
      <Button variant="outlined" onClick={handleCloseSaveNo} autoFocus>Нет</Button>
      <Button variant="outlined" onClick={handleCloseSaveYes} >Да</Button>
  </DialogActions>
</Dialog>
 </div>     
  )
}

export { DataTablePeopleClass, lastId }
