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
import { Grid, Box, IconButton } from '@mui/material';
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
import { table_names } from './table_names';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import Divider from '@mui/material/Divider';

const DataTableChelement = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const apiRefNuclide = useGridApiRef(); // init DataGrid API for scrolling

  // Поля БД
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();
  const [valueNameRus, setValueNameRus] = React.useState();
  const [valueNameRusInitial, setValueNameRusInitial] = React.useState();
  const [valueNameEng, setValueNameEng] = React.useState();
  const [valueNameEngInitial, setValueNameEngInitial] = React.useState();
  const [valueAtomicNum, setValueAtomicNum] = React.useState();
  const [valueAtomicNumInitial, setValueAtomicNumInitial] = React.useState();

  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [currentId, setCurrentId] = useState(null);  

  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
/*   const [tablePhchForm, setTablePhchForm] = useState([]); 
  const [tablePhchFormFiltered, setTablePhchFormFiltered] = useState([]);  */
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [rowSelectionModelNuclide, setRowSelectionModelNuclide] = React.useState([]);
  const [editStarted, setEditStarted] = useState(false);  

  const [addedId, setAddedId] = useState(null);  
  const [addedIdNuclide, setAddedIdNuclide] = useState(null);  

  const [tableNuclide, setTableNuclide] = useState([]); 
  const [valueMassNumber, setValueMassNumber] = React.useState();
  const [isEmpty, setIsEmpty] = useState([false]);
  const [valueNuclideId, setValueNuclideID] = React.useState();

  //const [reportValid, setReportValid] = React.useState([true]);

  useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueNameRus)&&(''===valueNameEng)&&(''===valueAtomicNum)&&(''===valueMassNumber));
    }, [ valueTitle, valueNameRus, valueNameEng, valueAtomicNum, valueMassNumber]); 
  function isValueSet(valueId) {
    return valueId !== null && valueId !== undefined && valueId !== '';
  }  
      
   useEffect(() => {
    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueAtomicNumInitial!==valueAtomicNum));

      //setReportValid(formRef.current.reportValidity());

    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
       valueAtomicNumInitial, valueAtomicNum]);  

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length) && tableData[0].id>-1) {
      if (typeof currentId !== 'number') 
      {
        console.log('Выбрано ', tableData[0].id);
        setRowSelectionModel([tableData[0].id]);
        setCurrentId(tableData[0].id);
        setValueID(tableData[0].id);
      }
    }
    }, [ isLoading, tableData, currentId] );

  const [prevRowSelectionModel, setPrevRowSelectionModel] = useState([]);
  const [clickedRowId, setClickedRowId] = useState(null);

   useEffect(() => {
    // Если редактирование начато, не меняем выбранную строку
    if (editStarted) {
      setRowSelectionModel(prevRowSelectionModel);
    } else {
      // Здесь сохраняем предыдущую выбранную строку
      setPrevRowSelectionModel(rowSelectionModel);
    }
  }, [rowSelectionModel, prevRowSelectionModel, editStarted]);    

  const handleRowClick = (params) => {

    console.log('handleRowClick', params.row.id, valueId);
    if (params.row.id === valueId  ) {
      // Если данные не изменились, просто выходим из функции
      return;
    }
    setOpenAlert(false);

    //console.log('editStarted isEmpty', editStarted, isEmpty);
    //if (editStarted&&(!isEmpty))
    if (editStarted)
    {
      setClickedRowId(params.row.id);
      setDialogType('save');
    } 
    else 
    {
      setValueNuclideID(null);
      setValueMassNumber(null);
      setValueID(params.row.id);
    }
  }; 

  const inputRef = React.useRef();
  const handleRowNuclideClick = (params) => {

    console.log('handleRowNuclideClick', params.row.id, params.row.mass_number);
    setOpenAlertNuclide(false);
    setValueNuclideID(params.row.id);
    setValueMassNumber(params.row.mass_number);
  }; 

  const handleClearClick = (params) => {
    if (editStarted/* &&(!isEmpty) */) {
      setDialogType('save');
    } else {
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
      .then((data) => setTableData(data)); 
  }, [props.table_name])

