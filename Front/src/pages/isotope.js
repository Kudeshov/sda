import { DataTableIsotope } from './dt_isotope';
import { table_names } from './sda_types';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Isotope() {
  useDocumentTitle(table_names['isotope']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['isotope']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableIsotope table_name="isotope"/>
     </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Isotope;
