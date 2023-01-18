import { DataTableCriterion } from './dt_criterion';
import { table_names } from './sda_types';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Criterion() {
  useDocumentTitle(table_names['criterion'] + ' - в работе');
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;{table_names['criterion']}   - в работе </h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableCriterion table_name="criterion_gr"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Criterion;

