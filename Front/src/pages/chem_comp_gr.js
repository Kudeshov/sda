import { DataTableExpScenario } from './dt_exp_scenario';
import { table_names } from './sda_types';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Organ() {
  useDocumentTitle(table_names['chem_comp_gr']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['chem_comp_gr']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableExpScenario table_name="chem_comp_gr"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Organ;