/*   useEffect(() => {
    fetch(`/phchform_chelem`)
      .then((data) => data.json())
      .then((data) => setTablePhchForm(data)); 
  }, [])
 */
  useEffect(() => {
    if (!valueId)
    { 
      setTableNuclide([]);
      return;
    }

    fetch(`/nuclide/`+valueId)
    .then((data) => data.json())
    .then((data) => {
      setTableNuclide(data);
      
      // Если массив содержит элементы, устанавливаем значения
      if (data.length > 0) {
        setValueNuclideID(data[0].id);
        setValueMassNumber(data[0].mass_number);
      }
    })
    .then(() => console.log('грузим нуклиды'));
  }, [valueId])

/*   useEffect(() => {
    let f = tablePhchForm.filter(item => ( Number(item.chelement_id) === Number(valueId) ));
    console.log(f);
    setTablePhchFormFiltered(f);
  }, [valueId, tablePhchForm]) */

const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    const data = {
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      atomic_num: valueAtomicNum,      
    };
    
    setIsLoading(true);
    const url = `/${props.table_name}/` + (isValueSet(valueId) ? valueId : '');
    const method = isValueSet(valueId) ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'Application/json',
          Accept: '*/*',
        },
      });
      
      // Проверяем тип контента
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      let responseData;
      
      // Обрабатываем ответ в зависимости от типа контента
      if (isJson) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      // Обрабатываем ответ в зависимости от статуса
      if (!response.ok) {
        throw new Error(responseData);
      }
      
      setAlertSeverity('success');
      
      // Если это POST запрос, получаем и устанавливаем новый ID
      if (method === 'POST') {
        const newId = responseData.id;
        
        if (clickedRowId===null) {
          setValueID(newId);
          setAddedId(newId);
        }
        else {
          setValueID(clickedRowId);
          setClickedRowId(null);
        }
          
        setAlertText(`Добавлена запись с кодом ${newId}`);

      } else {
        if  (clickedRowId!==null) {
          setValueID(clickedRowId);
          setClickedRowId(null);
        }
        setAlertText(responseData || 'Success');
      }
      
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);

      if (clickedRowId!==null) {
        setValueID(clickedRowId);
      }
    } finally {
      setIsLoading(false);
      setOpenAlert(true);

      await reloadData();
    }
  }
}

useEffect(() => {
  const rowData = tableData.find(row => row.id === valueId);
  if (rowData) {
    setValues(rowData);
  }
}, [tableData, valueId]);

