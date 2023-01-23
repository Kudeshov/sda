// Big fucking table VALUE_INT_DOSE

import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
//  useGridApiContext,
//  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
/* import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'; */
import { Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SvgIcon from '@mui/material/SvgIcon';
/* import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg"; */
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
/* import { table_names } from './sda_types';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material"; */
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import ServerPaginationGrid from './sp_datagrid';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

var alertText = "Сообщение";
var alertSeverity = "info";
//var lastId = 0;

const BigTableValueIntDose = (props) => {
/*  const [valueId, setValueID] = React.useState();
   const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();

  const [valueShortName, setValueShortName] = React.useState();
  const [valueFullName, setValueFullName] = React.useState();
  const [valueDescr, setValueDescr] = React.useState();
  const [valueExternalDS, setValueExternalDS] = React.useState();

  const [valueShortNameInitial, setValueShortNameInitial] = React.useState();
  const [valueFullNameInitial, setValueFullNameInitial] = React.useState();
  const [valueDescrInitial, setValueDescrInitial] = React.useState();
  const [valueExternalDSInitial, setValueExternalDSInitial] = React.useState(); */

  const [isLoading, setIsLoading] = React.useState(false);
  const [tableDataSource, setTableDataSource] = useState([]); 
  const [tableOrgan, setTableOrgan] = useState([]);
  const [tableIrradiation, setTableIrradiation] = useState([]);  
  const [tableIsotope, setTableIsotope] = useState([]);
  const [tableIntegralPeriod, setTableIntegralPeriod] = useState([]);
  const [tableDoseRatio, setTableDoseRatio] = useState([]);

  const [tableValueIntDose, setTableValueIntDose] = useState([]); 
  const [selectionModel, setSelectionModel] = React.useState([]);
/*  const [editStarted, setEditStarted] = useState([false]);

   useEffect(() => {
    setEditStarted((valueTitleInitial!==valueTitle)||(valueShortNameInitial!==valueShortName)||(valueFullNameInitial!==valueFullName)
      ||(valueDescrInitial!==valueDescr)||(valueExternalDSInitial!==valueExternalDS));
    }, [valueTitleInitial, valueTitle, valueShortNameInitial, valueShortName, valueFullNameInitial, valueFullName, 
      valueDescrInitial, valueDescr, valueExternalDSInitial, valueExternalDS]); 

  useEffect(() => {
    if ((!isLoading) && (tableDataSource) && (tableDataSource.length)) {
      if (!lastId) 
      {
        console.log('isLoading, tableData[0].external_ds '+tableDataSource[0].external_ds);
        lastId = tableDataSource[0].id;
        setSelectionModel([tableDataSource[0].id]);
        setValueID(tableDataSource[0].id);

        setValueTitle(tableDataSource[0].title);
        setValueShortName(tableDataSource[0].shortname);
        setValueFullName(tableDataSource[0].fullname || "" );
        setValueExternalDS(tableDataSource[0].external_ds);
        setValueDescr(tableDataSource[0].descr || "" );

        setValueTitleInitial(tableDataSource[0].title);
        setValueShortNameInitial(tableDataSource[0].shortname);
        setValueFullNameInitial(tableDataSource[0].fullname || "" );
        setValueExternalDSInitial(tableDataSource[0].external_ds);
        setValueDescrInitial(tableDataSource[0].descr || "" ); 
        //autocompleteValues(tableData[0]); 
        
      }
    }
    }, [ isLoading, tableDataSource] ); */

  /* const handleRowClick = (params) => {
    setOpenAlert(false);
    console.log('handleRowClick params.row.external_ds'+ params.row.external_ds);
    if (editStarted)
    {
      handleClickSave(params);
    } 
    else 
    {
      setValueID(params.row.id);

      setValueTitle(params.row.title);
      setValueShortName(params.row.shortname);
      setValueFullName( params.row.fullname || "" );
      setValueExternalDS(params.row.external_ds);
      setValueDescr( params.row.descr  || "" );

      setValueTitleInitial(params.row.title);
      setValueShortNameInitial(params.row.shortname);
      setValueFullNameInitial( params.row.fullname || "" );
      setValueExternalDSInitial(params.row.external_ds);
      setValueDescrInitial( params.row.descr  || "" );
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
      setValueID('');
      setValueTitle('');
      setValueShortName('');
      setValueFullName('');
      setValueExternalDS('');
      setValueDescr('');
    }
  }; 
 */
  useEffect(() => {
    fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => setTableDataSource(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/organ`)
      .then((data) => data.json())
      .then((data) => setTableOrgan(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/irradiation`)
      .then((data) => data.json())
      .then((data) => setTableIrradiation(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/isotope_min`)
      .then((data) => data.json())
      .then((data) => setTableIsotope(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/value_int_dose/`)
      .then((data) => data.json())
      .then((data) => setTableValueIntDose(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/integral_period/`)
      .then((data) => data.json())
      .then((data) => setTableIntegralPeriod(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/dose_ratio/`)
      .then((data) => data.json())
      .then((data) => setTableDoseRatio(data)); 
  }, [props.table_name])


  //const idsDoseRatioAllowed = [1, 2, 8];

  useEffect(() => {
    var a = tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id));
    console.log('tableDoseRatio.filter');    
    console.log(a);
  }, [tableDoseRatio])

  useEffect(() => {
    console.log('tableDataSource[0]');   
    console.log([tableDataSource[0]]);  

    //if (tableDataSource.length===0)
    //  setSelDataSourceValues([tableDataSource[0]]);
/*     var a = tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id));
    console.log(tableDoseRatio.filter);    
    console.log(a); */
  }, [tableDataSource]);


  

//  options={ tableDoseRatio.filter((row) => idsDoseRatio.has(row.id)) }

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  /* const saveRec = async ( fromToolbar ) => {
    const js = JSON.stringify({
      title: valueTitle,
      shortname: valueShortName,
      fullname: valueFullName,
      external_ds: valueExternalDS,
      descr: valueDescr         
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
       setValueShortNameInitial(valueShortName);
       setValueFullNameInitial(valueFullName);
       setValueExternalDSInitial(valueExternalDS);
       setValueDescrInitial(valueDescr);           
     }
    reloadData();     
   }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      shortname: valueShortName,
      fullname: valueFullName,
      external_ds: valueExternalDS,
      descr: valueDescr         
   });
    setIsLoading(true);
    console.log(js);
    try {
      const response = await fetch(`/${props.table_name}/`, {
        method: 'POST',
        body: js,
        headers: {
          'Content-Type': 'Application/json',
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
        //console.log('добавлено lastid = ' + lastId);
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
      //console.log('addRec Refresh initial '+valueTitle+' '+valueShortName);      
      setValueTitle(valueTitle);       
      setValueShortName(valueShortName);
      setValueFullName(valueFullName);
      setValueExternalDS(valueExternalDS);
      setValueDescr(valueDescr);       
      setValueTitleInitial(valueTitle);       
      setValueShortNameInitial(valueShortName);
      setValueFullNameInitial(valueFullName);
      setValueExternalDSInitial(valueExternalDS);
      setValueDescrInitial(valueDescr);          
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
        setSelectionModel([tableDataSource[0].id ]);  
        setValueID(tableDataSource[0].id);

        setValueTitle(tableDataSource[0].title);
        setValueShortName(tableDataSource[0].shortname);
        setValueFullName( tableDataSource[0].fullname || "" );
        setValueExternalDS(tableDataSource[0].external_ds);
        setValueDescr( tableDataSource[0].descr || "" );

        setValueTitleInitial(tableDataSource[0].title);
        setValueShortNameInitial(tableDataSource[0].shortname);
        setValueFullNameInitial( tableDataSource[0].fullname || "" );
        setValueExternalDSInitial(tableDataSource[0].external_ds);
        setValueDescrInitial( tableDataSource[0].descr || "" );  
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
    }
  };  
 */
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
      console.log(selDataSourceValues);
      var ds_id = 0;
      if (selDataSourceValues.length)
        ds_id = selDataSourceValues[0].id;
      console.log(ds_id);  

      const  idsDS =  selDataSourceValues.map(item => item.id).join(',');
      console.log('idsDS = '+idsDS);  
      const  idsOrgan =  selOrganValues.map(item => item.id).join(',');
      console.log('idsOrgan = '+idsOrgan);  
      const  idsIrradiation =  selIrradiationValues.map(item => item.id).join(',');
      console.log('idsIrradiation = '+idsIrradiation);        
      const  idsIsotope =  selIsotopeValues.map(item => item.id).join(',');
      console.log('idsIsotope = '+idsIsotope);  
      const  idsIntegralPeriod =  selIntegralPeriodValues.map(item => item.id).join(',');
      console.log('idsIntegralPeriod = '+idsIntegralPeriod);  
      const  idsDoseRatio =  selDoseRatioValues.map(item => item.id).join(',');
      console.log('idsDoseRatio = '+idsDoseRatio);  

      const response = await fetch(`/value_int_dose?data_source_id=`+idsDS+
                                  `&organ_id=`+idsOrgan+
                                  `&irradiation_id=`+idsIrradiation+
                                  `&isotope_id=`+idsIsotope+
                                  `&integral_period_id=`+idsIntegralPeriod+
                                  `&dose_ratio_id=`+idsDoseRatio);

       if (!response.ok) {
        alertText = `Ошибка при обновлении данных: ${response.status}`;
        alertSeverity = "false";
        const error = response.status + ' (' +response.statusText+')';  
        throw new Error(`${error}`);
      }
      else
      {  
        const result = await response.json();
        setTableValueIntDose(result);
      }
    } catch (err) {
      //console.log('catch err');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /////////////////////////////////////////
/*  const [openDel, setOpenDel] = React.useState(false); 
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

    setValueID('');
    setValueTitle('');
    setValueShortName('');
    setValueFullName('');
    setValueExternalDS('');
    setValueDescr('');
  };

  const handleCloseSaveWhenNewYes = () => {
    console.log('handleCloseSaveYes');
    setOpenSaveWhenNew(false);
    saveRec(true);
    setValueID('');
    setValueTitle('');
    setValueShortName('');
    setValueFullName('');
    setValueExternalDS('');
    setValueDescr('');
  };
*/

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
 
  const columnsValueIntDose = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'dr_value', headerName: 'Значение', width: 180 },
    { field: 'updatetime', headerName: 'Время последнего измерения', width: 280 },
    { field: 'data_source_title', headerName: 'Источник данных', width: 200 },
    { field: 'organ_name_rus', headerName: 'Орган', width: 200 },
    { field: 'irradiation_name_rus', headerName: 'Тип облучения', width: 200 },
    { field: 'isotope_title', headerName: 'Нуклид', width: 200 },
    { field: 'integral_period_name_rus', headerName: 'Период интегрирования', width: 200 },
  ]
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const [selDataSourceValues, setSelDataSourceValues] = useState([]);
  const [selOrganValues, setSelOrganValues] = useState([]);
  const [selIrradiationValues, setSelIrradiationValues] = useState([]);
  const [selIsotopeValues, setSelIsotopeValues] = useState([]);
  const [selIntegralPeriodValues, setSelIntegralPeriodValues] = useState([]);
  const [selDoseRatioValues, setSelDoseRatioValues] = useState([]);

  const handleChangeDataSource = (event, value) => {
    console.log('handleChangeDataSource');
    console.log(value);

    setSelDataSourceValues(value);
   // setValueTitle(value);
    //console.log(value);
  };

  const handleChangeDoseRatio = (event, value) => {
    setSelDoseRatioValues(value);
   // setValueTitle(value);
    console.log(value);
  };

  const handleChangeOrgan = (event, value) => {
    setSelOrganValues(value);
    console.log(value);
  };

  const handleChangeIrradiation = (event, value) => {
    setSelIrradiationValues(value);
    console.log(value);
  };

  const handleChangeIsotope = (event, value) => {
    setSelIsotopeValues(value);
    console.log(value);
  };

  const handleChangeIntegralPeriod = (event, value) => {
    setSelIntegralPeriodValues(value);
    console.log(value);
  };

 /*  const handleCancelClick = () => 
  {
    console.log('handleCancelClick');
    //console.log('selectionModel');
    //console.log(selectionModel);
    //console.log('selectionModel='+selectionModel.row.id);
    const selectedIDs = new Set(selectionModel);
    //console.log(selectedIDs);
    const selectedRowData = tableDataSource.filter((row) => selectedIDs.has(row.id));
    //console.log(selectedRowData);
    if (selectedRowData.length)
    {
      setValueID(selectedRowData[0].id);

      setValueTitle(selectedRowData[0].title);
      setValueShortName(selectedRowData[0].shortname);
      setValueFullName( selectedRowData[0].fullname || "" );
      setValueExternalDS(selectedRowData[0].external_ds);
      setValueDescr( selectedRowData[0].descr  || "" );

      setValueTitleInitial(selectedRowData[0].title);
      setValueShortNameInitial(selectedRowData[0].shortname);
      setValueFullNameInitial( selectedRowData[0].fullname || "" );
      setValueExternalDSInitial(selectedRowData[0].external_ds);
      setValueDescrInitial( selectedRowData[0].descr  || "" );
    }
  }
 */
  function CustomToolbar1() {
/*   const apiRef = useGridApiContext();
     const handleExport = (options) =>
      apiRef.current.exportDataAsCsv(options); */

    return (
      <GridToolbarContainer>
{/*         <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" title="Создать запись">
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
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton> */}
      </GridToolbarContainer>
    );
  }

  const [pageState, setPageState] = useState({
    page: 0,
    pageSize: 25,
    rows: [],
    rowCount: 0,
    isLoading: false
  });

