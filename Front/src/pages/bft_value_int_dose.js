// Big f....g table VALUE_INT_DOSE

import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
//  useGridApiContext,
  //gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//import DialogContentText from '@mui/material/DialogContentTecxt';
import DialogTitle from '@mui/material/DialogTitle';
//import { FormControl } from "@mui/material";
//import { InputLabel } from "@mui/material";
//import { Select } from "@mui/material";
import { Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SvgIcon from '@mui/material/SvgIcon';
//import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
//import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { ReactComponent as CheckDoubleIcon } from "./../icons/check-double.svg";
import { ReactComponent as ArrowAltDownIcon } from "./../icons/arrow-alt-down.svg";
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
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
//import ServerPaginationGrid from './sp_datagrid';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

var alertText = "Сообщение";
var alertSeverity = "info";

const BigTableValueIntDose = (props) => {
  const [pageState, setPageState] = useState({
    page: 0,
    pageSize: 10,
    rows: [],
    rowCount: 0,
    isLoading: false
  });

  const columnsValueIntDose = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'people_class_name_rus', headerName: 'Тип облучаемых лиц', width: 180 },
    { field: 'isotope_title', headerName: 'Нуклид', width: 100 },
    { field: 'integral_period_name_rus', headerName: 'Период интегрирования', width: 200 },
    { field: 'organ_name_rus', headerName: 'Орган', width: 200 },
    { field: 'agegroup_name_rus', headerName: 'Возрастная группа населения', width: 200 },
    { field: 'dr_value', headerName: 'Значение', width: 180 },
    { field: 'updatetime', headerName: 'Время последнего измерения', width: 280 },
    { field: 'data_source_title', headerName: 'Источник данных', width: 200 },
    { field: 'irradiation_name_rus', headerName: 'Тип облучения', width: 200 },
    { field: 'dose_ratio_title', headerName: 'Параметр', width: 200 },
    { field: 'let_level_name_rus', headerName: 'Уровень ЛПЭ', width: 200 },
    { field: 'subst_form_name_rus', headerName: 'Форма вещества', width: 200 },    
    { field: 'aerosol_sol_name_rus', headerName: 'Тип растворимости аэрозолей', width: 200 },
    { field: 'aerosol_amad_name_rus', headerName: 'AMAD аэрозолей', width: 200 },
    { field: 'exp_scenario_name_rus', headerName: 'Сценарии поступления', width: 200 },
   ]

