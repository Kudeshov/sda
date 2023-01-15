import { DataTablePeopleClass } from './dt_people_class';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Db() {
  useDocumentTitle("Формы вещества");
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Формы вещества</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="subst_form"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Db;

