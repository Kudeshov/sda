import React, { useState, useEffect } from 'react'
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
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import CircularProgress from '@material-ui/core/CircularProgress';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTableExpScenario = (props) => {
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();
  const [valueNameRus, setValueNameRus] = React.useState();
  const [valueNameRusInitial, setValueNameRusInitial] = React.useState();
  const [valueNameEng, setValueNameEng] = React.useState();
  const [valueNameEngInitial, setValueNameEngInitial] = React.useState();
  const [valueDescrEng, setValueDescrEng] = React.useState();
  const [valueDescrEngInitial, setValueDescrEngInitial] = React.useState();
  const [valueDescrRus, setValueDescrRus] = React.useState();
  const [valueDescrRusInitial, setValueDescrRusInitial] = React.useState();
  const [valueParentID, setValueParentID] = React.useState();
  const [valueParentIDInitial, setValueParentIDInitial] = React.useState();
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [treeData, setTreeData] = useState([]); 
  // const [selectionModel, setSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState([false]);

  useEffect(() => {
    console.log('valueTitle ' + valueTitle + ' ' +valueTitleInitial);
    console.log('valueNameRus ' + valueNameRus + ' ' +valueNameRusInitial);
    console.log('valueNameEng ' + valueNameEng + ' ' +valueNameEngInitial);
    console.log('valueDescrEng ' + valueDescrEng + ' ' +valueDescrEngInitial);
    console.log('valueDescrRus ' + valueDescrRus + ' ' +valueDescrRusInitial);
    console.log('valueParentID ' + valueParentID + ' ' +valueParentIDInitial);
    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng)||(valueDescrRusInitial!==valueDescrRus)||(valueParentIDInitial!==valueParentID));
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, valueParentID, valueParentIDInitial]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        console.log('useEffect isLoading, tableData ON lastId '+lastId);
        lastId = tableData[0].id;
        //setSelectionModel(tableData[0].id);
        //setValueID(`${tableData[0].id}`);
        setValueTitle(`${tableData[0].title}`);
        setValueNameRus(`${tableData[0].name_rus}`);
        setValueNameEng(`${tableData[0].name_eng}`);
        setValueDescrRus(`${tableData[0].descr_rus}`);
        setValueDescrEng(`${tableData[0].descr_eng}`);
        console.log('useEffect Refresh initial '+tableData[0].title+' '+tableData[0].name_rus);
        setValueTitleInitial(`${tableData[0].title}`);       
        setValueNameRusInitial(`${tableData[0].name_rus}`);
        setValueNameEngInitial(`${tableData[0].name_eng}`);
        setValueDescrRusInitial(`${tableData[0].descr_rus}`);
        setValueDescrEngInitial(`${tableData[0].descr_eng}`);
        setValueParentID(tableData[0].parent_id||-1);
        setValueParentIDInitial(tableData[0].parent_id||-1);
      }
    }
    }, [ isLoading, tableData] );

    function list_to_tree(list) {
      var map = {}, node, roots = [], i;
      
      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
      }
      
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent_id) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.parent_id]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      return roots;
    }

    const getTreeItemsFromData = treeItems => {
      return treeItems.map(treeItemData => {
        let children = undefined;
        if (treeItemData.children && treeItemData.children.length > 0) {
          children = getTreeItemsFromData(treeItemData.children);
        }
        return (
          <TreeItem
            key={treeItemData.id}
            nodeId={treeItemData.id}
            label={treeItemData.title}
            children={children}
            //onClick={() => handleItemClick(treeItemData.id)}   //{handleItemClick}
            //{() => console.log(treeItemData.title)} onRowClick=
//            expanded={true}
          />
        );
      });
    };

    const [expanded, setExpanded] = React.useState([1,2]);
    const [selected, setSelected] = React.useState([]);

    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };
  
    const handleSelect = (event, nodeIds) => {
      setSelected(nodeIds);

      handleItemClick(nodeIds);

/*       console.log('setSelected '+nodeIds);
      var res = tableData.filter(function(item) {
        return item.id === nodeIds;
      });
 
      setValueID(res[0].id);  */     
    };  

    const DataTreeView = ({ treeItems }) => {
      //console.log('treeItems');
      let ids = tableData.map(a => a.id);
      //console.log(ids);
      return (
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
          expanded={expanded}
          selected={selected}          
          //defaultCollapseIcon={<ExpandMoreIcon />}
          //defaultExpandIcon={<ChevronRightIcon />}
          //onNodeToggle={handleChange}
          //defaultExpanded={[1,2]}
          //expanded={true}
          loading={isLoading}
          defaultExpanded={ids}
        >
          {getTreeItemsFromData(treeItems)}
        </TreeView>
      );
    };

  const handleItemClick = (id) => {
    console.log('handleItemClick');
    if (editStarted)
    {
      handleClickSave(id);
    } 
    else 
    {
      var res = tableData.filter(function(item) {
        return item.id === id;
      });
 
      setValueID(res[0].id);
  
      setValueTitle(res[0].title);
      setValueNameRus(res[0].name_rus);
      setValueNameEng(res[0].name_eng);
      setValueDescrRus(res[0].descr_rus);
      setValueDescrEng(res[0].descr_eng);    
      setValueParentID(res[0].parent_id||-1);    
      console.log('handleItemClick '+tableData[0].title+' '+tableData[0].name_rus);
      setValueTitleInitial(res[0].title);
      setValueNameRusInitial(res[0].name_rus);
      setValueNameEngInitial(res[0].name_eng);
      setValueDescrRusInitial(res[0].descr_rus);
      setValueDescrEngInitial(res[0].descr_eng);
      setValueParentIDInitial(res[0].parent_id||-1); 
    }   
  }; 

  const handleClearClick = (params) => {
    console.log('handleClearClick');
    if (editStarted)
    {
      console.log('params');
      console.log(params);
      handleClickSaveWhenNew(params);
    } 
    else 
    {
      setValueID(``);
      setValueTitle(``);
      setValueNameRus(``);
      setValueNameEng(``);
      setValueDescrRus(``);
      setValueDescrEng(``);
      setValueParentID(-1);
    }
  }; 

  useEffect(() => {
    console.log( 'Fetch ' );  
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => { console.log( 'useEffect '+ props.table_name ); /* setTreeData( list_to_tree( data ) ); */ lastId = 0;} ); 
  }, [props.table_name])

   useEffect(() => {
    //console.log( 'setTreeData ' + tableData );    
    //let arr = tableData; //.map(x => Object.assign({}, tableData, { "children": null }));
    setTreeData( list_to_tree( tableData ) );
  }, [tableData]) 

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    let myParentID;
    myParentID = valueParentID === -1 ? null : valueParentID;
    console.log( 'saveRec myParentID ' + myParentID );     
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      parent_id: myParentID        
    });

    console.log( js ); 

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
      console.log('fromToolbar saveRec')
       setValueTitleInitial(valueTitle);       
       setValueNameRusInitial(valueNameRus); 
       setValueNameEngInitial(valueNameEng);
       setValueDescrRusInitial(valueDescrRus);
       setValueDescrEngInitial(valueDescrEng);    
       setValueParentIDInitial(valueParentID);
     }
    reloadData();     
   }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    let myParentID;
    myParentID = valueParentID === -1 ? null : valueParentID;
    console.log( 'myParentID ' + myParentID );   
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      parent_id: myParentID         
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
        alertText =  await response.text();
        lastId = parseInt( alertText.substr(alertText.lastIndexOf('ID:') + 3, 20)); 
        //console.log(lastId);
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
      //setSelectionModel(lastId);
      //Refresh initial state
