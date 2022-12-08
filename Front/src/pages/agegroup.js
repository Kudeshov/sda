import { DataTableAgeGroup } from './dt_agegroup';

function AgeGroup() {
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Возрастные группы населения</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableAgeGroup table_name="agegroup"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default AgeGroup;