/*    const columnsDataSourceClass = [
    { field: 'id', headerName: 'Код', width: 60 },
    { field: 'data_source_id', headerName: 'Код источника данных', width: 100 },
    { field: 'table_name', headerName: 'Имя таблицы БД', width: 180 },
    { field: 'rec_id', headerName: `Идентификатор записи в таблице `, width: 100 },
  ]
 */
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const [selDataSourceValues, setSelDataSourceValues] = useState([]);
  const [selOrganValues, setSelOrganValues] = useState([]);
  const [selIrradiationValue, setSelIrradiationValue] = useState(null);
  const [selIsotopeValues, setSelIsotopeValues] = useState([]);
  const [selIntegralPeriodValues, setSelIntegralPeriodValues] = useState([]);
  const [selDoseRatioValue, setSelDoseRatioValue] = useState(null);
  const [selLetLevelValues, setSelLetLevelValues] = useState([]);
  const [selAgeGroupValues, setSelAgeGroupValues] = useState([]);
  const [selSubstFormValues, setSelSubstFormValues] = useState([]);
  const [selAerosolSolValues, setSelAerosolSolValues] = useState([]);
  const [selAerosolAMADValues, setSelAerosolAMADValues] = useState([]);
  const [selExpScenarioValues, setSelExpScenarioValues] = useState([]);
  const [selPeopleClassValues, setSelPeopleClassValues] = useState([]);
  //const [selDoseRatioID, setSelDoseRatioID] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableDataSource, setTableDataSource] = useState([]); 
  const [tableOrgan, setTableOrgan] = useState([]);
  const [tableIrradiation, setTableIrradiation] = useState([]);  
  const [tableIrradiationFiltered, setTableIrradiationFiltered] = useState([]);  
  const [tableIsotope, setTableIsotope] = useState([]);
  const [tableIntegralPeriod, setTableIntegralPeriod] = useState([]);
  const [tableDoseRatio, setTableDoseRatio] = useState([]);
  const [tableDoseRatioFiltered, setTableDoseRatioFiltered] = useState([]);
  const [tableLetLevel, setTableLetLevel] = useState([]); //уровни ЛПЭ
  const [tableAgeGroup, setTableAgeGroup] = useState([]);   
  const [tableSubstForm, setTableSubstForm] = useState([]); //формы вещества  
  const [tableAerosolSol, setTableAerosolSol] = useState([]);   
  const [tableAerosolAMAD, setTableAerosolAMAD] = useState([]); //АМАД аэрозолей
  const [tableExpScenario, setTableExpScenario] = useState([]); //Сценарии поступления
  const [tablePeopleClass, setTablePeopleClass] = useState([]); //Типы облучаемых лиц
  const [tablePeopleClassFiltered, setTablePeopleClassFiltered] = useState([]); //Типы облучаемых лиц - фильтр по
  const [tableValueIntDose, setTableValueIntDose] = useState([]); 
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [tableDataSourceClass, setTableDataSourceClass] = useState([]);
  //const [tableDataSourceClassFiltered, setTableDataSourceClassFiltered] = useState([]);

  const handleChangeDataSource = (event, value) => {
    //console.log('handleChangeDataSource');
    //console.log(value);
    setSelDataSourceValues(value);
  };
  
  useEffect(() => {
    //взяли айди выбранных источников данных
    var ids = selDataSourceValues.map(item => item.id);
    var ids_dose_ratio = tableDataSourceClass.filter(item => ((item.table_name === 'dose_ratio' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredDoseRatio = tableDoseRatio.filter(item => ((ids_dose_ratio.includes(item.id))) );
    setTableDoseRatioFiltered( filteredDoseRatio ); 
    // если отфильтрованная таблица DoseRatio содержит значение, выбранное в выпадающем списке
    if ((filteredDoseRatio&&selDoseRatioValue)&&(!filteredDoseRatio.some(item => item.id === selDoseRatioValue.id) )) setSelDoseRatioValue(null);

    var ids_irradiation = tableDataSourceClass.filter(item => ((item.table_name === 'irradiation' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIrradiation = tableIrradiation.filter(item => ((ids_irradiation.includes(item.id))) );
    setTableIrradiationFiltered( filteredIrradiation ); 
    if ((filteredIrradiation&&selIrradiationValue)&&(!filteredIrradiation.some(item => item.id === selIrradiationValue.id) )) setSelIrradiationValue(null);

    var ids_people_class = tableDataSourceClass.filter(item => ((item.table_name === 'people_class' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredPeopleClass = tablePeopleClass.filter(item => ((ids_people_class.includes(item.id))) );
    setTablePeopleClassFiltered( filteredPeopleClass ); 

  }, [selDataSourceValues, tableDataSourceClass, 
      tableDoseRatio, selDoseRatioValue, 
      tableIrradiation, selIrradiationValue,
      tablePeopleClass 
    ]);

  useEffect(() => {
    setSelPeopleClassValues((prevValues) => {
      // Фильтруем значения в prevValues, чтобы оставить только те,
      // которые есть в tablePeopleClassFiltered
      return prevValues.filter((val) =>
        tablePeopleClassFiltered.find((opt) => opt.id === val.id)
      );
    });
  }, [tablePeopleClassFiltered]);      


  const handleChangeDoseRatio = (event, value) => {
    //console.log('handleChangeDoseRatio');
    //console.log(value);
    setSelDoseRatioValue(value);
  };

  const handleChangeOrgan = (event, value) => {
    setSelOrganValues(value);
    //console.log(value);
  };

  const handleChangeIrradiation = (event, value) => {
    setSelIrradiationValue(value);
    //console.log(value);
  };

  const handleChangeIsotope = (event, value) => {
    setSelIsotopeValues(value);
    //console.log(value);
  };

  const handleChangeIntegralPeriod = (event, value) => {
    setSelIntegralPeriodValues(value);
    //console.log(value);
  };

  const handleChangeLetLevel = (event, value) => {
    setSelLetLevelValues(value);
    //console.log(value);
  };
  
  const handleChangeAgeGroup = (event, value) => {
    setSelAgeGroupValues(value);
    //console.log(value);
  }; 

  const handleChangeSubstForm = (event, value) => {
    setSelSubstFormValues(value);
    //console.log(value);
  };   

  const handleChangeAerosolSol = (event, value) => {
    setSelAerosolSolValues(value);
    //console.log(value);
  }; 

  const handleChangeAerosolAMAD = (event, value) => {
    setSelAerosolAMADValues(value);
    //console.log(value);
  };
  
  const handleChangeExpScenario = (event, value) => {
    setSelExpScenarioValues(value);
    //console.log(value);
  };     
  
  const handleChangePeopleClass = (event, value) => {
    setSelPeopleClassValues(value);
    //console.log(value);
  };  

  const [openEdit, setOpenEdit] = React.useState(false);
  const handleClickEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEditYes = () => {
    setOpenEdit(false);
    saveRec();
  };
  const handleCloseEditNo = () => {
    setOpenEdit(false);
  };

  const [valueID, setValueID] = React.useState();
  const [valueDoseRatioID, setValueDoseRatioID] = React.useState();
  const [valuePeopleClassID, setValuePeopleClassID] = React.useState();
  const [valueIsotopeID, setValueIsotopeID] = React.useState();
  const [valueIntegralPeriodID, setValueIntegralPeriodID] = React.useState();
  const [valueOrganID, setValueOrganID] = React.useState();
  const [valueAgeGroupID, setValueAgeGroupID] = React.useState();
  const [valueDataSourceID, setValueDataSourceID] = React.useState();
  
  const [valueDrValue, setValueDrValue] = React.useState();
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  

  const handleRowClick = (params) => {
    //setOpenAlert(false);
    //console.log( 'handleRowClick dose_ratio_id = '+params.row.dose_ratio_id);
    //if (editStarted&&(!isEmpty))
      setValueID(params.row.id);
      setValueDoseRatioID(params.row.dose_ratio_id);
      setValuePeopleClassID(params.row.people_class_id);
      setValueIsotopeID(params.row.isotope_id);
      setValueIntegralPeriodID(params.row.integral_period_id);
      setValueOrganID(params.row.organ_id);
      setValueAgeGroupID(params.row.agegroup_id);
      setValueDataSourceID(params.row.data_source_id);
      setValueDrValue(params.row.dr_value);
  }; 
  
  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {

    if (formRef.current.reportValidity() )
    {
    const js = JSON.stringify({
      dose_ratio_id: valueDoseRatioID,
      dr_value: valueDrValue    
    });
/*     if (!valueId) {
      addRec();
      return;
    } */
    setIsLoading(true);
    try {
      const response = await fetch(`/${props.table_name}/`+valueID, {
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
/*      if (fromToolbar) 
     {
       setValueTitleInitial(valueTitle);       
       setValueShortNameInitial(valueShortName);
       setValueFullNameInitial(valueFullName);
       setValueExternalDSInitial(valueExternalDS);
       setValueDescrInitial(valueDescr);           
     } */
    reloadData();     
   }
  }
 };  

  useEffect(  () => {
/*     const setFirst =  async (data) => { 
      if ((tableDataSource.length>0)&&(selDataSourceValues.length===0)) {
        setSelDataSourceValues([tableDataSource[0]]);
      } 
    }  */
    async function fetchData() {
      await fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => setTableDataSource(data));
    }

    fetchData();
    //setFirst();
  },[ ]); //, [props.table_name]

  useEffect(() => {
    const setFirst =  async () => { 
      if ((tableDataSource.length>0)) {
        setSelDataSourceValues([tableDataSource[0]]);
      } 
    }   
    setFirst();  
  }, [tableDataSource])    

  useEffect(() => {
    fetch(`/data_source_class_min`)
      .then((data) => data.json())
      .then((data) => setTableDataSourceClass(data)); 
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

  useEffect(() => {
    fetch(`/let_level/`)
      .then((data) => data.json())
      .then((data) => setTableLetLevel(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/agegroup/`)
      .then((data) => data.json())
      .then((data) => setTableAgeGroup(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/subst_form/`)
      .then((data) => data.json())
      .then((data) => setTableSubstForm(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/aerosol_sol/`)
      .then((data) => data.json())
      .then((data) => setTableAerosolSol(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/aerosol_amad/`)
      .then((data) => data.json())
      .then((data) => setTableAerosolAMAD(data)); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/exp_scenario/`)
      .then((data) => data.json())
      .then((data) => setTableExpScenario(data)); 
  }, [props.table_name])
 
  useEffect(() => {
    fetch(`/people_class/`)
      .then((data) => data.json())
      .then((data) => setTablePeopleClass(data)); 
  }, [props.table_name])

  const reloadDataHandler =  async () => {
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
    setIsTableExpanded(true);
    setIsFilterExpanded(false);
  }

  const reloadData = async () => {
    setIsLoading(true);
    try {
      //console.log(selDataSourceValues);
      //var ds_id = 0;
      //if (selDataSourceValues.length)
      //  ds_id = selDataSourceValues[0].id;
      //console.log(ds_id);  

      const  idsDS =  selDataSourceValues.map(item => item.id).join(',');
      ////console.log('idsDS = '+idsDS);  
      const  idsOrgan =  selOrganValues.map(item => item.id).join(',');
      ////console.log('idsOrgan = '+idsOrgan);  
      const  idsIrradiation = selIrradiationValue?[selIrradiationValue.id]:[]; //selIrradiationValue.map(item => item.id).join(',');
      //console.log('idsIrradiation = '+idsIrradiation);        
      const  idsIsotope =  selIsotopeValues.map(item => item.id).join(',');
      //console.log('idsIsotope = '+idsIsotope);  
      const  idsIntegralPeriod =  selIntegralPeriodValues.map(item => item.id).join(',');
      //console.log('idsIntegralPeriod = '+idsIntegralPeriod);  
      const  idsDoseRatio =  selDoseRatioValue?[selDoseRatioValue.id]:[]; //map(item => item.id).join(',');
      //console.log('idsDoseRatio = '+idsDoseRatio);  
      const  idsLetLevel =  selLetLevelValues.map(item => item.id).join(',');
      //console.log('idsLetLevel = '+idsLetLevel);  
      const  idsAgeGroup =  selAgeGroupValues.map(item => item.id).join(',');
      //console.log('idsAgeGroup = '+idsAgeGroup);  
      const  idsSubstForm =  selSubstFormValues.map(item => item.id).join(',');
      //console.log('idsSubstForm = '+idsSubstForm);  
      const  idsAerosolSol =  selAerosolSolValues.map(item => item.id).join(',');
      //console.log('idsAerosolSol = '+idsAerosolSol);  
      const  idsAerosolAMAD =  selAerosolAMADValues.map(item => item.id).join(',');
      //console.log('idsAerosolAMAD = '+idsAerosolAMAD);  
      const  idsExpScenario =  selExpScenarioValues.map(item => item.id).join(',');
      //console.log('idsExpScenario = '+idsExpScenario); 
      const  idsPeopleClass =  selPeopleClassValues.map(item => item.id).join(',');
      //console.log('idsPeopleClass = '+idsPeopleClass); 

      const response = await fetch(`/value_int_dose?data_source_id=`+idsDS+`&organ_id=`+idsOrgan+
      `&irradiation_id=`+idsIrradiation+`&isotope_id=`+idsIsotope+
      `&integral_period_id=`+idsIntegralPeriod+`&dose_ratio_id=`+idsDoseRatio+
      `&let_level_id=`+idsLetLevel+`&agegroup_id=`+idsAgeGroup+`&subst_form_id=`+idsSubstForm+
      `&aerosol_sol_id=`+idsAerosolSol+`&aerosol_amad_id=`+idsAerosolAMAD+`&exp_scenario_id=`+idsExpScenario+
      `&people_class_id=`+idsPeopleClass+
      `&page=`+(pageState.page + 1)+`&pagesize=`+pageState.pageSize
      );   
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
      ////console.log('catch err');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //console.log("---");
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      // console.log("pageState:", pageState);
      const response = await fetch(
        `/value_int_dose?page=${
          pageState.page + 1
        }&pagesize=${pageState.pageSize}`
      );
      const json = await response.json();
      setPageState((old) => ({
        ...old,
        isLoading: false,
        rows: json,
        rowCount: 99999999
      }));
    };
    fetchData();
  }, [pageState.pageSize, pageState.page]);

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  function CustomToolbar1() {
/*   const apiRef = useGridApiContext();
     const handleExport = (options) =>
      apiRef.current.exportDataAsCsv(options); */

    return(
      <GridToolbarContainer>
        <IconButton /* onClick={()=>handleClearClick()}  */ color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>

        <IconButton onClick={()=>handleClickEdit()} color="primary" size="small" title="Редактировать запись">
          <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton>          
{/*         <IconButton  color="primary" size="small" title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton> */}
        <IconButton /* onClick={()=>handleClickDelete()} */  color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
{/*         <IconButton   color="primary" size="small" title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton> */}
        <IconButton /* onClick={()=>reloadDataAlert()} */ color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
{/*         <IconButton onClick={()=>handleExport({ delimiter: ';', utf8WithBom: true, getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} color="primary" 
            size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>  */}
      </GridToolbarContainer>
    );
  }



/*  
    const setPage = (page) => {
    setPageState({ ...pageState, page: page });
  };

  const setPageSize = (pageSize) => {
    setPageState({ ...pageState, pageSize: pageSize });
  };  */

  // const setRowCountState = (rowCount) => {
  //   setPageState({ ...pageState, rowCount: rowCount });
  // };

  // useEffect(() => {
  //   setRowCountState((prevRowCountState) =>
  //     rowCount !== undefined ? rowCount : prevRowCountState
  //   );
  // }, [pageState.rowCount, setRowCountState]);


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


  function GetFilterCaption() { //формирование заголовка выбранных фильтров
    //console.log('MyFilterCaption');
    //console.log(selPeopleClassValues); 
    //console.log(selDataSourceValues);
    return (
      <>
        {selDataSourceValues.length > 0 ? (<div>Источники данных: {selDataSourceValues.map(value => value.title).join(', ')}<br /></div>) : ''}

        {selDoseRatioValue&&selDoseRatioValue.title? (<div>Параметр: {selDoseRatioValue.title}<br /></div>) : '' }

        {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![2, 8].includes(selDoseRatioValue.id)))&&(selOrganValues.length > 0) ? 
          (<div>Органы и ткани: {selOrganValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![8].includes(selDoseRatioValue.id)))&&(selLetLevelValues.length > 0) ? 
          (<div>Уровни ЛПЭ: {selLetLevelValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {selIrradiationValue&&selIrradiationValue.name_rus? (<div>Тип облучения: {selIrradiationValue.name_rus}<br /></div>) : '' }

        {!((!selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2))&&(selSubstFormValues.length > 0) ? 
          (<div>Формы вещества: {selSubstFormValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {!((!selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2))&&
         !((selSubstFormValues.filter((row) => [162].includes(row.id))).length===0)&& 
          (selAerosolSolValues.length > 0) ? 
          (<div>Типы растворимости аэрозолей: {selAerosolSolValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {!((!selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2))&&
         !((selSubstFormValues.filter((row) => [162].includes(row.id))).length===0)&& 
          (selAerosolAMADValues.length > 0) ? 
          (<div>AMAD аэрозолей: {selAerosolAMADValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {selPeopleClassValues.length > 0? (<div>Типы облучаемых лиц: {selPeopleClassValues.map(value => value.name_rus).join(', ')}<br /></div>) : '' }
       
        {!( (!selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) )&&
        (selAgeGroupValues.length > 0)? (<div>Возрастные группы населения: {selAgeGroupValues.map(value => value.name_rus).join(', ')}<br /></div>) : '' }
 
        {!( (!selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) )&&
        (selExpScenarioValues.length > 0)? (<div>Сценарии поступления: {selExpScenarioValues.map(value => value.name_rus).join(', ')}<br /></div>) : '' }

        {selIsotopeValues.length > 0? (<div>Нуклиды: {selIsotopeValues.map(value => value.title).join(', ')}<br /></div>) : '' }
 
        {selIntegralPeriodValues.length > 0? (<div>Периоды интегрирования: {selIntegralPeriodValues.map(value => value.name_rus).join(', ')}<br /></div>) : '' }
      </>  
    );
  }

  const formRef = React.useRef();
  return (
    <div /* style={{ height: 640, width: 1500 }} */>
    <form ref={formRef}>  
      <Accordion expanded={isFilterExpanded} onChange={() => setIsFilterExpanded(!isFilterExpanded)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Фильтры {GetFilterCaption()}</Typography> 
 
        </AccordionSummary>
        <AccordionDetails>
        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td width={548}>
            <Autocomplete
            size="small"
            limitTags={10}
            value={selDataSourceValues}
            onChange={handleChangeDataSource}
            multiple
            id="autocomplete-datasource"
            options={tableDataSource}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelDataSourceValues(tableDataSource)/* setAll() */} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          </tr>
        </tbody></table>  
        <p></p>
        
        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td width={348}>      
          <Autocomplete
            size="small"  
            value={selDoseRatioValue}
            //isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeDoseRatio}
            id="autocomplete-dose_ratio"
            options={ tableDoseRatioFiltered.filter((row) => [1, 2, 8].includes(row.id)) }
            getOptionLabel={(option) => option.title?option.title:''} //?option.title:'Выбор отсутствует'
            renderInput={(params) => (
              <TextField {...params} label="Параметр" placeholder="Параметр" />
            )}
          />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelDoseRatioValue(tableDoseRatioFiltered.filter((row) => [1, 2, 8].includes(row.id)))} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>


           {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![2, 8].includes(selDoseRatioValue.id)))&&(    
            <td width={548}>      
            <Autocomplete
            size="small"
            limitTags={7}
            value={selOrganValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
            </td>
          )}
          {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![2, 8].includes(selDoseRatioValue.id)))&&(    
            <td>
              &nbsp;&nbsp;
            </td>
          )}
          {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![2, 8].includes(selDoseRatioValue.id)))&&(    
            <td>        
              <IconButton onClick={()=>setSelOrganValues(tableOrgan)} color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
          )}
          {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![2, 8].includes(selDoseRatioValue.id)))&&(    
            <td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>
          )}
          
 
          {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![8].includes(selDoseRatioValue.id)) ) && (
            <td width={348}> 
            <Autocomplete
            size="small"
            limitTags={7}
            value={selLetLevelValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeLetLevel}
            multiple
            id="autocomplete-let_level"
            options={tableLetLevel}
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Уровни ЛПЭ" placeholder="Уровни ЛПЭ" />
            )}
            />  
            </td>
          )}

          {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![8].includes(selDoseRatioValue.id)) ) && (
            <td>
              &nbsp;&nbsp;
            </td>
          )}
          {!((!selDataSourceValues.length)||(!selDoseRatioValue)||(![8].includes(selDoseRatioValue.id)) ) && (
            <td>        
              <IconButton onClick={()=>setSelLetLevelValues(tableLetLevel)} color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
          )}
          </tr>
        </tbody></table>  

        <p>{/* Тип облучения */}</p>        

        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td width={348}>
          <Autocomplete
            size="small"
            value={selIrradiationValue}
            onChange={handleChangeIrradiation}
            //multiple
            id="autocomplete-irradiation"
            options={tableIrradiationFiltered.filter((row) => [2,6, 30319, 30316].includes(row.id)) }
            getOptionLabel={(option) => option.name_rus?option.name_rus:''}  
            renderInput={(params) => (
              <TextField {...params} label="Тип облучения" placeholder="Тип облучения" />
            )}
          />          
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelIrradiationValue(tableIrradiationFiltered.filter((row) => [2,6, 30319, 30316].includes(row.id)))} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>

          {!( (!selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2) ) && (
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            <> 
            
            <td width={300}>      
              <Autocomplete
              size="small"
              value={selSubstFormValues}
              onChange={handleChangeSubstForm}
              multiple
              id="autocomplete-subst_form"
              options={tableSubstForm}
              disabled={  (!selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2)}          
              getOptionLabel={(option) => option.name_rus}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                  {option.name_rus}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Формы вещества" placeholder="Формы вещества" />
              )}
              />
            </td>          
            <td>
              &nbsp;&nbsp;
            </td>
            <td>        
              <IconButton onClick={()=>setSelSubstFormValues(tableSubstForm)} color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
            <td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>

          {!( (!selDataSourceValues.length) ||  ((selSubstFormValues.filter((row) => [162].includes(row.id))).length===0) ) && (
          <>  
          <td width={300}>      
            <Autocomplete
            size="small"
            value={selAerosolSolValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeAerosolSol}
            multiple
            id="autocomplete-aerosol_sol"
            options={tableAerosolSol}
            disabled={  (!selDataSourceValues.length) ||  
                ((selSubstFormValues.filter((row) => [162].includes(row.id))).length===0) 
            }          
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Типы растворимости аэрозолей" placeholder="Типы растворимости аэрозолей" />
            )}
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelAerosolSolValues(tableAerosolSol)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          <td width={300}>      
            <Autocomplete
            size="small"
            value={selAerosolAMADValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            limitTags={7}
            onChange={handleChangeAerosolAMAD}
            multiple
            id="autocomplete-aerosol_amad"
            options={tableAerosolAMAD}
            disabled={  (!selDataSourceValues.length) ||  
                ((selSubstFormValues.filter((row) => [162].includes(row.id))).length===0) 
            }          
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="AMAD аэрозолей" placeholder="AMAD аэрозолей" />
            )}
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td> 
            <IconButton onClick={()=>setSelAerosolAMADValues(tableAerosolAMAD)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>

          </> 
          )} 
          </> 
          )} 
          </tr>
        </tbody></table>  


        <p>{/* блок Типы облучаемых лиц */}</p>

        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td width={348}>
            <Autocomplete
            size="small"
            value={selPeopleClassValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangePeopleClass}
            multiple
            id="autocomplete-people_class"
            options={tablePeopleClassFiltered}
            getOptionLabel ={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Типы облучаемых лиц" placeholder="Типы облучаемых лиц" />
            )}
            />          
            </td>
            <td>
              &nbsp;&nbsp;
            </td>
            <td>        
              <IconButton onClick={()=>setSelPeopleClassValues(tablePeopleClassFiltered)} color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
            <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>

          {!( (!selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) ) && (
          < >
          <td width={348}>      
            <Autocomplete
            size="small"
            value={selAgeGroupValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeAgeGroup}
            multiple
            id="autocomplete-age_group"
            disabled={(!selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) }              
            options={tableAgeGroup}
            getOptionLabel ={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Возрастные группы населения" placeholder="Возрастные группы населения" />
            )}
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelAgeGroupValues(tableAgeGroup)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          </ >
          )}

          {!((!selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) ) && (
          <td width={348}>      
            <Autocomplete
            size="small"
            value={selExpScenarioValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeExpScenario}
            multiple
            id="autocomplete-aerosol_amad"
            options={tableExpScenario}
            disabled={ (!selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) }              
            getOptionLabel ={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Сценарии поступления" placeholder="Сценарии поступления" />
            )}
            />
          </td>
          )} 

          {!((!selDataSourceValues.length) ||  ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0)  ) && (   
          <td>
            &nbsp;&nbsp;
          </td>
          )}
          
          {!((!selDataSourceValues.length) ||  ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0)  ) && (   
          <td>     
            <IconButton onClick={()=>setSelExpScenarioValues(tableExpScenario)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          )}


          </tr>
          </tbody>
        </table> 

        <p>{/* Блок Нуклиды ==== Периоды интегрирования */}</p>                           
        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td width={348}>
            <Autocomplete
              size="small"
              value={selIsotopeValues}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={handleChangeIsotope}
              multiple
              limitTags={7}
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
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelIsotopeValues(tableIsotope)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
           <td width={348}>      
            <Autocomplete
            size="small"
            value={selIntegralPeriodValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeIntegralPeriod}
            multiple
            limitTags={7}
            id="autocomplete-integral"
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
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelIntegralPeriodValues(tableIntegralPeriod)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          </tr>
          </tbody>
        </table>
        <p></p>  

        <IconButton onClick={()=>reloadDataHandler()} color="primary" size="small" title="Получить данные">
          <SvgIcon fontSize="small" component={ArrowAltDownIcon} inheritViewBox /></IconButton>

        </AccordionDetails>
      </Accordion>

      <Accordion expanded={isTableExpanded}  onChange={() => {setIsTableExpanded(!isTableExpanded); }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography>Таблица значений</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <table border = "0" style={{  height: 410,  width: 1500 }} >
          <tbody>
            <tr>
              <td style={{ /* height: 840, */ verticalAlign: 'top' }}>
              <div style={{ height: 390 }} > 
              <DataGrid
                  components={{ Toolbar: CustomToolbar1 }}
                  hideFooterSelectedRowCount={true}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                  rowHeight={25}
                  loading={isLoading}
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
                  onRowClick={handleRowClick} {...tableValueIntDose} 
                  />
                </div>    
              </td>
            </tr>
            <tr>
              <td style={{ height: 50, verticalAlign: 'top' }}>

{/*                <p></p>   
              <ServerPaginationGrid
                page={pageState.page}
                loading={pageState.isLoading}
                pageSize={pageState.pageSize}
                rows={pageState.rows}
                rowCount={pageState.rowCount}
                columns={columnsValueIntDose}
                onPageAlter={(newPage) => setPageState({ ...pageState, page: newPage })}
              />   */}

              <Box /* sx={{ width: 585 }} */>
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

        </AccordionDetails>
      </Accordion>

      <Dialog open={openEdit} onClose={handleCloseEditNo} fullWidth={false} maxWidth="800px">
      <DialogTitle>Редактировать запись {valueID}</DialogTitle>  
        <DialogContent style={{height:'480px', width: '700px'}}>
           <p></p>
          <table border = "0" cellSpacing="0" cellPadding="0"><tbody><tr>
          <td>
          <div style={{width: '320px'}}><Autocomplete
            size="small"
            disabled={ (!selDataSourceValues.length) }
            value={tableDoseRatio.find((option) => option.id === valueDoseRatioID)  }
            onChange={(event, newValueAC) => {  console.log('aaa '+newValueAC?newValueAC.id:-1); setValueDoseRatioID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-dose_ratio_edit"
            options={ tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id)) }
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Параметр" placeholder="Параметр" />
            )}
          /></div>
          </td><td>&nbsp;&nbsp;&nbsp;
          </td><td>
          <div style={{width: '320px'}}><Autocomplete
            size="small"
            disabled={ (!selDataSourceValues.length) }
            value={tablePeopleClass.find((option) => option.id === valuePeopleClassID)  }
            onChange={(event, newValueAC) => { console.log('aaa '+newValueAC?newValueAC.id:-1); setValuePeopleClassID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-people_class_edit"
            options={ tablePeopleClass }
            getOptionLabel={(option) => option.name_rus}
            renderInput={(params) => (
              <TextField {...params} label="Тип облучаемых лиц" placeholder="Тип облучаемых лиц" />
            )}
          /></div>
          </td>
          </tr></tbody></table>
          <p></p>
          <Autocomplete
            size="small"
            disabled={ (!selDataSourceValues.length) }
            value={tableIsotope.find((option) => option.id === valueIsotopeID)  }
            onChange={(event, newValueAC) => { console.log('aaa '+newValueAC?newValueAC.id:-1); setValueIsotopeID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-nuclide_edit"
            options={ tableIsotope }
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Нуклид" placeholder="Нуклид" />
            )}
          />
          <p></p>
          <Autocomplete
            size="small"
            disabled={ (!selDataSourceValues.length) }
            value={tableIntegralPeriod.find((option) => option.id === valueIntegralPeriodID)  }
            onChange={(event, newValueAC) => { console.log('aaa '+newValueAC?newValueAC.id:-1); setValueIntegralPeriodID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-integral_period_edit"
            options={ tableIntegralPeriod }
            getOptionLabel={(option) => option.name_rus}
            renderInput={(params) => (
              <TextField {...params} label="Период интегрирования" placeholder="Период интегрирования" />
            )}
          />
          <p></p>
          <Autocomplete
            size="small"
            disabled={ (!selDataSourceValues.length) }
            value={tableOrgan.find((option) => option.id === valueOrganID)  }
            onChange={(event, newValueAC) => { console.log('aaa '+newValueAC?newValueAC.id:-1); setValueIsotopeID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-nuclide_edit"
            options={ tableOrgan }
            getOptionLabel={(option) => option.name_rus}
            renderInput={(params) => (
              <TextField {...params} label="Орган / ткань" placeholder="Орган / ткань" />
            )}
          />
          <p></p>
          <Autocomplete
            size="small"
            disabled={ (!selDataSourceValues.length) }
            value={tableAgeGroup.find((option) => option.id === valueAgeGroupID)  }
            onChange={(event, newValueAC) => { console.log('aaa '+newValueAC?newValueAC.id:-1); setValueAgeGroupID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-agegroup_edit"
            options={ tableAgeGroup }
            getOptionLabel={(option) => option.name_rus}
            renderInput={(params) => (
              <TextField {...params} label="Возрастная группа населения" placeholder="Возрастная группа населения" />
            )}
          />
          <p></p>
          <Autocomplete
            size="small"
            disabled={ (!selDataSourceValues.length) }
            value={tableDataSource.find((option) => option.id === valueDataSourceID) }
            onChange={(event, newValueAC) => { console.log('data_source_edit '+newValueAC?newValueAC.id:-1); setValueDataSourceID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-data_source_edit"
            options={ tableDataSource }
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Источник данных" placeholder="Источник данных" />
            )}
          />
          <p></p>
          <TextField
            size="small"
            variant="outlined"
            id="name_src"
            label="Значение"
            value={valueDrValue || ''}
            fullWidth
            onChange={e => setValueDrValue(e.target.value)}
          />          
          </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseEditNo}>Отмена</Button>
          <Button variant="outlined" /* disabled={!valueTitleSrc||!valueDataSourceId} */ onClick={handleCloseEditYes}>Сохранить</Button>
        </DialogActions>
      </Dialog>



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

  </form>
  </div>     
  )
}

export { BigTableValueIntDose }
