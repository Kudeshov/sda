import { DataTableDoseRatio } from './dt_dose_ratio';

function CalcFunction() {
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Функции</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableDoseRatio table_name="calcfunction"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default CalcFunction;

