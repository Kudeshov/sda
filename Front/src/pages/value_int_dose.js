import { BigTableValueIntDose } from './bft_value_int_dose';
import { table_names } from './table_names';
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function ValueIntDose() {
  useDocumentTitle(table_names['value_int_dose']);
  return (
    <div className="App">
   {/*  <h3>&nbsp;&nbsp;{table_names['value_int_dose']}</h3> */}
    <table>
      <tbody>
    <tr>
      <td width="10">
        &nbsp;
      </td>
      <td width="1600">
        <BigTableValueIntDose table_name="value_int_dose"/>
     </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default ValueIntDose;
