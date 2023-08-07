import React, { useState, useEffect, useCallback } from 'react';
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
import { ReactComponent as CollapseIcon } from "./../icons/chevron-double-right.svg";
import { ReactComponent as ExpandIcon } from "./../icons/chevron-double-down.svg";
import { ReactComponent as SearchIcon } from "./../icons/search.svg";
import { ReactComponent as TimesCircleIcon } from "./../icons/times-circle.svg";
import { ReactComponent as FolderIcon } from "./../icons/folder.svg";
import { ReactComponent as FileIcon } from "./../icons/file.svg";
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
import { table_names } from './table_names';
import Backdrop from '@mui/material/Backdrop';
import { InputAdornment } from "@material-ui/core";
import Tooltip from '@mui/material/Tooltip';
import { listToTree } from '../helpers/treeHelper';
import { Grid } from '@mui/material';

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
  const [valueNormativID, setValueNormativID] = React.useState();
  const [valueNormativIDInitial, setValueNormativIDInitial] = React.useState();
  const [isLoading, setIsLoading] = React.useState("false");
  const [tableData, setTableData] = useState([]); 
  const [tableNormativ, setTableNormativ] = useState([]); 
  const [treeData, setTreeData] = useState([]); 
  const [editStarted, setEditStarted] = useState(false);

  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");

  useEffect(() => {
    let isEditStarted = false;
  
    let fieldsToCheck = {
      'valueTitle': [valueTitleInitial, valueTitle],
      'valueNameRus': [valueNameRusInitial, valueNameRus],
      'valueNameEng': [valueNameEngInitial, valueNameEng],
      'valueDescrEng': [valueDescrEngInitial, valueDescrEng],
      'valueDescrRus': [valueDescrRusInitial, valueDescrRus],
      'valueParentID': [valueParentIDInitial, valueParentID]
    };
  
    if (props.table_name === 'criterion_gr') {
      fieldsToCheck = {
        ...fieldsToCheck,
        'valueNormativID': [valueNormativIDInitial, valueNormativID]
      };
    }
  
    Object.keys(fieldsToCheck).forEach((key) => {
      const [initialValue, currentValue] = fieldsToCheck[key];
      if (initialValue !== currentValue) {
        isEditStarted = true;
        console.log('Field changed:', key);
      }
    });
  
    setEditStarted(isEditStarted);
  }, [
    valueTitleInitial, 
    valueTitle, 
    valueNameRusInitial, 
    valueNameRus, 
    valueNameEngInitial, 
    valueNameEng, 
    valueDescrEngInitial, 
    valueDescrEng, 
    valueDescrRusInitial, 
    valueDescrRus, 
    valueParentID, 
    valueParentIDInitial, 
    valueNormativID, 
    valueNormativIDInitial,
    props.table_name
  ]);
  
  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) {
        lastId = tableData[0].id;
        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueDescrRus(tableData[0].descr_rus);
        setValueDescrEng(tableData[0].descr_eng);
        setValueParentID(tableData[0].parent_id || -1);
        
        setValueTitleInitial(tableData[0].title);       
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueDescrRusInitial(tableData[0].descr_rus);
        setValueDescrEngInitial(tableData[0].descr_eng);
        setValueParentIDInitial(tableData[0].parent_id || -1);
        
        if (props.table_name === 'criterion_gr') {
          setValueNormativID(tableData[0].normativ_id);
          setValueNormativIDInitial(tableData[0].normativ_id);
        }
      }
    }
  }, [isLoading, tableData, props.table_name]);
  
    useEffect(() => {
      function updateCurrentRec (id)  {
              if (id)
                lastId = id;
              var res = tableData.filter(function(item) {
                return item.id.toString() === id;
              });
              if (res.length === 0)
                return;
              setValueID(res[0].id); 
              setValueTitle(res[0].title);
              setValueNameRus(res[0].name_rus);
              setValueNameEng(res[0].name_eng);
              setValueDescrRus(res[0].descr_rus);
              setValueDescrEng(res[0].descr_eng);    
              setValueParentID(res[0].parent_id||-1);    
              setValueNormativID(res[0].normativ_id);      
              setValueTitleInitial(res[0].title);
              setValueNameRusInitial(res[0].name_rus);
              setValueNameEngInitial(res[0].name_eng);
              setValueDescrRusInitial(res[0].descr_rus);
              setValueDescrEngInitial(res[0].descr_eng);
              setValueParentIDInitial(res[0].parent_id||-1); 
              setValueNormativIDInitial(res[0].normativ_id);      
          }; 
        
      if (clickAfterReload) {
          clickAfterReload = false;
          if (lastId!==0)
            updateCurrentRec(lastId); 
      }
    }, [tableData] );

    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState('');
    const [updated, setUpdated] = React.useState(false);  

    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };
  
    const [treeFilterString, setTreeFilterString] = React.useState('');
    const nodeRefs = React.useRef({}); 
    const scrollContainerRef = React.useRef();

    useEffect(() => {
      if (updated && selected && nodeRefs.current[selected]) {
        const node = nodeRefs.current[selected];
        const scrollContainer = scrollContainerRef.current;

        if (node && scrollContainer) {

          const nodePosition = node.offsetTop;
         
          if (nodePosition < scrollContainer.scrollTop || nodePosition > (scrollContainer.scrollTop + scrollContainer.clientHeight)) {
            scrollContainer.scrollTop = nodePosition - scrollContainer.clientHeight / 2;
          } 
        }
        setUpdated(false); // Reset the updated state to false after scrolling
      }
    }, [updated, selected]);
    

    const DataTreeView = ({ treeItems }) => {
      const getTreeItemsFromData = treeItems => {
      
        return treeItems.map(treeItemData => {
          let children = undefined;
          if (treeItemData.children && treeItemData.children.length > 0) {
            children = getTreeItemsFromData(treeItemData.children);
          }
          return (
            <TreeItem
            sx={{ 
              '&.Mui-selected': {
                '& .MuiTreeItem-label': {
                  backgroundColor: 'rgba(0, 0, 0, 0.11)',
                },
              },
              '&.Mui-selected:focus': {
                '& .MuiTreeItem-label': {
                  backgroundColor: 'rgba(0, 0, 0, 0.11)',
                },
              },
            }}              
              key={treeItemData.id}
              nodeId={treeItemData.id?treeItemData.id.toString():0}
              ref={(el) => (nodeRefs.current[treeItemData.id] = el)}
              label={
                <Tooltip title={treeItemData.name_rus}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {treeItemData.crit === 0 ?
                    <SvgIcon fontSize="small" style={{ color: '#4b77d1', fontSize: '19px' }} component={FolderIcon} inheritViewBox />: 
                    <SvgIcon fontSize="small" style={{ color: '#4b77d1', fontSize: '19px' }} component={FileIcon} inheritViewBox />
                  }
                  <span style={{ marginLeft: '5px' }}>{treeItemData.title}</span>
                </div>
                </Tooltip>
              }
              children={children}
            />
          );
        });
      };
  
      return (
        <div>
        <p></p>
        <TreeView
          aria-label="Tree navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ 
            height: 240, 
            flexGrow: 1, 
            maxWidth: 400, 
            overflowY: 'auto',
            '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content': {
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
            },
            '& .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content': {
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
            },
          }}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
          expanded={expanded}
          selected={selected}          
          loading={isLoading}
        >
          {getTreeItemsFromData(treeItems)}
        </TreeView></div>
      );
    };

  useEffect(() => {
    // Здесь код, который будет выполняться после каждого обновления treeData
    setUpdated(true);
  }, [treeData]);    


  const setValues = (row) => {
    const valueSetters = {
      title: setValueTitle,
      name_rus: setValueNameRus,
      name_eng: setValueNameEng,
      descr_rus: setValueDescrRus,
      descr_eng: setValueDescrEng,
      parent_id: setValueParentID,
      ...(props.table_name === 'criterion_gr' && {normativ_id: setValueNormativID})
    }
    
    const initialValueSetters = {
      title: setValueTitleInitial,
      name_rus: setValueNameRusInitial,
      name_eng: setValueNameEngInitial,
      descr_rus: setValueDescrRusInitial,
      descr_eng: setValueDescrEngInitial,
      parent_id: setValueParentIDInitial,
      ...(props.table_name === 'criterion_gr' && {normativ_id: setValueNormativIDInitial})
    }
  
    Object.keys(valueSetters).forEach((key) => {
      const setValue = valueSetters[key];
      if (key in row) {
        // Если ключ - parent_id и значение не определено, устанавливаем его в -1
        if (key === 'parent_id' && !row[key]) {
          setValue(-1);
        } else {
          setValue(row[key]);
        }        
      } else {
        console.log("Ключа " + key + " не существует в объекте row");
      }
    });
  
    Object.keys(initialValueSetters).forEach((key) => {
      const setValueInitial = initialValueSetters[key];
      if (key in row) {
        // Если ключ - parent_id и значение не определено, устанавливаем его в -1
        if (key === 'parent_id' && !row[key]) {
          setValueInitial(-1);
        } else {
          setValueInitial(row[key]);
        }            
      } else {
        console.log("Ключа " + key + " не существует в объекте row");
      }
    });
  };
  

  useEffect(() => {
    const rowData = tableData.find(row => row.id === valueId);
    console.log('if (rowData) {', valueId, rowData);
    if (rowData) {
      setValues(rowData);
    }
  }, [tableData, valueId]);

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    setOpenAlert(false);  
    const id = Number(nodeIds); // преобразуем id в число
    console.log('setClickedRowId id = ' + id);
    setClickedRowId(id);
  
    if (editStarted) {
      setDialogType('save');
    } else {
      if (id) {
        lastId = id;
      }
      setValueID(id);
    }
  };

  const handleClearClick = (params) => {
    if (editStarted/* &&(!isEmpty) */)
    {
      setDialogType('save');
    } 
    else 
    {
      setValueID(``);
      setValueTitle(``);
      setValueNameRus(``);
      setValueNameEng(``);
      setValueDescrRus(``);
      setValueDescrEng(``);
      setValueParentID(valueId); //-1
      setValueNormativID(valueNormativID);
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data)); 
  }, [props.table_name])

  useEffect(() => {

    function updateCurrentRec (id)  {
      if (id)
        lastId = id;
      var res = tableData.filter(function(item) {
        return item.id.toString() === id;
      });

      setValueID(res[0].id); 
      setValueTitle(res[0].title);
      setValueNameRus(res[0].name_rus);
      setValueNameEng(res[0].name_eng);
      setValueDescrRus(res[0].descr_rus);
      setValueDescrEng(res[0].descr_eng);    
      setValueParentID(res[0].parent_id||-1);    
      setValueNormativID(res[0].normativ_id);      
      setValueTitleInitial(res[0].title);
      setValueNameRusInitial(res[0].name_rus);
      setValueNameEngInitial(res[0].name_eng);
      setValueDescrRusInitial(res[0].descr_rus);
      setValueDescrEngInitial(res[0].descr_eng);
      setValueParentIDInitial(res[0].parent_id||-1); 
      setValueNormativIDInitial(res[0].normativ_id);      
    }; 
    if ((!selected)&&(tableData.length))
    {
      setSelected(tableData[0].id.toString());
      updateCurrentRec(tableData[0].id.toString());
    }      
  }, [tableData, selected])

  const fetchData = async (url, setStateFunc) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStateFunc(data);
    } catch (error) {
      console.error(`Failed to fetch data from ${url}: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData('/normativ', setTableNormativ);
  }, []);

  ///////////////////////////////////////////////////////////////////  Tree load functions and hook  /////////////////////
  useEffect(() => {
    // Преобразуем tableData из списка в структуру дерева и обновляем состояние treeData
    const arr = listToTree(tableData, treeFilterString);
    setTreeData(arr);
  }, [tableData, treeFilterString]);

  function getParentIds(tree, targetId) {
    const result = [];
    for (const item of tree) {
      if (item.id === targetId) {
        return [item.id]; // Если это целевой элемент, возвращаем его id в массиве
      } else if (item.children) {
        const childResult = getParentIds(item.children, targetId); // Если есть дети, ищем в детях
        if (childResult.length > 0) {
          // Если нашли в детях, добавляем текущий id в результат и возвращаем
          return [item.id, ...childResult];
        }
      }
    }
    return result; // Если не нашли, возвращаем пустой массив
  }

    //  состояние для управления диалогом
    const [open, setOpen] = React.useState(false);

    // Функция для открытия диалога
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    // Функция для закрытия диалога
    const handleClose = () => {
      setOpen(false);
    };
  
  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    // Проверка на то, что нормативная база у родителя и ребенка совпадает
    if (valueParentID !== -1) { // если запись не на верхнем уровне
      const parentNormativ = tableData.find(item => item.id === valueParentID).normativ_id;
      if (parentNormativ !== valueNormativID) {
          handleClickOpen();
          //alert("Нормативная база у дочерней записи и родительской записи должна быть одинаковой!");
          return; // выйти из функции, не продолжая сохранение
      }
    }    
    if (formRef.current.reportValidity() )
    {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      parent_id: valueParentID === -1 ? null : valueParentID, 
      normativ_id: valueNormativID
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
        setAlertSeverity('error');
        setAlertText(await response.text());
      }
      else
      {
        setAlertSeverity('success');
        setAlertText(await response.text());        
        if (valueParentID) {
          const parentIds = getParentIds(treeData, valueParentID).map(String); // получите список всех родительских элементов
          const newExpanded = new Set([...expanded, ...parentIds]); // добавьте их к уже раскрытым элементам, убрав дубликаты
          setExpanded(Array.from(newExpanded)); // преобразуйте обратно в массив и установите как новое состояние
        }  
        if (valueParentID && !expanded.includes(valueParentID.toString())) {
          setExpanded(prevExpanded => [...prevExpanded, valueParentID.toString()]);
        }
        await reloadData();
      }
      setOpenAlert(true); 
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);
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
        setValueNormativIDInitial(valueNormativID);
        setValueTitleInitial(valueTitle);       
        setValueNameRusInitial(valueNameRus); 
        setValueNameEngInitial(valueNameEng);
        setValueDescrRusInitial(valueDescrRus);
        setValueDescrEngInitial(valueDescrEng);    
        setValueParentIDInitial(valueParentID);
        setValueNormativIDInitial(valueNormativID);     
     }
   }
  }
};


/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    if (valueParentID !== -1 && props.table_name==='criterion_gr') { // если запись не на верхнем уровне
      const parentNormativ = tableData.find(item => item.id === valueParentID).normativ_id;
      if (parentNormativ !== valueNormativID) {
          handleClickOpen();
          //alert("Нормативная база у дочерней записи и родительской записи должна быть одинаковой!");
          return; // выйти из функции, не продолжая сохранение
      }
    }    
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      parent_id: valueParentID === -1 ? null : valueParentID, 
      normativ_id: valueNormativID,
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
        setAlertSeverity('error');
        setAlertText(await response.text());        
      }
      else
      {
        const { id } = await response.json();
        setAlertSeverity('success');
        setAlertText(`Добавлена запись с кодом ${id}`);        
        lastId = id;         
        console.log('setSelected lastId' + lastId);
        setValueID(lastId);
        console.log('setSelected toString' + lastId.toString());
        setSelected(lastId.toString());

        if (valueParentID) {
          const parentIds = getParentIds(treeData, valueParentID).map(String); // получите список всех родительских элементов
          const newExpanded = new Set([...expanded, ...parentIds]); // добавьте их к уже раскрытым элементам, убрав дубликаты
          setExpanded(Array.from(newExpanded)); // преобразуйте обратно в массив и установите как новое состояние
        }  
        if (valueParentID && !expanded.includes(valueParentID.toString())) {
          setExpanded(prevExpanded => [...prevExpanded, valueParentID.toString()]);
        }

        setValueTitle(valueTitle);       
        setValueNameRus(valueNameRus); 
        setValueNameEng(valueNameEng);
        setValueDescrRus(valueDescrRus);
        setValueDescrEng(valueDescrEng);    
        setValueParentID(valueParentID);
        setValueNormativID(valueNormativID);         
        setValueTitleInitial(valueTitle);       
        setValueNameRusInitial(valueNameRus); 
        setValueNameEngInitial(valueNameEng);
        setValueDescrRusInitial(valueDescrRus);
        setValueDescrEngInitial(valueDescrEng);    
        setValueParentIDInitial(valueParentID);
        setValueNormativIDInitial(valueNormativID);     
      }
      setOpenAlert(true);
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);
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
        setAlertSeverity('error');
        setAlertText(await response.text());
      }
      else
      {
        setAlertSeverity('success');
        setAlertText(await response.text());        
        reloadData();
        setValueID(tableData[0].id);
        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueDescrRus(tableData[0].descr_rus);
        setValueDescrEng(tableData[0].descr_eng);
        setValueTitleInitial(tableData[0].title);
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueDescrRusInitial(tableData[0].descr_rus);
        setValueDescrEngInitial(tableData[0].descr_eng);
        setValueParentID(tableData[0].parent_id||-1);
        setValueParentIDInitial(tableData[0].parent_id||-1);
        setValueNormativID(tableData[0].normativ_id);
        setValueNormativIDInitial(tableData[0].normativ_id);

/* 
        setValueCalcfunctionID(tableData[0].calcfunction_id);
        setValueIrradiation(tableData[0].irradiation_id);
        setValueAgegroup(tableData[0].agegroup_id);
        setValueExpScenario(tableData[0].exp_scenario_id);
        setValueIntegralPeriod(tableData[0].integral_period_id);
        setValueOrgan(tableData[0].organ_id);
        setValueDataSource(tableData[0].data_source_id);
        setValueAerosolAmad(tableData[0].aerosol_amad_id);
        setValueAerosolSol(tableData[0].aerosol_sol_id);
        setValueChemCompGr(tableData[0].chem_comp_gr_id);
        setValueSubstForm(tableData[0].subst_form_id);
        setValueIsotope(tableData[0].isotope_id);
        setValueActionLevel(tableData[0].action_level_id);
        setValuePeopleClass(tableData[0].people_class_id);
        setValueCrValue(tableData[0].cr_value);
        setValueTimeend(tableData[0].timeend);

        setValueCalcfunctionIDInitial(tableData[0].calcfunction_id);
        setValueIrradiationInitial(tableData[0].irradiation_id);
        setValueAgegroupInitial(tableData[0].agegroup_id);
        setValueExpScenarioInitial(tableData[0].exp_scenario_id);
        setValueIntegralPeriodInitial(tableData[0].integral_period_id);
        setValueOrganInitial(tableData[0].organ_id);
        setValueDataSourceInitial(tableData[0].data_source_id);
        setValueAerosolAmadInitial(tableData[0].aerosol_amad_id);
        setValueAerosolSolInitial(tableData[0].aerosol_sol_id);
        setValueChemCompGrInitial(tableData[0].chem_comp_gr_id);
        setValueSubstFormInitial(tableData[0].subst_form_id);
        setValueIsotopeInitial(tableData[0].isotope_id);
        setValueActionLevelInitial(tableData[0].action_level_id);
        setValuePeopleClassInitial(tableData[0].people_class_id);
        setValueCrValueInitial(tableData[0].cr_value);
        setValueTimeendInitial(tableData[0].timeend); */
      }
      setOpenAlert(true);  
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);
      setOpenAlert(true);
    } finally {
      setIsLoading("false");
    }
  };  

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////
  const handleClickReload = async () => {
    setAlertSeverity('info');
    setAlertText('Данные успешно обновлены');
    try 
    {
      clickAfterReload = true;
      await reloadData().then( console.log('after reload, title = '+tableData[0].title) ) ;
    } catch(e)
    {
      setAlertSeverity('error');
      setAlertText('Ошибка при обновлении данных: '+e.message);
      setOpenAlert(true);
      return;
    }    
    setOpenAlert(true);        
  }

  const reloadData = async () => {
    
    try {
      const response = await fetch(`/${props.table_name}/`);
      if (!response.ok) {
        setAlertSeverity('error');
        setAlertText(`Ошибка при обновлении данных: ${response.status}`);
        const error = response.status + ' (' +response.statusText+')';  
        throw new Error(`${error}`);
      }
      else
      {  
        const result = await response.json();
        setTableData(result);
        console.log('after reload');
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading("false");
    }
  };

  ///////////////////////////////////////// DIALOG
  const [dialogType, setDialogType] = useState('');
  const [clickedRowId, setClickedRowId] = useState(null);

  const setValuesById = (id) => {
    //console.log( 'id = '+id);
    //if (id)
    //  lastId = id;
    var res = tableData.filter(function(item) {
      return item.id === id;
    });
    console.log('console ', id, res[0]);
    setValues(res[0]);
  };   

  const getDialogContentText = () => {
    const allRequiredFieldsFilled = formRef.current?.checkValidity();
    switch (dialogType) {
      case 'delete':
        return (
          <>
            В таблице "{table_names[props.table_name]}" предложена к удалению следующая запись: 
            <br />
            {valueTitle}; Код в БД = {valueId}. 
            <br />
            Вы желаете удалить указанную запись?
          </>);
      case 'save':
        if (!valueId) { // если это новая запись
          if (allRequiredFieldsFilled) {
            return `Создана новая запись, сохранить?`;
          } else {
            return (
              <>
                Не заданы обязательные поля, запись не будет создана.
                <br />
                Перейти без сохранения изменений?
              </>
            );
          }
        } else { // если это редактируемая запись
          if (allRequiredFieldsFilled) {
            return `В запись внесены изменения, сохранить изменения?`;
          } else {
            return (
              <>
                Не заданы обязательные поля, изменения не будут сохранены
                <br />
                Перейти без сохранения изменений?
              </>
            );            
          }
        }
      default:
        return '';
    }
  };

  const handleCloseNo = () => {
    switch (dialogType) {
      case 'save':
        setEditStarted(false);
        setValueID(clickedRowId);
        setSelected(clickedRowId.toString());
        break;
      default:
    }
    setDialogType('');
  };

  const handleCloseCancel = () => {
    switch (dialogType) {
      case 'save':
        setSelected(valueId.toString());
        break;
      default:
        break;
    }
    setDialogType('');
  };
  
  const handleCloseYes = () => {
    switch (dialogType) {
      case 'delete':
        delRec();
        break;
      case 'save':
        saveRec(false);
        break;
      default:
        break;
    }
    
    setDialogType('');

    if (clickedRowId>0) {
      setEditStarted(false);
      console.log('yes', clickedRowId);
      setSelected(clickedRowId.toString());
      //setRowSelectionModel([clickedRowId]);
      const rowData = tableData.find(row => row.id === clickedRowId);
      setValues(rowData);
      setValueID(clickedRowId);
      setEditStarted(false);
    }
  };

  function DialogButtons() {
    const allRequiredFieldsFilled = formRef.current?.checkValidity();
  
    if (dialogType === 'save' && !allRequiredFieldsFilled) {
      return (
        <>
          <Button variant="outlined" onClick={handleCloseNo} >Да</Button>
          <Button variant="outlined" onClick={handleCloseCancel} >Отмена</Button>
        </>
      );
    } else {
      return (
        <>
          <Button variant="outlined" onClick={handleCloseYes} >Да</Button>
          <Button variant="outlined" onClick={handleCloseNo} >Нет</Button>
          {dialogType !== 'delete' && <Button variant="outlined" onClick={handleCloseCancel} >Отмена</Button>}
        </>
      );
    }
  }
 
  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    setEditStarted(false);
    setValuesById(clickedRowId);
  }

  function getHeaders(atable)
  {
    if (atable==='criterion') 
      return ['Обозначение','Название(рус.яз)','Название(англ.яз)','Группа критериев','Комментарий(рус.яз)','Комментарий(англ.яз)','Функция',
      'Значение','Время облучения, сек',
      'Уровень вмешательства',
      'Тип облучения','Тип облучаемых лиц','Возрастная группа населения','Сценарий поступления','Период интегрирования','Орган / Ткань','Нуклид',
      'Форма вещества','Химические соединения (группа)','Тип растворимости','AMAD','Источник данных', ];
  }
  function getTableDataForExcel(t) {
    function replacer(i, val) {
        if (val === null) {
            return ""; // change null to empty string
        } else {
            return val; // return unchanged
        }
    }
    var arr_excel = t.map(({
        title, name_rus, name_eng, descr_rus, descr_eng, parent_name, normativ_title, calcfunction_title, cr_value, timeend,
        action_level_title,
        irradiation_title, people_class_title, agegroup_title, exp_scenario_title, integral_period_title, organ_title, isotope_title, 
        subst_form_title, chem_comp_gr_title, aerosol_sol_title, aerosol_amad_title, data_source_title,
    }) => ({
        title, name_rus, name_eng, parent_name, descr_rus, descr_eng, normativ_title, calcfunction_title, cr_value, timeend,
        action_level_title,
        irradiation_title, people_class_title, agegroup_title, exp_scenario_title, integral_period_title, organ_title, isotope_title, 
        subst_form_title, chem_comp_gr_title, aerosol_sol_title, aerosol_amad_title, data_source_title
    }));
    arr_excel = JSON.parse(JSON.stringify(arr_excel, replacer));

    return (arr_excel);
  }

  const optionsCSV = {
    filename: table_names[props.table_name],
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: getHeaders(props.table_name)
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };


  const exportDataCSV = async () => {
    const csvExporter = new ExportToCsv(optionsCSV);
    console.log(treeFilterString);
    const filteredData = tableData.filter(item =>
      item.title.toLowerCase().includes(treeFilterString.toLowerCase())
    );
    csvExporter.generateCsv(getTableDataForExcel(filteredData));
  }
      
  const setTreeFilter = (e) => { 
    const value = e;
    const filter = value.trim();
    setTreeFilterString(filter);
  }  

  const [filter, setFilter] = useState(""); //значение фильтра
  const [filterApplied, setFilterApplied] = useState(false); //состояние применен фильтр или нет

  const clearFilter = useCallback(() => {
    setFilter("");
    setFilterApplied(false);
    setTreeFilter("");
  }, []);

  const applyFilter = useCallback(() => {
    if (filter.trim() === "") return;
    setFilterApplied(true);
    setTreeFilter(filter);
  }, [filter]);

  const expandTree = useCallback(() => { //развернуть дерево
    const hasChild = [];
    tableData.forEach((item) => {
      if (item.parent_id && !hasChild.includes(item.parent_id.toString())) {
        hasChild.push(item.parent_id.toString());
      }
    });
    const expandedNew = expanded.length ? [] : hasChild;
    setExpanded(expandedNew);
  }, [expanded, tableData]);


  const formRef = React.useRef();
  return (
    <>
    
    <Box sx={{ width: 1445, height: 650, padding: 1 }}>
      <Grid container spacing={1}>
        <Grid item sx={{width: 570, border: '0px solid green', ml: 1 }}>
        <div style={{ height: 500, width: 570 }}>
          <Box sx={{ border: 1, borderRadius: '4px', borderColor: 'rgba(0, 0, 0, 0.23)', height: 500, p: '4px' }} >
            <IconButton onClick={()=>handleClearClick()} disabled={editStarted} color="primary" size="small" title="Создать запись">
              <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>saveRec(true)} disabled={false} color="primary" size="small" title="Сохранить запись в БД">
              <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
            <IconButton onClick={()=>setDialogType('delete')} disabled={false} color="primary" size="small" title="Удалить запись">
              <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" title="Отменить редактирование">
              <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>handleClickReload()} color="primary" size="small" title="Обновить данные">
              <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>exportDataCSV()} color="primary" size="small" title="Сохранить в формате CSV">
              <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>expandTree()} color="primary" size="small" title={expanded.length !== 0?"Свернуть все":"Развернуть все"} >
              <SvgIcon fontSize="small" component={expanded.length !== 0?CollapseIcon:ExpandIcon} inheritViewBox /></IconButton>
            <br/>
            <TextField
              label="Фильтр ..."
              size="small"
              variant="standard"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilter();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={applyFilter}
                      edge="end"
                      size="small"
                      color="primary"
                      disabled={!filter}
                      title="Применить фильтр"
                    >
                      <SvgIcon fontSize="small" component={SearchIcon} inheritViewBox />
                    </IconButton>
                    <IconButton
                      onClick={clearFilter}
                      edge="end"
                      size="small"
                      color="primary"
                      disabled={!filter && !filterApplied}
                      title={filterApplied ? "Сбросить фильтр" : "Очистить поле ввода"}
                    >
                      <SvgIcon fontSize="small" component={TimesCircleIcon} inheritViewBox />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ height: 415, overflowY: 'false' }}>
              {(isLoading==="true") && 
              <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                <CircularProgress color="inherit" />
              </Backdrop> } 
              <Box ref={scrollContainerRef} sx={{ height: 415, flexGrow: 1, overflowY: 'auto' }} >     
                <DataTreeView treeItems={treeData} />
              </Box> 
            </Box>
          </Box>
          </div>
          <Box sx={{ width: 583 }}>
          <Collapse in={openAlert}>
            <Alert
              item sx={{width: 571}}
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
        </Grid>
        {/* <Grid item > */}
        <Grid sx={{ width: 801, padding: 1, ml: 1.5 }}>
        {/* <Grid item xs={7}   sx={{ ml: 1.5 }}> */}
        {( true ) &&
          <>
          <form ref={formRef}> 

          <Grid container spacing={1.5}>
            <Grid item xs={2}>
              <TextField  
                id="ch_id" 
                disabled={true} 
                label="Код" 
                variant="outlined" 
                value={ valueId ||''} 
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField  
                id="ch_name" 
                label="Обозначение" 
                required 
                size="small" 
                variant="outlined" 
                value={valueTitle || ''} 
                onChange={e => setValueTitle(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl required fullWidth size="small">
                <InputLabel id="ch_parent_id">Родительский класс</InputLabel>
                <Select fullWidth labelId="ch_parent_id" id="ch_parent_id1" label="Родительский класс" value={valueParentID  || "" } onChange={e => setValueParentID(e.target.value)} >
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
            </Grid>
            <Grid item xs={6}>
              <TextField  
                id="ch_name_rus" 
                size="small" 
                label="Название (рус.яз)" 
                required 
                variant="outlined"  
                value={valueNameRus || ''} 
                onChange={e => setValueNameRus(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField  
                id="ch_name_eng" 
                size="small" 
                label="Название (англ.яз)"  
                variant="outlined" 
                value={valueNameEng || ''} 
                onChange={e => setValueNameEng(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField  
                id="ch_descr_rus" 
                label="Комментарий (рус.яз)"  
                size="small" 
                multiline 
                maxRows={4} 
                variant="outlined" 
                value={valueDescrRus || ''} 
                onChange={e => setValueDescrRus(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField  
                id="ch_descr_eng" 
                label="Комментарий (англ.яз)"  
                size="small" 
                multiline 
                maxRows={4} 
                variant="outlined" 
                value={valueDescrEng || ''} 
                onChange={e => setValueDescrEng(e.target.value)}
                fullWidth
              />
            </Grid>

            {
              props.table_name === 'criterion_gr' &&
              <Grid item xs={12}>
                <div>
                  <FormControl sx={{ width: '30ch' }} size="small">
                    <InputLabel id="ch_normativ_id" required>Нормативная база</InputLabel>
                    <Select labelId="ch_normativ_id" id="ch_normativ_id1" label="Нормативная база" required value={valueNormativID  || "" } onChange={e => setValueNormativID(e.target.value)}>
                      {tableNormativ?.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.title ?? option.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>   
                </div>
              </Grid>
            }
    {/*     <Grid item xs={6}>
            </Grid>
    */}
          </Grid>
        </form>
          <div style={{ height: 300, width: 800 }}>
            <td>Источники данных<br/>
            <DataTableDataSourceClass table_name={props.table_name} rec_id={valueId||0} />
            </td>
          </div>
          </>}
        </Grid>
      </Grid>
    </Box>

    <Dialog open={dialogType !== ''} onClose={handleCloseCancel} fullWidth={true}>
      <DialogTitle>Внимание</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {getDialogContentText()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DialogButtons />
      </DialogActions>
    </Dialog>  
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"Ошибка"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {"Нормативная база у дочерней записи и родительской записи должна быть одинаковой!"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button  variant="outlined" onClick={handleClose}>
          {"ОК"}
        </Button>
      </DialogActions>
    </Dialog>
      
 </>     
  )
}

export { DataTableExpScenario, lastId }
