import { DataTablePeopleClass } from './dt_people_class';

function Db() {
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Периоды интегрирования</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="integral_period"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Db;

