import { DataTablePeopleClass } from './dt_people_class';

function Db() {
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Уровень линейной передачи энергии</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="let_level"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Db;

