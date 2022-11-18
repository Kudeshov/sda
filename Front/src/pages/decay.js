import { globalJson, DataTable } from './DataTable';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';
 
//const drawerWidth = 240;
 
/* const data1 = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'title', headerName: 'Title', width: 350, editable: true },
  { field: 'atomic_num', headerName: 'Atomic Num', width: 100 }
] */

const downloadExcel = (data) => {
  console.log(data);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Химические элементы");
    XLSX.writeFile(workbook, "Химические элементы.xlsx");
  };

function Decay() {
  return (
    <div className="App">
    <center><h1>Химические элементы</h1></center> 
    <table>
    <tr>
{/*       <td width="300">

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Chemical elements', 'Isotopes', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
           <ListItem key='Test' disablePadding onClick={()=>downloadExcel(globalJson)}>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary='Test' />
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>

      </td>
 */}
      <td width="60">
        &nbsp;
      </td>
      <td width="900">
        <DataTable />
      </td>
      <td width="200"> 
	<Button variant="outlined" onClick={()=>downloadExcel(globalJson)}>
    	  Сохранить Excel
	</Button>

      </td>
    </tr>
    </table>   
    </div>
  );
}
export default Decay;
