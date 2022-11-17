import React, { useState, useEffect } from 'react'
import { DataGrid, ruRU } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DataTableDataSourceClass } from './dt_data_source_class';

var alertText = "Сообщение";
var alertSeverity = "info";

const downloadExcel = (data) => {
  console.log(data);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Источники данных");
    XLSX.writeFile(workbook, "Источники данных.xlsx");
  };

  const valuesExtDS = [
    { label: 'Целевая БД', value: 'false' },
    { label: 'Внешний источник', value: 'true' } ];

const DataTablePeopleClass = () => {
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueShortName, setValueShortName] = React.useState();
  const [valueFullName, setValueFullName] = React.useState();
  const [valueDescr, setValueDescr] = React.useState();
  const [valueExternalDS, setValueExternalDS] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

const handleRowClick: GridEventListener<'rowClick'>  = (params) => {
    setValueID(`${params.row.id}`);
    setValueTitle(`${params.row.title}`);
    setValueShortName(`${params.row.shortname}`);
    setValueFullName( params.row.fullname || "" );
    setValueExternalDS(`${params.row.external_ds}`);
    setValueDescr( params.row.descr  || "" );
    reloadDataSrc(`${params.row.id}`);
  }; 

  const [tableData, setTableData] = useState([])
  const [tableDataSrc, setTableDataSrc] = useState([])

  useEffect(() => {
    fetch("/people_class")
      .then((data) => data.json())
      .then((data) => setTableData(data))     
  }, [])

  useEffect(() => {
    fetch(`/data_source_class?table_name=people_class&rec_id=${valueId??0}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
      },
    })
      .then((data) => data.json())
      .then((data) => setTableDataSrc(data))     
  }, [])  

///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async () => {
    const js = JSON.stringify({
      title: valueTitle,
      shortname: valueShortName,
      fullname: valueFullName,
      external_ds: valueExternalDS,
      descr: valueDescr         
   });
   setIsLoading(true);
   console.log(js);
   try {
     const response = await fetch('http://localhost:3001/people_class/'+valueId, {
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
        alertText =  'Запись с кодом '+valueId+' успешно сохранена';
        setOpenAlert(true);  
      }
     const result = await response.json();
   } catch (err) {
     //setErr(err.message);
   } finally {
     setIsLoading(false);
     reloadData();        
   }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
      console.log('addrec clicked');
      const js = JSON.stringify({
         id: valueId,
         title: valueTitle,
         shortname: valueShortName,
         fullname: valueFullName,
         external_ds: valueExternalDS,
         descr: valueDescr         
      });
      setIsLoading(true);
      console.log(js);
      try {
        const response = await fetch('http://localhost:3001/people_class/', {
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
          alertText =  'Запись с кодом '+valueId+' успешно добавлена';
          setOpenAlert(true);  
        }
      } catch (err) {
        alertText = err.message;
        alertSeverity = 'error';
        setOpenAlert(true);
      } finally {
        setIsLoading(false);
        reloadData();  
      }
    };

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
    const delRec =  async () => {
      console.log('delrec clicked');
      const js = JSON.stringify({
         id: valueId,
         title: valueTitle,
         shortname: valueShortName
      });
      setIsLoading(true);
      console.log(js);
      try {
        const response = await fetch('http://localhost:3001/people_class/'+valueId, {
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
          alertText =  'Запись с кодом '+valueId+' успешно удалена';
          setOpenAlert(true);  
        }
        //const result = await response.json();
        //console.log('result is: ', JSON.stringify(result, null, 4));
        //setData(result);
      } catch (err) {
        //setErr(err.message);
      } finally {
        setIsLoading(false);
        reloadData();
        //setOpenAlert(true);
      }
    };  
  
/////////////////////////////////////////////////////////////////// RELOAD /////////////////////

  const reloadDataAlert =  async () => {
    reloadData();
    alertSeverity = "info";
    alertText =  'Данные успешно обновлены';
    setOpenAlert(true);        
  }

  const reloadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/people_class");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();
      setTableData(result);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const reloadDataSrc = async (qqq) => {
    setIsLoading(true);
    try {
      const response = await  fetch(`/data_source_class?table_name=people_class&rec_id=${qqq??0}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Application/json',
          Accept: '*/*',
        },
      });   

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();
      setTableDataSrc(result);
    } catch (err) {
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
const DataSourceActions = ({ params }) => {
    return (
      <Box>
        <Tooltip title="Удалить">
          <IconButton onClick={() => handleClickDelete()}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
/////////////////////////////////////////  
const columns = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'title', headerName: 'Обозначение', width: 180 },
  { field: 'shortname', headerName: 'Краткое название', width: 280 },
  { field: 'fullname', headerName: 'Полное название', width: 280 },
  { field: 'descr', headerName: 'Комментарий', width: 280 },
  { field: 'external_ds', headerName: 'Внешний источник', width: 120 },
  { field: 'actions',
    headerName: 'Действие',
    type: 'actions',
    width: 150,
    // renderCell: (params) => <DataSourceActions {...{ params }} />,
  },
]

const columns_src = [
  { field: 'id', headerName: 'Код', width: 60 },
  { field: 'title', headerName: 'Источник', width: 280 },
  { field: 'title_src', headerName: 'Обозначение', width: 180 },
  { field: 'name_src', headerName: 'Название', width: 280 },
]

const [openAlert, setOpenAlert] = React.useState(false, '');
console.log('return ( ' );
  return (
    <div style={{ height: 550, width: 1500 }}>
    <table style={{ height: 550, width: 1400 }} >
    <tr>
      <td style={{ height: 550, width: 800, verticalAlign: 'top' }}>
      <div style={{ height: 400, width: 728 }}>
      <DataGrid
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableData}
        columns={columns}
        columnVisibilityModel={{
          fullname: false,
          field: false,
          external_ds: false,
          descr: false,
          actions: false,
        }}
        onRowClick={handleRowClick} {...tableData} 
        //onselectionChange={handleRowClick} {...tableData}  
      />
      </div>
      <p/>
      <Button variant="outlined" onClick={()=>downloadExcel(tableData)}>
    	  Сохранить в Excel
	    </Button>
      &nbsp;&nbsp;&nbsp;&nbsp; 
      <Button variant="outlined" onClick={()=>reloadDataAlert()}>
    	  Обновить данные
	    </Button>     
      </td>
{/*       <td style={{ height: 550, width: 10 }}>      
      </td> */}
      <td style={{ height: 550, width: 700, verticalAlign: 'top' }}>

  <TextField  id="ch_id" label="Id" sx={{ width: '12ch' }} variant="outlined" value={valueId} defaultValue=" " onChange={e => setValueID(e.target.value)}/>
  <p/>
  <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение"  variant="outlined" value={valueTitle} defaultValue=" " onChange={e => setValueTitle(e.target.value)}/>
  <p/>
   <div style={{ height: 300, width: 728 }}>
     <DataTableDataSourceClass table_name="people_class" rec_id={valueId} />
   </div>
  <p/>


{/*unblock*/}
{/*       <div style={{ height: 400, width: 728 }}>
      <DataGrid
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableDataSrc}
        columns={columns_src}
        columnVisibilityModel={{
          fullname: false,
          field: false,
          external_ds: false,
          descr: false,
          actions: false,
        }}
      //  onRowClick={handleRowClick} {...tableData} 
      //  onselectionChange={handleRowClick} {...tableData}  
      />
      </div>
      <p/> */}

  <TextField  id="ch_shortname" sx={{ width: '40ch' }} label="Краткое название"  variant="outlined" value={valueShortName} defaultValue=" " onChange={e => setValueShortName(e.target.value)}/>
  <p/>
  <TextField  id="ch_fullname" sx={{ width: '80ch' }} label="Полное название"  variant="outlined" value={valueFullName} defaultValue=" " onChange={e => setValueFullName(e.target.value)}/>
  <p/>
{/*   <TextField  id="ch_external_ds" sx={{ width: '80ch' }} label="Внешний источник"  variant="outlined" value={valueExternalDS} defaultValue=" " onChange={e => setValueExternalDS(e.target.value)}/>
  <p/>
 */}
{/*      <FormControl sx={{ width: '40ch' }}>
        <InputLabel id="demo-controlled-open-select-label">Тип источника</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={valueExternalDS  || "" }
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
  <p/> */} 

  <TextField  id="ch_descr" sx={{ width: '80ch' }} label="Комментарий" multiline maxRows={4} variant="outlined" value={valueDescr} defaultValue=" " onChange={e => setValueDescr(e.target.value)}/>
  <p/> 
  <Button variant="outlined" onClick={()=>saveRec()}>
    	  Сохранить
	</Button>&nbsp;&nbsp;&nbsp;&nbsp;
  <Button variant="outlined" onClick={()=>addRec()}>
    	  Добавить
	</Button>&nbsp;&nbsp;&nbsp;&nbsp;
  <Button variant="outlined" onClick={()=>handleClickDelete()}>
    	  Удалить
	</Button>
    </td>
  </tr>
  </table>

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
          {alertText}!
        </Alert>
      </Collapse>
      <div style={{
      marginLeft: '40%',
      }}>
      {isLoading && <CircularProgress/>} 
{/*       {!isLoading && <h3>Successfully API Loaded Data</h3>} */}
      </div>

      {/*<Button
        disabled={openAlert}
        variant="outlined"
        onClick={() => {
          setOpenAlert(true);
        }}
      >
        На жми!
      </Button> */}
    </Box>


  <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={400}
  >
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              Вы действительно хотите удалить запись {valueId}?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleClose} autoFocus>Нет</Button>
          <Button onClick={handleCloseYes} >Да</Button>
      </DialogActions>
  </Dialog>
     </div>
  )
}

export { DataTablePeopleClass }
