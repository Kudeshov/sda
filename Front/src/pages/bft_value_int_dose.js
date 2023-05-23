// Big f....g table VALUE_INT_DOSE
import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
//import { renderToString } from 'react-dom/server';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { ReactComponent as CheckDoubleIcon } from "./../icons/check-double.svg";
import { ReactComponent as ArrowAltDownIcon } from "./../icons/arrow-alt-down.svg";
/* import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@mui/material/Backdrop'; */
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { table_names } from './sda_types';
//import ServerPaginationGrid from './sp_datagrid';
//import DialogContentText from '@mui/material/DialogContentTecxt';
//import { FormControl } from "@mui/material";
//import { InputLabel } from "@mui/material";
//import { Select } from "@mui/material";
//import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
/* import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material"; */

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

let alertText = "Сообщение";
let alertSeverity = "info";

const BigTableValueIntDose = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling

   const [pageState/* , setPageState */] = useState({
    page: 0,
    pageSize: 10,
    rows: [],
    rowCount: 0,
    isLoading: false
  });

  // заголовки столбцов основной таблицы
  const columnsValueIntDose = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'people_class_name_rus', headerName: 'Тип облучаемых лиц', width: 180 },
    { field: 'isotope_title', headerName: 'Нуклид', width: 100 },
    { field: 'integral_period_name_rus', headerName: 'Период интегрирования', width: 200 },
    { field: 'organ_name_rus', headerName: 'Орган', width: 200 },
    { field: 'agegroup_name_rus', headerName: 'Возрастная группа населения', width: 200 },
    { field: 'exp_scenario_name_rus', headerName: 'Сценарий поступления', width: 200 },
    { field: 'subst_form_name_rus', headerName: 'Форма вещества', width: 200 },    
    { field: 'chem_comp_group_name_rus', headerName: 'Химическое соединение (группа)', width: 250 },    
    { field: 'aerosol_sol_name_rus', headerName: 'Тип растворимости аэрозолей', width: 200 },
    { field: 'aerosol_amad_name_rus', headerName: 'AMAD аэрозолей', width: 200 },
    { field: 'let_level_name_rus', headerName: 'Уровень ЛПЭ', width: 200 },
    { field: 'data_source_title', headerName: 'Источник данных', width: 200 },
    { field: 'dr_value', headerName: 'Значение', width: 180 },
    { 
      field: 'updatetime', 
      headerName: 'Время последнего измерения', 
      width: 280,
      valueGetter: (params) => {
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
        return formattedDate;
      }
    },
   /*  { field: 'updatetime', headerName: 'Время последнего измерения', width: 280 }, */
    { field: 'irradiation_name_rus', headerName: 'Тип облучения', width: 200 },
    { field: 'dose_ratio_title', headerName: 'Параметр', width: 200 },
   ]

  //состояние загрузки таблицы для отображения крутилки
  const [isLoading, setIsLoading] = React.useState(false);

  //состояние открытой панельки алерта-уведомления
  const [openAlert, setOpenAlert] = React.useState(false, '');

  //объект для хранения текущего состояния фильтра - значения, выбранные в автокомплитах
  const [currFlt, setCurrFlt] = useState({
    selDataSourceValues: [],
    selDoseRatioValue: null,
    selOrganValues: [],
    selIrradiationValue: null,
    selSubstFormValues: [],
    selIsotopeValues: [],
    selPeopleClassValues: [],
    selIntegralPeriodValues: [],
    selLetLevelValues: [],
    selAgeGroupValues: [],
    selAerosolSolValues: [],
    selAerosolAMADValues: [],
    selExpScenarioValues: [],
  });

  //примененный фильтр
  const [applFlt, setApplFlt] = useState({
    selDataSourceValues: [],
    selDoseRatioValue: null,
    selOrganValues: [],
    selIrradiationValue: null,
    selSubstFormValues: [],
    selIsotopeValues: [],
    selPeopleClassValues: [],
    selIntegralPeriodValues: [],
    selLetLevelValues: [],
    selAgeGroupValues: [],
    selAerosolSolValues: [],
    selAerosolAMADValues: [],
    selExpScenarioValues: [],
  });

  // Обновление текущего значения фильтра
  const updateCurrentFilter = (newFilterValue) => {
    setCurrFlt((prevFilter) => ({
      ...prevFilter,
      ...newFilterValue,
    }));
  };

  // Применение текущего значения фильтра
  const applyFilter = () => {
    setApplFlt(currFlt);
  };

  //массивы, содержащие данные для автокомплитов

  const [tableDataSource, setTableDataSource] = useState([]); 
  const [tableOrgan, setTableOrgan] = useState([]);
  const [tableOrganFiltered, settableOrganFiltered] = useState([]);
  const [tableIrradiation, setTableIrradiation] = useState([]);
  const [tableIrradiationFiltered, settableIrradiationFiltered] = useState([]);  
  
  const [tableIsotope, setTableIsotope] = useState([]);
  const [tableIsotopeFiltered, settableIsotopeFiltered] = useState([]);

  const [tableIntegralPeriod, setTableIntegralPeriod] = useState([]);
  const [tableIntegralPeriodFiltered, settableIntegralPeriodFiltered] = useState([]);
  const [tableDoseRatio, setTableDoseRatio] = useState([]);
  const [tableDoseRatioFiltered, settableDoseRatioFiltered] = useState([]);
  const [tableAgeGroup, setTableAgeGroup] = useState([]); //возрастные группы населения
  const [tableAgeGroupFiltered, settableAgeGroupFiltered] = useState([]);
  const [tableSubstForm, setTableSubstForm] = useState([]); //формы вещества
  const [tableSubstFormFiltered, settableSubstFormFiltered] = useState([]);
  const [tableAerosolSol, setTableAerosolSol] = useState([]);  
  const [tableAerosolSolFiltered, settableAerosolSolFiltered] = useState([]);  
  const [tableLetLevel, setTableLetLevel] = useState([]); //уровни ЛПЭ
  const [tableLetLevelFiltered, settableLetLevelFiltered] = useState([]); //уровни ЛПЭ
  const [tableAerosolAMAD, setTableAerosolAMAD] = useState([]); //АМАД аэрозолей
  const [tableAerosolAMADFiltered, settableAerosolAMADFiltered] = useState([]); //АМАД аэрозолей
  const [tableExpScenario, setTableExpScenario] = useState([]); //Сценарии поступления
  const [tableExpScenarioFiltered, settableExpScenarioFiltered] = useState([]); //Сценарии поступления
  const [tablePeopleClass, setTablePeopleClass] = useState([]); //Типы облучаемых лиц
  const [tablePeopleClassFiltered, settablePeopleClassFiltered] = useState([]); //Типы облучаемых лиц  

  const [tableValueIntDose, setTableValueIntDose] = useState([]); 
  const [selectionModel, setselectionModel] = React.useState([]);
  const [tableDataSourceClass, setTableDataSourceClass] = useState([]);

  const [organ_name_rus_visible, set_organ_name_rus_visible] = useState(true);
  const [let_level_name_rus_visible, set_let_level_name_rus_visible] = useState(true);
  const [people_class_name_rus_visible, set_people_class_name_rus_visible] = useState(true);
  const [subst_form_name_rus_visible, set_subst_form_name_rus_visible] = useState(true);
  const [aerosol_sol_name_rus_visible, set_aerosol_sol_name_rus_visible] = useState(true);
  const [aerosol_amad_name_rus_visible, set_aerosol_amad_name_rus_visible] = useState(true);
  const [agegroup_name_rus_visible, set_agegroup_name_rus_visible] = useState(true);
  const [exp_scenario_name_rus_visible, set_exp_scenario_name_rus_visible] = useState(true);
  const [isotope_title_visible, set_isotope_title_visible] = useState(true);
  const [integral_period_name_rus_visible, set_integral_period_name_rus_visible] = useState(true);

