import { DataTableExpScenario } from './dt_exp_scenario';
import { table_names } from './sda_types';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function CriterionGr() {
  useDocumentTitle(table_names['criterion_gr']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['criterion_gr']}</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableExpScenario table_name="criterion_gr"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default CriterionGr;

