import { DataTablePeopleClass } from './dt_people_class';
import { table_names } from './sda_types';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Irradiation() {
  useDocumentTitle(table_names['irradiation']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['irradiation']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="irradiation"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Irradiation;

