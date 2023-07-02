import { DataTablePeopleClass } from './dt_people_class';
import { table_names } from './table_names';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Coeff() {
  useDocumentTitle(table_names['people_class']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['people_class']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="people_class"/>
     </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Coeff;
