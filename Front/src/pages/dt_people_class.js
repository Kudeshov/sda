import React, { useState, useEffect } from 'react'
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  GridToolbarExport
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
import { DataTableDataSourceClass } from './dt_data_source_class';
//import { withStyles } from "@material-ui/core/styles";
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIconBox from '@mui/icons-material/AddBox';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTablePeopleClass = () => {
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueNameRus, setValueNameRus] = React.useState([""]);
  const [valueNameEng, setValueNameEng] = React.useState();
  const [valueDescrEng, setValueDescrEng] = React.useState();
  const [valueDescrRus, setValueDescrRus] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]) 
  const [selectionModel, setSelectionModel] = React.useState([]);

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        console.log('lastId '+lastId);
      //  console.log('selectionModel '+selectionModel||0);
        lastId = tableData[0].id;
        setSelectionModel(tableData[0].id);
        setValueID(`${tableData[0].id}`);
        setValueTitle(`${tableData[0].title}`);
        setValueNameRus(`${tableData[0].name_rus}`);
        setValueNameEng( tableData[0].name_eng || "" );
        setValueDescrRus(`${tableData[0].descr_rus}`);
        setValueDescrEng(`${tableData[0].descr_eng}` );
      }
      else
      {
        console.log('lastId '+lastId);
      }
    }
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {
    setValueID(`${params.row.id}`);
    setValueTitle(`${params.row.title}`);
    setValueNameRus(`${params.row.name_rus}`);
    setValueNameEng(`${params.row.name_eng}`);
    setValueDescrRus(`${params.row.descr_rus}`);
    setValueDescrEng(`${params.row.descr_eng}` );
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
      .then((data) => {console.log('fetch ok'); console.log(data)} ); 
  }, [])

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async () => {
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
     reloadData();      
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
      setValueNameEng( tableData[0].name_eng || "" );
      setValueDescrRus(`${tableData[0].descr_rus}`);
      setValueDescrEng(`${tableData[0].descr_eng}` );
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
  const [open, setOpen] = React.useState(false); 
  const handleClickDelete = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseYes = () => {
    setOpen(false);
    delRec();
  };
  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
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

  function CustomToolbar1() {
    const apiRef = useGridApiContext();

    return (
      <GridToolbarContainer>
        <GridToolbarExport csvOptions={{ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) }} />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 550, width: 1500 }}>
    <table border = "0" style={{ height: 550, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 550, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 400, width: 585 }}>
      <DataGrid
        components={{ Toolbar: CustomToolbar1  }}
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

      <p/>
      <Button variant="outlined" startIcon={<RefreshIcon />} onClick={()=>reloadDataAlert()}>
    	   Обновить данные
	    </Button>     
      </td>

      <td style={{ height: 550, width: 900, verticalAlign: 'top' }}>

      <TextField  id="ch_id"  disabled={true} label="Id" sx={{ width: '12ch' }} variant="outlined" value={valueId || ''} size="small" /* defaultValue=" " */ onChange={e => setValueID(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" size="small" variant="outlined" value={valueTitle || ''} /* defaultValue=" " */ onChange={e => setValueTitle(e.target.value)}/>
      <p/>
      <TextField  id="ch_name_rus" sx={{ width: '40ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''}  /* defaultValue=" "  */ onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '40ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} /* defaultValue=" " */ onChange={e => setValueNameEng(e.target.value)}/>
      <p/>
      <TextField  id="ch_descr_rus" sx={{ width: '110ch' }} label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} /* defaultValue=" " */ onChange={e => setValueDescrRus(e.target.value)}/>
      <p/> 
      <TextField  id="ch_descr_rus" sx={{ width: '110ch' }} label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} /* defaultValue=" " */ onChange={e => setValueDescrEng(e.target.value)}/>
      <p/>
      <Button  variant="outlined" startIcon={<AddIconBox />} onClick={handleClearClick} Title="Начать ввод новой записи"/* {() => setDisabled(!disabled)} */>Новая запись</Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button variant="outlined" disabled={!valueTitle} startIcon={<SaveIcon />} onClick={()=>saveRec()} Title="Сохранить изменения в БД">
            Сохранить
      </Button>&nbsp;&nbsp;&nbsp;&nbsp;
      <Button variant="outlined" disabled={!valueId} startIcon={<DeleteIcon />} onClick={()=>handleClickDelete()} Title="Удалить запись">
            Удалить
      </Button>
      <p/>
      <div style={{ height: 300, width: 750 }}>
        <DataTableDataSourceClass table_name="people_class" rec_id={valueId} />
      </div>
    </td>
  </tr>
  </tbody>
  </table>

  <Dialog open={open} onClose={handleClose} fullWidth={true}>
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
          <Button variant="outlined" onClick={handleClose} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleCloseYes} >Да</Button>
      </DialogActions>
  </Dialog>
     </div>
  )
}

export { DataTablePeopleClass }
