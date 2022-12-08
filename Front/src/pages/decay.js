import { DataTable } from './DataTable';
import { useEffect } from 'react';

  const useDocumentTitle = (title) => {
    useEffect(() => {
       document.title = title
    }, [title])
  }

function Decay() {
  useDocumentTitle("Радиоактивный распад");
 
  return (
    <div className="App">
    <center><h1>Химические элементы</h1></center> 
    <table>
    <tbody>
    <tr>
      <td width="60">
        &nbsp;
      </td>
      <td width="900">
        <DataTable />
      </td>
      <td width="200"> 
      </td>
    </tr>
    </tbody>
    </table>   
    </div>
  );
}
export default Decay;
