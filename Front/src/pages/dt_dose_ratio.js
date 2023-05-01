import React, { useState, useEffect } from 'react'
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
import { DataTableDataSourceClass } from './dt_data_source_class';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { ReactComponent as FileImportLightIcon } from "./../icons/file-import.svg";
import { ReactComponent as EraserLightIcon } from "./../icons/eraser.svg";
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { table_names } from './sda_types';
import Autocomplete from '@mui/material/Autocomplete';
import { ReactComponent as InfoLightIcon } from "./../icons/info.svg";

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTableDoseRatio = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling

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
  const [editStarted, setEditStarted] = useState([false]);

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
  const [valueUsedInitial, setValueUsedInitial] = useState();
  const [valueParameters, setValueParameters] = useState();
  const [valueParametersInitial, setValueParametersInitial] = useState();
  const [valueParametersDialog, setValueParametersDialog] = useState();
  
  const [isEmpty, setIsEmpty] = useState([false]);

  const valuesDrTypeList = [
    { label: 'внешнего облучения', value: 'e' },
    { label: 'внутреннего облучения', value: 'i' },
    { label: 'поглощения в ЖКТ', value: 'f' } ];

/*     const valuesDrTypeList = [
      { label: 'e', value: 'e' },
      { label: 'i', value: 'i' },
      { label: 'f', value: 'f' } ]; */
  

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


  useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueNameRus)&&(''===valueNameEng)&&(''===valueDescrEng)&&(''===valueDescrRus)   
      &&(''===valueRespRate)&&(''===valueRespYear)&&(''===valueIndoor)&&(''===valueExtCloud)&&(''===valueExtGround)
      &&(''===valuePhysParamID)&&(''===valueUsed)&&(''===valueParameters)&&(''===valueParametersDialog));

      console.log('setIsEmpty');

    }, [ valueTitle, valueNameRus, valueNameEng, valueDescrEng, valueDescrRus, 
        valueRespRate, valueRespYear,  valueIndoor, valueExtCloud, valueExtGround,
        valuePhysParamID, valueUsed, valueParameters, valueParametersDialog]); 
      
  useEffect(() => {
    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng)||(valueDescrRusInitial!==valueDescrRus)   
      ||(valueRespRateInitial!==valueRespRate)||(valueRespYearInitial!==valueRespYear)||(valueIndoorInitial!==valueIndoor)
      ||(valueExtCloudInitial!==valueExtCloud)||(valueExtGroundInitial!==valueExtGround)||(valuePhysParamIDInitial!==valuePhysParamID)
      ||(valueUsedInitial!==valueUsed)||(valueParametersInitial!==valueParameters)||(valueDrTypeInitial!==valueDrType)
      );
      console.log('compare valueDrType, valueDrTypeInitial');
      console.log(valueDrType); console.log(valueDrTypeInitial);

    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, 
        valueRespRateInitial, valueRespRate, valueRespYearInitial, valueRespYear, valueIndoorInitial, 
        valueIndoor, valueExtCloudInitial, valueExtCloud, valueExtGroundInitial, valueExtGround,
        valuePhysParamID, valuePhysParamIDInitial, valueUsed, valueUsedInitial, valueParameters, valueParametersInitial,
        valueDrType, valueDrTypeInitial
      ]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        //console.log('isLoading, tableData ON lastId  '+lastId);  
        lastId = tableData[0].id;
        setRowSelectionModel([tableData[0].id]);
        setValueID(tableData[0].id);

        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueDescrRus(tableData[0].descr_rus);
        setValueDescrEng(tableData[0].descr_eng);

        setValueRespRate(tableData[0].resp_rate);
        setValueRespYear(tableData[0].resp_year);
        setValueIndoor(tableData[0].indoor);
        setValueExtCloud(tableData[0].extcloud);
        setValueExtGround(tableData[0].extground);

        setValueTitleInitial(tableData[0].title);       
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueDescrRusInitial(tableData[0].descr_rus);
        setValueDescrEngInitial(tableData[0].descr_eng);

        setValueRespRateInitial(tableData[0].resp_rate);
        setValueRespYearInitial(tableData[0].resp_year);
        setValueIndoorInitial(tableData[0].indoor);
        setValueExtCloudInitial(tableData[0].extcloud);
        setValueExtGroundInitial(tableData[0].extground);

        setValuePhysParamId(tableData[0].physparam_id);
        setValuePhysParamIdInitial(tableData[0].physparam_id);
        setValueUsed(tableData[0].used);
        setValueUsedInitial(tableData[0].used);
        setValueParameters(tableData[0].parameters);
        setValueParametersInitial(tableData[0].parameters);

        setValueDrType(tableData[0].dr_type);
        setValueDrTypeInitial(tableData[0].dr_type);
        console.log('init tableData[0].dr_type');
        console.log(tableData[0].dr_type);
      }
    }
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {
    setOpenAlert(false);
    console.log( 'isEmpty = '+isEmpty);
    if (editStarted&&(!isEmpty))
    {
      handleClickSave(params);
    } 
    else 
    {
      setValueID(params.row.id);
      setValueTitle(params.row.title);
      setValueNameRus(params.row.name_rus);
      setValueNameEng(params.row.name_eng);
      setValueDescrRus(params.row.descr_rus);
      setValueDescrEng(params.row.descr_eng);

      setValueRespRate(params.row.resp_rate );
      setValueRespYear(params.row.resp_year );
      setValueIndoor(params.row.indoor );
      setValueExtCloud(params.row.ext_cloud );
      setValueExtGround(params.row.ext_ground );
      setValueTitleInitial(params.row.title);
      setValueNameRusInitial(params.row.name_rus);
      setValueNameEngInitial(params.row.name_eng);
      setValueDescrRusInitial(params.row.descr_rus);
      setValueDescrEngInitial(params.row.descr_eng);

      setValueRespRateInitial(params.row.resp_rate );
      setValueRespYearInitial(params.row.resp_year );
      setValueIndoorInitial(params.row.indoor );
      setValueExtCloudInitial(params.row.ext_cloud );
      setValueExtGroundInitial(params.row.ext_ground );
      setValuePhysParamId(params.row.physparam_id);
      setValuePhysParamIdInitial(params.row.physparam_id);

      setValueUsed(params.row.used);
      setValueUsedInitial(params.row.used);
      setValueParameters(params.row.parameters);
      setValueParametersInitial(params.row.parameters);

      setValueDrType(params.row.dr_type);
      setValueDrTypeInitial(params.row.dr_type);      
      console.log('params.row.dr_type');
      console.log(params.row.dr_type);
    }
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
      setValueDescrRus(``);
      setValueDescrEng(``);
      setValueRespRate(``);
      setValueRespYear(``);
      setValueIndoor(``);
      setValueExtCloud(``);
      setValueExtGround(``);
      setValuePhysParamId('');  
      setValueUsed(true);
      setValueParameters(``);
      setValueDrType(``);  
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => { lastId = 0;} ); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/physparam`)
      .then((data) => data.json())
      .then((data) => settablePhysParam(data))
      .then((data) => { /* console.log('fetch PhysParam ok'); console.log(data);  */ lastId = 0;} ); 
  }, [])
 
  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {

    if (formRef.current.reportValidity() )
    {

    const js = JSON.stringify({
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
       setValueDescrRusInitial(valueDescrRus);
       setValueDescrEngInitial(valueDescrEng);  
       setValueRespRateInitial(valueRespRate);
       setValueRespYearInitial(valueRespYear);
       setValueIndoorInitial(valueIndoor);
       setValueExtCloudInitial(valueExtCloud);
       setValueExtGroundInitial(valueExtGround);
       setValuePhysParamIdInitial(valuePhysParamID);            
       setValueUsedInitial(valueUsed);           
       setValueParametersInitial(valueParameters);
       setValueDrTypeInitial(valueDrType);
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
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      resp_rate: valueRespRate,
      resp_year: valueRespYear,
      indoor: valueIndoor,
      ext_cloud: valueExtCloud,
      ext_ground: valueExtGround,
      physparam_id: valuePhysParamID||0,
      used: valueUsed,       
      parameters: valueParameters,
      dr_type: valueDrType,
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
      console.log('addRec setScrollToIndex lastId = ' + lastId);
      scrollToIndexRef.current = lastId;  
      //Refresh initial state
      setValueTitle(valueTitle);
      setValueNameRus(valueNameRus);
      setValueNameEng(valueNameEng);
      setValueDescrRus(valueDescrRus);
      setValueDescrEng(valueDescrEng); 
      setValueRespRate(valueRespRate);
      setValueRespYear(valueRespYear);
      setValueIndoor(valueIndoor);
      setValueExtCloud(valueExtCloud);          
      setValueExtGround(valueExtGround);
      setValuePhysParamId(valuePhysParamID);
      setValueUsed(valueUsed); 
      setValueParameters(valueParameters);
      setValueDrType(valueDrType);

      setValueTitleInitial(valueTitle);
      setValueNameRusInitial(valueNameRus);
      setValueNameEngInitial(valueNameEng);
      setValueDescrRusInitial(valueDescrRus);
      setValueDescrEngInitial(valueDescrEng); 
      setValueRespRateInitial(valueRespRate);
      setValueRespYearInitial(valueRespYear);
      setValueIndoorInitial(valueIndoor);
      setValueExtCloudInitial(valueExtCloud);          
      setValueExtGroundInitial(valueExtGround);
      setValuePhysParamIdInitial(valuePhysParamID);
      setValueUsedInitial(valueUsed); 
      setValueParametersInitial(valueParameters);
      setValueDrTypeInitial(valueDrType);
    }
  };

//  const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false); 
const [openDSInfo, setOpenDSInfo] = React.useState(false); 
const handleOpenDSInfo = () => {
  setOpenDSInfo(true);
};

const handleCloseDSInfo = () => {
  setOpenDSInfo(false);
};

//const [noRecords, setNoRecords] = useState(true);


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
        setValueDescrRus(tableData[0].descr_rus);
        setValueDescrEng(tableData[0].descr_eng);

        setValueRespRate(tableData[0].resp_rate);
        setValueRespYear(tableData[0].resp_year);
        setValueIndoor(tableData[0].indoor);
        setValueExtCloud(tableData[0].ext_cloud);
        setValueExtGround(tableData[0].ext_ground);

        setValueTitleInitial(tableData[0].title);
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueDescrRusInitial(tableData[0].descr_rus);
        setValueDescrEngInitial(tableData[0].descr_eng);

        setValueRespRateInitial(tableData[0].resp_rate);
        setValueRespYearInitial(tableData[0].resp_year);
        setValueIndoorInitial(tableData[0].indoor);
        setValueExtCloudInitial(tableData[0].ext_cloud);
        setValueExtGroundInitial(tableData[0].ext_ground);
        setValuePhysParamId(tableData[0].physparam_id);
        setValuePhysParamIdInitial(tableData[0].physparam_id); 
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
  const [openEdit, setOpenEdit] = React.useState(false);
    
  const handleClickEdit = () => {
    setValueParametersDialog(valueParameters);
    setOpenEdit(true);
  };

  const handleClickEditYes = () => {
    setValueParameters(valueParametersDialog);
    setOpenEdit(false);
  };

  const handleClickEditNo = () => {
    setOpenEdit(false);
  };

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
    setValueDescrRus(``);
    setValueDescrEng(``);

    setValueRespRate(``);
    setValueRespYear(``);
    setValueIndoor(``);
    setValueExtCloud(``);
    setValueExtGround(``);   
    setValuePhysParamId(``);
  };

  const handleCloseSaveWhenNewYes = () => {
    setOpenSaveWhenNew(false);
    saveRec(true);
    setValueID(``);
    setValueTitle(``);
    setValueNameRus(``);
    setValueNameEng(``);
    setValueDescrRus(``);
    setValueDescrEng(`` );
    setValueRespRate(``);
    setValueRespYear(``);
    setValueIndoor(``);
    setValueExtCloud(``);
    setValueExtGround(`` );
    setValuePhysParamId(``);
  };

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 250 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'descr_rus', headerName: 'Полное название (рус.яз)', width: 180 },
    { field: 'descr_eng', headerName: 'Полное название (англ.яз)', width: 180 },
    { field: 'dr_type', headerName: 'Тип дозового коэффициента', width: 180 },
  ]

  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    console.log(rowSelectionModel);    
    const selectedIDs = new Set(rowSelectionModel);
    console.log(selectedIDs);
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
      //console.log('handleCancelClick Refresh initial '+selectedRowData[0].title+' '+selectedRowData[0].name_rus);
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
      setValueUsed(selectedRowData[0].used); 
      setValueUsedInitial(selectedRowData[0].used); 
      setValueParameters(selectedRowData[0].parameters);      
      setValueParametersInitial(selectedRowData[0].parameters); 

      setValueDrType(selectedRowData[0].dr_type);      
      setValueDrTypeInitial(selectedRowData[0].dr_type);           
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
    const apiRef = useGridApiRef(); // init DataGrid API for scrolling
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

  const valuesYesNo = [
    { title: 'Нет', id: 'false' },
    { title: 'Да', id: 'true' } ];

  function handleFileChange(event) {
    //console.log( 'handleFileChange файл '+event.target.files[0] );
//    setFile(event.target.files[0]);
    var reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = e => {
      //console.log(e.target.result);
      setValueParameters("" + e.target.result);
      event.target.value = '';
      //$("#icon-button-file").val('');
    };
  }
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
              descr_rus: false,
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
      <TextField  id="ch_id"  disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={valueId || ''} size="small" onChange={e => setValueID(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
      <p></p>
      <TextField  id="ch_name_rus" sx={{ width: '49ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '49ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
      <p></p>
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} onChange={e => setValueDescrRus(e.target.value)}/>
      <p></p> 
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} onChange={e => setValueDescrEng(e.target.value)}/>
      <p></p>

      {(props.table_name==='dose_ratio') && 
      <>
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
      <p></p></>
      }

          

      <div>
      {(() => {
        if (props.table_name==='calcfunction') {
          return (
            <div>
{/*             <Button variant="contained" component="label">Загрузить из файла
              <input hidden accept="text/xml" type="file" onChange={handleFileChange}/>
            </Button><p></p> */}
{/*             <Button variant="contained" onClick={() => {setValueParameters(""); }}>Очистить</Button>   */}     

            <table border = "0" cellSpacing={0} cellPadding={0} style={{ height: 110, width: 886, verticalAlign: 'top' }}><tbody><tr>
            <td style={{ height: 110, width: 787, verticalAlign: 'top' }}>
            <TextField  id="ch_parameters" sx={{ width: '100ch' }} label="Параметры функции"  size="small" multiline rows={4} variant="outlined" value={valueParameters || ''} onChange={e => setValueParameters(e.target.value)}/>
            </td>
            <td style={{ height: 110, width: 100, verticalAlign: 'top' }}>

            &nbsp;<input accept="text/xml" id="icon-button-file" type="file" style={{ display: 'none' }} onChange={handleFileChange}/>
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload xml file" component="span" size="small" title="Поиск и загрузка файла *.xml">
                <SvgIcon fontSize="small" component={FileImportLightIcon} inheritViewBox/>
              </IconButton>
            </label>
            <br/>
            &nbsp;<label htmlFor="icon-button-file1">
            <IconButton onClick={()=>{setValueParameters("")}} color="primary" size="small" title="Очистить">
              <SvgIcon fontSize="small" component={EraserLightIcon} inheritViewBox /></IconButton>
            </label>
            <br/>
            &nbsp;<label htmlFor="icon-button-file1">
            <IconButton onClick={()=>{handleClickEdit()}} color="primary" size="small" title="Редактировать">
              <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton>
            </label></td></tr>
            </tbody></table>
            <p></p>
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
            <p></p> 
            </div>
          )
        } 
      })()}
      </div>

      <table border = "0" cellSpacing={0} cellPadding={0}><tbody>
      <tr>
      <td>
      <Autocomplete
        //sx={{ width: '50ch' }}
        fullWidth
        sx={{ width: '60ch' }} size="small"
        disablePortal
        id="combo-box-child-isotope"
        value={tablePhysParam.find((option) => option.id === valuePhysParamID)||'' }
        disableClearable
        isOptionEqualToValue={(option, value) => option.id === value.id }  
        onChange={(event, newValueAC) => { /*  console.log(newValueAC?newValueAC.id:-1);  */ setValuePhysParamId(newValueAC?newValueAC.id:-1) } }
        options={tablePhysParam}
        getOptionLabel={option => option?option.title:""} 
        renderInput={(params) => <TextField {...params} label="Физический параметр (из общего списка)" required />}
        
        />
        </td><td>
        &nbsp;<IconButton onClick={()=>handleOpenDSInfo()} color="primary" size="small" title="Физический параметр">
        <SvgIcon fontSize="small" component={InfoLightIcon} inheritViewBox /></IconButton>
        </td>
        </tr>
        </tbody>
        </table>  
      

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

      <p></p>

   

        

{/*         <FormControl sx={{ width: '60ch' }} size="small">
        <InputLabel id="fiz">Физический параметр (из общего списка)</InputLabel>
          <Select labelId="fiz" id="fiz1" label="Физический параметр (из общего списка)" defaultValue="" value={valuePhysParamID||"0"} onChange={e => setValuePhysParamId(e.target.value)}>
          {tablePhysParam?.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title ?? option.id}
                  </MenuItem>
                );
                })}
          </Select>
          </FormControl>   
          <p></p> */}
         {/*  &nbsp;&nbsp;&nbsp;&nbsp;<TextField sx={{width: '98ch', input: {background: '#EEEEEE'}}} id="physparam_code" label="Код"  size="small" variant="outlined" value={valuePhysParamCode || ''} />
          <p></p>
          &nbsp;&nbsp;&nbsp;&nbsp;<TextField sx={{width: '98ch', input: {background: '#EEEEEE'}}} id="physparam_name_rus" label="Название (рус.яз)"  size="small" variant="outlined" value={valuePhysParamNameRus || ''} />
          <p></p>
          &nbsp;&nbsp;&nbsp;&nbsp;<TextField sx={{width: '98ch', input: {background: '#EEEEEE'}}} id="dimension" label="Eд.измерения (базовая)"  size="small" variant="outlined" value={valuePhysParamDimension || ''} />
          <p></p>
 */}
      <div style={{ height: 300, width: 800 }}>
      <td>Источники данных<br/>
        <DataTableDataSourceClass table_name={props.table_name} rec_id={valueId} />
        </td>
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

  <Dialog open={openEdit} onClose={handleClickEditNo} maxWidth="700">
      <DialogTitle>
          Параметры функции
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
             <TextField  id="ch_parameters1" sx={{ width: '100ch' }}size="small" multiline rows={20} variant="outlined" value={valueParametersDialog || ''} onChange={e => setValueParametersDialog(e.target.value)}/>
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleClickEditNo} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleClickEditYes} >Да</Button>
      </DialogActions>
  </Dialog>  
 
  <Dialog open={openSave} onClose={handleCloseSaveNo} fullWidth={true}>
    <DialogTitle>
        Внимание
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
            В запись таблицы {table_names[props.table_name]}{/*  с кодом <b>{valueId}</b> */} внесены изменения.
{/*             {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p></p>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p></p>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p></p>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p></p>
            {valueRespRate === valueRespRateInitial ? '' : 'Скорость дыхания, куб.м/сек: '+valueRespRate+'; ' }<p></p>
            {valueRespYear === valueRespYearInitial ? '' : 'Годовой объем вдыхаемого воздуха, куб.м: '+valueRespYear+'; ' }<p></p>
            {valueIndoor === valueIndoorInitial ? '' : 'Доля времени, проводимая индивидуумом в помещении: '+valueIndoor+'; ' }<p></p>
            {valueExtCloud === valueExtCloudInitial ? '' : 'Коэффициент для дозы внешнего облучения от облака: '+valueExtCloud+'; ' }<p></p>
            {valueExtGround === valueExtGroundInitial ? '' : 'Коэффициент для дозы внешнего облучения от поверхности: '+valueExtGround+'; ' }<p></p>
            {valuePhysParamID === valuePhysParamIDInitial ? '' : 'Физический параметр (из общего списка): '+valuePhysParamID+'; ' }<p></p>
            {valueUsed === valueUsedInitial ? '' : 'Используется расчетным модулем '+valueUsed+'; ' }<p></p>
            {valueParameters === valueParametersInitial ? '' : 'Параметры функции'+valueParameters+'; ' }<p></p> */}
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
            В запись таблицы {table_names[props.table_name]} {/* с кодом <b>{valueId}</b> */} внесены изменения.
{/*             {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p></p>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p></p>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p></p>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p></p>
            {valueRespRate === valueRespRateInitial ? '' : 'Скорость дыхания, куб.м/сек: '+valueRespRate+'; ' }<p></p>
            {valueRespYear === valueRespYearInitial ? '' : 'Годовой объем вдыхаемого воздуха, куб.м: '+valueRespYear+'; ' }<p></p>
            {valueIndoor === valueIndoorInitial ? '' : 'Доля времени, проводимая индивидуумом в помещении: '+valueIndoor+'; ' }<p></p>
            {valueExtCloud === valueExtCloudInitial ? '' : 'Коэффициент для дозы внешнего облучения от облака: '+valueExtCloud+'; ' }<p></p>
            {valueExtGround === valueExtGroundInitial ? '' : 'Коэффициент для дозы внешнего облучения от поверхности: '+valueExtGround+'; ' }<p></p>
            {valuePhysParamID === valuePhysParamIDInitial ? '' : 'Физический параметр (из общего списка): '+valuePhysParamID+'; ' }<p></p>
            {valueUsed === valueUsedInitial ? '' : 'Используется расчетным модулем '+valueUsed+'; ' }<p></p>
            {valueParameters === valueParametersInitial ? '' : 'Параметры функции'+valueParameters+'; ' }<p></p> */}
            <br/>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewYes} >Да</Button>
    </DialogActions>
  </Dialog>
  </form>
 </div>     
  )
}

export { DataTableDoseRatio, lastId }
