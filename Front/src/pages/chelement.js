import { DataTableChelement } from './dt_chelement';
import { table_names } from './table_names';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Chelement() {
  useDocumentTitle(table_names['chelement']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['chelement']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableChelement table_name="chelement"/>
     </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Chelement;
