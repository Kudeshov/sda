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
import CircularProgress from '@material-ui/core/CircularProgress';
import { ExportToCsv } from 'export-to-csv-fix-source-map';
import { table_names } from './table_names';
import Backdrop from '@mui/material/Backdrop';
import { InputAdornment } from "@material-ui/core";
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { listToTree, findPreviousIdAfterDeleteChemComp } from '../helpers/treeHelper';
import { Grid } from '@mui/material';

var lastId = 0;
var clickAfterReload = false;

const DataTableChemCompGr = (props) => {
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
  const [valueFormula, setValueFormula] = React.useState();
  const [valueFormulaInitial, setValueFormulaInitial] = React.useState();
  
  const [isLoading, setIsLoading] = React.useState("false");
  const [tableData, setTableData] = useState([]); 
  const [tableChelement, setChelement] = useState([]); 
  const [treeData, setTreeData] = useState([]); 
  const [editStarted, setEditStarted] = useState(false);

  const [valueCrit, setValueCrit] = React.useState(0);
  function isValueSet(valueId) {
    return valueId !== null && valueId !== undefined && valueId !== '';
  }  
  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");

  useEffect(() => {
    setEditStarted(       
       (valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng) ||(valueDescrRusInitial!==valueDescrRus)||(valueParentIDInitial!==valueParentID)
      ||(valueFormulaInitial!==valueFormula));
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, valueParentID, valueParentIDInitial, 
        valueFormula, valueFormulaInitial]); 

  /*   useEffect(() => {
    console.log('init ', isLoading, tableData.length, lastId);

   if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        console.log('init last id tableData[0].id', tableData[0].id)
        lastId = tableData[0].id;
        setValueCrit(0);
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
 
        setValueFormula(tableData[0].formula);
        setValueFormulaInitial(tableData[0].formula);
      }
    }
    }, [ isLoading, tableData ] ); */

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
              setValueTitleInitial(res[0].title);
              setValueNameRusInitial(res[0].name_rus);
              setValueNameEngInitial(res[0].name_eng);
              setValueDescrRusInitial(res[0].descr_rus);
              setValueDescrEngInitial(res[0].descr_eng);
              setValueParentIDInitial(res[0].parent_id||-1); 
              setValueFormula(res[0].formula);
              setValueFormulaInitial(res[0].formula);              
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
      }
      setUpdated(false); // Reset the updated state to false after scrolling  
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


  const setValues = useCallback((row) => {
    const valueSetters = {
      title: setValueTitle,
      name_rus: setValueNameRus,
      name_eng: setValueNameEng,
      descr_rus: setValueDescrRus,
      descr_eng: setValueDescrEng,
      parent_id: setValueParentID,
      formula: setValueFormula,
      crit: setValueCrit
    }
    
    const initialValueSetters = {
      title: setValueTitleInitial,
      name_rus: setValueNameRusInitial,
      name_eng: setValueNameEngInitial,
      descr_rus: setValueDescrRusInitial,
      descr_eng: setValueDescrEngInitial,
      parent_id: setValueParentIDInitial,
      formula: setValueFormulaInitial
    }

    Object.keys(valueSetters).forEach((key) => {
        const setValue = valueSetters[key];
        if(key in row) { // проверить, существует ли ключ в объекте row
            setValue(row[key]);
        } else { // если ключ не существует
            console.log("Ключа " + key + " не существует в объекте row"); // выводим имя ключа в консоль
        }
    });
    
    Object.keys(initialValueSetters).forEach((key) => {
        const setValueInitial = initialValueSetters[key];
        if(key in row) { // проверить, существует ли ключ в объекте row
            setValueInitial(row[key]);
        } else { // если ключ не существует
            console.log("Ключа " + key + " не существует в объекте row"); // выводим имя ключа в консоль
        }
    });
  }, [setValueTitle, setValueNameRus, setValueNameEng, setValueDescrRus, setValueDescrEng, setValueParentID, setValueFormula, setValueCrit,
    setValueTitleInitial, setValueNameRusInitial, setValueNameEngInitial, setValueDescrRusInitial, setValueDescrEngInitial, setValueParentIDInitial, setValueFormulaInitial]);
    
  const setValuesById = useCallback((id) => {
    const rowData = tableData.find(row => Number(row.id) === Number(id));
    if (rowData) {
      setValues(rowData);
    }    
  }, [tableData, setValues]);

  useEffect(() => {

    setValuesById( valueId );

  }, [ valueId, setValuesById]);

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    setOpenAlert(false);  
    const id = Number(nodeIds); // преобразуем id в число
    setClickedRowId(id);
  
    if (editStarted && valueCrit===1) {

      setDialogType('save');
    } else {
      if (id) {
        lastId = id;
      }
      setValueID(id);
    }
  };

  const inputRef = React.useRef();

  const handleClearClick = (params) => {
    if (editStarted)
    {
      setDialogType('save');
    } 
    else 
    {
      setClickedRowId(null); 
      setValueID(``);
      setValueTitle(``);
      setValueNameRus(``);
      setValueNameEng(``);
      setValueDescrRus(``);
      setValueDescrEng(``);
      setValueParentID(valueParentID?valueParentID:valueId);
      setValueCrit(1);
      setValueFormula(``);
    }
  }; 

  useEffect(() => {
    // Если valueId пуст (и поле "Обозначение" доступно), устанавливаем на него фокус
    if (!isValueSet(valueId)&&!isLoading) {
      // Даем фокус TextField после обновления состояния
      inputRef.current && inputRef.current.focus(); 
    }
  }, [valueId, isLoading]);

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
      setValueTitleInitial(res[0].title);
      setValueNameRusInitial(res[0].name_rus);
      setValueNameEngInitial(res[0].name_eng);
      setValueDescrRusInitial(res[0].descr_rus);
      setValueDescrEngInitial(res[0].descr_eng);
      setValueParentIDInitial(res[0].parent_id||-1); 
      setValueFormula(res[0].formula);      
      setValueFormulaInitial(res[0].formula);
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
      return Promise.resolve(); // добавляем эту строку
    } catch (error) {
      console.error(`Failed to fetch data from ${url}: ${error.message}`);
      return Promise.reject(error); // и эту
    }
  };

  useEffect(() => {
    fetchData('/chelement', setChelement).then(() => {
      setChelement(chelement => [
        {
          id: 1000000,
          title: "Не определено",
          atomic_num: null,
          name_rus: null,
          name_eng: null,
          mass_numbers: null
        },
        ...chelement
      ]);
    });
  }, []);
  ///////////////////////////////////////////////////////////////////  Tree load functions and hook  /////////////////////
  const [filter, setFilter] = useState(""); //значение фильтра
  const [filterApplied, setFilterApplied] = useState(false); //состояние применен фильтр или нет

  const clearFilter = useCallback(() => {
    setFilter("");
    setFilterApplied(false);
    setTreeFilter("");
  }, []);

  useEffect(() => {
    // Преобразуем tableData из списка в структуру дерева и обновляем состояние treeData
    const arr = listToTree(tableData, treeFilterString);
    setTreeData(arr);
    if ((arr.length===0)&& filterApplied) {
      clearFilter();
    }
  }, [tableData, treeFilterString, clearFilter, filterApplied]);

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

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    if (formRef.current.reportValidity() )
    {
    let myId, myParentID;
    if (valueId)
      myId = valueId-1000000;    
    if (valueParentID)
      myParentID = valueParentID;
    if (valueParentID===1000000)
      myParentID = null;  
    const js = JSON.stringify({
      id: myId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      parent_id: myParentID, 
      formula: valueFormula
    });

    if (!valueId) {
      addRec();
      return;
    }
    setIsLoading("true");
    try {
      const response = await fetch(`/${props.table_name}/${myId}`, {
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
        //console.log('reloadData');
        //console.log(treeData);
        if (valueParentID) {
          const parentIds = getParentIds(treeData, valueParentID).map(String); // получите список всех родительских элементов
          const newExpanded = new Set([...expanded, ...parentIds]); // добавьте их к уже раскрытым элементам, убрав дубликаты
          setExpanded(Array.from(newExpanded)); // преобразуйте обратно в массив и установите как новое состояние
        }  
        if (valueParentID && !expanded.includes(valueParentID.toString())) {
          setExpanded(prevExpanded => [...prevExpanded, valueParentID.toString()]);
        }

        // После успешного добавления или обновления записи:
        if (!valueTitle.includes(filter) && !valueNameRus.includes(filter) && filterApplied) {
          clearFilter();
        }
        await reloadData();
        if (clickedRowId===null) {
          setValueID(valueId.toString());
          setSelected(null);
          setSelected(valueId.toString());
        }
        else {
          setValueID(clickedRowId.toString());
          setSelected(clickedRowId.toString());
          setClickedRowId(null);
        }

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
        setValueFormulaInitial(valueFormula);     
     }
   }
  }
};


