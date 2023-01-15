import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { DataTableDataSourceClass } from './dt_data_source_class';
import { DataTableIsotopeDecay } from './dt_comp_isotope_decay';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { table_names } from './sda_types';
 
import styled from "@emotion/styled";
 import { Tree, TreeNode } from "react-organizational-chart";

/* import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight"; */

const StyledNode = styled.div`
  padding: 5px;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid gray;
`; 

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTableIsotope = (props) => {
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();

  const [valueNIndex, setValueNIndex] = React.useState();
  const [valueNameRusInitial, setValueNameRusInitial] = React.useState();
  const [valueHalfLifeValue, setValueHalfLifeValue] = React.useState();
  const [valueHalfLifeValueInitial, setValueHalfLifeValueInitial] = React.useState();
  const [valueHalfLifePeriod, setValueHalfLifePeriod] = React.useState();
  const [valueHalfLifePeriodInitial, setValueHalfLifePeriodInitial] = React.useState();
  const [valueDecayConst, setValueDecayConst] = React.useState();
  const [valueDecayConstInitial, setValueDecayConstInitial] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [tableData1, setTableData1] = useState([]); 
  
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState([false]);

  useEffect(() => {
    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNIndex)||(valueHalfLifeValueInitial!==valueHalfLifeValue)
      ||(valueHalfLifePeriodInitial!==valueHalfLifePeriod)||(valueDecayConstInitial!==valueDecayConst));
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNIndex, valueHalfLifeValueInitial, valueHalfLifeValue, 
        valueHalfLifePeriodInitial, valueHalfLifePeriod, valueDecayConstInitial, valueDecayConst]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        lastId = tableData[0].id;
        setSelectionModel([tableData[0].id]);
        setValueID(`${tableData[0].id}`);
        setValueTitle(tableData[0].title);
        setValueNIndex(tableData[0].n_index);
        setValueHalfLifeValue(tableData[0].half_life_value);
        setValueDecayConst(tableData[0].decayconst);
        setValueHalfLifePeriod(tableData[0].half_life_period);
        setValueTitleInitial(tableData[0].title);       
        setValueNameRusInitial(tableData[0].n_index);
        setValueHalfLifeValueInitial(tableData[0].half_life_value);
        setValueDecayConstInitial(tableData[0].decayconst);
        setValueHalfLifePeriodInitial(tableData[0].half_life_period);
      }
    }
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {
    console.log('handleRowClick');
    setOpenAlert(false);
    if (editStarted)
    {
      handleClickSave(params);
    } 
    else 
    {
      setValueID(params.row.id);
      console.log('setValueID '+ params.row.id);
      setValueTitle(params.row.title);
      setValueNIndex(params.row.n_index);
      setValueHalfLifeValue(params.row.half_life_value);
      setValueDecayConst(params.row.decayconst);
      setValueHalfLifePeriod(params.row.half_life_period);
      setValueTitleInitial(params.row.title);
      setValueNameRusInitial(params.row.n_index);
      setValueHalfLifeValueInitial(params.row.half_life_value);
      setValueDecayConstInitial(params.row.decayconst);
      setValueHalfLifePeriodInitial(params.row.half_life_period);
    }
  }; 

  const handleClearClick = (params) => {
    if (editStarted)
    {
      handleClickSaveWhenNew(params);
    } 
    else 
    {
      setValueID(``);
      setValueTitle(``);
      setValueNIndex(``);
      setValueHalfLifeValue(``);
      setValueDecayConst(``);
      setValueHalfLifePeriod(`` );
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => { lastId = 0;} ); 
  }, [props.table_name])



  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNIndex,
      half_life_value: valueHalfLifeValue,
      decayconst: valueDecayConst,
      half_life_period: valueHalfLifePeriod         
    });
    if (!valueId) {
      addRec();
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/${props.table_name}/`+valueId, {
       method: 'PUT',
       body: js,
       headers: {
         'Content-Type': 'Application/json',
         Accept: '*/*',
       },
     });
     if (!response.ok) {
        alertSeverity = 'error';
        alertText = await response.text();
        setOpenAlert(true);          
      }
      else
      {
        alertSeverity = "success";
        alertText = await response.text();
        setOpenAlert(true);  
      }
   } catch (err) {
     alertText = err.message;
     alertSeverity = 'error';
     setOpenAlert(true);
   } finally {
     setIsLoading(false);
     if (fromToolbar) 
     {
       setValueTitleInitial(valueTitle);       
       setValueNameRusInitial(valueNIndex); 
       setValueHalfLifeValueInitial(valueHalfLifeValue);
       setValueDecayConstInitial(valueDecayConst);
       setValueHalfLifePeriodInitial(valueHalfLifePeriod);           
     }
    reloadData();     
   }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNIndex,
      half_life_value: valueHalfLifeValue,
      decayconst: valueDecayConst,
      half_life_period: valueHalfLifePeriod         
    });
    setIsLoading(true);
    try {
      const response = await fetch(`/${props.table_name}/`, {
        method: 'POST',
        body: js,
        headers: {
          'Content-Type': 'Application/json',
          Accept: '*/*',
        },
      });

      if (!response.ok) {
        alertSeverity = 'error';
        alertText = await response.text();
        setOpenAlert(true);          
      }
      else
      {
        alertSeverity = "success";
        const { id } = await response.json();
        alertText = `Добавлена запись с кодом ${id}`;
        lastId = id;  
        setValueID(lastId);
        setOpenAlert(true);  
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
      reloadData();
      setSelectionModel([lastId]);
      //Refresh initial state
      //console.log('addRec Refresh initial '+valueTitle+' '+valueNIndex);
      setValueTitle(valueTitle);
      setValueNIndex(valueNIndex);
      setValueHalfLifeValue(valueHalfLifeValue);
      setValueDecayConst(valueDecayConst);
      setValueHalfLifePeriod(valueHalfLifePeriod); 
      setValueTitleInitial(valueTitle);
      setValueNameRusInitial(valueNIndex);
      setValueHalfLifeValueInitial(valueHalfLifeValue);
      setValueDecayConstInitial(valueDecayConst);
      setValueHalfLifePeriodInitial(valueHalfLifePeriod);           
    }
  };

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
  const delRec =  async () => {
    const js = JSON.stringify({
        id: valueId,
        title: valueTitle,
    });
    setIsLoading(true);
    try {
      const response = await fetch(`/${props.table_name}/`+valueId, {
        method: 'DELETE',
        body: js,
        headers: {
          'Content-Type': 'Application/json',
          Accept: '*/*',
        },
      });
      if (!response.ok) {
        alertSeverity = 'error';
        alertText = await response.text();
        setOpenAlert(true);          
      }
      else
      {
        alertSeverity = "success";
        alertText = await response.text();
        setOpenAlert(true); 
        reloadData();
        setSelectionModel([tableData[0].id ]);  
        setValueID(`${tableData[0].id}`);
        setValueTitle(tableData[0].title);
        setValueNIndex(tableData[0].n_index);
        setValueHalfLifeValue(tableData[0].half_life_value);
        setValueDecayConst(tableData[0].decayconst);
        setValueHalfLifePeriod(tableData[0].half_life_period);
        setValueTitleInitial(tableData[0].title);
        setValueNameRusInitial(tableData[0].n_index);
        setValueHalfLifeValueInitial(tableData[0].half_life_value);
        setValueDecayConstInitial(tableData[0].decayconst);
        setValueHalfLifePeriodInitial(tableData[0].half_life_period);
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
    }
  };  

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////
  const reloadDataAlert =  async () => {
    alertSeverity = "info";
    alertText =  'Данные успешно обновлены';
    try 
    {
      await reloadData();
    } catch(e)
    {
      alertSeverity = "error";
      alertText =  'Ошибка при обновлении данных: '+e.message;      
      setOpenAlert(true);
      return;
    }
    setOpenAlert(true);        
  }

  const reloadData = async () => {
    try {
      const response = await fetch(`/${props.table_name}/`);
       if (!response.ok) {
        alertText = `Ошибка при обновлении данных: ${response.status}`;
        alertSeverity = "false";
        const error = response.status + ' (' +response.statusText+')';  
        throw new Error(`${error}`);
      }
      else
      {  
        const result = await response.json();
        setTableData(result);
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /////////////////////////////////////////
  const [openDel, setOpenDel] = React.useState(false); 
  const [openSave, setOpenSave] = React.useState(false); 
  const [openSaveWhenNew, setOpenSaveWhenNew] = React.useState(false); 

  const handleClickDelete = () => {
    setOpenDel(true);
  };

  const handleCloseDelNo = () => {
    setOpenDel(false);
  };

  const handleCloseDelYes = () => {
    setOpenDel(false);
    delRec();
  };

  const handleClickSave = () => {
    setOpenSave(true);
  };

  const handleCloseSaveNo = () => {
    setOpenSave(false);
    handleCancelClick();
  };

  const handleCloseSaveYes = () => {
    setOpenSave(false);
    saveRec(false);
    handleCancelClick();
  };

  const handleClickSaveWhenNew = () => {
    setOpenSaveWhenNew(true);
  };

  const handleCloseSaveWhenNewNo = () => {
    setOpenSaveWhenNew(false);

    setValueID(``);
    setValueTitle(``);
    setValueNIndex(``);
    setValueHalfLifeValue(``);
    setValueDecayConst(``);
    setValueHalfLifePeriod(`` );
  };

  const handleCloseSaveWhenNewYes = () => {
    setOpenSaveWhenNew(false);
    saveRec(true);
    setValueID(``);
    setValueTitle(``);
    setValueNIndex(``);
    setValueHalfLifeValue(``);
    setValueDecayConst(``);
    setValueHalfLifePeriod(`` );
  };

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 130, hideable: false },
    { field: 'n_index', headerName: 'Индекс', width: 85 },
    { field: 'half_life_value', headerName: 'Период полураспада', width: 180 },
    { field: 'half_life_period', headerName: 'Единица измерения периода полураспада', width: 180 },
    { field: 'decayconst', headerName: 'Постоянная распада 1/сек', width: 180 },
  ]

  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    const selectedIDs = new Set(selectionModel);
    //console.log('selectedIDs ' + selectedIDs);
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    //console.log('selectedRowData ' + selectedRowData);
    if (selectedRowData.length)
    {
      setValueID(`${selectedRowData[0].id}`);
      setValueTitle(selectedRowData[0].title);
      setValueNIndex(selectedRowData[0].n_index);
      setValueHalfLifeValue(selectedRowData[0].half_life_value );
      setValueDecayConst(selectedRowData[0].decayconst);
      setValueHalfLifePeriod(selectedRowData[0].half_life_period);
      setValueTitleInitial(selectedRowData[0].title);
      setValueNameRusInitial(selectedRowData[0].n_index);
      setValueHalfLifeValueInitial(selectedRowData[0].half_life_value );
      setValueDecayConstInitial(selectedRowData[0].decayconst);
      setValueHalfLifePeriodInitial(selectedRowData[0].half_life_period);
    }
  }

  function CustomToolbar1() {
    const apiRef = useGridApiContext();
    const handleExport = (options) =>
      apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>saveRec(true)}  color="primary" size="small" title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
        <IconButton onClick={()=>handleClickDelete()}  color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>reloadDataAlert()} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleExport({ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} color="primary" 
            size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
      </GridToolbarContainer>
    );
  }

  ///////////////////////////////////////////////////////////////////  Tree load functions and hook  /////////////////////
  //const [treeFilterString, setTreeFilterString] = React.useState('');

  useEffect(() => {
 /*    function filterTree( tree1, filterS )
    {
      var i;
      i = 0;
      while (i < tree1.length) 
      {
        if (tree1[i].children.length === 0)
        {
          if (tree1[i].title.toLowerCase().indexOf(filterS.toLowerCase()) === -1)
          {
            tree1.splice(i, 1); 
            i--;
          }
        }
        else
        {
          filterTree( tree1[i].children, filterS );
        }
        i++;
      }
      i = 0;
      while (i < tree1.length) 
      {
        if (tree1[i].children.length === 0)
        {
          if (tree1[i].title.toLowerCase().indexOf(filterS.toLowerCase()) === -1)
          {
            tree1.splice(i, 1); 
            i--;
          }
        }
        else
        {
          filterTree( tree1[i].children, filterS );
        }
        i++;
      }      
    } */
    function list_to_tree1(list/* , filterString */) {
      console.log(list); 
      var map = {}, node, roots = [], i;
       for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i;   // initialize the map
        list[i].children = []; // initialize the children
      }
      console.log(map);
      //filterString=filterString||'';
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent_id) {
          // if you have dangling branches check that map[node.parentId] exists
          console.log('map[node.parent_id] node.parent_id id = '+node.parent_id+' ' +node.id);
          console.log(map[node.parent_id]);
          list[map[node.parent_id]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      //filterTree(roots, filterString.toLowerCase());  
      return roots;
    }

    let arr = list_to_tree1( tableData1/* , treeFilterString */ );
    setTreeData( arr );
  }, [tableData1/* , treeFilterString */]) 


  useEffect(() => {
    if (!valueId)
      return;

    console.log( `/isotope_tree/`+valueId );
    fetch(`/isotope_tree/`+valueId||0) 
      .then((data) => data.json())
      .then((data) => setTableData1(data))
      .then((data) => { console.log( `fetched /isotope_tree/`+valueId); //lastId = data[0].id||0; clickAfterReload = true; console.log( 'setSelected ');  //console.log( tableData[0].id||0 ); 
          } );   
  }, [valueId]);

  const [treeData, setTreeData] = useState([]); 

/*   const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState('');

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    //handleItemClick(nodeIds);
  };   */

/*   const getTreeItemsFromData = treeItems => {
    return treeItems.map(treeItemData => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeItemsFromData(treeItemData.children);
      }
      return ( 
        <TreeItem
          key={treeItemData.id}
          nodeId={treeItemData.id?treeItemData.id.toString():0}
          label={treeItemData.title}
          children={children}
        />
      );
    });
  };
 */
  function probDisplay(prob) {
    if ((parseInt(prob)===0)||(parseInt(prob)===1))
      return('')
    else
      return(<div><small>P={prob}</small><br></br></div>);
  }
  
  function timeDisplay(val, per) {
   // if ((val==0)||(val==1))
   //   return('')
   // else
    return(<span> ({val} {per})</span>);
  }

  const getTreeNodesFromData = treeItems => {
    return treeItems.map(treeItemData => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeNodesFromData(treeItemData.children);
      }
      //children = getTreeNodesFromData(treeItemData.children);
      return ( 
        <TreeNode
          //key={treeItemData.id}
          //nodeId={treeItemData.id?treeItemData.id.toString():0}
          //label={treeItemData.title}
          label={<StyledNode>
            {probDisplay(treeItemData.decay_prob)}{treeItemData.title} {/* {treeItemData.id} */} {timeDisplay(treeItemData.half_life_value,treeItemData.half_life_period)}</StyledNode>}
          children={children}
        />
      );
    });
  };
/*   const DataTreeView = ({ treeItems }) => {
    return (
      <div>
      <p></p>
      <TreeView
        aria-label="Tree navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        expanded={expanded}
        selected={selected}          
         loading={isLoading}
      >
        {getTreeItemsFromData(treeItems)}
      </TreeView></div>
    );
  }; */
  
  return (
    <div style={{ height: 640, width: 1500 }}>
    <table border = "0" style={{ height: 550, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 640, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 486, width: 585 }}>

      <DataGrid
        components={{ Toolbar: CustomToolbar1 }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableData}
        loading={isLoading}
        columns={columns}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}        
        initialState={{
          columns: {
            columnVisibilityModel: {
              //half_life_value: false,
              //decayconst: false,
              half_life_period: false,
            },
          },
        }}        
        onRowClick={handleRowClick} {...tableData} 
      />
      </div>
      <Box sx={{ width: 585 }}>
      <Collapse in={openAlert}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertText}
        </Alert>
      </Collapse>
      </Box>
      
      </td>
      <td style={{ height: 550, width: 900, verticalAlign: 'top' }}>
      <TextField  id="ch_id"  disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={valueId || ''} size="small"  onChange={e => setValueID(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;
      Радиоизотоп - сюда добавить выбор из списка Nuclide (из БД)
      <p></p>
      <TextField  id="ch_n_index" sx={{ width: '40ch' }}  size="small" label="Индекс"  variant="outlined"  value={valueNIndex || ''} onChange={e => setValueNIndex(e.target.value)} />
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_half_life_value" sx={{ width: '40ch' }} size="small" label="Период полураспада"  variant="outlined" value={valueHalfLifeValue || ''} onChange={e => setValueHalfLifeValue(e.target.value)}/>
      <p></p>
      Ед. изм: 4Заменить на список из (n, m, d, y, s, us, ms, h) 
      <TextField  id="ch_half_life_period" sx={{ width: '40ch' }} label="Ед. изм."  size="small" multiline maxRows={4} variant="outlined" value={valueHalfLifePeriod || ''} onChange={e => setValueHalfLifePeriod(e.target.value)}/>
      <p></p>
      <TextField  id="ch_decayconst" sx={{ width: '100ch' }} label="Постоянная распада, 1/сек"  size="small" multiline maxRows={4} variant="outlined" value={valueDecayConst || ''} onChange={e => setValueDecayConst(e.target.value)}/>


{/*       <Box sx={{ height: 415, flexGrow: 1, overflowY: 'auto' }} >     
            <DataTreeView treeItems={treeData} />
          </Box> 
 */}


      <p></p>
      <Tree
      lineWidth={"2px"}
      lineColor={"gray"}
      lineBorderRadius={"10x"}
      label={<StyledNode>Радиоактивные ряды: {valueTitle}</StyledNode>}> 
        {getTreeNodesFromData(treeData)}
      </Tree>         
      <p></p>
      <div style={{ height: 240, width: 800 }}>
        Радиоактивные ряды<br/>
        <DataTableIsotopeDecay table_name={valueTitle} rec_id={valueId} />
      </div>

      <div style={{ height: 300, width: 800 }}>
        Источники данных<br/>
        <DataTableDataSourceClass table_name={props.table_name} rec_id={valueId} />
      </div>
    </td>
  </tr>
  </tbody>
  </table>

  <Dialog open={openDel} onClose={handleCloseDelNo} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
          В таблице "{table_names[props.table_name]}" предложена к удалению следующая запись:<p></p><b>{valueTitle}</b>; Код в БД = <b>{valueId}</b><p></p>
          Вы желаете удалить указанную запись?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseDelNo} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleCloseDelYes} >Да</Button>
      </DialogActions>
  </Dialog>
 
  <Dialog open={openSave} onClose={handleCloseSaveNo} fullWidth={true}>
    <DialogTitle>
        Внимание
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
            В запись таблицы {table_names[props.table_name]} с кодом <b>{valueId}</b> внесены изменения.<p></p>
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueNIndex === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNIndex+'; ' }<p></p>
            {valueHalfLifeValue === valueHalfLifeValueInitial ? '' : 'Название (англ. яз): '+valueHalfLifeValue+'; ' }<p></p>
            {valueDecayConst === valueDecayConstInitial ? '' : 'Комментарий (рус. яз): '+valueDecayConst+'; ' }<p></p>
            {valueHalfLifePeriod === valueHalfLifePeriodInitial ? '' : 'Комментарий (англ. яз): '+valueHalfLifePeriod+'; ' }<p></p>
            <p></p>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveYes} >Да</Button>
    </DialogActions>
  </Dialog>

  <Dialog open={openSaveWhenNew} onClose={handleCloseSaveWhenNewNo} fullWidth={true}>
    <DialogTitle>
        Внимание
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
            В запись таблицы {table_names[props.table_name]} с кодом <b>{valueId}</b> внесены изменения.<p></p>
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueNIndex === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNIndex+'; ' }<p></p>
            {valueHalfLifeValue === valueHalfLifeValueInitial ? '' : 'Название (англ. яз): '+valueHalfLifeValue+'; ' }<p></p>
            {valueDecayConst === valueDecayConstInitial ? '' : 'Комментарий (рус. яз): '+valueDecayConst+'; ' }<p></p>
            {valueHalfLifePeriod === valueHalfLifePeriodInitial ? '' : 'Комментарий (англ. яз): '+valueHalfLifePeriod+'; ' }<p></p>
            <p></p>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewYes} >Да</Button>
    </DialogActions>
  </Dialog>
 </div>     
  )
}

export { DataTableIsotope, lastId }
