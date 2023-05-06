import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiRef,
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
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import CircularProgress from '@material-ui/core/CircularProgress';
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
//import { ReactComponent as InfoLightIcon } from "./../icons/info.svg";
import { table_names } from './sda_types';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTableChelement = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();
  const [valueNameRus, setValueNameRus] = React.useState();
  const [valueNameRusInitial, setValueNameRusInitial] = React.useState();
  const [valueNameEng, setValueNameEng] = React.useState();
  const [valueNameEngInitial, setValueNameEngInitial] = React.useState();
  const [valueAtomicNum, setValueAtomicNum] = React.useState();
  const [valueAtomicNumInitial, setValueAtomicNumInitial] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [tablePhchForm, setTablePhchForm] = useState([]); 
  const [tablePhchFormFiltered, setTablePhchFormFiltered] = useState([]); 
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState([false]);
  const [tableNuclide, setTableNuclide] = useState([]); 
  const [valueMassNumber, setValueMassNumber] = React.useState();
  const [isEmpty, setIsEmpty] = useState([false]);
  const [valueNuclideId, setValueNuclideID] = React.useState();

  useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueNameRus)&&(''===valueNameEng)&&(''===valueAtomicNum)&&(''===valueMassNumber));
    }, [ valueTitle, valueNameRus, valueNameEng, valueAtomicNum, valueMassNumber]); 
      
  useEffect(() => {
    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueAtomicNumInitial!==valueAtomicNum));
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
       valueAtomicNumInitial, valueAtomicNum]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        lastId = tableData[0].id;
        setRowSelectionModel([tableData[0].id]);
        setValueID(tableData[0].id);
        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueAtomicNum(tableData[0].atomic_num);
        setValueTitleInitial(tableData[0].title);       
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueAtomicNumInitial(tableData[0].atomic_num);
      }
    }
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {
        console.log( 'isEmpty = '+isEmpty);
        console.log( 'editStarted = '+editStarted);


    if (editStarted&&(!isEmpty))
    //if (editStarted)
    {
      handleClickSave(params);
    } 
    else 
    {
      console.log( 'params.row.id = '+params.row.id); 
      setValueID(params.row.id);
      setValueTitle(params.row.title);
      setValueNameRus(params.row.name_rus);
      setValueNameEng(params.row.name_eng);
      console.log('Atomic num = ' + params.row.atomic_num);
      setValueAtomicNum(params.row.atomic_num);
      setValueTitleInitial(params.row.title);
      setValueNameRusInitial(params.row.name_rus);
      setValueNameEngInitial(params.row.name_eng);
      setValueAtomicNumInitial(params.row.atomic_num);
    }
  }; 

  const handleRowNuclideClick = (params) => {
    setValueNuclideID(params.row.id);
    setValueMassNumber(params.row.mass_number);
  }; 

  const handleClearClick = (params) => {
    if (editStarted&&(!isEmpty))
    {
      handleClickSaveWhenNew(params);
    } 
    else 
    {
      setValueID(``);
      setValueTitle(``);
      setValueNameRus(``);
      setValueNameEng(``);
      setValueAtomicNum(``);
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => { lastId = 0;} ); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/phchform_chelem`)
      .then((data) => data.json())
      .then((data) => setTablePhchForm(data)); 
  }, [])

  useEffect(() => {
    if (!valueId) 
      return;

    fetch(`/nuclide/`+valueId)
      .then((data) => data.json())
      .then((data) => setTableNuclide(data))
      .then(console.log('грузим нуклиды'));
  }, [valueId])

  useEffect(() => {
    let f = tablePhchForm.filter(item => ( Number(item.chelement_id) === Number(valueId) ));
    console.log(f);
    setTablePhchFormFiltered(f);
  }, [valueId, tablePhchForm])


  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {

    if (formRef.current.reportValidity() )
    {

    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      atomic_num: valueAtomicNum,      
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
       setValueNameRusInitial(valueNameRus); 
       setValueNameEngInitial(valueNameEng);
       setValueAtomicNumInitial(valueAtomicNum);         
     }
    reloadData();     
   }
  }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      atomic_num: valueAtomicNum,       
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
      setRowSelectionModel([lastId]);
      scrollToIndexRef.current = lastId;  
      //Refresh initial state
      setValueTitleInitial(valueTitle);
      setValueNameRusInitial(valueNameRus);
      setValueNameEngInitial(valueNameEng);
      setValueAtomicNumInitial(valueAtomicNum);         
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
        setRowSelectionModel([tableData[0].id]);  
        setValueID(tableData[0].id);
        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueAtomicNum(tableData[0].atomic_num);
        setValueTitleInitial(tableData[0].title);
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueAtomicNumInitial(tableData[0].atomic_num);
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
    setValueNameRus(``);
    setValueNameEng(``);
    setValueAtomicNum(``);
  };

  const handleCloseSaveWhenNewYes = () => {
    setOpenSaveWhenNew(false);
    saveRec(true);
    setValueID(``);
    setValueTitle(``);
    setValueNameRus(``);
    setValueNameEng(``);
    setValueAtomicNum(``);
  };

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 250 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'atomic_num', headerName: 'Атомный номер', width: 180 },
    { field: 'mass_numbers', headerName: 'Радионуклиды элемента', width: 300 }
  ]

  /*
{"id":1533,"chelement_id":143,"subst_form_id":3,"chem_comp_gr_id":167,"subst_form_title":"gases_vapours",
"subst_form_nls_name":"газы и пары","subst_form_nls_descr":"растворимые или химически активные газы или пары",
"chem_comp_gr_title":"noble_gas","chem_comp_gr_formula":null,"chem_comp_gr_nls_name":"инертные газы","chem_comp_gr_nls_descr":null,"chelement_title":"Ar","chelement_atomic_num":null}
  */

  const columnsPhchform = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'chelement_id', headerName: 'Химический элемент, код', width: 80 },
    { field: 'subst_form_id', headerName: 'Форма вещества, код', width: 80 },
    { field: 'chem_comp_gr_id', headerName: 'Группа химических соединений, код', width: 180 },
    { field: 'subst_form_title', headerName: 'Форма вещества, обозначение', width: 180 },
    { field: 'subst_form_nls_name', headerName: 'Форма вещества, наименование (рус.яз)', width: 180 },
    { field: 'chem_comp_gr_title', headerName: 'Группа химических соединений, обозначение ', width: 180 },
    { field: 'chem_comp_gr_formula', headerName: 'Формула химических соединения ', width: 180 },
    { field: 'chem_comp_gr_nls_name', headerName: 'Группа химических соединений, наименование (рус.яз)', width: 180 },
    { field: 'chem_comp_gr_nls_descr', headerName: 'Группа химических соединений, описание', width: 180 },
    { field: 'chelement_title', headerName: 'Химический элемент, обозначение', width: 180 },
    { field: 'chelement_atomic_num', headerName: 'Химический элемент, атомное значение', width: 180 },
  ]

  
  const columnsNuclide = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'chelement_id', headerName: 'Химический элемент, код', width: 80 },
    { field: 'name', headerName: 'Обозначение', width: 300 },
    { field: 'mass_number', headerName: 'Массовое число', width: 180 },
  ]


  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    const selectedIDs = new Set(rowSelectionModel);
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    if (selectedRowData.length)
    {
      setValueID(selectedRowData[0].id);
      setValueTitle(selectedRowData[0].title);
      setValueNameRus(selectedRowData[0].name_rus);
      setValueNameEng(selectedRowData[0].name_eng);
      setValueAtomicNum(selectedRowData[0].atomic_num);
      setValueTitleInitial(selectedRowData[0].title);
      setValueNameRusInitial(selectedRowData[0].name_rus);
      setValueNameEngInitial(selectedRowData[0].name_eng);
      setValueAtomicNumInitial(selectedRowData[0].atomic_num);
    }
  }
// Scrolling and positionning
const [paginationModel, setPaginationModel] = React.useState({
  pageSize: 25,
  page: 0,
});

useEffect(() => {
  console.log(paginationModel.page);
}, [paginationModel]);

const handleScrollToRow = React.useCallback((v_id) => {
  const sortedRowIds = apiRef.current.getSortedRowIds(); //получаем список отсортированных строк грида
  const index = sortedRowIds.indexOf(parseInt(v_id));    //ищем в нем номер нужной записи
  if (index !== -1) {
    const pageSize = paginationModel.pageSize; // определяем текущую страницу и индекс строки в этой странице
    const currentPage = paginationModel.page;
    const rowPageIndex = Math.floor(index / pageSize);
    if (currentPage !== rowPageIndex) { // проверяем, нужно ли изменять страницу
      apiRef.current.setPage(rowPageIndex);
    }
    setRowSelectionModel([v_id]); //это устанавливает фокус на выбранной строке (подсветка)
    setTimeout(function() {       //делаем таймаут в 0.1 секунды, иначе скроллинг тупит
      apiRef.current.scrollToIndexes({ rowIndex: index, colIndex: 0 });
    }, 100);
  }
}, [apiRef, paginationModel, setRowSelectionModel]);

const scrollToIndexRef = React.useRef(null); //тут хранится значение (айди) добавленной записи

useEffect(() => {
  //событие, которое вызовет скроллинг грида после изменения данных в tableData
  if (!scrollToIndexRef.current) return; //если значение не указано, то ничего не делаем
  if (scrollToIndexRef.current===-1) return;
  // console.log('scrollToIndex index '+ scrollToIndexRef.current);
  handleScrollToRow(scrollToIndexRef.current);
  scrollToIndexRef.current = null; //обнуляем значение
}, [tableData, handleScrollToRow]);


function CustomToolbar1() {
  //const apiRef = useGridApiRef(); // init DataGrid API for scrolling
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
  /////////////////////////////////////////////////////////////////////////////////////////////Delete

  const delNuclide =  async () => {
    console.log('delNuclide clicked');
     const js = JSON.stringify({
       id: valueNuclideId,
    });  
    setIsLoading(true);
    console.log('del nuclide');
    console.log(valueNuclideId);
    try {
      const response = await fetch(`/nuclide/`+valueNuclideId, {
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
        console.log(response.text());
        setOpenAlert(true);          
      }
      else
      {
        alertSeverity = "success";
        alertText = await response.text();
        console.log(alertText);
        setOpenAlert(true);  
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
      reloadNuclide();
    }
  };  
///////////////////////////////////////////////////////////////////////////////////////////////Nuclide
  const reloadNuclide = async () => {
    setIsLoading(true);
    try {

      if (!valueId) 
      return;

      const response = await fetch(`/nuclide/`+valueId);

      if (!response.ok) {
        alertText =  'Ошибка при обновлении нуклидов';
        alertSeverity = "false";
        setOpenAlert(true);  
        throw new Error(`Error! status: ${response.status}`);
      }  
      const result = await response.json();
      setTableNuclide(result);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const addNuclide = async ()  => {
    const js = JSON.stringify({
      chelement_id: valueId,
      mass_number: valueMassNumber,
    });
    setIsLoading(true);
    try {
      const response = await fetch('/nuclide/', {
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
        //lastAddedId = parseInt( alertText.substr(alertText.lastIndexOf('ID:') + 3, 20)); 
        //setValueID(lastAddedId);
        setOpenAlert(true);  
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
      reloadNuclide(); 
    }
  };



  const saveNuclide = async ()  => {
    const js = JSON.stringify({
      nuclide_id: valueNuclideId,
      mass_number: valueMassNumber,
    });
    setIsLoading(true);
    try {
      const response = await fetch('/nuclide/' + valueNuclideId, {
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
        alertText =  await response.text();
        //lastAddedId = parseInt( alertText.substr(alertText.lastIndexOf('ID:') + 3, 20)); 
        //setValueID(lastAddedId);
        setOpenAlert(true);  
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
      reloadNuclide(); 
    }
  };


  const [openNuclide, setOpenNuclide] = React.useState(false);
  const [openDelNuclide, setOpenDelNuclide] = React.useState(false);


  //function DataTableChelement(props)  {
  //  const [open, setOpen] = React.useState(false);
  
 /*    const handleClickAddNuclide = () => {
      setValueID(null);
      setValueDataSourceId(null);
      setValueRecID(props.rec_id);
      setValueTableName(props.table_name);
      setValueTitleSrc("");
      setValueNameSrc("");
      setOpen(true);
    };
   
    const handleCloseYes = () => {
      setOpen(false);
      saveRec();
    };
  
    const handleCloseNo = () => {
      setOpen(false);
    }; */
  
 
  const handleClickEditNuclide = () => {
      setOpenNuclide(true); 
  };


  const handleClickAddNuclide = () => {
    setValueNuclideID(null);
    setValueMassNumber(null);
    setOpenNuclide(true); 
  };

  const handleCloseNuclideYes = () => {
    setOpenNuclide(false);

    if (!valueNuclideId)
      addNuclide()
    else
      saveNuclide();
  };

  const handleCloseNuclideNo = () => {
    setOpenNuclide(false);
  };

  const handleClickDelNuclide = () => {
    setOpenDelNuclide(true); 
  };

  const handleCloseDelNuclideYes = () => {
    setOpenDelNuclide(false);
    delNuclide();
  };

  const handleCloseDelNuclideNo = () => {
    setOpenDelNuclide(false);
  };

  //====================================================================================

  const [selectionModelNuclide, setSelectionModelNuclide] = React.useState([]);

  useEffect(() => {
  if ((!isLoading) && (tableNuclide) && (tableNuclide.length))
  {

    setValueNuclideID(tableNuclide[0].id);
    setValueMassNumber(tableNuclide[0].mass_number);

    setSelectionModelNuclide([tableNuclide[0].id]); //выбрать первую строку при перегрузке таблицы
  }
  if ((!isLoading) && (tableNuclide) )
  {
    //обновить блокировку кнопок "Редактировать" и "Удалить" в зависимости от наличия записей в таблице
    //setNoRecordsDecay(!tableDecay.length);
  }
}, [isLoading, tableNuclide]); 

   const formRef = React.useRef();
  return (
    <div style={{ height: 640, width: 1500 }}>

    <form ref={formRef}>  
    <table border = "0" style={{ height: 550, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 640, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 486, width: 585 }}>
      <DataGrid
        components={{ Toolbar: CustomToolbar1 }}
        apiRef={apiRef}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableData}
        loading={isLoading}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}    
        initialState={{
          columns: {
            columnVisibilityModel: {
              name_eng: false,
              atomic_num: false,
              descr_eng: false,
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
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_atomic_num" sx={{ width: '20ch' }} label="Атомный номер" required size="small" /* type="number" */ variant="outlined" value={valueAtomicNum || ''} onChange={e => setValueAtomicNum(e.target.value)}/>
      <p></p>
      <TextField  id="ch_name_rus" sx={{ width: '49ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '49ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
      <p></p>
      Физико-химические формы элемента
      <DataGrid
        style={{ height: 230, width: 800, verticalAlign: 'top' }}
        //sx={{ height: 200 }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tablePhchFormFiltered}
        loading={isLoading}
        columns={columnsPhchform}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              chelement_id: false,
              subst_form_id: false,
              chem_comp_gr_id: false,
              chem_comp_gr_formula: false,
              chem_comp_gr_nls_descr: false,
              chelement_title: false,
              chelement_atomic_num: false,
            },
          },

        }}    
      />

      <p></p>
      <table cellSpacing={0} cellPadding={0} style={{ height: 270, width: 886, verticalAlign: 'top' }} border="0"><tbody><tr>
        <td style={{ height: 270, width: 800, verticalAlign: 'top' }}>
        Радионуклиды элемента
        <DataGrid
        style={{ height: 270, width: 800, verticalAlign: 'top' }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableNuclide}
        loading={isLoading}
        columns={columnsNuclide}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModelNuclide(newSelectionModel);
        }}        
        selectionModel={selectionModelNuclide} 
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              chelement_id: false,
            },
          },
 
        }}   
        onRowClick={handleRowNuclideClick} {...tableData}     
      />
      </td>
      <td style={{ height: 270, width: 100, verticalAlign: 'top' }}>
       &nbsp;<IconButton onClick={()=>handleClickAddNuclide()}  disabled={false} color="primary" size="small" title="Добавить нуклид">
        <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton><br/>
       &nbsp;<IconButton onClick={()=>handleClickEditNuclide()} disabled={false} color="primary" size="small" title="Редактировать нуклид">
        <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton><br/>
       &nbsp;<IconButton onClick={()=>handleClickDelNuclide()} disabled={false} color="primary" size="small" title="Удалить нуклид">
        <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton><br/>
      {/* 
      &nbsp;<IconButton onClick={()=>handleOpenDSInfo()} disabled={noRecords} color="primary" size="small" title="Информация по источнику данныъ">
        <SvgIcon fontSize="small" component={InfoLightIcon} inheritViewBox /></IconButton> */}
      </td></tr>
      <tr>
        <td>
        <Box sx={{ width: '100%' }}>
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
            sx={{ mb: 2 }}
          >
            {alertText}
          </Alert>
        </Collapse>
        <div style={{
        marginLeft: '40%',
        }}>
        {isLoading && <CircularProgress/>} 
        {/*       {!isLoading && <h3>Successfully API Loaded Data</h3>} */}
        </div>
      </Box>
        </td>
      </tr>
      </tbody>
      </table>

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
        {valueId?
          `В запись таблицы "${table_names[props.table_name]}" внесены изменения.`:
          `В таблицу "${table_names[props.table_name]}" внесена новая несохраненная запись.`} 
{/*             {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueAtomicNum === valueAtomicNumInitial ? '' : 'Атомный номер: '+valueAtomicNum+'; ' }<p></p>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p></p>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p></p> */}
            <br/>Вы желаете сохранить указанную запись?
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
        {valueId?
          `В запись таблицы "${table_names[props.table_name]}" внесены изменения.`:
          `В таблицу "${table_names[props.table_name]}" внесена новая несохраненная запись.`} 
      {/*       {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueAtomicNum === valueAtomicNumInitial ? '' : 'Атомный номер: '+valueAtomicNum+'; ' }<p></p>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p></p>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p></p> */}
            <br/>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewYes} >Да</Button>
    </DialogActions>
  </Dialog>

  <Dialog open={openNuclide} onClose={handleCloseNuclideNo} fullWidth={false} maxWidth="800px">
      <DialogTitle>Нуклид</DialogTitle>  
        <DialogContent style={{height:'280px', width: '700px'}}>
          <DialogContentText>
            Ввести нуклид
          </DialogContentText>
          <p></p>        
          <TextField
            variant="outlined"
            margin="dense"
            id="title"
            //type="number"
            label="Массовое число"
            value={valueMassNumber}
            fullWidth
            onChange={e => setValueMassNumber(e.target.value)}  
          />
          </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseNuclideNo}>Отмена</Button>
          <Button variant="outlined" onClick={handleCloseNuclideYes}>Сохранить</Button>
        </DialogActions>
      </Dialog>

  <Dialog open={openDelNuclide} onClose={handleCloseDelNuclideNo} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
          В таблице "Нуклиды" предложена к удалению следующая запись:<p></p><b>{valueMassNumber}</b>; Код в БД = <b>{valueNuclideId}</b><p></p>
          Вы желаете удалить указанную запись?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseDelNuclideNo} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleCloseDelNuclideYes} >Да</Button>
      </DialogActions>
  </Dialog>  
  </form>    
 </div>     

  )
}

export { DataTableChelement, lastId }
