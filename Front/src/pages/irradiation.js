import { DataTablePeopleClass } from './dt_people_class';

function Irradiation() {
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Типы облучения</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="irradiation"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Irradiation;

