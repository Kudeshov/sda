import { DataTablePeopleClass } from './dt_people_class';
import { table_names } from './table_names';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function AerosolAmad() {
  useDocumentTitle(table_names['aerosol_amad']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['aerosol_amad']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="aerosol_amad"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default AerosolAmad;

