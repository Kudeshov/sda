import { DataTablePeopleClass } from './dt_people_class';

function Coeff() {
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Типы облучаемых лиц</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass />
     </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Coeff;
