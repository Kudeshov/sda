import { globalJson, DataTablePeopleClass } from './dt_people_class';

function Coeff() {
  return (
    <div className="App">
    <center><h3>Типы облучаемых лиц</h3></center> 
    <table>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass />
     </td>
    </tr>
    </table>   
    </div>
  );
}
export default Coeff;
