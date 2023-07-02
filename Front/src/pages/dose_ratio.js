import { DataTableDoseRatio } from './dt_dose_ratio';
import { table_names } from './table_names';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function DoseRatio() {
  useDocumentTitle(table_names['dose_ratio']);
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Параметры</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableDoseRatio table_name="dose_ratio"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default DoseRatio;