/*   const setPage = (page) => {
    setPageState({ ...pageState, page: page });
  };

  const setPageSize = (pageSize) => {
    setPageState({ ...pageState, pageSize: pageSize });
  }; */

  // const setRowCountState = (rowCount) => {
  //   setPageState({ ...pageState, rowCount: rowCount });
  // };

  // useEffect(() => {
  //   setRowCountState((prevRowCountState) =>
  //     rowCount !== undefined ? rowCount : prevRowCountState
  //   );
  // }, [pageState.rowCount, setRowCountState]);

  const columns = [
    {
      field: "id"
    },
    {
      field: "albumId",
      headerName: "AlbumId",
      width: 110
    },
    {
      field: "thumbnailUrl",
      headerName: "ThumbnailUrl",
      width: 180,
      editable: false
    },
    {
      field: "title",
      headerName: "Title",
      width: 120,
      editable: false
    },

    {
      field: "url",
      headerName: "URL",
      type: "string",
      width: 140
    }
  ];

/*   useEffect(() => {
    console.log("---");
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      // console.log("pageState:", pageState);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos?_page=${
          pageState.page + 1
        }&_limit=${pageState.pageSize}`
      );
      const json = await response.json();
      setPageState((old) => ({
        ...old,
        isLoading: false,
        rows: json,
        rowCount: 1000
      }));
    };
    fetchData();
  }, [pageState.pageSize, pageState.page]); */

  useEffect(() => {
    console.log("---");
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      // console.log("pageState:", pageState);

      var ds_id = 0;
      if (selDataSourceValues.length)
        ds_id = selDataSourceValues[0].id;
      console.log(ds_id);  

      const  idsDS =  selDataSourceValues.map(item => item.id).join(',');
      console.log('idsDS = '+idsDS);  
      const  idsOrgan =  selOrganValues.map(item => item.id).join(',');
      console.log('idsOrgan = '+idsOrgan);  
      const  idsIrradiation =  selIrradiationValues.map(item => item.id).join(',');
      console.log('idsIrradiation = '+idsIrradiation);        
      const  idsIsotope =  selIsotopeValues.map(item => item.id).join(',');
      console.log('idsIsotope = '+idsIsotope);  
      const  idsIntegralPeriod =  selIntegralPeriodValues.map(item => item.id).join(',');
      console.log('idsIntegralPeriod = '+idsIntegralPeriod);  

      const response = await fetch(`/value_int_dose?data_source_id=`+idsDS+`&organ_id=`+idsOrgan+
      `&irradiation_id=`+idsIrradiation+`&isotope_id=`+idsIsotope+`&integral_period_id=`+idsIntegralPeriod);

/*       const response = await fetch(
        `/value_int_dose?page=${
          pageState.page + 1
        }&pagesize=${pageState.pageSize}`
      );
 */      const json = await response.json();
      //const cnt = await response.count();
      console.log("X-Total-Count", response.headers.get('X-Total-Count'));
      //console.log("Content-Range", response.headers.get('Content-Range'));
      const cnt = parseInt( response.headers.get('X-Total-Count') );
     // console.log('cnt = '+ cnt );
      setPageState((old) => ({
        ...old,
        isLoading: false,
        rows: json,
        rowCount: cnt
      }));
    };
    fetchData();
  }, [pageState.pageSize, pageState.page, selDataSourceValues]);



  return (
    <div style={{ height: 640, width: 1500 }}>
    <table border = "0" style={{ height: 550, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 640, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 486, width: 585 }}>
        <Autocomplete
          size="small"
          value={selDataSourceValues}
          onChange={handleChangeDataSource}
          multiple
          id="autocomplete-datasource"
          options={tableDataSource}  
        /*  options={ tableData.filter((row) => idsDoseRatio.has(row.id)) }
           options={tableDataSource.filter((row) => idsDoseRatio.has(row.id)) } */
          getOptionLabel={(option) => option.title}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
              {option.title}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Источники данных" placeholder="Источники данных" />
          )}
        />
        <p></p>
        <Autocomplete
          size="small"
          value={selDoseRatioValues}
          onChange={handleChangeDoseRatio}
          multiple
          id="autocomplete-doseratio"
          options={ tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id)) }
          /* options={tableDoseRatio} */
          getOptionLabel={(option) => option.title}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
              {option.title}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Параметры" placeholder="Параметры" />
          )}
        />
        <p></p>

        <Autocomplete
          size="small"
          value={selOrganValues}
          onChange={handleChangeOrgan}
          multiple
          id="autocomplete-organ"
          options={tableOrgan}
          getOptionLabel={(option) => option.name_rus}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
              {option.name_rus}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Органы и ткани" placeholder="Органы и ткани" />
          )}
        />
        <p></p>
        <Autocomplete
          size="small"
          value={selIrradiationValues}
          onChange={handleChangeIrradiation}
          multiple
          id="autocomplete-irradiation"
          options={tableIrradiation.filter((row) => [2,6, 30319, 30316].includes(row.id)) }
          getOptionLabel={(option) => option.name_rus}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
              {option.name_rus}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Типы облучения" placeholder="Типы облучения" />
          )}
        />
        <p></p>
        <Autocomplete
          size="small"
          value={selIsotopeValues}
          onChange={handleChangeIsotope}
          multiple
          id="autocomplete-isotope"
          options={tableIsotope}
          getOptionLabel={(option) => option.title}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
              {option.title}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Нуклиды" placeholder="Нуклиды" />
          )}
        />
        <p></p>
        <Autocomplete
          size="small"
          value={selIntegralPeriodValues}
          onChange={handleChangeIntegralPeriod}
          multiple
          id="autocomplete-isotope"
          options={tableIntegralPeriod}
          getOptionLabel={(option) => option.name_rus}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
              {option.name_rus}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Периоды интегрирования" placeholder="Периоды интегрирования" />
          )}
        />
        <p></p>
        <IconButton onClick={()=>reloadDataAlert()} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
{/*         <Autocomplete
          multiple
          //size="small"
          sx={{ width: '60ch' }}
          //disablePortal
          id="combo-box-nuclide"
          value={tableData.find((option) => option.id === valueId)||'' }
          //disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id }  
          onChange={(event, newValueAC) => {   setValueID(newValueAC?newValueAC.id:-1) } }
          options={tableData}
          getOptionLabel={option => option?option.title:""}
          renderInput={(params) => <TextField {...params} label="Радиоизотоп" />}
        /> */}


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
{/*       <DataGrid
        components={{ Toolbar: CustomToolbar1 }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableValueIntDose}
        columns={columnsValueIntDose}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}        
        initialState={{
          columns: {
            columnVisibilityModel: {
              updatetime: false,
              external_ds: false,
              descr: false,
            },
          },
        }}        
        //onRowClick={handleRowClick} {...tableData} 
      />  
      <p></p>   */}
       <ServerPaginationGrid
        page={pageState.page}
        loading={pageState.isLoading}
        pageSize={pageState.pageSize}
        rows={pageState.rows}
        rowCount={pageState.rowCount}
        columns={columnsValueIntDose}
        onPageAlter={(newPage) => setPageState({ ...pageState, page: newPage })}
      /> 
    </td>
  </tr>
  </tbody>
  </table>

  {(isLoading) && 

  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={isLoading}
  >
    <CircularProgress color="inherit" />
  </Backdrop> } 

 {/* <Dialog open={openDel} onClose={handleCloseDelNo} fullWidth={true}>
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
            В запись таблицы "{table_names[props.table_name]}" с кодом <b>{valueId}</b> внесены изменения.<p></p>
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
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
            <p></p>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewYes} >Да</Button>
    </DialogActions>
  </Dialog> */}
 </div>     
  )
}

export { BigTableValueIntDose }
