import React, { useState, useEffect } from 'react'
//import { DataGrid, ruRU, gridFilteredSortedRowIdsSelector, GridCsvGetRowsToExportParams, GridCsvExportOptions } from '@mui/x-data-grid'
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridCsvExportOptions,
  GridExportMenuItemProps,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  GridApi,
  GridToolbarExport
} from '@mui/x-data-grid';
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


const getJson = (apiRef: React.MutableRefObject<GridApi>) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map((id) => {
    const row: Record<string, any> = {};
    visibleColumnsField.forEach((field) => {
      row[field] = apiRef.current.getCellParams(id, field).value;
    });
    return row;
  });

  // Stringify with some indentation
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
  return JSON.stringify(data, null, 2);
};

const exportBlob = (blob: Blob, filename: string) => {
  // Save the blob in a json file
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};

const JsonExportMenuItem = (props: GridExportMenuItemProps<{}>) => {
  const apiRef = useGridApiContext();

  const { hideMenu } = props;

  return (
    <MenuItem
      onClick={() => {
        const jsonString = getJson(apiRef);
        const blob = new Blob([jsonString], {
          type: 'text/json',
        });
        exportBlob(blob, 'DataGrid_demo.json');

        // Hide the export menu after the export
        hideMenu?.();
      }}
    >
      Export JSON
    </MenuItem>
  );
};

const csvOptions: GridCsvExportOptions = { delimiter: ';' };

const CustomExportButton = (props: ButtonProps) => (
  <GridToolbarExportContainer {...props}>
    <GridCsvExportMenuItem options={csvOptions} />
    <JsonExportMenuItem />
  </GridToolbarExportContainer>
);

const CustomToolbar = (props: GridToolbarContainerProps) => (
  <GridToolbarContainer {...props}>
    <CustomExportButton />
  </GridToolbarContainer>
);

function CustomToolbar1() {
  const apiRef = useGridApiContext();

  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) }} />
    </GridToolbarContainer>
  );
}

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

const DataTableDataSource = () => {
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
  };

  const [tableData, setTableData] = useState([])
  useEffect(() => {
    fetch("/data_source")
      .then((data) => data.json())
      .then((data) => setTableData(data))     
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
     const response = await fetch('http://localhost:3001/data_source/'+valueId, {
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
        const response = await fetch('http://localhost:3001/data_source/', {
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
        const response = await fetch('http://localhost:3001/data_source/'+valueId, {
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
      const response = await fetch("/data_source");
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
    renderCell: (params) => <DataSourceActions {...{ params }} />,
  },
]

const [openAlert, setOpenAlert] = React.useState(false, '');
const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridFilteredSortedRowIdsSelector(apiRef);

  return (
    <div style={{ height: 550, width: 1500 }}>
    <table style={{ height: 550, width: 1400 }} >
    <tr>
      <td style={{ height: 550, width: 800, verticalAlign: 'top' }}>
      <div style={{ height: 400, width: 728 }}>
        <p/>
      <DataGrid
//        componentsProps={{ toolbar: { csvOptions } }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableData}
        columns={columns}
        columnVisibilityModel={{
          // Hide columns status and traderName, the other columns will remain visible
          fullname: false,
          field: false,
          external_ds: false,
          descr: false,
          actions: false,
        }}
//        loading={loading}
        components={{ Toolbar: CustomToolbar1  }}
        onRowClick={handleRowClick} {...tableData} 
        onselectionChange={handleRowClick} {...tableData}
        onSelectionModelChange={(ids) => {
          //setSelectionModel(ids);
          
          console.log('filtered rows');
          //console.log(getRowsToExport:getFilteredRows);
        }}  
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
  <p/>
  <TextField  id="ch_id" label="Id" sx={{ width: '12ch' }} variant="outlined" value={valueId} defaultValue=" " onChange={e => setValueID(e.target.value)}/>
  <p/>
  <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение"  variant="outlined" value={valueTitle} defaultValue=" " onChange={e => setValueTitle(e.target.value)}/>
  <p/>
  <TextField  id="ch_shortname" sx={{ width: '40ch' }} label="Краткое название"  variant="outlined" value={valueShortName} defaultValue=" " onChange={e => setValueShortName(e.target.value)}/>
  <p/>
  <TextField  id="ch_fullname" sx={{ width: '80ch' }} label="Полное название"  variant="outlined" value={valueFullName} defaultValue=" " onChange={e => setValueFullName(e.target.value)}/>
  <p/>
{/*   <TextField  id="ch_external_ds" sx={{ width: '80ch' }} label="Внешний источник"  variant="outlined" value={valueExternalDS} defaultValue=" " onChange={e => setValueExternalDS(e.target.value)}/>
  <p/>
 */}
     <FormControl sx={{ width: '40ch' }}>
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
{/*           <MenuItem value={'0'}>Целевая БД</MenuItem>
          <MenuItem value={'1'}>Внешний источник</MenuItem>
 */}          
        </Select>
      </FormControl>  
  <p/> 

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

export { DataTableDataSource }
