//import { DataTableDataSource } from './dt_data_source';
import MyStepper from './dt_db_struct';
//import { table_names } from './sda_types';
//import { useEffect } from 'react';

/* const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
} */

function DbStruct() {
  
  //useDocumentTitle(table_names['data_source']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Целевые БД</h3>
    <table>
      <tbody>
    <tr>
      <td width="1600">
        <MyStepper />
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}

export default DbStruct;