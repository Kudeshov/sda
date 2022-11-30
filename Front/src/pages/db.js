//import { Typography } from "@material-ui/core";
//import TextField from '@mui/material/TextField';
//import Box from '@mui/material/Box';
import { DataTablePeopleClass } from './dt_people_class';

function Db() {
  return (
    <div className="App">
    <h3>&nbsp;&nbsp;Формы вещества</h3>
    <table>
      <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTablePeopleClass table_name="subst_form"/>
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Db;

