import React,  { Component , useState, useEffect } from 'react'
import { DataGrid, ruRU } from '@mui/x-data-grid'

//const [tableDataSrc, setTableDataSrc] = useState([])

/* var TableDataSrc = "";

function setTableDataSrc(a){
  var TableDataSrc=a;
} 
function setTableDataSrc(a){
 // alert(a);
  console.log(a);
}*/


function DataTableDataSourceClass(props)  {
 // shouldComponentUpdate(props)
  const [nameState , setNameState] = useState(props)

  //alert(props);
  console.log('table_name1:  ' + props.table_name);
  console.log('rec_id1: ' + props.rec_id);

  const [tableData1, setTableData] = useState([])
  useEffect(() => {
    console.log('fetch entered: ' + props.rec_id); 
    fetch(`/data_source_class?table_name=people_class&rec_id=${props.rec_id??0}`)
      .then((data) => data.json())
      .then((data) => setTableData(data));
      
      console.log('id=', props.rec_id);
      console.log('data=', tableData1);
      setNameState(nameState);
  }, [props])

/*    const [tableDataSrc, setTableDataSrc] = useState([]);
  
   fetch(`/data_source_class?table_name=people_class&rec_id=${props.rec_id??0}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'Application/json',
      Accept: 'text/plain',
    },
  })
    .then((data1) => data1.json())
    .then((data1) => setTableDataSrc(data1)) ;  */

/*   const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueShortName, setValueShortName] = React.useState();
  const [valueFullName, setValueFullName] = React.useState();
  const [valueDescr, setValueDescr] = React.useState();
  const [valueExternalDS, setValueExternalDS] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  //valueId reloadDataSrc */

/*   const handleRowClick: GridEventListener<'rowClick'>  = (params) => {
    setValueID(`${params.row.id}`);
    setValueTitle(`${params.row.title}`);
    setValueShortName(`${params.row.shortname}`);
    setValueFullName( params.row.fullname || "" );
    setValueExternalDS(`${params.row.external_ds}`);
    setValueDescr( params.row.descr  || "" );
    //reloadDataSrc(`${params.row.id}`);
  };
 */
 // const [tableData, setTableData] = useState([])


//  const [tableDataSrc, setTableDataSrc] = useState([])
/* 
  useEffect(() => {
    fetch("/people_class")
      .then((data) => data.json())
      .then((data) => setTableDataSrc(data))     
  }, [])
  */
/*   useEffect(() => {
    console.log('useEffect fetch'); 
    fetch(`/data_source_class?table_name=people_class&rec_id=${props.rec_id??0}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        Accept: 'text/plain',
      },
    })
      .then((data) => data.json())
      .then((data) => setTableDataSrc(data))     
  }, [])  

 */
/////////////////////////////////////////////////////////////////// RELOAD /////////////////////
/* const reloadDataSrc = async (qqq) => {
  setIsLoading(true);
  try {
    console.log('reloadDataSrc'+qqq);
    const response = await  fetch(`/data_source_class?table_name=people_class&rec_id=${props.rec_id??0}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        Accept: 'text/plain',
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
}; */



const [open, setOpen] = React.useState(false); 

const columns_src = [
  { field: 'id', headerName: 'Код', width: 60 },
  { field: 'title', headerName: 'Источник', width: 280 },
  { field: 'title_src', headerName: 'Обозначение', width: 180 },
  { field: 'name_src', headerName: 'Название', width: 280 },
]

const rows_data  = [
  { id: '1', title: 'Код'  },
  { id: '2', title: 'Источник'  },
]

//const [openAlert, setOpenAlert] = React.useState(false, '');

const valueID = props.rec_id;
// reloadDataSrc(valueID);

/* if (props.rec_id>-1) {
  reloadDataSrc(props.rec_id);
  props.rec_id=-1;
}
 */
  return (
      <DataGrid
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        columns={columns_src}
        rows={tableData1}
        columnVisibilityModel={{
          fullname: false,
          field: false,
          external_ds: false,
          descr: false,
          actions: false,
        }}
       // onRowClick={handleRowClick} {...tableData} 
      //  onselectionChange={handleRowClick} {...tableData}  
      />
    )
}


//const DataTableDataSourceClass = React.memo(DataTableDataSourceClass1);
//module.exports = { DataTableDataSourceClass: DataTableDataSourceClass   }
//export React.memo(DataTableDataSourceClass)
 export  { DataTableDataSourceClass   }
//export default React.memo(DataTableDataSourceClass)