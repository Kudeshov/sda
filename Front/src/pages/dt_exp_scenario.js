import React, { useState, useEffect } from 'react';
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
import { ExportToCsv } from 'export-to-csv-fix-source-map';
import { table_names } from './sda_types';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;
var clickAfterReload = false;

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
  const [valueNormativ, setValueNormativ] = React.useState();
  const [valueNormativInitial, setValueNormativInitial] = React.useState();
  
  const [isLoading, setIsLoading] = React.useState("false");
  const [tableData, setTableData] = useState([]); 
  const [tableNormativ, setNormativ] = useState([]); 
  const [treeData, setTreeData] = useState([]); 
  const [editStarted, setEditStarted] = useState([false]);

  useEffect(() => {
    setEditStarted(       
       (valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng) ||(valueDescrRusInitial!==valueDescrRus)||(valueParentIDInitial!==valueParentID)/*||(valueNormativInitial!==valueNormativ)*/);
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, valueParentID, valueParentIDInitial, valueNormativ, valueNormativInitial]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        console.log('lastId ' + lastId); 
        console.log('tableData[0].id ' + tableData[0].id); 
        lastId = tableData[0].id;
        console.log('tableData[0].title ' + tableData[0].title); 
        //setValueID(lastId);
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
        setValueParentID(tableData[0].parent_id||-1);
        setValueParentIDInitial(tableData[0].parent_id||-1);
        setValueNormativ(`${tableData[0].normativ_id}`);
        setValueNormativInitial(`${tableData[0].normativ_id}`);  
      }
    }
    }, [ isLoading, tableData] );

    useEffect(() => {
      if (clickAfterReload) {
          clickAfterReload = false;
          console.log('clickAfterReload ' + lastId); 
          handleItemClick(lastId); 
      }
    }, [ tableData] );

