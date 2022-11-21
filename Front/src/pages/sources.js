import { DataTableDataSource } from './dt_data_source';

function Sources() {
  return (
    <div className="App">
    <center><h3>Источники данных</h3></center> 
    <table>
    <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="1600">
        <DataTableDataSource />
     </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}

export default Sources;