/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {

    let myParentID = valueParentID;
    if (valueParentID===1000000)
      myParentID = null;

    const js = JSON.stringify({
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      parent_id: myParentID,
      descr_eng: valueDescrEng,
      formula: valueFormula,
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
        lastId = Number(id)+1000000;         
        console.log('setSelected lastId' + lastId);
        // После успешного добавления или обновления записи:
        if (!valueTitle.includes(filter) && !valueNameRus.includes(filter) && filterApplied) {
          clearFilter();
        }
        
        if (clickedRowId===null) {
          setValueID(lastId);
          setSelected(lastId.toString());
        }
        else {
          setValueID(clickedRowId.toString());
          setSelected(clickedRowId.toString());
          setClickedRowId(null);
        }

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
        setValueFormula(valueFormula);
        setValueFormulaInitial(valueFormula);             
        setValueTitleInitial(valueTitle);       
        setValueNameRusInitial(valueNameRus); 
        setValueNameEngInitial(valueNameEng);
        setValueDescrRusInitial(valueDescrRus);
        setValueDescrEngInitial(valueDescrEng);    
        setValueParentIDInitial(valueParentID);
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
    let previousRowId = 0;
    previousRowId = findPreviousIdAfterDeleteChemComp(valueId, treeData); 

    let myId;
    if (valueId)
      myId = valueId-1000000;   


    setIsLoading("true");
    try {
      const response = await fetch(`/${props.table_name}/${myId}`, {
        method: 'DELETE',
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
        await reloadData();
        const rowData = tableData.find(row => row.id === previousRowId);
        if (rowData) {
          setValueID(previousRowId);
          setSelected(previousRowId.toString());
        }
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
        //console.log('after reload');
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

  const getDialogContentText = () => {
    const allRequiredFieldsFilled = formRef.current?.checkValidity();
    switch (dialogType) {
      case 'delete':
        return (
          <>
            В таблице "{table_names[props.table_name]}" предложена к удалению следующая запись: 
            <br />
            {valueTitle}; Код в БД = {valueId-1000000}. 
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
        //console.log('no save ', clickedRowId, clickedId);
        setEditStarted(false);
        setValueID(clickedRowId);
        //setValuesById(clickedRowId);
        setSelected(clickedRowId.toString());
        // setRowSelectionModel([clickedRowId]);
        break;
      default:
    }
    setDialogType('');
  };

  const handleCloseCancel = () => {
    switch (dialogType) {
      case 'save':
        //console.log('no save 1 clickedRowId valueId', clickedRowId, valueId);
        //setClickedRowId( valueId );
        //console.log('no save 2 clickedRowId valueId', clickedRowId, valueId);
        setSelected(valueId.toString());
        //setValueID(valueId);        
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
    setValueID(clickedRowId);
    setValuesById(clickedRowId);

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
    headers: ['Обозначение','Название (рус. яз)','Название (англ. яз)','Формула','Химический элемент','Комментарий (рус. яз)','Комментарий (англ. яз)']
  }; 

  const exportDataCSV = async () => {
    const csvExporter = new ExportToCsv(optionsCSV);
    const updatedData = tableData.map((item) => ({
      ...item,
      parent_title: tableData.find((parentItem) => parentItem.id === item.parent_id)?.title || "",
    }));
    const filteredData = updatedData.filter(item => item.id > 1000000 && item.title.toLowerCase().includes(treeFilterString.toLowerCase()));
    const newData = filteredData.map(({ title, name_rus, name_eng, formula, parent_title, descr_rus, descr_eng }) => ({
      title,
      name_rus,
      name_eng,
      formula,
      parent_title,
      descr_rus,
      descr_eng
    }));

    const noNullData = newData.map((item) => {
      return Object.fromEntries(
        Object.entries(item).map(([key, value]) => [key, value === null ? "" : value])
      );
    });

    csvExporter.generateCsv(noNullData);  
  } 

      
  const setTreeFilter = (e) => { 
    const value = e;
    const filter = value.trim();
    setTreeFilterString(filter);
  }  

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
            <IconButton onClick={()=>handleClearClick()} disabled={editStarted || valueId===1000000 || valueParentID === 1000000} color="primary" size="small" title="Создать запись">
              <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>saveRec(true)} disabled={valueCrit===0} color="primary" size="small" title="Сохранить запись в БД">
              <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
            <IconButton onClick={()=>setDialogType('delete')} disabled={valueCrit===0} color="primary" size="small" title="Удалить запись">
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
        {( valueCrit === 1) &&
          <>
          <form ref={formRef}> 
          <Grid container spacing={1.5}>
            <Grid item xs={2}>
              <TextField  
                id="ch_id" 
                disabled={true} 
                label="Код" 
                variant="outlined" 
                value={ (valueId-1000000)<=0?'':(valueId-1000000)} 
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={7}>
              <TextField  
                id="ch_name"
                inputRef={inputRef}  
                label="Обозначение"
                disabled={valueId!==''}  
                required 
                size="small" 
                variant="outlined" 
                value={valueTitle || ''} 
                onChange={e => setValueTitle(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                  required
                  id="ch_parent_id"
                  value={tableChelement.find(option => option.id === valueParentID) || ""}
                  size="small"
                  onChange={(event, newValue) => {
                    setValueParentID(newValue ? newValue.id : null);
                  }}
                  options={ tableChelement }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Tooltip title={option.name_rus}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <span>{option.title}</span>
                          <span></span>
                        </div>
                      </Tooltip>
                    </li>
                  )}                  
                  getOptionLabel={option => (option && option.title) ? option.title : ""}
                  fullWidth
                  disableClearable
                  disabled = {valueParentID===1000000}
                  getOptionDisabled={(option) => option.id === 1000000} // Отключение опции с id = 1000000
                  renderInput={(params) => <TextField {...params} label="Химический элемент" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField  
                id="ch_formula" 
                size="small" 
                label="Формула" 
                variant="outlined"  
                value={valueFormula||''} 
                onChange={e => setValueFormula(e.target.value)}
                fullWidth
              />                   
            </Grid>            
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
    {/*         <Grid item xs={6}>
            </Grid>
    */}
          </Grid>
          </form>
       
          <div style={{ height: 300, width: 800 }}>
            <td>Источники данных<br/>
            <DataTableDataSourceClass table_name={props.table_name} rec_id={valueId-1000000||0} />
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


 </>     
  )
}

export { DataTableChemCompGr, lastId }
