import React, { useState, useEffect, useCallback } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
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
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { ReactComponent as InfoLightIcon } from "./../icons/info.svg";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import { DataTableDataSourceClass } from './dt_data_source_class';
import Divider from '@mui/material/Divider';

const DataTableDoseRatio = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling

  // Поля БД
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState(false);

  const [valueRespRate, setValueRespRate] = React.useState();
  const [valueRespRateInitial, setValueRespRateInitial] = React.useState();
  const [valueRespYear, setValueRespYear] = React.useState();
  const [valueRespYearInitial, setValueRespYearInitial] = React.useState();
  const [valueIndoor, setValueIndoor] = React.useState();
  const [valueIndoorInitial, setValueIndoorInitial] = React.useState();
  const [valueExtCloud, setValueExtCloud] = React.useState();
  const [valueExtCloudInitial, setValueExtCloudInitial] = React.useState();
  const [valueExtGround, setValueExtGround] = React.useState();
  const [valueExtGroundInitial, setValueExtGroundInitial] = React.useState();

  const [tablePhysParam, settablePhysParam] = useState([]); 

  const [valuePhysParamID, setValuePhysParamId] = useState(); 
  const [valuePhysParamIDInitial, setValuePhysParamIdInitial] = useState(); 
  const [valuePhysParamCode, setValuePhysParamCode] = useState(); 
  const [valuePhysParamNameRus, setValuePhysParamNameRus] = useState(); 
  const [valuePhysParamDimension, setValuePhysParamDimension] = useState();
  const [valueDrType, setValueDrType] = useState('e'); 
  const [valueDrTypeInitial, setValueDrTypeInitial] = useState('e'); 
  const [valueUsed, setValueUsed] = useState(true);
  const [valueUsedInitial, setValueUsedInitial] = useState(true);
  const [valueParameters, setValueParameters] = useState();
  const [valueParametersInitial, setValueParametersInitial] = useState();

  const [isEmpty, setIsEmpty] = useState([false]);

  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [currentId, setCurrentId] = useState(null);  

  const [addedId, setAddedId] = useState(null);  
  const [addedIdFilt, setAddedIdFilt] = useState(null);  
  const valuesDrTypeList = [
    { label: 'e - внешнее облучение', value: 'e' },
    { label: 'i - внутреннее облучение', value: 'i' },
    { label: 'f - поглощение в ЖКТ', value: 'f' } ];

  useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueNameRus)&&(''===valueNameEng)&&(''===valueDescrEng)&&(''===valueDescrRus)   
      &&(''===valueRespRate)&&(''===valueRespYear)&&(''===valueIndoor)&&(''===valueExtCloud)&&(''===valueExtGround)
      &&(''===valuePhysParamID)&&(''===valueUsed)&&(''===valueParameters));

      //console.log('setIsEmpty', isEmpty);

    }, [ valueTitle, valueNameRus, valueNameEng, valueDescrEng, valueDescrRus, 
        valueRespRate, valueRespYear,  valueIndoor, valueExtCloud, valueExtGround,
        valuePhysParamID, valueUsed, valueParameters]); 
  function isValueSet(valueId) {
    return valueId !== null && valueId !== undefined && valueId !== '';
  }  
    

/*         useEffect(() => {

          console.log('currentId ', currentId, 'Editstarted ', editStarted);
        
          if (!currentId) {
            setEditStarted(false);
            return;
          }  
        
          const checkFields = (initialValue, value, fieldName) => {
            if (initialValue !== value) {
              console.log(`${fieldName} has changed.`, value, initialValue);
              return true;
            }
            return false;
          }
        
          const editStarted1 = checkFields(valueTitleInitial, valueTitle, 'valueTitle') ||
              checkFields(valueNameRusInitial, valueNameRus, 'valueNameRus') ||
              checkFields(valueNameEngInitial, valueNameEng, 'valueNameEng') ||
              checkFields(valueDescrEngInitial, valueDescrEng, 'valueDescrEng') ||
              checkFields(valueDescrRusInitial, valueDescrRus, 'valueDescrRus') ||
              checkFields(valueRespRateInitial, valueRespRate, 'valueRespRate') ||
              checkFields(valueRespYearInitial, valueRespYear, 'valueRespYear') ||
              checkFields(valueIndoorInitial, valueIndoor, 'valueIndoor') ||
              checkFields(valueExtCloudInitial, valueExtCloud, 'valueExtCloud') ||
              checkFields(valueExtGroundInitial, valueExtGround, 'valueExtGround') ||
              checkFields(valuePhysParamIDInitial, valuePhysParamID, 'valuePhysParamID') ||
              checkFields(valueUsedInitial, valueUsed, 'valueUsed') ||
              checkFields(valueParametersInitial, valueParameters, 'valueParameters') ||
              checkFields(valueDrTypeInitial, valueDrType, 'valueDrType');
        
          console.log('currentId ', currentId, 'setEditStarted ', editStarted1);
          setEditStarted(editStarted1);
        
        }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
          valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, 
          valueRespRateInitial, valueRespRate, valueRespYearInitial, valueRespYear, valueIndoorInitial, 
          valueIndoor, valueExtCloudInitial, valueExtCloud, valueExtGroundInitial, valueExtGround,
          valuePhysParamID, valuePhysParamIDInitial, valueUsed, valueUsedInitial, valueParameters, valueParametersInitial,
          valueDrType, valueDrTypeInitial
        ]); 
   */
        
        