/*     useEffect(() => {
      console.log('useEffect once tableData.length ' + tableData.length); 
      if ((!isLoading) && (tableData) && (tableData.length)) {
        if (!lastId) 
        {
          console.log('tableData[0].id ' + tableData[0].id); 
          lastId = tableData[0].id;
          console.log('tableData[0].title ' + tableData[0].title); 
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
          setValueParentID(tableData[0].parent_id||-1);
          setValueParentIDInitial(tableData[0].parent_id||-1);
          setValueNormativ(`${tableData[0].normativ_id}`);
          setValueNormativInitial(`${tableData[0].normativ_id}`); 
        }
      }
      }, [] );     */

    const getTreeItemsFromData = treeItems => {
      return treeItems.map(treeItemData => {
        let children = undefined;
        if (treeItemData.children && treeItemData.children.length > 0) {
          children = getTreeItemsFromData(treeItemData.children);
        }
        //console.log('treeItemData.id ' + treeItemData.id);
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

    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState('');

    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };
  
    const handleSelect = (event, nodeIds) => {
      console.log('handleSelect nodeIds= ' + nodeIds);
      setSelected(nodeIds);

      handleItemClick(nodeIds);
    };  

    const [treeFilterString, setTreeFilterString] = React.useState('');

    const DataTreeView = ({ treeItems }) => {
      //let ids = tableData.map(a => a.id);
      return (
        <div>
        <p/>
        <TreeView
          aria-label="Tree navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
          expanded={expanded}
          selected={selected}          
          //onNodeToggle={handleChange}
          //defaultExpanded={[1,2]}
          //expanded={true}
          loading={isLoading}
          //defaultExpanded={ids}
        >
          {getTreeItemsFromData(treeItems)}
        </TreeView></div>
      );
    };

  const handleItemClick = (id) => {

    console.log('handleItemClick id ' + id ); 
    if (editStarted)
    {
      handleClickSave(id);
    } 
    else 
    {
      if (id)
        lastId = id;
      //else
      //  return;
      //console.log('handleItemClick '+id);
      //console.log('id '+ id);
      //console.log('lastId ' + lastId);

      var res = tableData.filter(function(item) {
        return item.id.toString() === id;
      });

      console.log('res.length ' + res.length);
 
    //  console.log('res[0].id ' + res[0].id);
    //  console.log('res[0].title ' + res[0].title);
      setValueID(res[0].id); 
      setValueTitle(res[0].title);
      setValueNameRus(res[0].name_rus);
      setValueNameEng(res[0].name_eng);
      setValueDescrRus(res[0].descr_rus);
      setValueDescrEng(res[0].descr_eng);    
      setValueParentID(res[0].parent_id||-1);    
      setValueNormativ(res[0].normativ_id);      
      setValueTitleInitial(res[0].title);
      setValueNameRusInitial(res[0].name_rus);
      setValueNameEngInitial(res[0].name_eng);
      setValueDescrRusInitial(res[0].descr_rus);
      setValueDescrEngInitial(res[0].descr_eng);
      setValueParentIDInitial(res[0].parent_id||-1); 
      setValueNormativInitial(res[0].normativ_id);
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
      setValueNameRus(``);
      setValueNameEng(``);
      setValueDescrRus(``);
      setValueDescrEng(``);
      setValueParentID(-1);
      setValueNormativ(``);
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => {  //lastId = data[0].id||0; clickAfterReload = true; console.log( 'setSelected ');  //console.log( tableData[0].id||0 ); 
         //handleItemClick(1);
        //   setSelected( "1" ); 
          
          } ); 
  }, [props.table_name])

  useEffect(() => {
    console.log( 'selected = ' + selected + ' tableData.length ' + tableData.length );
    if ((!selected)&&(tableData.length))
    {
      console.log( 'setSelected(tableData[0].id.toString()); = ' + tableData[0].id.toString()  );

      setSelected(tableData[0].id.toString());
      handleItemClick(tableData[0].id.toString());
    }      
  }, [tableData])

  useEffect(() => {
    fetch(`/normativ`)
      .then((data) => data.json())
      .then((data) => setNormativ(data))
      .then((data) => { /* lastId = 0; */} ); 
  }, [valueNormativ])


///////////////////////////////////////////////////////////////////  Tree load functions and hook  /////////////////////
  useEffect(() => {
    function filterTree( tree1, filterS )
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
    }
    function list_to_tree1(list, filterString) { 
      var map = {}, node, roots = [], i;
       for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i;   // initialize the map
        list[i].children = []; // initialize the children
      }
      filterString=filterString||'';
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent_id) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.parent_id]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      filterTree(roots, filterString.toLowerCase());  
      return roots;
    }

    let arr = list_to_tree1( tableData, treeFilterString );
    setTreeData( arr );
  }, [tableData, treeFilterString]) 

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    let myParentID;
    myParentID = valueParentID === -1 ? null : valueParentID;  
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      parent_id: myParentID,    
      normativ_id: valueNormativ     
    });

    if (!valueId) {
      addRec();
      return;
    }
    setIsLoading("true");
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
     setIsLoading('false');
     if (fromToolbar) 
     {
       setValueTitleInitial(valueTitle);       
       setValueNameRusInitial(valueNameRus); 
       setValueNameEngInitial(valueNameEng);
       setValueDescrRusInitial(valueDescrRus);
       setValueDescrEngInitial(valueDescrEng);    
       setValueParentIDInitial(valueParentID);
       setValueNormativInitial(valueNormativ);

     }
    reloadData();     
   }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    let myParentID;
    myParentID = valueParentID === -1 ? null : valueParentID;
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      parent_id: myParentID,
      normativ_id: valueNormativ        
    });
    setIsLoading("true");
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
        setValueID(lastId);
        setOpenAlert(true);  
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading("false");
      reloadData();
    }
  };

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
  const delRec =  async () => {
    const js = JSON.stringify({
        id: valueId,
        title: valueTitle,
    });
    setIsLoading("true");
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
        setValueNormativ(`${tableData[0].normativ_id}`);
        setValueNormativInitial(`${tableData[0].normativ_id}`);
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading("false");
    }
  };  

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////
  const handleClickReload = async () => {
    alertSeverity = "info";
    alertText =  'Данные успешно обновлены';
    try 
    {
      console.log('handleClickReload await reloadData();');
      clickAfterReload = true;
      await reloadData().then( console.log('after reload, title = '+tableData[0].title) ) ;
      //console.log('handleClickReload handleItemClick(lastId); lastId= '+lastId);
      //handleItemClick(lastId);
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
      setIsLoading("false");
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
    handleCancelClick();    
  };

  const handleCloseSaveWhenNewYes = () => {
    console.log('handleCloseSaveYes');
    setOpenSaveWhenNew(false);
    saveRec(true);
    handleCancelClick();
  };

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    console.log('handleCancelClick');
    const selectedIDs = selected;
    const selectedRowData = tableData.filter((row) => selectedIDs===row.id);
    if (selectedRowData.length)
    {
      setValueID(`${selectedRowData[0].id}`);
      setValueTitle(`${selectedRowData[0].title}`);
      setValueNameRus(`${selectedRowData[0].name_rus}`);
      setValueNameEng(`${selectedRowData[0].name_eng}` );
      setValueDescrRus(`${selectedRowData[0].descr_rus}`);
      setValueDescrEng(`${selectedRowData[0].descr_eng}` );
      setValueTitleInitial(`${selectedRowData[0].title}`);
      setValueNameRusInitial(`${selectedRowData[0].name_rus}`);
      setValueNameEngInitial(`${selectedRowData[0].name_eng}` );
      setValueDescrRusInitial(`${selectedRowData[0].descr_rus}`);
      setValueDescrEngInitial(`${selectedRowData[0].descr_eng}` );
      setValueParentID(selectedRowData[0].parent_id||-1);
      setValueParentIDInitial(selectedRowData[0].parent_id||-1);
      setValueNormativ(`${selectedRowData[0].normativ_id}`);
      setValueNormativInitial(`${selectedRowData[0].normativ_id}` );
    }
  }

  const optionsCSV = {
    filename: table_names[props.table_name],
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    //showTitle: true,
    //title: table_names['data_source'],
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };

  const exportdDataCSV = async () => {
    console.log('export csv');
    const csvExporter = new ExportToCsv(optionsCSV);
    csvExporter.generateCsv(tableData);   
  } 

  const onFilterKeyUp = (e) => { 
    const value = e.target.value;
    const filter = value.trim();
    setTreeFilterString(filter);
  }  

  return (
    <div style={{ height: 650, width: 1500 }}>
    <table border = "0" style={{ height: 650, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 550, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 500, width: 585 }}>
      <Box sx={{ border: 1, borderRadius: '4px', borderColor: 'grey.300', height: 500, p: '4px' }} >
        <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>saveRec(true)}  color="primary" size="small" title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
        <IconButton onClick={()=>handleClickDelete()}  color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleClickReload()} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=> exportdDataCSV()} color="primary" size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
        <br/><TextField label="Фильтр ..." size = "small" variant="standard" onKeyUp={onFilterKeyUp} />
        <Box sx={{ height: 415, overflowY: 'false' }}>
          {(isLoading==="true") && <CircularProgress/>} 
          <Box sx={{ height: 415, flexGrow: 1, overflowY: 'auto' }} >     
            <DataTreeView treeItems={treeData} />
          </Box> 
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
      
      </Box>
      
      </td>
      <td style={{ height: 550, width: 900, verticalAlign: 'top' }}>
      <TextField  id="ch_id" disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={ valueId ||''} size="small" /* onChange={e => setValueID(e.target.value)} *//>
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
      <div>
      {(() => {
        if (props.table_name==='criterion_gr') {
          return (
            <div>

              <FormControl sx={{ width: '30ch' }} size="small">
                <InputLabel id="ch_normativ_id">Нормативная база</InputLabel>
                  <Select labelId="ch_normativ_id" id="ch_normativ_id1" label="Нормативная база" value={valueNormativ  || "" } onChange={e => setValueNormativ(e.target.value)} >
                          {tableNormativ?.map(option => {
                          return (
                          <MenuItem key={option.id} value={option.id}>
                            {option.title ?? option.id}
                          </MenuItem>
                          );
                        })}
                </Select>
              </FormControl>   
            </div>
          )
        } 
      })()}
      </div>

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
          В таблице "{table_names[props.table_name]}" предложена к удалению следующая запись:<b><p/>{valueTitle}</b>; Код в БД = <b>{valueId}<p/></b>
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
        В запись таблицы "{table_names[props.table_name]}" с кодом <b>{valueId}</b> внесены изменения.<p/>
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
            В запись таблицы "{table_names[props.table_name]}" с кодом <b>{valueId}</b> внесены изменения.<p/>
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
