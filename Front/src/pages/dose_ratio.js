import { DataTableDoseRatio } from './dt_dose_ratio';

function DoseRatio() {
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