/*       console.log('addRec Refresh initial '+valueTitle+' '+valueNameRus);
      setValueTitleInitial(valueTitle);
      setValueNameRusInitial(valueNameRus);
      setValueNameEngInitial(valueNameEng);
      setValueDescrRusInitial(valueDescrRus);
      setValueDescrEngInitial(valueDescrEng);
      setValueParentIDInitial(valueParentID); */
    }
  };

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
  const delRec =  async () => {
    //console.log('delrec clicked');
    const js = JSON.stringify({
        id: valueId,
        title: valueTitle,
    });
    setIsLoading(true);
    //console.log(js);
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
        console.log('response not OK');
        alertSeverity = 'error';
        alertText = await response.text();
        setOpenAlert(true);          
      }
      else
      {
        console.log('response OK');
        alertSeverity = "success";
        alertText = await response.text();
        setOpenAlert(true); 
        reloadData();
        //setSelectionModel(tableData[0].id );  
        setValueID(`${tableData[0].id}`);
        setValueTitle(`${tableData[0].title}`);
        setValueNameRus(`${tableData[0].name_rus}`);
        setValueNameEng(`${tableData[0].name_eng}`);
        setValueDescrRus(`${tableData[0].descr_rus}`);
        setValueDescrEng(`${tableData[0].descr_eng}`);
        setValueTitleInitial(`${tableData[0].title}`);
        setValueNameRusInitial(`${tableData[0].name_rus}`);
        setValueNameEngInitial(`${tableData[0].name_eng}`);
        setValueDescrRusInitial(`${tableData[0].descr_rus}`);
        setValueDescrEngInitial(`${tableData[0].descr_eng}`);
        setValueParentID(`${tableData[0].parent_id||-1}`);
        setValueParentIDInitial(`${tableData[0].parent_id||-1}`);
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
        //console.log('response not ok');
        alertText = `Ошибка при обновлении данных: ${response.status}`;
        alertSeverity = "false";
        const error = response.status + ' (' +response.statusText+')';  
        throw new Error(`${error}`);
      }
      else
      {  
        const result = await response.json();
        console.log('reloadData setTableData');
        setTableData(result);
      }
    } catch (err) {
      //console.log('catch err');
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
    console.log('handleClickSave');
    setOpenSave(true);
  };

  const handleCloseSaveNo = () => {
    console.log('handleCloseSaveNo');
    setOpenSave(false);
    handleCancelClick();
  };

  const handleCloseSaveYes = () => {
    console.log('handleCloseSaveYes setOpenSave');
    setOpenSave(false);
    console.log('handleCloseSaveYes saveRec')
    saveRec(false);
    console.log('handleCloseSaveYes handleCancelClick')
    handleCancelClick();
  };

  const handleClickSaveWhenNew = () => {
    console.log('handleClickSaveWhenNew');
    setOpenSaveWhenNew(true);
  };

  const handleCloseSaveWhenNewNo = () => {
    console.log('handleCloseSaveNo');
    setOpenSaveWhenNew(false);
    handleCancelClick();    
/*     setValueID(``);
    setValueTitle(``);
    setValueNameRus(``);
    setValueNameEng(``);
    setValueDescrRus(``);
    setValueDescrEng(``);
    setValueParentID(-1); */
  };

  const handleCloseSaveWhenNewYes = () => {
    console.log('handleCloseSaveYes');
    setOpenSaveWhenNew(false);
    saveRec(true);
    handleCancelClick();
/*     setValueID(``);
    setValueTitle(``);
    setValueNameRus(``);
    setValueNameEng(``);
    setValueDescrRus(``);
    setValueDescrEng(`` );
    setValueParentID(-1); */
  };

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
/*   const columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 250 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'descr_rus', headerName: 'Комментарий (рус.яз)', width: 180 },
    { field: 'descr_eng', headerName: 'Комментарий (англ.яз)', width: 180 },
  ]
 */
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    console.log('handleCancelClick');
    const selectedIDs = selected;//new Set(selectionModel);
    console.log(selectedIDs);
    const selectedRowData = tableData.filter((row) => selectedIDs===row.id);
    //console.log(selectedRowData);
    if (selectedRowData.length)
    {
      console.log('selectedRowData.length' + selectedRowData.length);
      setValueID(`${selectedRowData[0].id}`);
      setValueTitle(`${selectedRowData[0].title}`);
      setValueNameRus(`${selectedRowData[0].name_rus}`);
      setValueNameEng(`${selectedRowData[0].name_eng}` );
      setValueDescrRus(`${selectedRowData[0].descr_rus}`);
      setValueDescrEng(`${selectedRowData[0].descr_eng}` );
      //console.log('handleCancelClick Refresh initial '+selectedRowData[0].title+' '+selectedRowData[0].name_rus);
      setValueTitleInitial(`${selectedRowData[0].title}`);
      setValueNameRusInitial(`${selectedRowData[0].name_rus}`);
      setValueNameEngInitial(`${selectedRowData[0].name_eng}` );
      setValueDescrRusInitial(`${selectedRowData[0].descr_rus}`);
      setValueDescrEngInitial(`${selectedRowData[0].descr_eng}` );
      console.log('selectedRowData[0].parent_id' + selectedRowData[0].parent_id);
      setValueParentID(selectedRowData[0].parent_id||-1);
      setValueParentIDInitial(selectedRowData[0].parent_id||-1);
    }
  }

  return (
    <div style={{ height: 550, width: 1500 }}>
    <table border = "0" style={{ height: 550, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 550, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 400, width: 585 }}>
      <Box sx={{ border: 1, borderRadius: '3px', borderColor: 'grey.300', height: 400 }} >
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
        <IconButton 
        //onClick={()=>handleExport({ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} 
            color="primary" 
            size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
        <Box sx={{ height: 367, flexGrow: 1, overflowY: 'auto' }} >     
          <DataTreeView treeItems={treeData} />
        </Box> 
      </Box>
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
      {isLoading && <CircularProgress/>} 
      </Box>
      
      </td>
      <td style={{ height: 550, width: 900, verticalAlign: 'top' }}>
      <TextField  id="ch_id"  disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={ valueId ||''} size="small" /* onChange={e => setValueID(e.target.value)} *//>
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;
      <FormControl sx={{ width: '30ch' }} size="small">
        <InputLabel id="ch_parent_id">Родительский класс</InputLabel>
          <Select labelId="ch_parent_id" id="ch_parent_id1" label="Родительский класс" value={valueParentID  || "" } onChange={e => setValueParentID(e.target.value)} >
          <MenuItem key={-1} value={-1}>
                    {'Не задан'}
                  </MenuItem>
          {tableData?.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title ?? option.id}
                  </MenuItem>
                );
                })}
        </Select>
      </FormControl>  
      <p/> 
      <TextField  id="ch_name_rus" sx={{ width: '49ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '49ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
      <p/>
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} onChange={e => setValueDescrRus(e.target.value)}/>
      <p/> 
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} onChange={e => setValueDescrEng(e.target.value)}/>
      <p/>
      <div style={{ height: 300, width: 800 }}>
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
          В таблице "Типы облучаемых лиц" предложена к удалению следующая запись:<p/><b>{valueTitle}</b>; Код в БД = <b>{valueId}</b><p/>
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
          {/*   В запись таблицы "Типы облучаемых лиц" с кодом <b>{valueId}</b> внесены изменения.<p/> */}
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p/>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p/>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p/>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p/>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p/>
            <p/>Вы желаете сохранить указанную запись?
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
          {/*   В запись таблицы "Типы облучаемых лиц" с кодом <b>{valueId}</b> внесены изменения.<p/> */}
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p/>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p/>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p/>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p/>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p/>
            <p/>Вы желаете сохранить указанную запись?
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

export { DataTableExpScenario, lastId }
