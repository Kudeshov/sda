import React,  { useState, useEffect } from 'react'
import { DataGrid, ruRU } from '@mui/x-data-grid'
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';

function DataTableDataSourceClass(props)  {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //const [nameState , setNameState] = useState(props);  //alert(props);
  const [tableDataSrc, setTableDataSrc] = useState([])
  useEffect(() => {
    //console.log('fetch entered: ' + props.rec_id); 
    fetch(`/data_source_class?table_name=people_class&rec_id=${props.rec_id??0}`)
      .then((data) => data.json())
      .then((data) => setTableDataSrc(data));
      //console.log('data=', tableDataSrc);
      //setNameState(nameState);
  }, [ props.rec_id /* props */])

const columns_src = [
  { field: 'id', headerName: 'Код', width: 60 },
  { field: 'title', headerName: 'Источник', width: 200 },
  { field: 'title_src', headerName: 'Обозначение', width: 180 },
  { field: 'name_src', headerName: 'Название', width: 250 },
]

const [valueId, setValueID] = React.useState();
const [valueTitle, setValueTitle] = React.useState();
const [valueTitleSrc, setValueTitleSrc] = React.useState();
const [valueNameSrc, setValueNameSrc] = React.useState();
/* const [valueNameRus, setValueNameRus] = React.useState([""]);
const [valueNameEng, setValueNameEng] = React.useState();
const [valueDescrEng, setValueDescrEng] = React.useState();
const [valueDescrRus, setValueDescrRus] = React.useState();
const [isLoading, setIsLoading] = React.useState(false);
 */

//var valueNameRus = "1";  
const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

const handleRowClick/* : GridEventListener<'rowClick'>  */ = (params) => {
  setValueID(`${params.row.id}`);
  setValueTitle(`${params.row.title}`);
  setValueTitleSrc(`${params.row.title_src}`);
  setValueNameSrc(`${params.row.name_src}`);  
//  setValueNameRus(`${params.row.name_rus}`);
//  setValueNameEng( params.row.name_eng || "" );
//  setValueDescrRus(`${params.row.descr_rus}`);
//  setValueDescrEng(`${params.row.descr_eng}` );
  //reloadDataSrc(`${params.row.id}`);
}; 
  return (
    <div style={{ height: 300, width: 850 }}>
      <table cellSpacing={0} cellPadding={0} style={{ height: 300, width: 850 }}   border="1"><tr>
        <td style={{ height: 300, width: 750 }}>
      <DataGrid
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        columns={columns_src}
        rows={tableDataSrc}
        columnVisibilityModel={{
          fullname: false,
          field: false,
          external_ds: false,
          descr: false,
          actions: false,
        }}
        onRowClick={handleRowClick} {...tableDataSrc} 
       // onselectionChange={handleRowClick} {...tableDataSrc}  
      /></td><td>
      &nbsp;&nbsp;&nbsp;<Button variant="outlined" onClick={handleClickOpen} startIcon={<CreateIcon />}></Button>
      <p/>
      &nbsp;&nbsp;&nbsp;<Button variant="outlined" startIcon={<SaveIcon />}></Button>
      <p/>
      &nbsp;&nbsp;&nbsp;<Button variant="outlined" startIcon={<DeleteIcon />}></Button>
      </td></tr></table>
      <Dialog open={open} onClose={handleClose} style={{ height: 500, width: 600 }}  sx={{ width: 500 }} 
              fullWidth={500}
              maxWidth={500}
              fullHeight={500}
              maxHeight={500}      >
{/*         <DialogTitle>Источник данных</DialogTitle> */}
        <DialogContent>
          <DialogContentText>
            Источник данных
          </DialogContentText>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={top100Films}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie" />}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Обозначение"
            value={valueTitleSrc}
            type="outlined"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Название"
            value={valueNameSrc}
            type="outlined"
            fullWidth
            variant="standard"
          />        

          
          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleClose}>Сохранить</Button>
        </DialogActions>
      </Dialog>
      </div>
    )
}
 export  { DataTableDataSourceClass   }