/*     useEffect(() => {

    if (typeof currentId !== 'number') {
      setEditStarted(false);
      return;
    }  
        
    const editStarted1 =(valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng)||(valueDescrRusInitial!==valueDescrRus)   
      ||(valueRespRateInitial!==valueRespRate)||(valueRespYearInitial!==valueRespYear)||(valueIndoorInitial!==valueIndoor)
      ||(valueExtCloudInitial!==valueExtCloud)||(valueExtGroundInitial!==valueExtGround)||(valuePhysParamIDInitial!==valuePhysParamID)
      ||(valueUsedInitial!==valueUsed)||(valueParametersInitial!==valueParameters)||(valueDrTypeInitial!==valueDrType);

      setEditStarted(editStarted1);

    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, 
        valueRespRateInitial, valueRespRate, valueRespYearInitial, valueRespYear, valueIndoorInitial, 
        valueIndoor, valueExtCloudInitial, valueExtCloud, valueExtGroundInitial, valueExtGround,
        valuePhysParamID, valuePhysParamIDInitial, valueUsed, valueUsedInitial, valueParameters, valueParametersInitial,
        valueDrType, valueDrTypeInitial, currentId
      ]);  */

  useEffect(() => {
    if (typeof currentId !== 'number') {
      setEditStarted(false);
      return;
    }
  
    const fields = [
      ['valueTitleInitial', valueTitleInitial, 'valueTitle', valueTitle],
      ['valueNameRusInitial', valueNameRusInitial, 'valueNameRus', valueNameRus],
      ['valueNameEngInitial', valueNameEngInitial, 'valueNameEng', valueNameEng],
      ['valueDescrRusInitial', valueDescrRusInitial, 'valueDescrRus', valueDescrRus],
      ['valueDescrEngInitial', valueDescrEngInitial, 'valueDescrEng', valueDescrEng],
      ['valueRespRateInitial', valueRespRateInitial, 'valueRespRate', valueRespRate],
      ['valueRespYearInitial', valueRespYearInitial, 'valueRespYear', valueRespYear],
      ['valueIndoorInitial', valueIndoorInitial, 'valueIndoor', valueIndoor],
      ['valueExtCloudInitial', valueExtCloudInitial, 'valueExtCloud', valueExtCloud],
      ['valueExtGroundInitial', valueExtGroundInitial, 'valueExtGround', valueExtGround],
      ['valuePhysParamIDInitial', valuePhysParamIDInitial, 'valuePhysParamID', valuePhysParamID],
      ['valueUsedInitial', valueUsedInitial, 'valueUsed', valueUsed],
      ['valueParametersInitial', valueParametersInitial, 'valueParameters', valueParameters],
      ['valueDrTypeInitial', valueDrTypeInitial, 'valueDrType', valueDrType],
    ];
  
    let editStarted = false;
  
    for (let i = 0; i < fields.length; i++) {
      const [initialName, initialValue, currentName, currentValue] = fields[i];
      
      if (initialValue !== currentValue) {
        console.log(`Variable ${currentName} ${initialName} changed from ${initialValue} to ${currentValue}`);
        editStarted = true;
        break; // выход из цикла, если какое-то из полей изменилось
      }
    }
  
    setEditStarted(editStarted);
  
  }, [
    valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
    valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, valueRespRateInitial, 
    valueRespRate, valueRespYearInitial, valueRespYear, valueIndoorInitial, valueIndoor, 
    valueExtCloudInitial, valueExtCloud, valueExtGroundInitial, valueExtGround, valuePhysParamID, 
    valuePhysParamIDInitial, valueUsed, valueUsedInitial, valueParameters, valueParametersInitial, 
    valueDrType, valueDrTypeInitial, currentId
  ]);
    

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length) /* && tableData[0].id>-1 */) {
      if (typeof currentId !== 'number') 
      {
        console.log('Выбрано ', tableData[0].id);
        setCurrentId(tableData[0].id);
        setValueID(tableData[0].id);
        setRowSelectionModel([tableData[0].id]);
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
  useEffect(() => {
    setValuePhysParamCode(valuePhysParamID);
    let myLine = tablePhysParam.filter(item => ( Number(item.id) === Number(valuePhysParamID) ));
    if (myLine.length>0) 
    {
      setValuePhysParamNameRus( myLine[0].name_rus );
      setValuePhysParamDimension( myLine[0].physunit_title );   
    }
    else
    {
      setValuePhysParamNameRus( '' );
      setValuePhysParamDimension( '' );    
    }
  }, [valuePhysParamID, tablePhysParam]);

  const handleRowClick = (params) => {

    //console.log('handleRowClick', params.row.id, valueId);
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
      setValueID(params.row.id);
    }
  }; 

  const inputRef = React.useRef();

  const handleClearClick = (params) => {
    if (editStarted&&(!isEmpty))
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
      setValueRespRate(``);
      setValueRespYear(``);
      setValueIndoor(``);
      setValueExtCloud(``);
      setValueExtGround(``);
      setValuePhysParamId('');  
      if (props.table_name==='calcfunction') {  
        setValueUsed(true);
        setValueParameters(``);
      }
      setValueDrType(``);

    }
  }; 
  
  useEffect(() => {
    // Если valueId пуст (и поле "Обозначение" доступно), устанавливаем на него фокус
    if (!isValueSet(valueId)&&!isLoading&&currentId) {
      // Даем фокус TextField после обновления состояния
      inputRef.current && inputRef.current.focus(); 
    }
  }, [valueId, currentId, isLoading]);

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/physparam`)
      .then((data) => data.json())
      .then((data) => settablePhysParam(data)); 
  }, [])

const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    const data = {
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      resp_rate: valueRespRate,
      resp_year: valueRespYear,
      indoor: valueIndoor,
      ext_cloud: valueExtCloud,
      ext_ground: valueExtGround,
      physparam_id: valuePhysParamID,
      dr_type: valueDrType,
      used: valueUsed,
      parameters: valueParameters
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
        setAddedIdFilt(newId);
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
const [openDSInfo, setOpenDSInfo] = React.useState(false); 
const handleOpenDSInfo = () => {
  setOpenDSInfo(true);
};
const handleCloseDSInfo = () => {
  setOpenDSInfo(false);
};

const setValues = useCallback((row) => {
    setValueTitle(row.title);
    setValueTitleInitial(row.title);
    setValueNameRus(row.name_rus);
    setValueNameRusInitial(row.name_rus);
    setValueNameEng(row.name_eng);
    setValueNameEngInitial(row.name_eng);
    setValueDescrRus(row.descr_rus);
    setValueDescrRusInitial(row.descr_rus);
    setValueDescrEng(row.descr_eng);
    setValueDescrEngInitial(row.descr_eng);

    setValueRespRate(row.resp_rate);
    setValueRespRateInitial(row.resp_rate);
    setValueRespYear(row.resp_year);
    setValueRespYearInitial(row.resp_year);
    setValueIndoor(row.indoor);
    setValueIndoorInitial(row.indoor);
    setValueExtCloud(row.ext_cloud);
    setValueExtCloudInitial(row.ext_cloud);
    setValueExtGround(row.ext_ground);
    setValueExtGroundInitial(row.ext_ground);
    setValuePhysParamId(row.physparam_id);
    setValuePhysParamIdInitial(row.physparam_id); 

    setValueParameters(row.parameters);
    setValueParametersInitial(row.parameters);
    setValueDrType(row.dr_type);
    setValueDrTypeInitial(row.dr_type);
}, []);

useEffect(() => {
  let newId = valueId;
  if (addedIdFilt&&(newId!==addedIdFilt)) {
    newId=addedIdFilt;
  }
  if (!isValueSet(newId)) 
    return;
  const rowData = tableData.find(row => Number(row.id) === Number(newId));
  if (rowData) {
    setAddedIdFilt(null);
    // Проверяем, отображается ли новая запись с учетом текущего фильтра
    const sortedAndFilteredRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const isAddedRowVisible = sortedAndFilteredRowIds.includes(Number(newId));
    // Если новая запись не отображается из-за фильтрации, сбрасываем фильтр
    if (!isAddedRowVisible) {
      apiRef.current.setFilterModel({ items: [] });
    } 
    //Установка значений 
    setValues(rowData);
  }
}, [tableData, addedIdFilt, valueId, apiRef, setValues]);

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

  const handleClickView = () => {
    const xmlContent = valueParameters; // Переменная с содержимым файла XML
  
    const blob = new Blob([xmlContent], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'parameters.xml');
    link.style.visibility = 'hidden';
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    if (clickedRowId>=0) {
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
  const columns = [
    { field: 'id', headerName: 'Код', width: 70 },
    { field: 'title', headerName: 'Обозначение', width: 150, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 250 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'descr_rus', headerName: 'Полное название (рус.яз)', width: 180 },
    { field: 'descr_eng', headerName: 'Полное название (англ.яз)', width: 180 },
    { field: 'dr_type', headerName: 'Тип дозового коэффициента', width: 90 },
  ]

  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    console.log(rowSelectionModel);
    
    const selectedIDs = new Set(rowSelectionModel.map(Number));
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    if (selectedRowData.length)
    {
      setValueID(selectedRowData[0].id);
      setValueTitle(selectedRowData[0].title);
      setValueNameRus(selectedRowData[0].name_rus);
      setValueNameEng(selectedRowData[0].name_eng );
      setValueDescrRus(selectedRowData[0].descr_rus);
      setValueDescrEng(selectedRowData[0].descr_eng);
      setValueRespRate(selectedRowData[0].resp_rate );
      setValueRespYear(selectedRowData[0].resp_year );
      setValueIndoor(selectedRowData[0].indoor );
      setValueExtCloud(selectedRowData[0].ext_cloud );
      setValueExtGround(selectedRowData[0].ext_ground );

      setValueTitleInitial(selectedRowData[0].title);
      setValueNameRusInitial(selectedRowData[0].name_rus);
      setValueNameEngInitial(selectedRowData[0].name_eng );
      setValueDescrRusInitial(selectedRowData[0].descr_rus);
      setValueDescrEngInitial(selectedRowData[0].descr_eng);
      setValueRespRateInitial(selectedRowData[0].resp_rate);
      setValueRespYearInitial(selectedRowData[0].resp_year );
      setValueIndoorInitial(selectedRowData[0].indoor );
      setValueExtCloudInitial(selectedRowData[0].ext_cloud );
      setValueExtGroundInitial(selectedRowData[0].ext_ground );
      setValuePhysParamId(selectedRowData[0].physparam_id );
      setValuePhysParamIdInitial(selectedRowData[0].physparam_id );
      if (props.table_name==='calcfunction') {  
        setValueUsed(selectedRowData[0].used); 
        setValueUsedInitial(selectedRowData[0].used); 
        setValueParameters(selectedRowData[0].parameters);      
        setValueParametersInitial(selectedRowData[0].parameters); 
      }
      setValueDrType(selectedRowData[0].dr_type);      
      setValueDrTypeInitial(selectedRowData[0].dr_type);           
    }
  }

  // Scrolling and positionning
  const { /* paginationModel, */ setPaginationModel, scrollToIndexRef } = useGridScrollPagination(apiRef, tableData, setRowSelectionModel);

  useEffect(() => {
    if (addedId !== null){  
        scrollToIndexRef.current = addedId;
        setAddedId(null);
        setEditStarted(false);
        setRowSelectionModel([addedId]);
    }
  }, [addedId, scrollToIndexRef]);

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

  const valuesYesNo = [
    { title: 'Нет', id: 'false' },
    { title: 'Да', id: 'true' } ];

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


  const formRef = React.useRef();


  return (
    <Box sx={{ border: '0px solid purple', width: 1445, height: 650, padding: 1 }}>
      <Grid container spacing={1}>
        <Grid item sx={{width: 583, border: '0px solid green', ml: 1 }}>
          <DataGrid
            components={{ Footer: CustomFooter, Toolbar: GridToolbar }}
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
            <TextField id="ch_id" 
              disabled={true} 
              fullWidth 
              label="Код"  
              variant="outlined" 
              value={isValueSet(valueId) ? valueId : ''} 
              size="small" />
          </Grid>            
          <Grid item xs={10}>
              <TextField id="ch_name" inputRef={inputRef} disabled={isValueSet(valueId)} fullWidth label="Обозначение" required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
          </Grid>            
          <Grid item xs={6}>
            <TextField  id="ch_name_rus" fullWidth size="small" label="Название (рус.яз)" required variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
          </Grid> 
          <Grid item xs={6}>
            <TextField  id="ch_name_eng" fullWidth size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
          </Grid>

          <Grid item xs={12}>
            <TextField  id="ch_descr_rus" fullWidth label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} onChange={e => setValueDescrRus(e.target.value)}/>
          </Grid> 
          <Grid item xs={12}>
            <TextField  id="ch_descr_eng" fullWidth label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} onChange={e => setValueDescrEng(e.target.value)}/>
          </Grid>
          {(props.table_name==='dose_ratio') && 
          <Grid item xs={12}>
            <FormControl sx={{ width: '40ch' }} size="small">
              <InputLabel required id="demo-controlled-open-select-label">Тип дозового коэффициента</InputLabel>
              <Select
                labelId="dose-coeff-select"
                id="dose-coeff-select"
                required
                value={valueDrType}
                label="Тип дозового коэффициента"
              // defaultValue="e"
                onChange={e => setValueDrType(e.target.value)}
              >
              {valuesDrTypeList?.map(option => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label ?? option.value}
                    </MenuItem>
                  );
              })}
              </Select>
            </FormControl>  
          </Grid>}

          { (props.table_name==='calcfunction') && 
          <>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1  }}>
              <TextField id="ch_parameters" sx={{ width: '100ch' }} label="Параметры функции"  size="small" multiline rows={4} variant="outlined" value={valueParameters || ''} onChange={e => setValueParameters(e.target.value)} disabled/>
              <label htmlFor="icon-button-file1">
                <IconButton onClick={()=>{handleClickView()}} color="primary" size="small" title="Сохранить в формате XML">
                  <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
              </label>
            </Box>
          </Grid>                     
          <Grid item xs={12}>
            <FormControl sx={{ width: '40ch' }} size="small">
            <InputLabel id="type"  >Используется расчетным модулем</InputLabel>
              <Select labelId="type" id="type1"  label="Используется расчетным модулем"  defaultValue={true}  value={valueUsed} onChange={e => setValueUsed(e.target.value)}>
                {valuesYesNo?.map(option => {
                    return (
                      <MenuItem key={option.id} value={option.id}>
                        {option.title ?? option.id}
                      </MenuItem>
                    );
                    })}
              </Select>
            </FormControl>    
          </Grid></>}                     
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1  }}>

            <Autocomplete
              fullWidth
              sx={{ width: '60ch' }}
              size="small"
              disablePortal
              id="combo-box-child-isotope"
              value={tablePhysParam.find((option) => option.id === valuePhysParamID) || ''}
              disableClearable
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, newValueAC) => { setValuePhysParamId(newValueAC ? newValueAC.id : -1) }}
              options={tablePhysParam}
              getOptionLabel={option => option ? option.title : ""}
              renderInput={(params) => <TextField {...params} label="Физический параметр (из общего списка)" required />}
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
            />
            <IconButton onClick={()=>handleOpenDSInfo()} color="primary" size="small" title="Физический параметр">
              <SvgIcon fontSize="small" component={InfoLightIcon} inheritViewBox /></IconButton>
            </Box>              
          </Grid>                     
        </Grid>
        </form>
          <Box sx={{ marginTop: '0.4rem' }}>
            Источники данных<br/>
              <DataTableDataSourceClass table_name={props.table_name} rec_id={valueId} />
          </Box>
        </Grid>
      </Grid>
      {(isLoading) && 
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop> 
      } 
    <Dialog open={openDSInfo} onClose={handleCloseDSInfo} fullWidth={true}>
      <DialogTitle>
        Физический параметр <b>{(tablePhysParam.find((option) => option.id === valuePhysParamID)||'').title }</b> 
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              Код: <b>{valuePhysParamCode}</b><p></p>
              Название (рус.яз): <b>{valuePhysParamNameRus}</b><p></p>
              Eд.измерения (базовая): <b>{valuePhysParamDimension}</b><p></p> 
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseDSInfo} autoFocus>Закрыть</Button>
      </DialogActions>
    </Dialog>

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
    </Box>
  )
  }

export { DataTableDoseRatio }