// Функция delRec
const delRec = async () => {

  const sortedAndFilteredRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const deletingRowIndex = sortedAndFilteredRowIds.indexOf(Number(valueId));
  let previousRowId = 0;
  if (deletingRowIndex > 0) {
    previousRowId = sortedAndFilteredRowIds[deletingRowIndex - 1];
  } else {
    previousRowId = sortedAndFilteredRowIds[deletingRowIndex + 1];
  }

  setIsLoading(true);

  try {
    const response = await fetch(`/${props.table_name}/${valueId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    //очищаем фильтр, если там только одна (удаленная) запись
    if (sortedAndFilteredRowIds.length === 1) {
      apiRef.current.setFilterModel({ items: [] });
    }
    setAlertSeverity('success');
    setAlertText(await response.text());
    // Переключаемся на предыдущую запись после удаления
    if (previousRowId)
    {
      setValueID(previousRowId);
      setAddedId(previousRowId);
    }
    else
    {
      if (tableData[0]) {
        setValueID(tableData[0].id);
        setAddedId(tableData[0].id);
      }
    }    
  } catch (err) {
    setAlertSeverity('error');
    setAlertText(err.message);
    setRowSelectionModel([valueId]);
    
  } finally {
    setIsLoading(false);
    setOpenAlert(true);
    reloadData();
  }
};

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////
  const reloadDataAlert =  async () => {
    setAlertSeverity('info');
    setAlertText('Данные успешно обновлены');
    try 
    {
      await reloadData();
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
    setIsLoading(true);  // запускаем индикатор загрузки
    try {
      const response = await fetch(`/${props.table_name}/`);
  
      if (!response.ok) {
        setAlertSeverity('error');
        setAlertText(`Ошибка при обновлении данных: ${response.status}`);
        const error = response.status + ' (' + response.statusText + ')';
        throw new Error(`${error}`);
      } else {
        const result = await response.json();
        setTableData(result);
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);  // останавливаем индикатор загрузки
    }
  };

  ///////////////////////////////////////// DIALOG
  const [dialogType, setDialogType] = useState('');

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
        if (!isValueSet(valueId)) { // если это новая запись
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

  const setValues = (row) => {
    setValueTitle(row.title);
    setValueTitleInitial(row.title);
    setValueNameRus(row.name_rus);
    setValueNameRusInitial(row.name_rus);
    setValueNameEng(row.name_eng);
    setValueNameEngInitial(row.name_eng);
    setValueAtomicNum(row.atomic_num);         
    setValueAtomicNumInitial(row.atomic_num);         
  };

  const handleCloseNo = () => {
    switch (dialogType) {
      case 'save':
        setEditStarted(false);
        setValueID(clickedRowId);
        setRowSelectionModel([clickedRowId]);
        break;
      default:
        break;
    }
    setDialogType('');
};

  const handleCloseCancel = () => {
    switch (dialogType) {
      case 'save':
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
      setRowSelectionModel([clickedRowId]);
      const rowData = tableData.find(row => row.id === clickedRowId);
      setValues(rowData);
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
  let columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 250 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'atomic_num', headerName: 'Атомный номер', width: 180 },
    { field: 'mass_numbers', headerName: 'Радиоизотопы элемента', width: 300 }
  ]

  /*
{"id":1533,"chelement_id":143,"subst_form_id":3,"chem_comp_gr_id":167,"subst_form_title":"gases_vapours",
"subst_form_nls_name":"газы и пары","subst_form_nls_descr":"растворимые или химически активные газы или пары",
"chem_comp_gr_title":"noble_gas","chem_comp_gr_formula":null,"chem_comp_gr_nls_name":"инертные газы","chem_comp_gr_nls_descr":null,"chelement_title":"Ar","chelement_atomic_num":null}
  */
/* 
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
 */
  
  const columnsNuclide = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'chelement_id', headerName: 'Химический элемент, код', width: 80 },
    { field: 'name', headerName: 'Обозначение', width: 300 },
    { field: 'mass_number', headerName: 'Массовое число', width: 180 },
  ]


  const [openAlert, setOpenAlert] = React.useState(false, '');
  const [openAlertNuclide, setOpenAlertNuclide] = React.useState(false, '');

  const [alertNuclideText, setAlertNuclideText] = useState("");
  const [alertNuclideSeverity, setAlertNuclideSeverity] = useState("info");

  const handleCancelClick = () => 
  {
    
    const selectedIDs = new Set(rowSelectionModel.map(Number));
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
  const { paginationModel, setPaginationModel, scrollToIndexRef } = useGridScrollPagination(apiRef, tableData, setRowSelectionModel);
  const { paginationModeNuclide, setPaginationModelNuclide, scrollToIndexRefNuclide } = 
    useGridScrollPagination(apiRefNuclide, tableNuclide, setRowSelectionModelNuclide);

  useEffect(() => {
    if (addedId !== null){  
        scrollToIndexRef.current = addedId;
        setAddedId(null);
        setEditStarted(false);
        setRowSelectionModel([addedId]);
    }
  }, [addedId, scrollToIndexRef]);

  useEffect(() => {
    if (addedId !== null){  
        scrollToIndexRef.current = addedId;
        setAddedId(null);
         setRowSelectionModelNuclide([addedId]);
    }
  }, [addedIdNuclide, scrollToIndexRefNuclide]);  

  function GridToolbar() {
    const handleExport = (options) =>
       apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClearClick()} disabled={editStarted} color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>{setClickedRowId(null); saveRec(true)}}  color="primary" size="small" title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
        <IconButton onClick={()=>setDialogType('delete')}  color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>reloadDataAlert(valueId)} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleExport({ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} color="primary" 
            size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
      </GridToolbarContainer>
    );
  }


  const CustomFooter = props => {
    return (
      <span>
        <Divider />
        <GridToolbarContainer 
          style={{ 
            justifyContent: 'flex-end', 
            paddingRight: '20px', // Отступ справа
            alignItems: 'center', 
            height: '56px' // Фиксированная высота
        }}
      >
        Всего строк: {tableData.length}
      </GridToolbarContainer>
    </span>
    );
  };  

  const CustomFooterNuclide = props => {
    return (
      <>
        <Divider />
        <GridToolbarContainer 
          style={{ 
            justifyContent: 'flex-end', 
            alignItems: 'center', // Выравнивание по вертикали по центру
            paddingRight: '20px', // Отступ справа
            height: '56px' // Пример высоты, настройте под ваш случай
          }}
        >
          Всего строк: {tableNuclide.length}
        </GridToolbarContainer>
      </>
    );
  };

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
        setAlertNuclideSeverity('error');
        setAlertNuclideText( await response.text() );
        console.log(response.text());
        setOpenAlertNuclide(true);          
      }
      else
      {
        setAlertNuclideSeverity('success');
        setAlertNuclideText( await response.text() );
        console.log(alertText);
        setOpenAlertNuclide(true);  
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
      reloadNuclide();
      if ((tableNuclide) && (tableNuclide.length))
      {
        setValueNuclideID(tableNuclide[0].id);
        setValueMassNumber(tableNuclide[0].mass_number);
        setSelectionModelNuclide([tableNuclide[0].id]); //выбрать первую строку при перегрузке таблицы
      }
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
        setAlertNuclideText('Ошибка при обновлении нуклидов');
        setAlertNuclideSeverity('error');
        setOpenAlertNuclide(true);  
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
        setAlertNuclideSeverity('error');
        setAlertNuclideText( await response.text());
        setOpenAlertNuclide(true);    
        console.log('aaaaaa!');      
      }
      else
      {
        setAlertNuclideSeverity('success');

        // Проверяем тип контента
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        let responseData;
        
        // Обрабатываем ответ в зависимости от типа контента
        if (isJson) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
              
        const newId = responseData.id;
        console.log('newId', newId);
        setAlertNuclideText(`Добавлен нуклид с кодом ${newId}`);
        //lastAddedId = parseInt( alertText.substr(alertText.lastIndexOf('ID:') + 3, 20)); 
        //setValueID(lastAddedId);
        setValueNuclideID(newId);
        setValueMassNumber(valueMassNumber);
        setSelectionModelNuclide([newId]);  
        setAddedIdNuclide(newId);
        setOpenAlertNuclide(true);  
      }
    } catch (err) {
      setAlertNuclideText(alertText);
      setAlertNuclideSeverity('error');
      setOpenAlertNuclide(true);
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
        setAlertNuclideText( await response.text());
        setAlertNuclideSeverity('error');
        setOpenAlertNuclide(true);          
      }
      else
      {
        setAlertNuclideSeverity('success');
        setAlertNuclideText( await response.text());
        //lastAddedId = parseInt( alertText.substr(alertText.lastIndexOf('ID:') + 3, 20)); 
        //setValueID(lastAddedId);
        setOpenAlertNuclide(true);  
      }
    } catch (err) {
      setAlertNuclideText( err.message );
      setAlertNuclideSeverity('error');
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
      reloadNuclide(); 

      setValueNuclideID(valueNuclideId);
      setValueMassNumber(valueMassNumber);
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

/*   useEffect(() => {
    //if (valueNuclideId) return;

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
  }, [isLoading, tableNuclide, valueNuclideId]);   */

  const formRef = React.useRef();
  return (
    <Box sx={{ border: '0px solid purple', width: 1445, height: 650, padding: 1 }}>
      <Grid container spacing={1}>
        <Grid item sx={{width: 583, border: '0px solid green', ml: 1 }}>
          <DataGrid
            components={{Footer: CustomFooter, Toolbar: GridToolbar }}
            apiRef={apiRef}
            hideFooterSelectedRowCount={true}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            rowHeight={25}
            pageSize={tableData.length}
            paginationMode="server"
            hideFooterPagination
            rows={tableData}
            columns={columns}
            /* paginationModel={paginationModel} */
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            initialState={{
              columns: {
            columnVisibilityModel: {
              name_eng: false,
              descr_rus: false,
              descr_eng: false,
            },
              },
            }}        
            onRowClick={handleRowClick} {...tableData}
            style={{ width: 570, height: 500, border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '4px' }}
            sx={{
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: dialogType !== ''||!isValueSet(valueId)||isLoading? "transparent" : "rgba(0, 0, 0, 0.11)",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
            }}
          />

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
        </Grid>
        <Grid sx={{ width: 801, padding: 1 }}>
        <form ref={formRef}>
          <Grid container spacing={1.5}>
            <Grid item xs={2}>
              <TextField id="ch_id" disabled={true} fullWidth label="Код"  variant="outlined" value={valueId || ''} size="small" />
            </Grid>  
            <Grid item xs={8}>
              <TextField id="ch_title" disabled={valueId} inputRef={inputRef} fullWidth label="Обозначение" inputProps={{ maxLength: 3 }}  required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
            </Grid>
            <Grid item xs={2}>
              <TextField 
                id="ch_atomic_num" 
                fullWidth 
                label="Атомный номер" 
                required 
                size="small" 
                variant="outlined" 
                value={valueAtomicNum || ''} 
                inputProps={{ maxLength: 3 }} // ограничивает длину ввода до 3 символов
                onChange={e => {
                  // проверяем, что ввод - это число
                  const val = e.target.value;
                  if (!isNaN(val)) {
                    setValueAtomicNum(val);
                  }
                }}
              />              
{/*               <TextField id="ch_atomic_num" fullWidth label="Атомный номер" required size="small"  variant="outlined" value={valueAtomicNum || ''} onChange={e => setValueAtomicNum(e.target.value)}/> */}
            </Grid>
            <Grid item xs={6}>
              <TextField id="ch_name_rus" fullWidth size="small" label="Название (рус.яз)" required variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
            </Grid>            
            <Grid item xs={6}>
              <TextField id="ch_name_eng" fullWidth size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
            </Grid>            
           {/*  <Grid item xs={12}>
            Физико-химические формы элемента
            <DataGrid
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor: "rgba(0, 0, 0, 0.11)",
                },
                "& .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
              }}  
              style={{ height: '270px', width: '786px' }} // set height of the DataGrid   
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
            </Grid>            */} 
            <Grid item sx={{ width: 747, border: '0px solid black', ml: 0 }}> 

                Радиоизотопы элемента
                <DataGrid
                components={{Footer: CustomFooterNuclide }}

                              sx={{
                                border: '1px solid rgba(0, 0, 0, 0.23)',
                                borderRadius: '4px',
                                "& .MuiDataGrid-row.Mui-selected": {
                                  backgroundColor: "rgba(0, 0, 0, 0.11)",
                                },
                                "& .MuiDataGrid-cell:focus-within": {
                                  outline: "none !important",
                                },
                              }}  
                style={{ height: '376px', width: '746px' }} // set height of the DataGrid                 
                apiRef={apiRefNuclide}
                hideFooterSelectedRowCount={true}
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                rowHeight={25}
                pageSize={tableNuclide.length}
                paginationMode="server"
                hideFooterPagination
                rows={tableNuclide}
                loading={isLoading}
                columns={columnsNuclide}
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectionModelNuclide(newSelectionModel);
                }}        
                /* rowSelectionModel={rowSelectionModelNuclide} */
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

              <Collapse in={openAlertNuclide}>
                <Alert
                  item sx={{width: 746}}
                  severity={alertNuclideSeverity}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenAlertNuclide(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {alertNuclideText}
                </Alert>
              </Collapse>              
            </Grid>
            <Grid item sx={{width: 40, border: '0px solid green', ml: 1 }}> 
            <Box sx={{ border: '0px solid purple', display: 'flex', flexDirection: 'column', gap: 0.1, alignItems: 'center', justifyContent: 'center' }}>
              <br/>
            
              <IconButton onClick={()=>handleClickAddNuclide()}  disabled={false} color="primary" size="small" title="Добавить нуклид">
              <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton> 
              <IconButton onClick={()=>handleClickEditNuclide()} disabled={false} color="primary" size="small" title="Редактировать нуклид">
              <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton> 
              <IconButton onClick={()=>handleClickDelNuclide()} disabled={false} color="primary" size="small" title="Удалить нуклид">
              <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton> 
            </Box>  
            </Grid>
          
          </Grid>
        </form>
{/*           <Box sx={{ marginTop: '0.4rem' }}>
            Источники данных<br/>
              <DataTableDataSourceClass table_name={props.table_name} rec_id={valueId} />
          </Box> */}
        </Grid>
      </Grid>
      {(isLoading) && 
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop> 
      } 

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


      <Dialog open={openNuclide} onClose={handleCloseNuclideNo} fullWidth={false} maxWidth="800px">
      <DialogTitle>Нуклид</DialogTitle>  
        <DialogContent style={{height:'280px', width: '700px'}}>
{/*           <DialogContentText>
            Ввести нуклид
          </DialogContentText> */}
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
            <Button variant="outlined" onClick={handleCloseDelNuclideYes} >Да</Button>
            <Button variant="outlined" onClick={handleCloseDelNuclideNo} autoFocus>Нет</Button>
          </DialogActions>
      </Dialog>  
    </Box>
  )
  }

export { DataTableChelement }
