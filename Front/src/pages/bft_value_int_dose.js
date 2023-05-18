// Big f....g table VALUE_INT_DOSE
import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  //useGridApiContext,
  //gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
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
//import DialogContentText from '@mui/material/DialogContentTecxt';
//import { FormControl } from "@mui/material";
//import { InputLabel } from "@mui/material";
//import { Select } from "@mui/material";
//import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
//import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
/* import { table_names } from './sda_types';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material"; */

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

let alertText = "Сообщение";
let alertSeverity = "info";

const BigTableValueIntDose = (props) => {
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
    { field: 'chem_comp_gr_name_rus', headerName: 'Химические соединения (группа)', width: 200 },    
   ]

  //состояние загрузки таблицы для отображения крутилки
  const [isLoading, setIsLoading] = React.useState(false);

  //состояние открытой панельки алерта-уведомления
  const [openAlert, setOpenAlert] = React.useState(false, '');

  // значения, выбранные в автокомплитах
  // const [selDataSourceValues, setselDataSourceValues] = useState([]);
  const [selOrganValues, setselOrganValues] = useState([]);
  const [selIrradiationValue, setselIrradiationValue] = useState(null);
  const [selIsotopeValues, setselIsotopeValues] = useState([]);
  const [selIntegralPeriodValues, setselIntegralPeriodValues] = useState([]);
  //const [selDoseRatioValue, setselDoseRatioValue] = useState(null);
  const [selLetLevelValues, setselLetLevelValues] = useState([]);
  const [selAgeGroupValues, setselAgeGroupValues] = useState([]);
  const [selSubstFormValues, setselSubstFormValues] = useState([]);
  const [selAerosolSolValues, setselAerosolSolValues] = useState([]);
  const [selAerosolAMADValues, setselAerosolAMADValues] = useState([]);
  const [selExpScenarioValues, setselExpScenarioValues] = useState([]);
  const [selPeopleClassValues, setselPeopleClassValues] = useState([]);

  const [currFlt, setCurrFlt] = useState({
    selDataSourceValues: [],
    selDoseRatioValue: null,
    selOrganValues1: [],
    selIrradiationValue1: null,
    // ... остальные значения фильтра
  });

  //примененный фильтр
  const [applFlt, setApplFlt] = useState({
    selDataSourceValues: [],
    selDoseRatioValue: null,
    selOrganValues1: [],
    selIrradiationValue1: null,
    // ... остальные значения фильтра
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
  // eslint-disable-next-line no-unused-vars
  const [tableOrganFiltered, settableOrganFiltered] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tableIrradiation, setTableIrradiation] = useState([]);
  // eslint-disable-next-line no-unused-vars  
  const [tableIrradiationFiltered, settableIrradiationFiltered] = useState([]);  
  
  const [tableIsotope, setTableIsotope] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tableIsotopeFiltered, settableIsotopeFiltered] = useState([]);

  const [tableIntegralPeriod, setTableIntegralPeriod] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tableIntegralPeriodFiltered, settableIntegralPeriodFiltered] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tableDoseRatio, setTableDoseRatio] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tableDoseRatioFiltered, settableDoseRatioFiltered] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tableAgeGroup, setTableAgeGroup] = useState([]); //возрастные группы населения
  // eslint-disable-next-line no-unused-vars  
  const [tableAgeGroupFiltered, settableAgeGroupFiltered] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tableSubstForm, setTableSubstForm] = useState([]); //формы вещества
  // eslint-disable-next-line no-unused-vars  
  const [tableSubstFormFiltered, settableSubstFormFiltered] = useState([]);
  // eslint-disable-next-line no-unused-vars  
  const [tableAerosolSol, setTableAerosolSol] = useState([]);  
  // eslint-disable-next-line no-unused-vars  
  const [tableAerosolSolFiltered, settableAerosolSolFiltered] = useState([]);  
  // eslint-disable-next-line no-unused-vars  
  const [tableLetLevel, setTableLetLevel] = useState([]); //уровни ЛПЭ
  // eslint-disable-next-line no-unused-vars  
  const [tableLetLevelFiltered, settableLetLevelFiltered] = useState([]); //уровни ЛПЭ
  // eslint-disable-next-line no-unused-vars  
  const [tableAerosolAMAD, setTableAerosolAMAD] = useState([]); //АМАД аэрозолей
  // eslint-disable-next-line no-unused-vars  
  const [tableAerosolAMADFiltered, settableAerosolAMADFiltered] = useState([]); //АМАД аэрозолей
  // eslint-disable-next-line no-unused-vars  
  const [tableExpScenario, setTableExpScenario] = useState([]); //Сценарии поступления
  // eslint-disable-next-line no-unused-vars  
  const [tableExpScenarioFiltered, settableExpScenarioFiltered] = useState([]); //Сценарии поступления
  // eslint-disable-next-line no-unused-vars  
  const [tablePeopleClass, setTablePeopleClass] = useState([]); //Типы облучаемых лиц
  // eslint-disable-next-line no-unused-vars  
  const [tablePeopleClassFiltered, settablePeopleClassFiltered] = useState([]); //Типы облучаемых лиц  

  const [tableValueIntDose, setTableValueIntDose] = useState([]); 
  const [selectionModel, setselectionModel] = React.useState([]);
  const [tableDataSourceClass, setTableDataSourceClass] = useState([]);
  
  const handleChangeDataSource = (event, value) => {
    updateCurrentFilter({ selDataSourceValues: value });
    //setselDataSourceValues(value);
  };

  //фильтрация списков фильтров в зависимости от выбранного источника (источников) данных
    useEffect(() => {
    let ids = currFlt.selDataSourceValues.map(item => item.id);
    const filters = [
        {table: 'dose_ratio', source: 'tableDoseRatio', filter: 'tableDoseRatioFiltered', item: 'currFlt.selDoseRatioValue', setsel: null},
        {table: 'irradiation', source: 'tableIrradiation', filter: 'tableIrradiationFiltered', item: 'selIrradiationValue', setsel: null},
        {table: 'subst_form', source: 'tableSubstForm', filter: 'tableSubstFormFiltered', item: null, setsel: 'selSubstFormValues'},
        {table: 'integral_period', source: 'tableIntegralPeriod', filter: 'tableIntegralPeriodFiltered', item: null, setsel: 'selIntegralPeriodValues'},
        {table: 'people_class', source: 'tablePeopleClass', filter: 'tablePeopleClassFiltered', item: null, setsel: 'selPeopleClassValues'},
        {table: 'agegroup', source: 'tableAgeGroup', filter: 'tableAgeGroupFiltered', item: null, setsel: 'selAgeGroupValues'},
        {table: 'organ', source: 'tableOrgan', filter: 'tableOrganFiltered', item: null, setsel: 'selOrganValues'},
        {table: 'isotope', source: 'tableIsotope', filter: 'tableIsotopeFiltered', item: null, setsel: 'selIsotopeValues'},
        {table: 'aerosol_sol', source: 'tableAerosolSol', filter: 'tableAerosolSolFiltered', item: null, setsel: 'selAerosolSolValues'},
        {table: 'let_level', source: 'tableLetLevel', filter: 'tableLetLevelFiltered', item: null, setsel: 'selLetLevelValues'},
        {table: 'aerosol_amad', source: 'tableAerosolAMAD', filter: 'tableAerosolAMADFiltered', item: null, setsel: 'selAerosolAMADValues'},
        {table: 'exp_scenario', source: 'tableExpScenario', filter: 'tableExpScenarioFiltered', item: null, setsel: 'selExpScenarioValues'},
    ];

    filters.forEach(filter => {
        //взяли айди выбранных источников данных
        let ids_table = tableDataSourceClass.filter(item => ((item.table_name === filter.table )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
        /* eslint-disable no-eval */
        let filteredTable = eval(filter.source).filter(item => ((ids_table.includes(item.id))) ); //отфильтровали table.id для выбранных источников данных, чтобы отфильтровать его автокомплит
        if (filter.item && filteredTable && eval(filter.item) && !filteredTable.some(item => item.id === eval(filter.item).id)) {
            eval(`set${filter.item}(null)`); // если отфильтрованная таблица не содержит значение, выбранное в выпадающем списке
        }
        if (filter.setsel && eval(filter.setsel)) {
          eval(`set${filter.setsel}(${filter.setsel}.filter(item => filteredTable.some(filteredItem => filteredItem.id === item.id)))`); 
        }
      eval(`set${filter.filter}(filteredTable)`); 
        /* eslint-enable no-eval */
    });
  }, [currFlt.selDataSourceValues, tableDataSourceClass]);

  useEffect(() => {
    setselPeopleClassValues((prevValues) => {
      // Фильтруем значения в prevValues, чтобы оставить только те,
      // которые есть в tablePeopleClassFiltered
      return prevValues.filter((val) =>
        tablePeopleClassFiltered.find((opt) => opt.id === val.id)
      );
    });
  }, [tablePeopleClassFiltered]);     

  //обработчики автокомплитов
  const handleChangeDoseRatio = (event, value) => { updateCurrentFilter({ selDoseRatioValue: value });/*  setselDoseRatioValue(value); */ };
  const handleChangeOrgan = (event, value) => { setselOrganValues(value); };
  const handleChangeIrradiation = (event, value) => { setselIrradiationValue(value); };
  const handleChangeIsotope = (event, value) => { setselIsotopeValues(value); };
  const handleChangeIntegralPeriod = (event, value) => { setselIntegralPeriodValues(value); };
  const handleChangeLetLevel = (event, value) => { setselLetLevelValues(value); };
  const handleChangeAgeGroup = (event, value) => { setselAgeGroupValues(value); }; 
  const handleChangeSubstForm = (event, value) => { setselSubstFormValues(value); };   
  const handleChangeAerosolSol = (event, value) => { setselAerosolSolValues(value); }; 
  const handleChangeAerosolAMAD = (event, value) => { setselAerosolAMADValues(value); };
  const handleChangeExpScenario = (event, value) => { setselExpScenarioValues(value); };     
  const handleChangePeopleClass = (event, value) => { setselPeopleClassValues(value); };  

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

  // состояния Accordion-а
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

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

  const reloadDataHandler =  async () => {
    alertSeverity = "info";
    alertText =  'Данные успешно обновлены';
    applyFilter();
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
    setFilters();
  }

  //загрузка данных в основную таблицу
  const reloadData = async () => {
    setIsLoading(true);
    try {
      const  idsDS =  currFlt.selDataSourceValues.map(item => item.id).join(','); //список ids
      const  idsOrgan =  selOrganValues.map(item => item.id).join(',');
      const  idsIrradiation = selIrradiationValue?[selIrradiationValue.id]:[]; //одно значение - поэтому приводим его к массиву []
      const  idsIsotope =  selIsotopeValues.map(item => item.id).join(',');
      const  idsIntegralPeriod =  selIntegralPeriodValues.map(item => item.id).join(',');
      const  idsDoseRatio =  currFlt.selDoseRatioValue?[currFlt.selDoseRatioValue.id]:[]; //map(item => item.id).join(',');
      const  idsLetLevel =  selLetLevelValues.map(item => item.id).join(',');
      const  idsAgeGroup =  selAgeGroupValues.map(item => item.id).join(',');
      const  idsSubstForm =  selSubstFormValues.map(item => item.id).join(',');
      const  idsAerosolSol =  selAerosolSolValues.map(item => item.id).join(',');
      const  idsAerosolAMAD =  selAerosolAMADValues.map(item => item.id).join(',');
      const  idsExpScenario =  selExpScenarioValues.map(item => item.id).join(',');
      const  idsPeopleClass =  selPeopleClassValues.map(item => item.id).join(',');

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
  };

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

  function GetFilterCaption() { //формирование заголовка выбранных фильтров для использования в аккордеоне
    return (
      <>
        {applFlt.selDataSourceValues.length > 0 ? (<div>Источники данных: {applFlt.selDataSourceValues.map(value => value.title).join(', ')}<br /></div>) : ''}

        {applFlt.selDoseRatioValue&&applFlt.selDoseRatioValue.title? (<div>Параметр: {applFlt.selDoseRatioValue.title}<br /></div>) : '' }

        {!((!applFlt.selDataSourceValues.length)||(!applFlt.selDoseRatioValue)||(![2, 8].includes(applFlt.selDoseRatioValue.id)))&&(selOrganValues.length > 0) ? 
          (<div>Органы и ткани: {selOrganValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {!((!applFlt.selDataSourceValues.length)||(!applFlt.selDoseRatioValue)||(![8].includes(applFlt.selDoseRatioValue.id)))&&(selLetLevelValues.length > 0) ? 
          (<div>Уровни ЛПЭ: {selLetLevelValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {selIrradiationValue&&selIrradiationValue.name_rus? (<div>Тип облучения: {selIrradiationValue.name_rus}<br /></div>) : '' }

        {!((!applFlt.selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2))&&(selSubstFormValues.length > 0) ? 
          (<div>Формы вещества: {selSubstFormValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {!((!applFlt.selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2))&&
         !((selSubstFormValues.filter((row) => [162].includes(row.id))).length===0)&& 
          (selAerosolSolValues.length > 0) ? 
          (<div>Типы растворимости аэрозолей: {selAerosolSolValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {!((!applFlt.selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2))&&
         !((selSubstFormValues.filter((row) => [162].includes(row.id))).length===0)&& 
          (selAerosolAMADValues.length > 0) ? 
          (<div>AMAD аэрозолей: {selAerosolAMADValues.map(value => value.name_rus).join(', ')}<br /></div>) : ''}

        {selPeopleClassValues.length > 0? (<div>Типы облучаемых лиц: {selPeopleClassValues.map(value => value.name_rus).join(', ')}<br /></div>) : '' }
       
        {!( (!applFlt.selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) )&&
        (selAgeGroupValues.length > 0)? (<div>Возрастные группы населения: {selAgeGroupValues.map(value => value.name_rus).join(', ')}<br /></div>) : '' }
 
        {!( (!applFlt.selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) )&&
        (selExpScenarioValues.length > 0)? (<div>Сценарии поступления: {selExpScenarioValues.map(value => value.name_rus).join(', ')}<br /></div>) : '' }

        {selIsotopeValues.length > 0? (<div>Нуклиды: {selIsotopeValues.map(value => value.title).join(', ')}<br /></div>) : '' }
 
        {selIntegralPeriodValues.length > 0? (<div>Периоды интегрирования: {selIntegralPeriodValues.map(value => value.name_rus).join(', ')}<br /></div>) : '' }
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
          <Typography variant="body2">Фильтр</Typography>
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
              return <TextField {...params} inputProps={inputProps} label="Параметр" placeholder="Параметр" />;
            }}            
          />
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>

          {
          
          //!((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(![2, 8].includes(currFlt.selDoseRatioValue.id)))
          //&&
          (    
            <td width={548}>      
            <Autocomplete
            size="small"
            limitTags={7}
            value={selOrganValues}
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
              <IconButton onClick={()=>setselOrganValues(tableOrganFiltered)} color="primary" size="small" title="Выбрать все">
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
            value={selLetLevelValues}
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
              <IconButton onClick={()=>setselLetLevelValues(tableLetLevelFiltered)} color="primary" size="small" title="Выбрать все">
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
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableIrradiationFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Тип облучения" placeholder="Тип облучения" />;
            }}                 
          />          
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>

          {!( (!currFlt.selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2) ) && (
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            <> 
            
            <td width={300}>      
              <Autocomplete
              size="small"
              value={selSubstFormValues}
              onChange={handleChangeSubstForm}
              multiple
              id="autocomplete-subst_form"
              options={tableSubstFormFiltered}
              disabled={  (!currFlt.selDataSourceValues.length) || (!selIrradiationValue) || (selIrradiationValue.id!==2)}          
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
              <IconButton onClick={()=>setselSubstFormValues(tableSubstFormFiltered)} color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
            <td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>

          {!( (!currFlt.selDataSourceValues.length) ||  ((selSubstFormValues.filter((row) => [162].includes(row.id))).length===0) ) && (
          <>  
          <td width={300}>      
            <Autocomplete
            size="small"
            value={selAerosolSolValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeAerosolSol}
            multiple
            id="autocomplete-aerosol_sol"
            options={tableAerosolSolFiltered}
            disabled={  (!currFlt.selDataSourceValues.length) ||  
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
            <IconButton onClick={()=>setselAerosolSolValues(tableAerosolSolFiltered)} color="primary" size="small" title="Выбрать все">
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
            options={tableAerosolAMADFiltered}
            disabled={  (!currFlt.selDataSourceValues.length) ||  
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
            <IconButton onClick={()=>setselAerosolAMADValues(tableAerosolAMADFiltered)} color="primary" size="small" title="Выбрать все">
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
              <IconButton onClick={()=>setselPeopleClassValues(tablePeopleClassFiltered)} color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
            <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>

          {!( (!currFlt.selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) ) && (
          < >
          <td width={348}>      
            <Autocomplete
            size="small"
            value={selAgeGroupValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeAgeGroup}
            multiple
            id="autocomplete-age_group"
            disabled={(!currFlt.selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) }              
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
            <IconButton onClick={()=>setselAgeGroupValues(tableAgeGroup)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          </ >
          )}

          {!((!currFlt.selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) ) && (
          <td width={348}>      
            <Autocomplete
            size="small"
            value={selExpScenarioValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeExpScenario}
            multiple
            id="autocomplete-aerosol_amad"
            options={tableExpScenarioFiltered}
            disabled={ (!currFlt.selDataSourceValues.length) || ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) }              
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

          {!((!currFlt.selDataSourceValues.length) ||  ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0)  ) && (   
          <td>
            &nbsp;&nbsp;
          </td>
          )}
          
          {!((!currFlt.selDataSourceValues.length) ||  ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0)  ) && (   
          <td>     
            <IconButton onClick={()=>setselExpScenarioValues(tableExpScenarioFiltered)} color="primary" size="small" title="Выбрать все">
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
            <IconButton onClick={()=>setselIsotopeValues(tableIsotopeFiltered)} color="primary" size="small" title="Выбрать все">
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
            <IconButton onClick={()=>setselIntegralPeriodValues(tableIntegralPeriodFiltered)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          </tr>
          </tbody>
        </table>
        <p></p>  

        <IconButton onClick={()=>reloadDataHandler()} color="primary" size="small" 
          disabled={ (!currFlt.selDataSourceValues.length/* ||!selDoseRatioValue||!selIrradiationValue||!selPeopleClassValues.length */) } 
          title="Получить данные">

          <SvgIcon fontSize="small" component={ArrowAltDownIcon} inheritViewBox /></IconButton>

        </AccordionDetails>
      </Accordion>

      <Accordion expanded={isTableExpanded}  onChange={() => {setIsTableExpanded(!isTableExpanded); }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography variant="body2">Таблица значений {GetFilterCaption()}</Typography>
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
                  rows={tableValueIntDose} //
                  columns={columnsValueIntDose}
 
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
                    data_source_title: currFlt.selDataSourceValues.length!==1,
                    people_class_name_rus: selPeopleClassValues.length!==1,
                    isotope_title: setselIsotopeValues.length!==1
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