//  { field: 'isotope_title', headerName: 'Нуклид', width: 100 },
//  { field: 'integral_period_name_rus', headerName: 'Период интегрирования', width: 200 },

  useEffect(() => {
      set_organ_name_rus_visible( applFlt.selOrganValues.length!==1 && applFlt.selDoseRatioValue && [2, 8].includes(applFlt.selDoseRatioValue.id) ); 
      set_let_level_name_rus_visible( applFlt.selLetLevelValues.length!==1 && applFlt.selDoseRatioValue && [8].includes(applFlt.selDoseRatioValue.id) ); 
      set_people_class_name_rus_visible( applFlt.selPeopleClassValues.length!==1 ); 
      set_subst_form_name_rus_visible( applFlt.selSubstFormValues.length!==1 && applFlt.selIrradiationValue && applFlt.selIrradiationValue.id===2 );
      set_aerosol_sol_name_rus_visible( applFlt.selAerosolSolValues.length!==1 && applFlt.selIrradiationValue && applFlt.selIrradiationValue.id===2 &&
        applFlt.selSubstFormValues &&  [162].includes(applFlt.selSubstFormValues.id) ); 
      set_aerosol_amad_name_rus_visible( applFlt.selAerosolAMADValues.length!==1 && applFlt.selIrradiationValue && applFlt.selIrradiationValue.id===2 &&
        applFlt.selSubstFormValues &&  [162].includes(applFlt.selSubstFormValues.id) ); 

/*       console.log('applFlt.selAgeGroupValues.length' +applFlt.selAgeGroupValues.length);
      console.log('applFlt.selPeopleClassValues');
      console.log( applFlt.selPeopleClassValues );
      console.log( applFlt.selAgeGroupValues.length!==1 && applFlt.selPeopleClassValues && [1].includes(applFlt.selPeopleClassValues.id) ); */
      set_agegroup_name_rus_visible( applFlt.selAgeGroupValues.length!==1 && applFlt.selPeopleClassValues &&
        applFlt.selPeopleClassValues.some((row) => row.id === 1) 
        
        /* && [1].includes(applFlt.selPeopleClassValues.id) */ );
      set_exp_scenario_name_rus_visible( applFlt.selExpScenarioValues.length!==1 && applFlt.selPeopleClassValues && [3,4].includes(applFlt.selPeopleClassValues.id) );
      set_isotope_title_visible( applFlt.selIsotopeValues.length!==1 ); 
      set_integral_period_name_rus_visible( applFlt.selIntegralPeriodValues.length!==1 ); 
        
        
  }, [applFlt])
  
  const handleChangeDataSource = (event, value) => {
    updateCurrentFilter({ selDataSourceValues: value });
    //setselDataSourceValues(value);
  };

  
  //фильтрация списков фильтров в зависимости от выбранного источника (источников) данных
  useEffect(() => {
    //взяли айди выбранных источников данных
    //return;

    let ids = currFlt.selDataSourceValues.map(item => item.id);
    //отфильтровали dose_ratio.id для выбранных источников данных, чтобы отфильтровать его автокомплит
    let ids_dose_ratio = tableDataSourceClass.filter(item => ((item.table_name === 'dose_ratio' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredDoseRatio = tableDoseRatio.filter(item => ((ids_dose_ratio.includes(item.id))) );
    settableDoseRatioFiltered( filteredDoseRatio ); 
    // если отфильтрованная таблица DoseRatio не содержит значение, выбранное в выпадающем списке
    if ((filteredDoseRatio&&currFlt.selDoseRatioValue)&&(!filteredDoseRatio.some(item => item.id === currFlt.selDoseRatioValue.id) )) 
      updateCurrentFilter({ selDoseRatioValue: null });
      //setselDoseRatioValue(null); //выставляем его в null

    // то же самое для остальных автокомплитов
    let ids_irradiation = tableDataSourceClass.filter(item => ((item.table_name === 'irradiation' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIrradiation = tableIrradiation.filter(item => ((ids_irradiation.includes(item.id))) );
    settableIrradiationFiltered( filteredIrradiation ); 
    if ((filteredIrradiation&&currFlt.selIrradiationValue)&&(!filteredIrradiation.some(item => item.id === currFlt.selIrradiationValue.id) )) 
      updateCurrentFilter({ selIrradiationValue: null });
      //setselIrradiationValue(null);

    let ids_subst_form = tableDataSourceClass.filter(item => ((item.table_name === 'subst_form' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredSubstForm = tableSubstForm.filter(item => ((ids_subst_form.includes(item.id))) );
    settableSubstFormFiltered( filteredSubstForm ); 
      
    let ids_integral_period = tableDataSourceClass.filter(item => ((item.table_name === 'integral_period' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIntegralPeriod = tableIntegralPeriod.filter(item => ((ids_integral_period.includes(item.id))) );
    settableIntegralPeriodFiltered( filteredIntegralPeriod );       

    let ids_people_class = tableDataSourceClass.filter(item => ((item.table_name === 'people_class' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredPeopleClass = tablePeopleClass.filter(item => ((ids_people_class.includes(item.id))) );
    settablePeopleClassFiltered( filteredPeopleClass ); 

    let ids_agegroup = tableDataSourceClass.filter(item => ((item.table_name === 'agegroup' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredAgeGroup = tableAgeGroup.filter(item => ((ids_agegroup.includes(item.id))) );
    settableAgeGroupFiltered( filteredAgeGroup ); 

    let ids_organ = tableDataSourceClass.filter(item => ((item.table_name === 'organ' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredOrgan = tableOrgan.filter(item => ((ids_organ.includes(item.id))) );
    settableOrganFiltered( filteredOrgan );     
    
    let ids_isotope = tableDataSourceClass.filter(item => ((item.table_name === 'isotope' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIsotope = tableIsotope.filter(item => ((ids_isotope.includes(item.id))) );
    settableIsotopeFiltered( filteredIsotope ); 

    let ids_aerosol_sol = tableDataSourceClass.filter(item => ((item.table_name === 'aerosol_sol' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredAerosolSol = tableAerosolSol.filter(item => ((ids_aerosol_sol.includes(item.id))) );
    settableAerosolSolFiltered( filteredAerosolSol ); 

    let ids_let_level = tableDataSourceClass.filter(item => ((item.table_name === 'let_level' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredLetLevel = tableLetLevel.filter(item => ((ids_let_level.includes(item.id))) );
    settableLetLevelFiltered( filteredLetLevel ); 

    let ids_aerosol_amad = tableDataSourceClass.filter(item => ((item.table_name === 'aerosol_amad' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredAerosolAmad = tableAerosolAMAD.filter(item => ((ids_aerosol_amad.includes(item.id))) );
    settableAerosolAMADFiltered( filteredAerosolAmad ); 

    let ids_exp_scenario = tableDataSourceClass.filter(item => ((item.table_name === 'exp_scenario' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredExpScenario = tableExpScenario.filter(item => ((ids_exp_scenario.includes(item.id))) );
    settableExpScenarioFiltered( filteredExpScenario ); 
  }, [currFlt.selDataSourceValues, 
      currFlt.selDoseRatioValue, 
      currFlt.selIrradiationValue, 
      tableDataSourceClass, 
      tableDoseRatio, 
      tableIrradiation,
      tableIntegralPeriod,  
      tableIsotope, 
      tableSubstForm,
      tablePeopleClass,
      tableAgeGroup,
      tableOrgan,
      tableAerosolSol,
      tableLetLevel,
      tableAerosolAMAD,
      tableExpScenario
    ]);
 
  //обработчики автокомплитов
  const handleChangeDoseRatio =      (event, value) => { updateCurrentFilter({ selDoseRatioValue: value }); };
  const handleChangeOrgan =          (event, value) => { updateCurrentFilter({ selOrganValues: value }); }; 
  const handleChangeIrradiation =    (event, value) => { updateCurrentFilter({ selIrradiationValue: value }); }; 
  const handleChangeIsotope =        (event, value) => { updateCurrentFilter({ selIsotopeValues: value }); }; 
  const handleChangeIntegralPeriod = (event, value) => { updateCurrentFilter({ selIntegralPeriodValues: value }); };
  const handleChangeLetLevel =       (event, value) => { updateCurrentFilter({ selLetLevelValues: value }); };
  const handleChangeAgeGroup =       (event, value) => { updateCurrentFilter({ selAgeGroupValues: value }); }; 
  const handleChangeSubstForm =      (event, value) => { updateCurrentFilter({ selSubstFormValues: value }); };
  const handleChangeAerosolSol =     (event, value) => { updateCurrentFilter({ selAerosolSolValues: value }); }; 
  const handleChangeAerosolAMAD =    (event, value) => { updateCurrentFilter({ selAerosolAMADValues: value }); };
  const handleChangeExpScenario =    (event, value) => { updateCurrentFilter({ selExpScenarioValues: value }); };     
  const handleChangePeopleClass =    (event, value) => { updateCurrentFilter({ selPeopleClassValues: value }); };  

  // переменные, относящиеся к редактированию данных в таблице
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

  const handleRowClick = (params) => {
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

  // состояния Accordion-а
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  
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
    reloadData();     
   }
  }
  };  

  // загрузка справочников   
  useEffect( () => {
    async function fetchData() {
      await fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => setTableDataSource(data));
    }
    fetchData();
  },[]);

  useEffect(() => {
    const setFirst =  async () => { 
      if ((tableDataSource.length>0)) {
        updateCurrentFilter({ selDataSourceValues: [tableDataSource[0]] });
        //setselDataSourceValues([tableDataSource[0]]);
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

  const setFilters = async () => {

  }

    //загрузка данных в основную таблицу
    const reloadData = React.useCallback(async () =>  {
      setIsLoading(true);
      try {
        const  idsDS =  applFlt.selDataSourceValues.map(item => item.id).join(','); //список ids
        const  idsOrgan =  applFlt.selOrganValues.map(item => item.id).join(',');
        const  idsIrradiation = applFlt.selIrradiationValue?[applFlt.selIrradiationValue.id]:[]; //одно значение - поэтому приводим его к массиву []
        const  idsDoseRatio =  applFlt.selDoseRatioValue?[applFlt.selDoseRatioValue.id]:[]; 
        const  idsIsotope =  applFlt.selIsotopeValues.map(item => item.id).join(',');
        const  idsIntegralPeriod =  applFlt.selIntegralPeriodValues.map(item => item.id).join(',');
        const  idsLetLevel =  applFlt.selLetLevelValues.map(item => item.id).join(',');
        const  idsAgeGroup =  applFlt.selAgeGroupValues.map(item => item.id).join(',');
        const  idsSubstForm =  applFlt.selSubstFormValues.map(item => item.id).join(',');
        const  idsAerosolSol =  applFlt.selAerosolSolValues.map(item => item.id).join(',');
        const  idsAerosolAMAD =  applFlt.selAerosolAMADValues.map(item => item.id).join(',');
        const  idsExpScenario =  applFlt.selExpScenarioValues.map(item => item.id).join(',');
        const  idsPeopleClass =  applFlt.selPeopleClassValues.map(item => item.id).join(',');
  
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
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, [applFlt, pageState]);

  // Создаем эффект для вызова reloadData() при изменении состояния фильтра
useEffect(() => {
  const fetchData = async () => {
    try {
      await reloadData();
      setOpenAlert(true);
      setIsTableExpanded(true);
    } catch (e) {
      alertSeverity = "error";
      alertText = 'Ошибка при обновлении данных: ' + e.message;
      setOpenAlert(true);
    }
  }

  fetchData();
}, [applFlt, reloadData]); // Зависимость от состояния фильтра 

const reloadDataHandler = async () => {
  alertSeverity = "info";
  alertText = 'Данные успешно обновлены';

  try {
    await applyFilter();
  } catch (e) {
    alertSeverity = "error";
    alertText = 'Ошибка при обновлении данных: ' + e.message;
    setOpenAlert(true);
    return;
  }
  
  setIsFilterExpanded(false);
  setFilters();
}



  //pagination - динамическая подгрузка страниц, пока не используем, оставим на будущее
/*   useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
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
 */
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

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  function CustomToolbar1() {

    function formatFilterCaption(filterCaption) {
      let result = '';
      let isFirst = true;
    
      filterCaption.props.children.forEach((child) => {
        if (typeof child === 'string') {
          const text = child.trim();
          if (text !== '') {
            if (!isFirst) {
              result += '\n';
            }
            result += text;
            isFirst = false;
          }
        } else if (child.props && child.props.children) {
          const text = getTextFromComponent(child.props.children);
          if (text.trim() !== '') {
            if (!isFirst) {
              result += '\n';
            }
            result += text;
            isFirst = false;
          }
        }
      });
    
      return result;
    }
    
    function getTextFromComponent(component) {
      if (typeof component === 'string') {
        return component;
      }
    
      if (Array.isArray(component)) {
        let text = component.map(getTextFromComponent).join('');
        text = text.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with a single space and trim
        return text;
      }
    
      if (component.props && component.props.children) {
        return getTextFromComponent(component.props.children);
      }
    
      return '';
    }
    

    const handleExport = (options) => {
      const { delimiter, utf8WithBom, getRowsToExport } = options;
      const rows = getRowsToExport();//gridFilteredSortedRowIdsSelector(apiRef);
      //const visibleColumns = apiRef.current.getAllColumns().filter((column) => column.isVisible());
      
      /* const visibleColumns = apiRef.current.getAllColumns().filter(
        (column) => apiRef.current.getColumnState(column.field).hide !== true
      ); */
      const visibleColumns = apiRef.current.getVisibleColumns();
      const columnNames = visibleColumns.map((column) => column.headerName);
      const columnHeaders = columnNames.map((name) => `"${name}"`).join(delimiter);
    
      if (!Array.isArray(rows) || rows.length === 0) {
        console.error('No rows to export.');
        return;
      }
      
      const filterCaption = GetFilterCaption();
      console.log(filterCaption);
      const csvFilterCaption = formatFilterCaption(filterCaption);
      console.log(csvFilterCaption);
      const customText = csvFilterCaption; //filterCaption ? renderToString(filterCaption) : ''; //csvFilterCaption; // Add your custom text here
      
      const dataToExport = rows.map((row) => {
        const rowData = tableValueIntDose.find((item) => item.id === row);
        if (rowData) {
          const valuesToExport = visibleColumns.map((column) => rowData[column.field]);
          const sanitizedValues = valuesToExport.map((cell) => {
            return cell !== null && cell !== undefined ? `"${cell}"` : '""';
          });
          return sanitizedValues.join(delimiter);
        }
        return '';
      });
      
      const csvContent = [customText, columnHeaders, ...dataToExport].join('\n');
      const csvData = utf8WithBom ? '\uFEFF' + csvContent : csvContent;
      
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', table_names[props.table_name]+'.csv'); //filename: table_names[props.table_name],
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

/*     const handleExport = (options) => {
      const { delimiter, utf8WithBom, getRowsToExport } = options;
      const rows = gridFilteredSortedRowIdsSelector(apiRef); 
      console.log(rows);
      if (!Array.isArray(rows) || rows.length === 0) {
        console.error('No rows to export.');
        return;
      }
      const customText = "Русский текст"; // Add your custom text here
      const dataToExport = rows.map((row) => {
      const rowData = tableValueIntDose.find((item) => item.id === row);
        if (rowData) {
          return Object.values(rowData).map((cell) => `"${cell}"`).join(delimiter);
        }
        return '';
      });
      const csvContent = [customText, ...dataToExport].join('\n');
      const blob = new Blob(["\uFEFF"+csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
     */

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
        <IconButton onClick={()=>reloadData()} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>

{/*          <IconButton onClick={()=>handleExport({ delimiter: ';', getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef) })} color="primary" 
            size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>   
 */}
          <IconButton
            onClick={() =>
              handleExport({
                delimiter: ';',
                utf8WithBom: true,
                getRowsToExport: () => gridFilteredSortedRowIdsSelector(apiRef),
              })
            }
            color="primary"
            size="small"
            title="Сохранить в формате CSV"
          >
            <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox />
          </IconButton>          
      </GridToolbarContainer>
    );
  }

  function GetFilterCaption() { //формирование заголовка выбранных фильтров для использования в аккордеоне
    const dataSourceValues = applFlt.selDataSourceValues.slice(0, 7); // Extract the first 7 records
    const hasMoreRowsDataSource = applFlt.selDataSourceValues.length > 7;
    const isotopeValues = applFlt.selIsotopeValues.slice(0, 7); 
    const hasMoreRowsIsotope = applFlt.selIsotopeValues.length > 7;
    const organValues = applFlt.selOrganValues.slice(0, 7); 
    const hasMoreRowsOrgan = applFlt.selOrganValues.length > 7;

    return (
      <>
        {dataSourceValues.length > 0 && (
          <>
            Источники данных: {dataSourceValues.map((value) => value.title).join(", ")}
            {hasMoreRowsDataSource && "..."}
            <br />
          </>
        )}

{/*         {applFlt.selDoseRatioValue&&applFlt.selDoseRatioValue.title? (<>Параметр: {applFlt.selDoseRatioValue.title}<br /></>) : '' }
 */}
        {organValues.length > 0 && [2, 8].includes(applFlt.selDoseRatioValue.id) && applFlt.selDataSourceValues.length && (
          <>
            Органы и ткани: {organValues.map((value) => value.name_rus).join(", ")}
            {hasMoreRowsOrgan && "..."}
            <br />
          </>
        )}

        {!((!applFlt.selDataSourceValues.length)||(!applFlt.selDoseRatioValue)||(![8].includes(applFlt.selDoseRatioValue.id)))&&(applFlt.selLetLevelValues.length > 0) ? 
          (<>Уровни ЛПЭ: {applFlt.selLetLevelValues.map(value => value.name_rus).join(', ')}<br /></>) : ''}

        {applFlt.selIrradiationValue&&applFlt.selIrradiationValue.name_rus? (<>Тип облучения: {applFlt.selIrradiationValue.name_rus}<br /></>) : '' }

        {!((!applFlt.selDataSourceValues.length) || (!applFlt.selIrradiationValue) || (applFlt.selIrradiationValue.id!==2))&&(applFlt.selSubstFormValues.length > 0) ? 
          (<>Формы вещества: {applFlt.selSubstFormValues.map(value => value.name_rus).join(', ')}<br /></>) : ''}

        {!((!applFlt.selDataSourceValues.length) || (!applFlt.selIrradiationValue) || (applFlt.selIrradiationValue.id!==2))&&
         !((applFlt.selSubstFormValues.filter((row) => [162].includes(row.id))).length===0)&& 
          (applFlt.selAerosolSolValues.length > 0) ? 
          (<>Типы растворимости аэрозолей: {applFlt.selAerosolSolValues.map(value => value.name_rus).join(', ')}<br /></>) : ''}

        {!((!applFlt.selDataSourceValues.length) || (!applFlt.selIrradiationValue) || (applFlt.selIrradiationValue.id!==2))&&
         !((applFlt.selSubstFormValues.filter((row) => [162].includes(row.id))).length===0)&& 
          (applFlt.selAerosolAMADValues.length > 0) ? 
          (<>AMAD аэрозолей: {applFlt.selAerosolAMADValues.map(value => value.name_rus).join(', ')}<br /></>) : ''}

        {applFlt.selPeopleClassValues.length > 0? (<>Типы облучаемых лиц: {applFlt.selPeopleClassValues.map(value => value.name_rus).join(', ')}<br /></>) : '' }
       
        {!( (!applFlt.selDataSourceValues.length) || ((applFlt.selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) )&&
        (applFlt.selAgeGroupValues.length > 0)? (<>Возрастные группы населения: {applFlt.selAgeGroupValues.map(value => value.name_rus).join(', ')}<br /></>) : '' }
 
        {!( (!applFlt.selDataSourceValues.length) || ((applFlt.selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) )&&
        (applFlt.selExpScenarioValues.length > 0)? (<>Сценарии поступления: {applFlt.selExpScenarioValues.map(value => value.name_rus).join(', ')}<br /></>) : '' }

        {isotopeValues.length > 0 && (
          <>
            Нуклиды: {isotopeValues.map((value) => value.title).join(", ")}
            {hasMoreRowsIsotope && "..."}
            <br />
          </>
        )}

        {applFlt.selIntegralPeriodValues.length > 0? (<>Периоды интегрирования: {applFlt.selIntegralPeriodValues.map(value => value.name_rus).join(', ')}<br /></>) : '' }
      </>  
    );
  }

  const formRef = React.useRef();

  // основной генератор страницы
  return (
    <div>
    <form ref={formRef}>  
      {/* аккордеон по страницам */} 
      <Accordion expanded={isFilterExpanded} onChange={() => setIsFilterExpanded(!isFilterExpanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography variant="body2">{table_names['value_int_dose']}. Фильтр</Typography>
        </AccordionSummary>

        <AccordionDetails>
        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td width={548}>
            <Autocomplete
            size="small"
            limitTags={10}
            value={currFlt.selDataSourceValues}
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
              <TextField {...params} label="Источники данных" placeholder="Источники данных" required/>
            )}
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>{/* setselDataSourceValues(tableDataSource); */ updateCurrentFilter({ selDataSourceValues: tableDataSource });}
            
            } color="primary" size="small" title="Выбрать все">
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
            value={currFlt.selDoseRatioValue}
            onChange={handleChangeDoseRatio}
            id="autocomplete-dose_ratio"
            options={ tableDoseRatioFiltered.filter((row) => [1, 2, 8].includes(row.id)) }
            getOptionLabel={(option) => option.title?option.title:''} 
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableDoseRatioFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Параметр" placeholder="Параметр" required/>;
            }}            
          />
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>

          {
          
          !((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(![2, 8].includes(currFlt.selDoseRatioValue.id)))
          &&
          (    
            <td width={548}>      
            <Autocomplete
            size="small"
            limitTags={7}
            value={currFlt.selOrganValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeOrgan}
            multiple
            id="autocomplete-organ"
            options={tableOrganFiltered}
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableOrganFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Органы и ткани" placeholder="Органы и ткани" />;
            }}            
            /> 
            </td>
          )}
          {!((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(![2, 8].includes(currFlt.selDoseRatioValue.id)))&&(    
            <td>
              &nbsp;&nbsp;
            </td>
          )}
          {!((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(![2, 8].includes(currFlt.selDoseRatioValue.id)))&&(    
            <td>        
              <IconButton onClick={()=>updateCurrentFilter({ selOrganValues: tableOrganFiltered }) } color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
          )}
          {!((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(![2, 8].includes(currFlt.selDoseRatioValue.id)))&&(    
            <td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>
          )}
 
          {!((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(![8].includes(currFlt.selDoseRatioValue.id)) ) && (
            <td width={348}> 
            <Autocomplete
            size="small"
            limitTags={7}
            value={currFlt.selLetLevelValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeLetLevel}
            multiple
            id="autocomplete-let_level"
            options={tableLetLevelFiltered}
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableLetLevelFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Уровни ЛПЭ" placeholder="Уровни ЛПЭ" />;
            }}                 
            />  
            </td>
          )}

          {!((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(![8].includes(currFlt.selDoseRatioValue.id)) ) && (
            <td>
              &nbsp;&nbsp;
            </td>
          )}
          {!((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(![8].includes(currFlt.selDoseRatioValue.id)) ) && (
            <td>        
              <IconButton onClick={()=>updateCurrentFilter({ selLetLevelValues: tableLetLevelFiltered }) } color="primary" size="small" title="Выбрать все">
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
            value={currFlt.selIrradiationValue}
            onChange={handleChangeIrradiation}
            //multiple
            id="autocomplete-irradiation"
            options={tableIrradiationFiltered.filter((row) => [2,6, 30319, 30316].includes(row.id)) }
            getOptionLabel={(option) => option.name_rus?option.name_rus:''}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableIrradiationFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Тип облучения" placeholder="Тип облучения" required/>;
            }}                 
          />          
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>

          {!( (!currFlt.selDataSourceValues.length) || (!currFlt.selIrradiationValue) || (currFlt.selIrradiationValue.id!==2) ) && (
            <> 
            <td width={300}>      
              <Autocomplete
              size="small"
              value={currFlt.selSubstFormValues}
              onChange={handleChangeSubstForm}
              multiple
              id="autocomplete-subst_form"
              options={tableSubstFormFiltered}
              disabled={  (!currFlt.selDataSourceValues.length) || (!currFlt.selIrradiationValue) || (currFlt.selIrradiationValue.id!==2)}          
              getOptionLabel={(option) => option.name_rus}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                  {option.name_rus}
                </li>
              )}
              renderInput={(params) => {
                const inputProps = {
                  ...params.inputProps,
                  value: tableSubstFormFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
                };
                return <TextField {...params} inputProps={inputProps} label="Формы вещества" placeholder="Формы вещества" />;
              }}    
              />
            </td>          
            <td>
              &nbsp;&nbsp;
            </td>
            <td>        
              <IconButton onClick={()=> updateCurrentFilter({ selOrganValues: tableSubstFormFiltered }) } color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
            <td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>

          {!( (!currFlt.selDataSourceValues.length) ||  ((currFlt.selSubstFormValues.filter((row) => [162].includes(row.id))).length===0) ) && (
          <>  
          <td width={300}>      
            <Autocomplete
            size="small"
            value={currFlt.selAerosolSolValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeAerosolSol}
            multiple
            id="autocomplete-aerosol_sol"
            options={tableAerosolSolFiltered}
            disabled={  (!currFlt.selDataSourceValues.length) ||  
                ((currFlt.selSubstFormValues.filter((row) => [162].includes(row.id))).length===0) 
            }          
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableAerosolSolFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Типы растворимости аэрозолей" placeholder="Типы растворимости аэрозолей" />;
            }}
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick= {()=>updateCurrentFilter({ selAerosolSolValues: tableAerosolSolFiltered }) }
              color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          <td width={300}>      
            <Autocomplete
            size="small"
            value={currFlt.selAerosolAMADValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            limitTags={7}
            onChange={handleChangeAerosolAMAD}
            multiple
            id="autocomplete-aerosol_amad"
            options={tableAerosolAMADFiltered}
            disabled={  (!currFlt.selDataSourceValues.length) ||  
                ((currFlt.selSubstFormValues.filter((row) => [162].includes(row.id))).length===0) 
            }          
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableAerosolAMADFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="AMAD аэрозолей" placeholder="AMAD аэрозолей" />;
            }}    
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td> 
            <IconButton onClick= {()=>updateCurrentFilter({ selAerosolAMADValues: tableAerosolAMADFiltered }) }
              color="primary" size="small" title="Выбрать все">
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
            value={currFlt.selPeopleClassValues}
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
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tablePeopleClassFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Типы облучаемых лиц" placeholder="Типы облучаемых лиц" />;
            }}             
            />          
            </td>
            <td>
              &nbsp;&nbsp;
            </td>
            <td>        
              <IconButton onClick={()=>updateCurrentFilter({ selPeopleClassValues: tablePeopleClassFiltered })} color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
            <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>

          {!( (!currFlt.selDataSourceValues.length) || ((currFlt.selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) ) && (
          < >
          <td width={348}>      
            <Autocomplete
            size="small"
            value={currFlt.selAgeGroupValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeAgeGroup}
            multiple
            id="autocomplete-age_group"
            disabled={(!currFlt.selDataSourceValues.length) || ((currFlt.selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) }              
            options={tableAgeGroupFiltered}
            getOptionLabel ={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableAgeGroupFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Возрастные группы населения" placeholder="Возрастные группы населения" />;
            }}             

/*             renderInput={(params) => (
              <TextField {...params} label="Возрастные группы населения" placeholder="Возрастные группы населения" />
            )} */
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick=
            {()=>updateCurrentFilter({ selAgeGroupValues: tableAgeGroupFiltered }) }
            /* {()=>setselAgeGroupValues(tableAgeGroup)} */ color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          </ >
          )}

          {!((!currFlt.selDataSourceValues.length) || ((currFlt.selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) ) && (
          <td width={348}>      
            <Autocomplete
            size="small"
            value={currFlt.selExpScenarioValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeExpScenario}
            multiple
            id="autocomplete-aerosol_amad"
            options={tableExpScenarioFiltered}
            disabled={ (!currFlt.selDataSourceValues.length) || ((currFlt.selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) }              
            getOptionLabel ={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableExpScenarioFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Сценарии поступления" placeholder="Сценарии поступления" />;
            }}             
/* 
            renderInput={(params) => (
              <TextField {...params} label="Сценарии поступления" placeholder="Сценарии поступления" />
            )} */
            />
          </td>
          )} 

          {!((!currFlt.selDataSourceValues.length) ||  ((currFlt.selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0)  ) && (   
          <td>
            &nbsp;&nbsp;
          </td>
          )}
          
          {!((!currFlt.selDataSourceValues.length) ||  ((currFlt.selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0)  ) && (   
          <td>     
            <IconButton onClick=
              {()=>updateCurrentFilter({ selExpScenarioValues: tableExpScenarioFiltered }) }
                color="primary" size="small" title="Выбрать все">
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
              value={currFlt.selIsotopeValues}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={handleChangeIsotope}
              multiple
              limitTags={7}
              id="autocomplete-isotope"
              options={tableIsotopeFiltered}
              getOptionLabel={(option) => option.title}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                  {option.title}
                </li>
              )}
              renderInput={(params) => {
                const inputProps = {
                  ...params.inputProps,
                  value: tableIsotopeFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
                };
                return <TextField {...params} inputProps={inputProps} label="Нуклиды" placeholder="Нуклиды" />;
              }}  
/*               renderInput={(params) => (
                <TextField {...params} label="Нуклиды" placeholder="Нуклиды" />
              )} */
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=> updateCurrentFilter({ selIsotopeValues: tableIsotopeFiltered })} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
           <td width={348}>      
            <Autocomplete
            size="small"
            value={currFlt.selIntegralPeriodValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeIntegralPeriod}
            multiple
            limitTags={7}
            id="autocomplete-integral"
            options={tableIntegralPeriodFiltered}
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                {option.name_rus}
              </li>
            )}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableIntegralPeriodFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Периоды интегрирования" placeholder="Периоды интегрирования" />;
            }}              
/*             renderInput={(params) => (
              <TextField {...params} label="Периоды интегрирования" placeholder="Периоды интегрирования" />
            )} */
          />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={ ()=> updateCurrentFilter({ selIntegralPeriodValues: tableIntegralPeriodFiltered })
              } color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          </tr>
          </tbody>
        </table>
        <p></p>  

        <IconButton onClick={()=>reloadDataHandler()} color="primary" size="small" 
          disabled={ (!currFlt.selDataSourceValues.length/* ||!selDoseRatioValue||!currFlt.selIrradiationValue||!selPeopleClassValues.length */) } 
          title="Получить данные">

          <SvgIcon fontSize="small" component={ArrowAltDownIcon} inheritViewBox /></IconButton>

        </AccordionDetails>
      </Accordion>

      <Accordion expanded={isTableExpanded}  onChange={() => {setIsTableExpanded(!isTableExpanded); }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography variant="body2">Таблица значений<br/> {GetFilterCaption()}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <table border = "0" style={{  height: 410,  width: 1500 }} >
          <tbody>
            <tr>
              <td style={{ /* height: 840, */ verticalAlign: 'top' }}>
              <div style={{ height: 390 }} > 
              
              <DataGrid
                  style={{  width: 1500 }}
                  components={{ Toolbar: CustomToolbar1 }}
                  hideFooterSelectedRowCount={true}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                  rowHeight={25}
                  loading={isLoading}
                  rows={tableValueIntDose}
                  columns={columnsValueIntDose}
                  apiRef={apiRef}
                  onSelectionModelChange={(newSelectionModel) => {
                    setselectionModel(newSelectionModel);
                  }}
                  selectionModel={selectionModel}        
                  initialState={{
                    columns: {
                      //data_source_title: { hidden: true },
                       columnVisibilityModel: {
                        updatetime: false,
                        external_ds: false,
                        descr: false,
                      },
                    },
                  }}    
                  columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    data_source_title: applFlt.selDataSourceValues.length!==1,
                    dose_ratio_title: false,
                    irradiation_name_rus: false,
                    people_class_name_rus: people_class_name_rus_visible, // applFlt.selPeopleClassValues.length!==1,
                    organ_name_rus: organ_name_rus_visible, //applFlt.selOrganValues.length!==1, //) && ([2, 8].includes(applFlt.selDoseRatioValue.id)),
                    agegroup_name_rus: agegroup_name_rus_visible, //applFlt.selAgeGroupValues.length!==1,
                    let_level_name_rus: let_level_name_rus_visible, //applFlt.selLetLevelValues.length!==1,
                    subst_form_name_rus: subst_form_name_rus_visible, //applFlt.selSubstFormValues.length!==1,
                    aerosol_sol_name_rus: aerosol_sol_name_rus_visible, //applFlt.selAerosolSolValues.length!==1,
                    aerosol_amad_name_rus: aerosol_amad_name_rus_visible, //applFlt.selAerosolAMADValues.length!==1,
                    exp_scenario_name_rus: exp_scenario_name_rus_visible,//applFlt.selExpScenarioValues.length!==1,
                    chem_comp_group_name_rus: true, //applFlt.selExpScenarioValues.length!==1,
                    isotope_title: isotope_title_visible,//: applFlt.selIsotopeValues.length!==1,
                    integral_period_name_rus: integral_period_name_rus_visible, //applFlt.selIntegralPeriodValues.length!==1,
                    updatetime: false,
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
{/*         {(isLoading) && 
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop> }  */}

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
            disabled={ (!currFlt.selDataSourceValues.length) }
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
            disabled={ (!currFlt.selDataSourceValues.length) }
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
            disabled={ (!currFlt.selDataSourceValues.length) }
            value={tableIsotopeFiltered.find((option) => option.id === valueIsotopeID)  }
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
            disabled={ (!currFlt.selDataSourceValues.length) }
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
            disabled={ (!currFlt.selDataSourceValues.length) }
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
            disabled={ (!currFlt.selDataSourceValues.length) }
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
            disabled={ (!currFlt.selDataSourceValues.length) }
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
