import React, { useState, useEffect } from 'react'
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
//import { type } from '@testing-library/user-event/dist/type';
//import { PropaneSharp } from '@mui/icons-material';
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as FileImportLightIcon } from "./../icons/file-import.svg";
import { ReactComponent as InfoLightIcon } from "./../icons/info.svg";
import { ReactComponent as EraserLightIcon } from "./../icons/eraser.svg";
import PhotoCamera from '@material-ui/icons/PhotoCamera';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTableDoseRatio = (props) => {
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
  const [selectionModel, setSelectionModel] = React.useState([]);
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
  const [valuePhysParamID, setValuePhysParamId] = useState([]); 
  const [valuePhysParamIDInitial, setValuePhysParamIdInitial] = useState([]); 
  const [valuePhysParamCode, setValuePhysParamCode] = useState([]); 
  const [valuePhysParamNameRus, setValuePhysParamNameRus] = useState([]); 
  const [valuePhysParamDimension, setValuePhysParamDimension] = useState([]);

  const [valueUsed, setValueUsed] = useState([]);
  const [valueUsedInitial, setValueUsedInitial] = useState([]);
  const [valueParameters, setValueParameters] = useState([]);
  const [valueParametersInitial, setValueParametersInitial] = useState([]);

  useEffect(() => {

    setValuePhysParamCode(valuePhysParamID);
    //console.log('выводим тайтл');
    let myLine = tablePhysParam.filter(item => item.id == valuePhysParamID);
    //console.log( myLine );
    if (myLine.length>0) 
    {
      //console.log( 'title='+myLine[0].title );
      //console.log( 'name_rus='+myLine[0].name_rus );    
      setValuePhysParamNameRus( myLine[0].name_rus );  
    }
  }, [valuePhysParamID, tablePhysParam]);

  useEffect(() => {

    setValuePhysParamCode(valuePhysParamID);
    //console.log('выводим тайтл');
    let myLine = tablePhysParam.filter(item => item.id == valuePhysParamID);
    //console.log( myLine );
    if (myLine.length>0) 
    {
      //console.log( 'title='+myLine[0].title );
      //console.log( 'name_rus='+myLine[0].name_rus );    
      setValuePhysParamDimension( myLine[0].physunit_title );  
    }
  }, [valuePhysParamID]);

  useEffect(() => {
    //console.log([valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
    //  valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus]); 
    console.log('valueRespRateInitial'+valueRespRateInitial);
    console.log('valueRespRate'+valueRespRate);

    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng)||(valueDescrRusInitial!==valueDescrRus)   
      ||(valueRespRateInitial!==valueRespRate)||(valueRespYearInitial!==valueRespYear)||(valueIndoorInitial!==valueIndoor)
      ||(valueExtCloudInitial!==valueExtCloud)||(valueExtGroundInitial!==valueExtGround)||(valuePhysParamIDInitial!==valuePhysParamID)
      ||(valueUsedInitial!==valueUsed)||(valueParametersInitial!==valueParameters)
      );
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, 
        valueRespRateInitial, valueRespRate, valueRespYearInitial, valueRespYear, valueIndoorInitial, 
        valueIndoor, valueExtCloudInitial, valueExtCloud, valueExtGroundInitial, valueExtGround,
        valuePhysParamID, valuePhysParamIDInitial, valueUsed, valueUsedInitial, valueParameters, valueParametersInitial]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        //console.log('isLoading, tableData ON lastId '+lastId);  
        lastId = tableData[0].id;
        setSelectionModel(tableData[0].id);
        setValueID(`${tableData[0].id}`);
        setValueTitle(`${tableData[0].title}`);
        setValueNameRus(`${tableData[0].name_rus}`);
        setValueNameEng(`${tableData[0].name_eng}`);
        setValueDescrRus(`${tableData[0].descr_rus}`);
        setValueDescrEng(`${tableData[0].descr_eng}`);

        setValueRespRate(`${tableData[0].resp_rate}`);
        setValueRespYear(`${tableData[0].resp_year}`);
        setValueIndoor(`${tableData[0].indoor}`);
        setValueExtCloud(`${tableData[0].extcloud}`);
        setValueExtGround(`${tableData[0].extground}`);
        //console.log('useEffect Refresh initial '+tableData[0].title+' '+tableData[0].name_rus);
        setValueTitleInitial(`${tableData[0].title}`);       
        setValueNameRusInitial(`${tableData[0].name_rus}`);
        setValueNameEngInitial(`${tableData[0].name_eng}`);
        setValueDescrRusInitial(`${tableData[0].descr_rus}`);
        setValueDescrEngInitial(`${tableData[0].descr_eng}`);

        setValueRespRateInitial(`${tableData[0].resp_rate}`);
        setValueRespYearInitial(`${tableData[0].resp_year}`);
        setValueIndoorInitial(`${tableData[0].indoor}`);
        setValueExtCloudInitial(`${tableData[0].extcloud}`);
        setValueExtGroundInitial(`${tableData[0].extground}`);

        setValuePhysParamId(`${tableData[0].physparam_id}`);
        setValuePhysParamIdInitial(`${tableData[0].physparam_id}`);
        setValueUsed(`${tableData[0].used}`);
        setValueUsedInitial(`${tableData[0].used}`);
        setValueParameters(`${tableData[0].parameters}`);
        setValueParametersInitial(`${tableData[0].parameters}`);
      }
    }
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {
    //console.log('handleRowClick');
    if (editStarted)
    {
      handleClickSave(params);
    } 
    else 
    {
      setValueID(`${params.row.id}`);
      setValueTitle(`${params.row.title}`);
      setValueNameRus(`${params.row.name_rus}`);
      setValueNameEng(`${params.row.name_eng}`);
      setValueDescrRus(`${params.row.descr_rus}`);
      setValueDescrEng(`${params.row.descr_eng}` );

      setValueRespRate(`${params.row.resp_rate}` );
      setValueRespYear(`${params.row.resp_year}` );
      setValueIndoor(`${params.row.indoor}` );
      setValueExtCloud(`${params.row.ext_cloud}` );
      setValueExtGround(`${params.row.ext_ground}` );
      setValueTitleInitial(`${params.row.title}`);
      setValueNameRusInitial(`${params.row.name_rus}`);
      setValueNameEngInitial(`${params.row.name_eng}`);
      setValueDescrRusInitial(`${params.row.descr_rus}`);
      setValueDescrEngInitial(`${params.row.descr_eng}` );

      setValueRespRateInitial(`${params.row.resp_rate}` );
      setValueRespYearInitial(`${params.row.resp_year}` );
      setValueIndoorInitial(`${params.row.indoor}` );
      setValueExtCloudInitial(`${params.row.ext_cloud}` );
      setValueExtGroundInitial(`${params.row.ext_ground}` );
      setValuePhysParamId(`${params.row.physparam_id}`);
      setValuePhysParamIdInitial(`${params.row.physparam_id}`);

      setValueUsed(`${params.row.used}`);
      setValueUsedInitial(`${params.row.used}`);
      setValueParameters(`${params.row.parameters}`);
      setValueParametersInitial(`${params.row.parameters}`);
    }
  }; 

  const handleClearClick = (params) => {
    //console.log('handleClearClick');
    if (editStarted)
    {
      //console.log('params');
      //console.log(params);
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
      //console.log('before assign '+ valueRespYear);

      setValueRespYear(``);
      //console.log('after assign '+ valueRespYear);      
      setValueIndoor(``);
      setValueExtCloud(``);
      setValueExtGround(``);
      setValuePhysParamId(``);  
      setValueUsed(``);
      setValueParameters(``);
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => { console.log('fetch ok'); console.log(data);  lastId = 0;} ); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/physparam`)
      .then((data) => data.json())
      .then((data) => settablePhysParam(data))
      .then((data) => { console.log('fetch settablePhysParam ok'); console.log(data);  lastId = 0;} ); 
  }, [])
 

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
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
      used: valueUsed,
      parameters: valueParameters
    });

    //console.log('Редактирование записи calcfunction');
    //console.log(js);

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
       console.log('SaveRec valueParameters ' + valueParameters) 
       setValueParametersInitial(valueParameters);
     }
    reloadData();     
   }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    //console.log('addrec executed');
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
      used: valueUsed,       
      parameters: valueParameters,
    });
    setIsLoading(true);
    //console.log(js);
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
      setSelectionModel(lastId);
      //Refresh initial state
      //console.log('addRec Refresh initial '+valueTitle+' '+valueNameRus);
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
        setSelectionModel(tableData[0].id );  
        setValueID(`${tableData[0].id}`);
        setValueTitle(`${tableData[0].title}`);
        setValueNameRus(`${tableData[0].name_rus}`);
        setValueNameEng(`${tableData[0].name_eng}`);
        setValueDescrRus(`${tableData[0].descr_rus}`);
        setValueDescrEng(`${tableData[0].descr_eng}`);

        setValueRespRate(`${tableData[0].resp_rate}`);
        setValueRespYear(`${tableData[0].resp_year}`);
        setValueIndoor(`${tableData[0].indoor}`);
        setValueExtCloud(`${tableData[0].ext_cloud}`);
        setValueExtGround(`${tableData[0].ext_ground}`);

        setValueTitleInitial(`${tableData[0].title}`);
        setValueNameRusInitial(`${tableData[0].name_rus}`);
        setValueNameEngInitial(`${tableData[0].name_eng}`);
        setValueDescrRusInitial(`${tableData[0].descr_rus}`);
        setValueDescrEngInitial(`${tableData[0].descr_eng}`);

        setValueRespRateInitial(`${tableData[0].resp_rate}`);
        setValueRespYearInitial(`${tableData[0].resp_year}`);
        setValueIndoorInitial(`${tableData[0].indoor}`);
        setValueExtCloudInitial(`${tableData[0].ext_cloud}`);
        setValueExtGroundInitial(`${tableData[0].ext_ground}`);
        setValuePhysParamId(`${tableData[0].physparam_id}`);
        setValuePhysParamIdInitial(`${tableData[0].physparam_id}`); 
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
    console.log('handleCloseSaveYes');
    setOpenSave(false);
    saveRec(false);
    handleCancelClick();
  };

  const handleClickSaveWhenNew = () => {
    console.log('handleClickSaveWhenNew');
    setOpenSaveWhenNew(true);
  };

  const handleCloseSaveWhenNewNo = () => {
    console.log('handleCloseSaveNo');
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
    console.log('handleCloseSaveYes');
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
  ]

  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    console.log('handleCancelClick');
    //console.log('selectionModel');
    //console.log(selectionModel);
    //console.log('selectionModel='+selectionModel.row.id);
    const selectedIDs = new Set(selectionModel);
    //console.log(selectedIDs);
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    //console.log(selectedRowData);
    if (selectedRowData.length)
    {
      setValueID(`${selectedRowData[0].id}`);
      setValueTitle(`${selectedRowData[0].title}`);
      setValueNameRus(`${selectedRowData[0].name_rus}`);
      setValueNameEng(`${selectedRowData[0].name_eng}` );
      setValueDescrRus(`${selectedRowData[0].descr_rus}`);
      setValueDescrEng(`${selectedRowData[0].descr_eng}` );
      setValueRespRate(`${selectedRowData[0].resp_rate}` );
      setValueRespYear(`${selectedRowData[0].resp_year}` );
      setValueIndoor(`${selectedRowData[0].indoor}` );
      setValueExtCloud(`${selectedRowData[0].ext_cloud}` );
      setValueExtGround(`${selectedRowData[0].ext_ground}` );
      //console.log('handleCancelClick Refresh initial '+selectedRowData[0].title+' '+selectedRowData[0].name_rus);
      setValueTitleInitial(`${selectedRowData[0].title}`);
      setValueNameRusInitial(`${selectedRowData[0].name_rus}`);
      setValueNameEngInitial(`${selectedRowData[0].name_eng}` );
      setValueDescrRusInitial(`${selectedRowData[0].descr_rus}`);
      setValueDescrEngInitial(`${selectedRowData[0].descr_eng}` );
      setValueRespRateInitial(`${selectedRowData[0].resp_rate}` );
      setValueRespYearInitial(`${selectedRowData[0].resp_year}` );
      setValueIndoorInitial(`${selectedRowData[0].indoor}` );
      setValueExtCloudInitial(`${selectedRowData[0].ext_cloud}` );
      setValueExtGroundInitial(`${selectedRowData[0].ext_ground}` );
      setValuePhysParamId(`${selectedRowData[0].physparam_id}` );
      setValuePhysParamIdInitial(`${selectedRowData[0].physparam_id}` );
      setValueUsed(`${selectedRowData[0].used}`); 
      setValueUsedInitial(`${selectedRowData[0].used}`); 
      setValueParameters(`${selectedRowData[0].parameters}`);      
      setValueParametersInitial(`${selectedRowData[0].parameters}`);      
    }
  }

  function CustomToolbar1() {
    const apiRef = useGridApiContext();
    const handleExport = (options/* : GridCsvExportOptions */) =>
      apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" Title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>saveRec(true)}  color="primary" size="small" Title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
        <IconButton onClick={()=>handleClickDelete()}  color="primary" size="small" Title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" Title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>reloadDataAlert()} color="primary" size="small" Title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleExport({ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} color="primary" 
            size="small" Title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
      </GridToolbarContainer>
    );
  }

/*   const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  }; */

  const valuesYesNo = [
    { title: 'Нет', id: 'false' },
    { title: 'Да', id: 'true' } ];

//  const [file, setFile] = useState()

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

  return (
    <div style={{ height: 550, width: 1500 }}>
    <table border = "0" style={{ height: 550, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 550, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 400, width: 585 }}>

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
      <TextField  id="ch_id"  disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={valueId || ''} size="small" /* defaultValue=" " */ onChange={e => setValueID(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" size="small" variant="outlined" value={valueTitle || ''} /* defaultValue=" " */ onChange={e => setValueTitle(e.target.value)}/>
      <p/>
      <TextField  id="ch_name_rus" sx={{ width: '40ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''}  /* defaultValue=" "  */ onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '40ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} /* defaultValue=" " */ onChange={e => setValueNameEng(e.target.value)}/>
      <p/>
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} /* defaultValue=" " */ onChange={e => setValueDescrRus(e.target.value)}/>
      <p/> 
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} /* defaultValue=" " */ onChange={e => setValueDescrEng(e.target.value)}/>
      <p/>

      <div>
      {(() => {
        if (props.table_name==='calcfunction') {
          return (
            <div>
{/*             <Button variant="contained" component="label">Загрузить из файла
              <input hidden accept="text/xml" type="file" onChange={handleFileChange}/>
            </Button><p/> */}
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
{/* 
            <input
              style={{ display: "none" }}
              id="contained-button-file"
              type="file"  onChange={handleFileChange}
            />   */}

{/*             <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
            <br/> */}
{/*             &nbsp;<IconButton color="primary" size="small" title="Поиск и загрузка файла *.xml">
              <SvgIcon fontSize="small" component={FileImportLightIcon} inheritViewBox>
                
              </SvgIcon>
              </IconButton><br/> */}
            &nbsp;<label htmlFor="icon-button-file1">
            <IconButton onClick={()=>{setValueParameters("")}} color="primary" size="small" title="Очистить">
              <SvgIcon fontSize="small" component={EraserLightIcon} inheritViewBox /></IconButton>
            </label></td></tr>
            </tbody></table>
            <p/>
            <FormControl sx={{ width: '40ch' }} size="small">
            <InputLabel id="type">Используется расчетным модулем</InputLabel>
              <Select labelId="type" id="type1"  label="Используется расчетным модулем" value={valueUsed  || "" }  onChange={e => setValueUsed(e.target.value)}>
                {valuesYesNo?.map(option => {
                    return (
                      <MenuItem key={option.id} value={option.id}>
                        {option.title ?? option.id}
                      </MenuItem>
                    );
                    })}
              </Select>
            </FormControl>    
            <p/> 
            </div>
          )
        } 
      })()}
      </div>


    
        <FormControl sx={{ width: '40ch' }} size="small">
        <InputLabel id="fiz">Физический параметр (из общего списка)</InputLabel>
          <Select labelId="fiz" id="fiz1" label="Физический параметр (из общего списка)" value={valuePhysParamID  || "" }  onChange={e => setValuePhysParamId(e.target.value)}>
          {tablePhysParam?.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title ?? option.id}
                  </MenuItem>
                );
                })}
          </Select>
          </FormControl>  
          <p/> 
          <TextField sx={{width: '100ch', input: {color: "black", background: '#EEEEEE'}}} id="physparam_code" label="Код"  size="small" variant="outlined" value={valuePhysParamCode || ''} />
          <p/>
          <TextField sx={{width: '100ch', input: {color: "black", background: '#EEEEEE'}}} id="physparam_name_rus" label="Название (рус.яз)"  size="small" variant="outlined" value={valuePhysParamNameRus || ''} />
          <p/>
          <TextField sx={{width: '100ch', input: {color: "black", background: '#EEEEEE'}}} id="dimension" label="Eд.измерения (базовая)"  size="small" variant="outlined" value={valuePhysParamDimension || ''} />
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
            В запись таблицы "Типы облучаемых лиц" с кодом <b>{valueId}</b> внесены изменения.<p/>
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p/>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p/>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p/>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p/>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p/>
            {valueRespRate === valueRespRateInitial ? '' : 'Скорость дыхания, куб.м/сек: '+valueRespRate+'; ' }<p/>
            {valueRespYear === valueRespYearInitial ? '' : 'Годовой объем вдыхаемого воздуха, куб.м: '+valueRespYear+'; ' }<p/>
            {valueIndoor === valueIndoorInitial ? '' : 'Доля времени, проводимая индивидуумом в помещении: '+valueIndoor+'; ' }<p/>
            {valueExtCloud === valueExtCloudInitial ? '' : 'Коэффициент для дозы внешнего облучения от облака: '+valueExtCloud+'; ' }<p/>
            {valueExtGround === valueExtGroundInitial ? '' : 'Коэффициент для дозы внешнего облучения от поверхности: '+valueExtGround+'; ' }<p/>
            {valuePhysParamID === valuePhysParamIDInitial ? '' : 'Физический параметр (из общего списка): '+valuePhysParamID+'; ' }<p/>
            {valueUsed === valueUsedInitial ? '' : 'Используется расчетным модулем '+valueUsed+'; ' }<p/>
            {valueParameters === valueParametersInitial ? '' : 'Параметры функции'+valueParameters+'; ' }<p/>
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
            В запись таблицы "Типы облучаемых лиц" с кодом <b>{valueId}</b> внесены изменения.<p/>
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p/>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p/>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p/>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p/>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p/>
            {valueRespRate === valueRespRateInitial ? '' : 'Скорость дыхания, куб.м/сек: '+valueRespRate+'; ' }<p/>
            {valueRespYear === valueRespYearInitial ? '' : 'Годовой объем вдыхаемого воздуха, куб.м: '+valueRespYear+'; ' }<p/>
            {valueIndoor === valueIndoorInitial ? '' : 'Доля времени, проводимая индивидуумом в помещении: '+valueIndoor+'; ' }<p/>
            {valueExtCloud === valueExtCloudInitial ? '' : 'Коэффициент для дозы внешнего облучения от облака: '+valueExtCloud+'; ' }<p/>
            {valueExtGround === valueExtGroundInitial ? '' : 'Коэффициент для дозы внешнего облучения от поверхности: '+valueExtGround+'; ' }<p/>
            {valuePhysParamID === valuePhysParamIDInitial ? '' : 'Физический параметр (из общего списка): '+valuePhysParamID+'; ' }<p/>
            {valueUsed === valueUsedInitial ? '' : 'Используется расчетным модулем '+valueUsed+'; ' }<p/>
            {valueParameters === valueParametersInitial ? '' : 'Параметры функции'+valueParameters+'; ' }<p/>
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

export { DataTableDoseRatio as DataTableDoseRatio, lastId }
