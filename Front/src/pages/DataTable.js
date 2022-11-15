import React, { useState, useEffect } from 'react'
import { DataGrid, ruRU } from '@mui/x-data-grid'
//import ChelementActions from './chelem_actions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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

var globalJson = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'title', headerName: 'Name', width: 180/*, editable: true */},
  { field: 'atomic_num', headerName: 'Atomic Num', width: 100 }
]


var alertText = "Сообщение";
var alertSeverity = "info";

const DataTable = () => {
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueAtomicNum, setValueAtomicNum] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
  //  setFieldValue("ch_name","test");
//    setMessage(`Movie "${params.row.title}" clicked`);
    // alert(`Data "${params.row.name}" `);
//    setMessage(`Movie "${params.row.name}" clicked`);
    setValueID(`${params.row.id}`);
    setValueTitle(`${params.row.title}`);
    setValueAtomicNum(`${params.row.atomic_num}`);
    //console.log(params.row.data);
    //this.refs.name.getInputNode().value = 'some value, hooray';
  };

  const [tableData, setTableData] = useState([])
  useEffect(() => {
    fetch("/chelement")
      .then((data) => data.json())
      .then((data) => setTableData(data))     
  }, [])

///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async () => {
    const js = JSON.stringify({
      title: valueTitle,
      atomic_num: valueAtomicNum
   });
   setIsLoading(true);
   console.log(js);
   try {
     const response = await fetch('http://localhost:3001/chelement/'+valueId, {
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
     //console.log('result is: ', JSON.stringify(result, null, 4));
     //setData(result);
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
         atomic_num: valueAtomicNum
      });
      setIsLoading(true);
      console.log(js);
      try {
        const response = await fetch('http://localhost:3001/chelement/', {
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
         atomic_num: valueAtomicNum
      });
      setIsLoading(true);
      console.log(js);
      try {
        const response = await fetch('http://localhost:3001/chelement/'+valueId, {
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
  
  //console.log(tableData);
  //const data = tableData;
  
  globalJson = tableData;
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
      const response = await fetch("/chelement");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log('result is: ', JSON.stringify(result, null, 4));
      setTableData(result);
    } catch (err) {
      //setErr(err.message);
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
    //Alert('Жесть');
    setOpen(false);
};

const handleCloseYes = () => {
  //Alert('Жесть');
  setOpen(false);
  delRec();
};
//////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
const ChelementActions = ({ params }) => {
  //  const {
  //    dispatch,
  //    state: { currentUser },
  //  } = useValue();
    return (
      <Box>
        <Tooltip title="Удалить">
          <IconButton
            onClick={() => handleClickDelete()}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

/////////////////////////////////////////  

const columns = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'title', headerName: 'Название', width: 180, editable: true },
  { field: 'atomic_num', headerName: 'Атомный номер', width: 180 },
  { field: 'actions',
    headerName: 'Действие',
    type: 'actions',
    width: 150,
    renderCell: (params) => <ChelementActions {...{ params }} />,
  },
]

  const [openAlert, setOpenAlert] = React.useState(false, '');

  return (
    <div style={{ height: 400, width: 650 }}>
      <DataGrid
//        componentsProps={{ toolbar: { csvOptions } }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableData}
        columns={columns}
        onRowClick={handleRowClick} {...tableData} 
        onselectionChange={handleRowClick} {...tableData}  
      />

<p/>
  <TextField  id="ch_id" label="Id" sx={{ width: '12ch' }} variant="outlined" value={valueId} defaultValue=" " onChange={e => setValueID(e.target.value)}/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <TextField  id="ch_name" label="Название"  variant="outlined" value={valueTitle} defaultValue=" " onChange={e => setValueTitle(e.target.value)}/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <TextField  id="ch_atomic_num" label="Атомный номер"  variant="outlined" value={valueAtomicNum} defaultValue=" " onChange={e => setValueAtomicNum(e.target.value)}/>
<p/>
  <Button variant="outlined" onClick={()=>saveRec(globalJson)}>
    	  Сохранить
	</Button>&nbsp;&nbsp;&nbsp;&nbsp;
  <Button variant="outlined" onClick={()=>addRec()}>
    	  Добавить
	</Button>&nbsp;&nbsp;&nbsp;&nbsp;
  <Button variant="outlined" onClick={()=>reloadDataAlert()}>
    	  Обновить данные
	</Button>&nbsp;&nbsp;&nbsp;&nbsp;
  <Button variant="outlined" onClick={()=>handleClickDelete()}>
    	  Удалить
	</Button>
  <p/>
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

export { globalJson, DataTable }
