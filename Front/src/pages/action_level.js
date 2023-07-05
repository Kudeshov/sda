import { DataTablePeopleClass } from './dt_people_class';
import { table_names } from './table_names';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function ActionLevel() {
  useDocumentTitle(table_names['action_level']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['action_level']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="action_level"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default ActionLevel;

