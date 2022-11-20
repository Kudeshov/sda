import React,  { useState, useEffect } from 'react'
import { DataGrid, ruRU } from '@mui/x-data-grid'

function DataTableDataSourceClass(props)  {
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

  return (
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
       // onRowClick={handleRowClick} {...tableDataSrc} 
       // onselectionChange={handleRowClick} {...tableDataSrc}  
      />
    )
}
 export  { DataTableDataSourceClass   }
