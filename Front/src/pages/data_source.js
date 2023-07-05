import { DataTableDataSource } from './dt_data_source';
import { table_names } from './table_names';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Sources() {
  useDocumentTitle(table_names['data_source']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['data_source']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableDataSource table_name="data_source"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}

export default Sources;