/**
 * Модуль, предоставляющий интерфейс пользователя для работы с данными о дозах внутреннего облучения.
 * 
 * Этот модуль подразумевает использование API, реализованное в value_int_dose_queries.
 */

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
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { ReactComponent as CheckDoubleIcon } from "./../icons/check-double.svg";
import { ReactComponent as ArrowAltDownIcon } from "./../icons/arrow-alt-down.svg";
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import Autocomplete from '@mui/material/Autocomplete';
import { createFilterOptions } from "@mui/material/Autocomplete";
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { table_names } from './table_names';
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import Divider from '@mui/material/Divider';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
//import CustomAutocomplete from './../component/CustomAutocomplete';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

let alertText = "Сообщение";
let alertSeverity = "info";
const MAX_ROWS = 50000;

const BigTableValueIntDose = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const [tableValueIntDose, setTableValueIntDose] = useState([]); 
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [valueID, setValueID] = React.useState();
  const [valueIDInitial, setValueIDInitial] = React.useState();
  const [valueDoseRatioID, setValueDoseRatioID] = React.useState();
  const [valueIrradiationID, setValueIrradiationID] = React.useState();
  const [valuePeopleClassID, setValuePeopleClassID] = React.useState();
  const [valueSubstFormID, setValueSubstFormID] = React.useState();
  const [valueIsotopeID, setValueIsotopeID] = React.useState();
  const [valueIntegralPeriodID, setValueIntegralPeriodID] = React.useState();
  const [valueOrganID, setValueOrganID] = React.useState();
  const [valueLetLevelID, setValueLetLevelID] = React.useState();
  const [valueAgeGroupID, setValueAgeGroupID] = React.useState();
  const [valueExpScenarioID, setValueExpScenarioID] = React.useState();
  const [valueDataSourceID, setValueDataSourceID] = React.useState();
  const [valueDrValue, setValueDrValue] = React.useState();
  const [valueChemCompGrID, setValueChemCompGrID] = React.useState(null);

  const [valueAerosolSolID, setValueAerosolSolID] = React.useState();
  const [valueAerosolAMADID, setValueAerosolAMADID] = React.useState();
  const [valueUpdateTime, setValueUpdateTime] = React.useState();

  // состояния Accordion-а
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true); 

  //состояние загрузки таблицы для отображения крутилки - прогресса
  const [isLoading, setIsLoading] = React.useState(false);
  //состояние открытой панельки алерта-уведомления
  const [openAlert, setOpenAlert] = React.useState(false, '');
  
  const [lastOperationWasAdd, setLastOperationWasAdd] = useState(false);
  
  // создаем пользовательскую функцию фильтрации
  const filterOptions = createFilterOptions();

  const [pageState] = useState({
    page: 0,
    pageSize: 10,
    rows: [],
    rowCount: 0,
    isLoading: false
  });

  const handleRowClick = React.useCallback((params) => {
    setValueID(params.row.id);
    setValueIDInitial(params.row.id);
    setValueDoseRatioID(params.row.dose_ratio_id);
    setValuePeopleClassID(params.row.people_class_id);
    setValueIsotopeID(params.row.isotope_id);
    setValueIntegralPeriodID(params.row.integral_period_id);
    setValueOrganID(params.row.organ_id);
    setValueLetLevelID(params.row.let_level_id);
    setValueAgeGroupID(params.row.agegroup_id);
    setValueDataSourceID(params.row.data_source_id);
    setValueDrValue(params.row.dr_value);
    setValueChemCompGrID(params.row.chem_comp_gr_id);
    setValueSubstFormID(params.row.subst_form_id);
    setValueAerosolSolID(params.row.aerosol_sol_id);
    setValueAerosolAMADID(params.row.aerosol_amad_id);
    setValueExpScenarioID(params.row.exp_scenario_id);
    setValueIrradiationID(params.row.irradiation_id);
    setValueUpdateTime( formatDate(params.row.updatetime) ); 
    
    setOpenAlert(false); 
  }, [setValueID, setValueIDInitial, setValueDoseRatioID, setValuePeopleClassID, setValueIsotopeID, 
    setValueIntegralPeriodID, setValueOrganID, setValueLetLevelID, setValueAgeGroupID, 
    setValueDataSourceID, setValueDrValue, setValueChemCompGrID, setValueSubstFormID, setValueAerosolSolID, 
    setValueAerosolAMADID, setValueExpScenarioID, setValueIrradiationID, setValueUpdateTime]); 

  // Scrolling and positionning
  const { paginationModel, setPaginationModel, scrollToIndexRef } = useGridScrollPagination(apiRef, tableValueIntDose, setRowSelectionModel);

  /* const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 100,
    page: 0,
  });

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
      //console.log('pagee ',currentPage );
      setRowSelectionModel([v_id]); //это устанавливает фокус на выбранной строке (подсветка)
      setTimeout(function() {       //делаем таймаут в 0.1 секунды, иначе скроллинг тупит
        apiRef.current.scrollToIndexes({ rowIndex: index, colIndex: 0 });
      }, 100);
    }
  }, [apiRef, paginationModel, setRowSelectionModel]);

  const scrollToIndexRef = React.useRef(null); //тут хранится значение (айди) добавленной записи
  useEffect(() => {
    //событие, которое вызовет скроллинг грида после изменения данных в tableValueIntDose
    if (!scrollToIndexRef.current) return; //если значение не указано, то ничего не делаем
    if (scrollToIndexRef.current===-1) return;
    if (!isRecordAdded) return;
    //console.log('handleScrollToRow');
    handleScrollToRow(scrollToIndexRef.current);
    handleRowClick({ row: tableValueIntDose.find(row => row.id === scrollToIndexRef.current) });
    scrollToIndexRef.current = null; //обнуляем значение
    //console.log('setRecordAdded(false);');
    setRecordAdded(false); // Сбрасываем флаг после использования
    // eslint-disable-next-line
  }, [ scrollToIndexRef.current ]);

    // Для перемещения на нужную позицию после загрузки грида
    useEffect(() => { 
      if ((!isLoading) && (tableValueIntDose) && (tableValueIntDose.length)) {
        if (!scrollToIndexRef) 
        {
          scrollToIndexRef.current = tableValueIntDose[0].id;
          setRowSelectionModel([tableValueIntDose[0].id]);
          handleRowClick({ row: tableValueIntDose.find(row => row.id === scrollToIndexRef.current) });
        }
      }
    }, [ isLoading, tableValueIntDose, handleRowClick] );
  
 */


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
      valueGetter: (params) => formatDate(params.value)
    },    
    { field: 'irradiation_name_rus', headerName: 'Тип облучения', width: 200 },
    { field: 'dose_ratio_title', headerName: 'Параметр', width: 200 },
   ]

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

  //примененный setApplFlt - то, что применено к таблице
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
    setApplFlt(prevState => {
      // Копируем все свойства из currFlt
      let newState = {...currFlt};
      // Следующее сделано для того, чтобы невидимые (скрытые) контролы не попадали в примененный фильтр
      if (!organVisible) { newState.selOrganValues = []; } 
      if (!letLevelVisible) { newState.selLetLevelValues = []; } 
      if (!substFormVisible) { newState.selSubstFormValues = []; }
      if (!aerosolSolVisible) { newState.selAerosolSolValues = []; }
      if (!aerosolAmadVisible) { newState.selAerosolAMADValues = []; }
      if (!agegroupVisible) { newState.selAgeGroupValues = []; }
      if (!expScenarioVisible) { newState.selExpScenarioValues = []; } 
      // Возвращаем новый объект, который будет новым состоянием
      return newState;
    });
  };

  //массивы, содержащие данные для автокомплитов
  const [tableDataSource, setTableDataSource] = useState([]); 
  const [tableDataSourceFilteredEdit, settableDataSourceFilteredEdit] = useState([]); 
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
  //это только для добавления в автокомплит
  const [tableChemCompGr, setTableChemCompGr] = useState([]);  
  //const [tableValueRelation, setTableValueRelation] = useState([]); 
  const [tableIntDoseAttr, setTableIntDoseAttr] = useState([]); 
  
  const [selectionModel, setselectionModel] = React.useState([]);
  const [tableDataSourceClass, setTableDataSourceClass] = useState([]);

  const [searchValueNuclide, setSearchValueNuclide] = useState('');  
  const [searchValueDataSource, setSearchValueDataSource] = useState('');  
  const [searchValuePeopleClass, setSearchValuePeopleClass] = useState('');
  const [searchValueIntegralPeriod, setSearchValueIntegralPeriod] = useState('');
  const [searchValueOrgan, setSearchValueOrgan] = useState('');
  const [searchValueSubstForm, setSearchValueSubstForm] = useState('');
  const [searchValueAerosolSol, setSearchValueAerosolSol] = useState('');
  const [searchValueAerosolAMAD, setSearchValueAerosolAMAD] = useState('');
  const [searchValueExpScenario, setSearchValueExpScenario] = useState('');
  const [searchValueLetLevel, setSearchValueLetLevel] = useState('');
  const [searchValueAgeGroup, setSearchValueAgeGroup] = useState('');
  
  // Состояния, определяющие видимость выпадающих списков
  const [organVisible, setOrganVisible] = useState(false);
  const [substFormVisible, setSubstFormVisible] = useState(false);
  const [aerosolSolVisible, setAerosolSolVisible] = useState(false);
  const [aerosolAmadVisible, setAerosolAmadVisible] = useState(false);
  const [letLevelVisible, setLetLevelVisible] = useState(false);
  const [agegroupVisible, setAgegroupVisible] = useState(false);
  const [expScenarioVisible, setExpScenarioVisible] = useState(false);
 
  useEffect(() => { 
    let isOrganVisible = false;
    let isLetLevelVisible = false;
    // Проверяем, есть ли у currFlt.selDoseRatioValue свойство id
    if (currFlt.selDoseRatioValue && currFlt.selDoseRatioValue.hasOwnProperty('id')) {
      // Используем .some() для проверки наличия удовлетворяющей строки в массиве
      isOrganVisible = tableIntDoseAttr.some(item => item.dose_ratio_id === currFlt.selDoseRatioValue.id  && item.organ_id >= 0 );
      isLetLevelVisible = tableIntDoseAttr.some(item => item.dose_ratio_id === currFlt.selDoseRatioValue.id  && item.let_level_id >= 0 );
    }
    // Используем результат для установки видимости
    setOrganVisible(isOrganVisible);
    setLetLevelVisible(isLetLevelVisible);
    if (!isOrganVisible)
      updateCurrentFilter({ selOrganValues: [] }); 
    if (!isLetLevelVisible)
      updateCurrentFilter({ isLetLevelVisible: [] });       
  }, [ tableIntDoseAttr, currFlt.selDoseRatioValue ] );


  useEffect(() => { 
    let isSubstFormVisible = false;
    if (currFlt.selIrradiationValue && currFlt.selIrradiationValue.hasOwnProperty('id') ) {
      tableIntDoseAttr.forEach(item => {
        const match = item.irradiation_id === currFlt.selIrradiationValue.id;
        if(match){
          if(item.subst_form_id >= 0) isSubstFormVisible = true;
        }
      });
    }
    setSubstFormVisible(isSubstFormVisible);
    if (!isSubstFormVisible)
      updateCurrentFilter({ selSubstFormValues: [] }); 
  }, [ tableIntDoseAttr, currFlt.selIrradiationValue ]);

  useEffect(() => { 
    let isAerosolSolVisible = false;
    let isAerosolAmadVisible = false;
    if (currFlt.selSubstFormValues && currFlt.selSubstFormValues.length > 0) {
      tableIntDoseAttr.forEach(item => {
        const match = currFlt.selSubstFormValues.some(substForm => substForm.id === item.subst_form_id);
        if(match){
          if(item.aerosol_sol_id >= 0) isAerosolSolVisible = true;
          if(item.aerosol_amad_id >= 0) isAerosolAmadVisible = true;
        }
      });
    }
    setAerosolSolVisible(isAerosolSolVisible);
    if (!isAerosolSolVisible)
      updateCurrentFilter({ selAerosolSolValues: [] }); 
    setAerosolAmadVisible(isAerosolAmadVisible);
    if (!isAerosolAmadVisible)
      updateCurrentFilter({ selAerosolAMADValues: [] });     
  }, [ tableIntDoseAttr, currFlt.selSubstFormValues ]);  
    
  useEffect(() => { 
    let isAgegroupVisible = false;
    let isExpScenarioVisible = false;
    if (currFlt.selPeopleClassValues && currFlt.selPeopleClassValues.length > 0) {
      tableIntDoseAttr.forEach(item => {
        const match = currFlt.selPeopleClassValues.some(peopleClass => peopleClass.id === item.people_class_id);
        if(match){
          if(item.agegroup_id >= 0) isAgegroupVisible = true;
          if(item.exp_scenario_id >= 0) isExpScenarioVisible = true;
        }
      });
    }
    setAgegroupVisible(isAgegroupVisible);
    if (!isAgegroupVisible)
      updateCurrentFilter({ selAgeGroupValues: [] });     
    setExpScenarioVisible(isExpScenarioVisible);
    if (!isExpScenarioVisible)
      updateCurrentFilter({ selExpScenarioValues: [] }); 
  }, [ tableIntDoseAttr, currFlt.selPeopleClassValues ]);


  const handleChangeDataSource = (event, value) => {
    // Обновление значения компонента Autocomplete
    const newFilter = {
      selDataSourceValues: value,
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
    };
  
    updateCurrentFilter(newFilter);
  };  
  
  //фильтрация списков фильтров в зависимости от выбранного источника (источников) данных
  useEffect(() => {
    //взяли айди выбранных источников данных
    let ids = currFlt.selDataSourceValues.map(item => item.id);
    //отфильтровали dose_ratio.id для выбранных источников данных, чтобы отфильтровать его автокомплит
    let ids_dose_ratio = tableDataSourceClass.filter(item => ((item.table_name === 'dose_ratio' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredDoseRatio = tableDoseRatio.filter(item => ((ids_dose_ratio.includes(item.id))) );
    settableDoseRatioFiltered( filteredDoseRatio ); 
    // если отфильтрованная таблица DoseRatio не содержит значение, выбранное в выпадающем списке
    if ((filteredDoseRatio&&currFlt.selDoseRatioValue)&&(!filteredDoseRatio.some(item => item.id === currFlt.selDoseRatioValue.id) )) 
      updateCurrentFilter({ selDoseRatioValue: null });

    // то же самое для остальных автокомплитов
    let ids_irradiation = tableDataSourceClass.filter(item => ((item.table_name === 'irradiation' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIrradiation = tableIrradiation.filter(item => ((ids_irradiation.includes(item.id))) );
    const prefix = "INT_";
    filteredIrradiation = filteredIrradiation.filter(irradiation => irradiation.title.startsWith(prefix));

    settableIrradiationFiltered( filteredIrradiation ); 
    if ((filteredIrradiation&&currFlt.selIrradiationValue)&&(!filteredIrradiation.some(item => item.id === currFlt.selIrradiationValue.id) )) 
      updateCurrentFilter({ selIrradiationValue: null });

    let ids_subst_form = tableDataSourceClass.filter(item => ((item.table_name === 'subst_form' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredSubstForm = tableSubstForm.filter(item => ((ids_subst_form.includes(item.id))) );
    settableSubstFormFiltered( filteredSubstForm ); 
    //удалить недоступные значения из фильтра, а если фильтр не виден, то очистить
    let newSubstFormValues = [];
    if (substFormVisible) {
      newSubstFormValues = currFlt.selSubstFormValues.filter((value) => 
        filteredSubstForm.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selSubstFormValues: newSubstFormValues });

    let ids_integral_period = tableDataSourceClass.filter(item => ((item.table_name === 'integral_period' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIntegralPeriod = tableIntegralPeriod.filter(item => ((ids_integral_period.includes(item.id))) );
    settableIntegralPeriodFiltered( filteredIntegralPeriod );       
    //удалить недоступные значения из фильтра
    const newIntegralPeriodValues = currFlt.selIntegralPeriodValues.filter((value) => 
      filteredIntegralPeriod.some((filteredValue) => filteredValue.id === value.id));
    updateCurrentFilter({ selIntegralPeriodValues: newIntegralPeriodValues });       

    let ids_people_class = tableDataSourceClass.filter(item => ((item.table_name === 'people_class' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredPeopleClass = tablePeopleClass.filter(item => ((ids_people_class.includes(item.id))) );
    settablePeopleClassFiltered( filteredPeopleClass ); 
    //удалить недоступные значения из фильтра
    const newPeopleClassValues = currFlt.selPeopleClassValues.filter((value) => 
      filteredPeopleClass.some((filteredValue) => filteredValue.id === value.id));
    updateCurrentFilter({ selPeopleClassValues: newPeopleClassValues });

    let ids_agegroup = tableDataSourceClass.filter(item => ((item.table_name === 'agegroup' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredAgeGroup = tableAgeGroup.filter(item => ((ids_agegroup.includes(item.id))) );
    settableAgeGroupFiltered( filteredAgeGroup );
    
    let newAgeGroupValues = [];
    if (agegroupVisible) {
      newAgeGroupValues = currFlt.selAgeGroupValues.filter((value) => 
        filteredAgeGroup.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selAgeGroupValues: newAgeGroupValues });

    let ids_organ = tableDataSourceClass.filter(item => ((item.table_name === 'organ' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredOrgan = tableOrgan.filter(item => ((ids_organ.includes(item.id))) );
    settableOrganFiltered( filteredOrgan );     
    //удалить недоступные значения из фильтра
    let newOrganValues = [];
    if (organVisible) {
      newOrganValues = currFlt.selOrganValues.filter((value) => 
        filteredOrgan.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selOrganValues: newOrganValues });       

    let ids_isotope = tableDataSourceClass.filter(item => ((item.table_name === 'isotope' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIsotope = tableIsotope.filter(item => ((ids_isotope.includes(item.id))) );
    settableIsotopeFiltered( filteredIsotope );
     //удалить недоступные значения из фильтра
    const newIsotopeValues = currFlt.selIsotopeValues.filter((value) => 
      filteredIsotope.some((filteredValue) => filteredValue.id === value.id));
    updateCurrentFilter({ selIsotopeValues: newIsotopeValues });      

    let ids_aerosol_sol = tableDataSourceClass.filter(item => ((item.table_name === 'aerosol_sol' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredAerosolSol = tableAerosolSol.filter(item => ((ids_aerosol_sol.includes(item.id))) );
    settableAerosolSolFiltered( filteredAerosolSol );
    
    let newAerosolSolValues = [];
    if (aerosolSolVisible) {
      newAerosolSolValues = currFlt.selAerosolSolValues.filter((value) => 
        filteredAerosolSol.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selAerosolSolValues: newAerosolSolValues });
    
    let ids_let_level = tableDataSourceClass.filter(item => ((item.table_name === 'let_level' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredLetLevel = tableLetLevel.filter(item => ((ids_let_level.includes(item.id))) );
    settableLetLevelFiltered( filteredLetLevel );
    
    let newLetLevelValues = [];
    if (letLevelVisible) {
      newLetLevelValues = currFlt.selLetLevelValues.filter((value) => 
        filteredLetLevel.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selLetLevelValues: newLetLevelValues });
    
    let ids_aerosol_amad = tableDataSourceClass.filter(item => ((item.table_name === 'aerosol_amad' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredAerosolAmad = tableAerosolAMAD.filter(item => ((ids_aerosol_amad.includes(item.id))) );
    settableAerosolAMADFiltered( filteredAerosolAmad );
    
    let newAerosolAMADValues = [];
    if (aerosolAmadVisible) {
      newAerosolAMADValues = currFlt.selAerosolAMADValues.filter((value) => 
        filteredAerosolAmad.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selAerosolAMADValues: newAerosolAMADValues });
    
    let ids_exp_scenario = tableDataSourceClass.filter(item => ((item.table_name === 'exp_scenario' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredExpScenario = tableExpScenario.filter(item => ((ids_exp_scenario.includes(item.id))) );
    settableExpScenarioFiltered( filteredExpScenario );
    
    let newExpScenarioValues = [];
    if (expScenarioVisible) {
      newExpScenarioValues = currFlt.selExpScenarioValues.filter((value) => 
        filteredExpScenario.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selExpScenarioValues: newExpScenarioValues });
        
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currFlt.selDataSourceValues,
      organVisible,
      substFormVisible,
      aerosolSolVisible,
      aerosolAmadVisible,
      letLevelVisible,
      agegroupVisible,
      expScenarioVisible,
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
      tableExpScenario,
      tableChemCompGr,
      tableIntDoseAttr
    ]);
 
  //обработчики автокомплитов
  const handleChangeDoseRatio =      (event, value) => { updateCurrentFilter({ selDoseRatioValue: value }); };
  const handleChangeIrradiation =    (event, value) => { updateCurrentFilter({ selIrradiationValue: value }); }; 

  // переменные, относящиеся к редактированию данных в таблице
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDel, setOpenDel] = React.useState(false); 

  const handleClickEditNew = () => {
    setValueID(null);
    setValueDrValue(null);
    setValueUpdateTime(null);
    setOpenEdit(true);
  };

  const handleClickEdit = () => {

    console.log('setOpenEdit(true)');
    setOpenEdit(true);
  };
  const handleCloseEditYes = () => {
    if (formRefDialog.current.reportValidity() )
    {    
      saveRec();
      setOpenEdit(false);
    }
  };
  const handleCloseEditNo = () => {
    if (valueIDInitial)
    {
      handleRowClick({ row: tableValueIntDose.find(row => row.id === valueIDInitial) });
      //const originalRow = tableValueIntDose.find(row => row.id === valueIDInitial);
      //handleRowClick({ row: originalRow });
    }
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

  const formatDate = (dateStr) => {
    let date = new Date(dateStr);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }
  
  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {

    if (formRefDialog.current.reportValidity() )
    {
    const js = JSON.stringify({
      dose_ratio_id: valueDoseRatioID,
      dr_value: valueDrValue,
      chem_comp_gr_id: valueChemCompGrID    
    });
    if (!valueID) {
      addRec();
      return;
    } 
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
  
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
const addRec = async ()  => {
  const js = JSON.stringify({
    dose_ratio_id: valueDoseRatioID,
    dr_value: valueDrValue,
    chem_comp_gr_id: valueChemCompGrID,  
    people_class_id: valuePeopleClassID,
    isotope_id: valueIsotopeID,
    integral_period_id: valueIntegralPeriodID,
    organ_id: valueOrganID,
    let_level_id: valueLetLevelID,
    agegroup_id: valueAgeGroupID,
    data_source_id: valueDataSourceID,
    subst_form_id: valueSubstFormID,
    aerosol_sol_id: valueAerosolSolID,
    aerosol_amad_id: valueAerosolAMADID,
    exp_scenario_id: valueExpScenarioID,
    irradiation_id: valueIrradiationID
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
      alertText = `Запись добавлена`;
      //setRecordAdded(true);
      setOpenAlert(true);  
    }
  } catch (err) {
    alertText = err.message;
    alertSeverity = 'error';
    setOpenAlert(true);
  } finally {
    setIsLoading(false);
    setLastOperationWasAdd(true);
    reloadData();
    if (valueIDInitial)
    {
      const originalRow = tableValueIntDose.find(row => row.id === valueIDInitial);
      handleRowClick({ row: originalRow });
    }
  }
};

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
const delRec =  async () => {
  const js = JSON.stringify({
      id: valueID,
  });
  setIsLoading(true);
  try {
    const response = await fetch(`/${props.table_name}/`+valueID, {
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
      if (tableValueIntDose && tableValueIntDose.length > 0) 
        handleRowClick({ row: tableValueIntDose.find(row => row.id === tableValueIntDose[0].id) });
    }
  } catch (err) {
    alertText = err.message;
    alertSeverity = 'error';
    setOpenAlert(true);
  } finally {
    setIsLoading(false);
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

  useEffect(() => {
    fetch(`/chem_comp_gr_min/`)
      .then((data) => data.json())
      .then((data) => setTableChemCompGr(data)); 
  }, [props.table_name])

   useEffect(() => {
    fetch(`/int_dose_attr`)
      .then((data) => data.json())
      .then((data) => setTableIntDoseAttr(data)); 
  }, [props.table_name]) 


  const checkColumns = React.useCallback((data, flt) => {
    let columnsToShow = {
      'id': false,
      'dr_value': true,
      'updatetime': true,
      'chem_comp_group_name_rus': true,
      'dose_ratio_id': false,
      'irradiation_id': false
    };
  
    const specialCols = {
      'organ_name_rus': 'selOrganValues', 
      'let_level_name_rus': 'selLetLevelValues', 
      'agegroup_name_rus': 'selAgeGroupValues', 
      'isotope_title': 'selIsotopeValues', 
      'integral_period_name_rus': 'selIntegralPeriodValues', 
      'subst_form_name_rus': 'selSubstFormValues', 
      'aerosol_sol_name_rus': 'selAerosolSolValues', 
      'aerosol_amad_name_rus': 'selAerosolAMADValues', 
      'exp_scenario_name_rus': 'selExpScenarioValues', 
      'people_class_name_rus': 'selPeopleClassValues',
      'data_source_title': 'selDataSourceValues' 
    };
  
    if (data.length === 0) {
      return columnsToShow;
    }
  
    if (!data[0]) {
      throw new Error('The first item in the data array is null or undefined');
    }
  
    const columnNames = Object.keys(data[0]);
  
    columnNames.forEach((colName) => {
      if (colName in columnsToShow) return;
      if (colName in specialCols) {
        let currFltName = specialCols[colName];
        const noFilterValues = !flt[currFltName] || flt[currFltName].length === 0;
        if (noFilterValues) {
          columnsToShow[colName] = false; // скрываем колонку, если в фильтре не выбрано ни одного значения
          console.log(colName, noFilterValues, columnsToShow[colName]);
        } else {
          const onlyOneFilterValue = flt[currFltName] && flt[currFltName].length === 1;
          const allColumnValuesSame = onlyOneFilterValue && data.every((row) => row[colName] === data[0][colName]);
          columnsToShow[colName] = !allColumnValuesSame;
          console.log(colName, noFilterValues, columnsToShow[colName]);
        }
      } else {
        columnsToShow[colName] = false;
      } 
    });
    return columnsToShow;
  }, []);
  
  const [vidColumnVisibilityModel, setVidColumnVisibilityModel] = useState(false);

    //загрузка данных в основную таблицу
    const reloadData = React.useCallback(async () =>  {
      if ((!applFlt.selDataSourceValues)|| (applFlt.selDataSourceValues.length===0))
      {
        setTableValueIntDose([]);
        return;
      }

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
          const vidColumnVisibilityModel = checkColumns(result, applFlt);
          setTableValueIntDose(result);
          //console.log('applFlt', applFlt);
          //console.log('vidColumnVisibilityModel', vidColumnVisibilityModel);
          setVidColumnVisibilityModel(vidColumnVisibilityModel);
          if (result && result.length >= MAX_ROWS) {
            alertText = `Внимание, отобрано первые ${MAX_ROWS} строк. Укажите более строгий фильтр, чтобы уточнить результат.`;
            alertSeverity = "warning";
          } 
          if (result && result.length > 0) {
            if (lastOperationWasAdd) {
              scrollToIndexRef.current = Math.max(...result.map(item => item.id));
              setLastOperationWasAdd(false);  // Сбрасываем состояние, так как мы уже прокрутили до новой строки
            }
          }
        }
      } catch (err) {
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, [applFlt, pageState, scrollToIndexRef, checkColumns, lastOperationWasAdd]);

// Создаем эффект для вызова reloadData() при изменении состояния фильтра
useEffect(() => {
  if ((!applFlt.selDataSourceValues)|| (applFlt.selDataSourceValues.length===0))
  {
    setTableValueIntDose([]);
    return;
  }  
  const fetchData = async () => {
    try {
      console.log('reload data');
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

// фильтрация источников данных для окна редактирования 
// требование спецификации:
// Список для выбора ограничен значениями, которые имеют связь с выбранным типом облучения irradiation  в таблице data_source_class
useEffect(() => {
  if (!valueIrradiationID) 
    return;
  const filteredDataSourceClass = tableDataSourceClass.filter(item => item.table_name === 'irradiation' && item.rec_id === valueIrradiationID)
  const filteredDataSource = tableDataSource.filter(dataSourceItem => filteredDataSourceClass.some(filteredItem => filteredItem.data_source_id === dataSourceItem.id) );
  settableDataSourceFilteredEdit( filteredDataSource ); 
}, [valueIrradiationID, tableDataSource, tableDataSourceClass, tableOrgan]);

const [tableSubstFormFilteredEdit, settableSubstFormFilteredEdit] = useState([]);
const [tableAerosolSolFilteredEdit, settableAerosolSolFilteredEdit] = useState([]);
const [tableAerosolAMADFilteredEdit, settableAerosolAMADFilteredEdit] = useState([]);
const [tablePeopleClassFilteredEdit, settablePeopleClassFilteredEdit] = useState([]);
const [tableAgeGroupFilteredEdit, settableAgeGroupFilteredEdit] = useState([]);
const [tableExpScenarioFilteredEdit, settableExpScenarioFilteredEdit] = useState([]);
const [tableIntegralPeriodFilteredEdit, settableIntegralPeriodFilteredEdit] = useState([]);
const [tableChemCompGrFilteredEdit, settableChemCompGrFilteredEdit] = useState([]);
const [tableOrganFilteredEdit, settableOrganFilteredEdit] = useState([]); //список органов в окне редактирования записи
const [tableLetLevelFilteredEdit, settableLetLevelFilteredEdit] = useState([]); //уровни ЛПЭ в окне редактирования записи

useEffect(() => {
  if (!valueDataSourceID) 
    return;
  const filterTable = (tableName, table) => 
    table.filter(item => 
      tableDataSourceClass.some(dataSourceClassItem => 
        dataSourceClassItem.table_name === tableName &&
        dataSourceClassItem.rec_id === item.id && 
        dataSourceClassItem.data_source_id === valueDataSourceID
      )
    );

  const filteredTableOrgan = filterTable('organ', tableOrgan);
  const filteredTableLetLevel = filterTable('let_level', tableLetLevel);
  const filteredTableSubstForm = filterTable('subst_form', tableSubstForm);
  const filteredTableAerosolSol = filterTable('aerosol_sol', tableAerosolSol);
  const filteredTableAerosolAMAD = filterTable('aerosol_amad', tableAerosolAMAD);
  const filteredTablePeopleClass = filterTable('people_class', tablePeopleClass);
  const filteredTableAgeGroup = filterTable('agegroup', tableAgeGroup);

  const filteredTableExpScenario = filterTable('exp_scenario', tableExpScenario);
  const filteredTableIntegralPeriod = filterTable('integral_period', tableIntegralPeriod);
  const filteredTableChemCompGr = filterTable('chem_comp_gr', tableChemCompGr);

  settableOrganFilteredEdit(filteredTableOrgan);
  settableLetLevelFilteredEdit(filteredTableLetLevel);
  settableSubstFormFilteredEdit(filteredTableSubstForm);
  settableAerosolSolFilteredEdit(filteredTableAerosolSol);
  settableAerosolAMADFilteredEdit(filteredTableAerosolAMAD);
  settablePeopleClassFilteredEdit(filteredTablePeopleClass);
  settableAgeGroupFilteredEdit(filteredTableAgeGroup);
  settableExpScenarioFilteredEdit(filteredTableExpScenario);
  settableIntegralPeriodFilteredEdit(filteredTableIntegralPeriod);
  settableChemCompGrFilteredEdit(filteredTableChemCompGr);
     
}, [valueID, valueDataSourceID, tableDataSourceClass, tableOrgan, tableLetLevel, tableSubstForm, tableAerosolSol, tableAerosolAMAD, tablePeopleClass, tableAgeGroup, tableExpScenario, tableIntegralPeriod, tableChemCompGr]);

const reloadDataHandler = async () => {
  if (formRef.current.reportValidity() )
  {  
    console.log('reloadDataHandler');
    alertSeverity = "info";
    alertText = 'Данные успешно загружены';
    try {
      await applyFilter();
    } 
    catch (e) {
      alertSeverity = "error";
      alertText = 'Ошибка при загрузке данных данных: ' + e.message;
      setOpenAlert(true);
      return;
    }
    setIsFilterExpanded(false);
  }
}

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
      const visibleColumns = apiRef.current.getVisibleColumns();
      const columnNames = visibleColumns.map((column) => column.headerName);
      const columnHeaders = columnNames.map((name) => `"${name}"`).join(delimiter);

      if (!Array.isArray(rows) || rows.length === 0) {
        console.error('No rows to export.');
        return;
      }
      const filterCaption = GetFilterCaption();
      const csvFilterCaption = formatFilterCaption(filterCaption);
      const customText = csvFilterCaption; 
      const dataToExport = rows.map((row) => {
        const rowData = tableValueIntDose.find((item) => item.id === row);
        if (rowData) {
            const valuesToExport = visibleColumns.map((column) => {
                let cell = rowData[column.field];
                // If the column is 'updatetime' and the cell is not null or undefined, format the date.
                if (column.field === 'updatetime' && cell !== null && cell !== undefined) {
                    cell = formatDate(cell);
                }
                return cell;
            });
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
      link.setAttribute('download', table_names[props.table_name]+'.csv'); 
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };


    return(
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClickEditNew()} disabled={(!valueID || !tableValueIntDose || tableValueIntDose.length === 0 )} color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>

        <IconButton onClick={()=>handleClickEdit()} disabled={(!valueID || !tableValueIntDose || tableValueIntDose.length === 0 )} color="primary" size="small" title="Редактировать запись">
          <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton> 

        <IconButton onClick={()=>handleClickDelete()} disabled={(!valueID || !tableValueIntDose || tableValueIntDose.length === 0 )} color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>

        <IconButton onClick={()=>reloadDataHandler()} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
        {/* тут кастомное сохранение в CSV - добавлен заголовок */}
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
          disabled={( !tableValueIntDose || tableValueIntDose.length === 0 )}
          title="Сохранить в формате CSV"
        >
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox />
          </IconButton>          
      </GridToolbarContainer>
    );
  }

  function GetFilterCaption() {
    return (
      <>
        {applFlt.selDoseRatioValue && (
          <>
            Параметр: {applFlt.selDoseRatioValue.title}, {applFlt.selDoseRatioValue.name_rus}
            , ед.измерения (базовая) {applFlt.selDoseRatioValue.sign}
            {applFlt.selOrganValues.length === 1 ? `, ${applFlt.selOrganValues[0].name_rus}` : ''}
            {applFlt.selLetLevelValues.length === 1 ? `, ${applFlt.selLetLevelValues[0].name_rus}` : ''}
            <br />
          </>
        )}
        {applFlt.selIrradiationValue && (
          <>
            Тип облучения: {applFlt.selIrradiationValue.name_rus}
            {applFlt.selSubstFormValues.length === 1 ? `, ${applFlt.selSubstFormValues[0].name_rus}` : ''}
            {applFlt.selAerosolSolValues.length === 1 ? `, ${applFlt.selAerosolSolValues[0].name_rus}` : ''}
            {applFlt.selAerosolAMADValues.length === 1 ? `, ${applFlt.selAerosolAMADValues[0].name_rus}` : ''}
            <br />
          </>
        )}
        {applFlt.selPeopleClassValues.length === 1 && (
          <>
            Тип облучаемых лиц: {applFlt.selPeopleClassValues[0].name_rus}
            {applFlt.selAgeGroupValues.length === 1 ? `, ${applFlt.selAgeGroupValues[0].name_rus}` : ''}
            {applFlt.selExpScenarioValues.length === 1 ? `, ${applFlt.selExpScenarioValues[0].name_rus}` : ''}
            <br />
          </>
        )}
        {applFlt.selDataSourceValues.length === 1 && (
          <>
            Источник данных: {applFlt.selDataSourceValues[0].shortname}
            <br />
          </>
        )}
        {applFlt.selIsotopeValues.length === 1 && (
          <>
            Нуклид: {applFlt.selIsotopeValues[0].title}
            <br />
          </>
        )}
        {applFlt.selIntegralPeriodValues.length === 1 && (
          <>
            Период интегрирования: {applFlt.selIntegralPeriodValues[0].name_rus}
            <br />
          </>
        )}
      </>
    );
  }
  
  const formRef = React.useRef();
  const formRefDialog = React.useRef();

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
          <td width={348}> 
          <Autocomplete
            size="small"
            value={currFlt.selDataSourceValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleChangeDataSource}
            onInputChange={(event, newInputValue, reason) => {
              if (reason !== "reset") {
                setSearchValueDataSource(newInputValue);
              }
            }}
            inputValue={searchValueDataSource}
            multiple
            limitTags={10}
            id="autocomplete-datasource"
            options={tableDataSource}
            getOptionLabel={(option) => option.title}
            disableCloseOnSelect
            filterOptions={filterOptions}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  size="small"
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <Tooltip title={option.fullname}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <span>{option.title}</span>
                    <span></span> 
                  </div>
                </Tooltip>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  required: currFlt.selDataSourceValues.length === 0,
                  value: tableDataSource.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                }}
                label="Источники данных"
                placeholder="Источники данных"
                required
              />
            )}
          />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>
            <IconButton
              onClick={async () => {
                const filtered = filterOptions(tableDataSource, { inputValue: searchValueDataSource, getOptionLabel: (option) => option.title });
                setCurrFlt({
                  ...currFlt,
                  selDataSourceValues: filtered,
                });
                // вызов handleChangeDataSource
                handleChangeDataSource(null, filtered);
                setSearchValueDataSource('');  // очищаем поле ввода после нажатия на "Выбрать все"
              }}
              color="primary"
              size="small"
              title="Выбрать все"
            >
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
            </IconButton>
          </td>

          </tr>
        </tbody></table>  

        <p>{/* Параметр */}</p>
        
        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td width={348}>      
          <Autocomplete
            size="small"
            value={currFlt.selDoseRatioValue}
            onChange={handleChangeDoseRatio}
            id="autocomplete-dose_ratio"
            options={tableDoseRatioFiltered.filter((row) => row.dr_type === "i")}
            getOptionLabel={(option) => option ? `${option.title}, ${option.name_rus}` : ''}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableDoseRatioFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return (
                <Tooltip enterDelay={500} title={currFlt.selDoseRatioValue ? `${currFlt.selDoseRatioValue.title}, ${currFlt.selDoseRatioValue.name_rus}` : ""}>
                  <TextField {...params} inputProps={inputProps} label="Параметр" placeholder="Параметр" required/>
                </Tooltip>
              );
            }}            
          />

          </td>
          <td width={59}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>

          { organVisible && ( 
            <>   
            <td width={348}>
              <Autocomplete
                size="small"
                value={currFlt.selOrganValues}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  setCurrFlt({
                    ...currFlt,
                    selOrganValues: newValue,
                  });
                }}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason !== "reset") {
                    setSearchValueOrgan(newInputValue);
                  }
                }}
                inputValue={searchValueOrgan}
                multiple
                limitTags={7}
                id="autocomplete-organ"
                options={tableOrganFiltered}
                getOptionLabel={(option) => option.name_rus}
                disableCloseOnSelect
                filterOptions={filterOptions}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      size="small"
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    <Tooltip title={option.name_eng}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.name_rus}</span>
                        <span></span> 
                      </div>
                    </Tooltip>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      required: currFlt.selOrganValues.length === 0,
                      value: tableOrganFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                    }}
                    label="Органы и ткани"
                    placeholder="Органы и ткани"
                    required 
                  />
                )}
              /> 
            </td>
            <td>
              &nbsp;&nbsp;
            </td>
            <td>
              <IconButton
                onClick={async () => {
                  const filtered = filterOptions(tableOrganFiltered, { inputValue: searchValueOrgan, getOptionLabel: (option) => option.name_rus });
                  setCurrFlt({
                    ...currFlt,
                    selOrganValues: filtered,
                  });
                  setSearchValueOrgan('');  // очищаем поле ввода после нажатия на "Выбрать все"
                }}
                color="primary"
                size="small"
                title="Выбрать все"
              >
                <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
              </IconButton>
            </td>

            <td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>
            </>
          )}
 
          {letLevelVisible && (
            <>
              <td width={300}>
                <Autocomplete
                  size="small"
                  limitTags={7}
                  value={currFlt.selLetLevelValues}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, newValue) => {
                    setCurrFlt({
                      ...currFlt,
                      selLetLevelValues: newValue,
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                      setSearchValueLetLevel(newInputValue);
                    }
                  }}
                  inputValue={searchValueLetLevel}
                  multiple
                  id="autocomplete-let_level"
                  options={tableLetLevelFiltered}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  filterOptions={filterOptions}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        size="small"
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <Tooltip title={option.name_eng}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <span>{option.name_rus}</span>
                          <span></span> 
                        </div>
                      </Tooltip>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        required: currFlt.selLetLevelValues.length === 0,
                        value: tableLetLevelFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="Уровни ЛПЭ"
                      placeholder="Уровни ЛПЭ"
                      required
                    />
                  )}
                />
              </td>
              <td>&nbsp;&nbsp;</td>
              <td>
                <IconButton
                  onClick={async () => {
                    const filtered = filterOptions(tableLetLevelFiltered, { inputValue: searchValueLetLevel, getOptionLabel: (option) => option.name_rus });
                    setCurrFlt({
                      ...currFlt,
                      selLetLevelValues: filtered,
                    });
                    setSearchValueLetLevel(''); // очищаем поле ввода после нажатия на "Выбрать все"
                  }}
                  color="primary"
                  size="small"
                  title="Выбрать все"
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>
              </td>
            </>
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
            id="autocomplete-irradiation"
            options={ tableIrradiationFiltered } //фильтрация условных 2,6, 30319, 30316 делается из tableIntDoseAttr            
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
          <td width={59}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>

          { substFormVisible && ( 
            <> 
              <td width={348}>
                <Autocomplete
                  size="small"
                  value={currFlt.selSubstFormValues}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, newValue) => {
                    setCurrFlt({
                      ...currFlt,
                      selSubstFormValues: newValue,
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                      setSearchValueSubstForm(newInputValue);
                    }
                  }}
                  inputValue={searchValueSubstForm}
                  multiple
                  id="autocomplete-subst_form"
                  options={tableSubstFormFiltered}
                  disabled={ (!currFlt.selDataSourceValues.length) || (!currFlt.selIrradiationValue) }
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  filterOptions={filterOptions}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        size="small"
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <Tooltip title={option.name_eng}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <span>{option.name_rus}</span>
                          <span></span> 
                        </div>
                      </Tooltip>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        required: currFlt.selSubstFormValues.length === 0,
                        value: tableSubstFormFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="Формы вещества"
                      placeholder="Формы вещества"
                      required
                    />
                  )}
                />
              </td>
              <td>
                &nbsp;&nbsp;
              </td>
              <td>
                <IconButton
                  onClick={async () => {
                    const filtered = filterOptions(tableSubstFormFiltered, { inputValue: searchValueSubstForm, getOptionLabel: (option) => option.name_rus });
                    setCurrFlt({
                      ...currFlt,
                      selSubstFormValues: filtered,
                    });
                    setSearchValueSubstForm('');
                  }}
                  color="primary"
                  size="small"
                  title="Выбрать все"
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>
              </td>
            <td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>
            </>
          )}  

          {aerosolSolVisible && (
            <>
              <td width={300}>
                <Autocomplete
                  size="small"
                  value={currFlt.selAerosolSolValues}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, newValue) => {
                    setCurrFlt({
                      ...currFlt,
                      selAerosolSolValues: newValue,
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                      setSearchValueAerosolSol(newInputValue);
                    }
                  }}
                  inputValue={searchValueAerosolSol}
                  multiple
                  id="autocomplete-aerosol_sol"
                  options={tableAerosolSolFiltered}
                  disabled={ !currFlt.selDataSourceValues.length }
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  filterOptions={filterOptions}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        size="small"
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <Tooltip title={option.name_eng}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <span>{option.name_rus}</span>
                          <span></span> 
                        </div>
                      </Tooltip>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        required: currFlt.selAerosolSolValues.length === 0,
                        value: tableAerosolSolFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="Типы растворимости аэрозолей"
                      placeholder="Типы растворимости аэрозолей"
                      required
                    />
                  )}
                />
              </td>
              <td>&nbsp;&nbsp;</td>
              <td>
                <IconButton
                  onClick={async () => {
                    const filtered = filterOptions(tableAerosolSolFiltered, { inputValue: searchValueAerosolSol, getOptionLabel: (option) => option.name_rus });
                    setCurrFlt({
                      ...currFlt,
                      selAerosolSolValues: filtered,
                    });
                    setSearchValueAerosolSol('');
                  }}
                  color="primary"
                  size="small"
                  title="Выбрать все"
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            </>
          )}


          {aerosolAmadVisible && (
            <>
              <td width={300}>
                <Autocomplete
                  size="small"
                  value={currFlt.selAerosolAMADValues}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, newValue) => {
                    setCurrFlt({
                      ...currFlt,
                      selAerosolAMADValues: newValue,
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                      setSearchValueAerosolAMAD(newInputValue);
                    }
                  }}
                  inputValue={searchValueAerosolAMAD}
                  limitTags={7}
                  multiple
                  id="autocomplete-aerosol_amad"
                  options={tableAerosolAMADFiltered}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  filterOptions={filterOptions}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        size="small"
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <Tooltip title={option.name_eng}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <span>{option.name_rus}</span>
                          <span></span> 
                        </div>
                      </Tooltip>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        required: currFlt.selAerosolAMADValues.length === 0,
                        value: tableAerosolAMADFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="AMAD аэрозолей"
                      placeholder="AMAD аэрозолей"
                      required
                    />
                  )}
                />
              </td>
              <td>&nbsp;&nbsp;</td>
              <td>
                <IconButton
                  onClick={async () => {
                    const filtered = filterOptions(tableAerosolAMADFiltered, { inputValue: searchValueAerosolAMAD, getOptionLabel: (option) => option.name_rus });
                    setCurrFlt({
                      ...currFlt,
                      selAerosolAMADValues: filtered,
                    });
                    setSearchValueAerosolAMAD(''); // очищаем поле ввода после нажатия на "Выбрать все"
                  }}
                  color="primary"
                  size="small"
                  title="Выбрать все"
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>
              </td>
            </>
          )}
          </tr>
        </tbody></table>  

        <p>{/* -------------------------- Блок Типы облучаемых лиц -------------------------*/}</p>

        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td width={348}>
          <Autocomplete
            size="small"
            value={currFlt.selPeopleClassValues}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => {
              setCurrFlt({
                ...currFlt,
                selPeopleClassValues: newValue,
              });
            }}
            onInputChange={(event, newInputValue, reason) => {
              if (reason !== "reset") {
                setSearchValuePeopleClass(newInputValue);
              }
            }}
            inputValue={searchValuePeopleClass}
            multiple
            limitTags={7}
            id="autocomplete-people_class"
            options={tablePeopleClassFiltered}
            getOptionLabel={(option) => option.name_rus}
            disableCloseOnSelect
            filterOptions={filterOptions}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  size="small"
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <Tooltip title={option.name_eng}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <span>{option.name_rus}</span>
                    <span></span>
                  </div>
                </Tooltip>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  required: currFlt.selPeopleClassValues.length === 0,
                  value: tablePeopleClassFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                }}
                label="Типы облучаемых лиц"
                placeholder="Типы облучаемых лиц"
                required
              />
            )}
          />
        </td>
        <td>
          &nbsp;&nbsp;
        </td>
        <td>
          <IconButton
            onClick={async () => {
              const filtered = filterOptions(tablePeopleClassFiltered, { inputValue: searchValuePeopleClass, getOptionLabel: (option) => option.name_rus });
              setCurrFlt({
                ...currFlt,
                selPeopleClassValues: filtered,
              });
              setSearchValuePeopleClass('');  // очищаем поле ввода после нажатия на "Выбрать все"
            }}
            color="primary"
            size="small"
            title="Выбрать все"
          >
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
          </IconButton>
        </td>
            <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>
            {
              agegroupVisible && (
                <>
                  <td width={348}>
                    <Autocomplete
                      size="small"
                      value={currFlt.selAgeGroupValues}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, newValue) => {
                        setCurrFlt({
                          ...currFlt,
                          selAgeGroupValues: newValue,
                        });
                      }}
                      onInputChange={(event, newInputValue, reason) => {
                        if (reason !== "reset") {
                          setSearchValueAgeGroup(newInputValue);
                        }
                      }}
                      inputValue={searchValueAgeGroup}
                      multiple
                      id="autocomplete-age_group"
                      options={tableAgeGroupFiltered}
                      getOptionLabel={(option) => option.name_rus}
                      disableCloseOnSelect
                      filterOptions={filterOptions}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            size="small"
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          <Tooltip title={option.name_eng}>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                              <span>{option.name_rus}</span>
                              <span></span> 
                            </div>
                          </Tooltip>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            required: currFlt.selAgeGroupValues.length === 0,
                            value: tableAgeGroupFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                          }}
                          label="Возрастные группы населения"
                          placeholder="Возрастные группы населения"
                          required
                        />
                      )}
                    />
                  </td>
                  <td>&nbsp;&nbsp;</td>
                  <td>
                    <IconButton
                      onClick={async () => {
                        const filtered = filterOptions(tableAgeGroupFiltered, { inputValue: searchValueAgeGroup, getOptionLabel: (option) => option.name_rus });
                        setCurrFlt({
                          ...currFlt,
                          selAgeGroupValues: filtered,
                        });
                        setSearchValueAgeGroup(''); // очищаем поле ввода после нажатия на "Выбрать все"
                      }}
                      color="primary"
                      size="small"
                      title="Выбрать все"
                    >
                      <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                    </IconButton>
                  </td>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                </>
              )
            }


          {expScenarioVisible && (
            <>
              <td width={300}>
                <Autocomplete
                  size="small"
                  value={currFlt.selExpScenarioValues}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, newValue) => {
                    setCurrFlt({
                      ...currFlt,
                      selExpScenarioValues: newValue,
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                      setSearchValueExpScenario(newInputValue);
                    }
                  }}
                  inputValue={searchValueExpScenario}
                  multiple
                  id="autocomplete-exp_scenario"
                  options={tableExpScenarioFiltered}
                  disabled={!currFlt.selDataSourceValues.length}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  filterOptions={filterOptions}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        size="small"
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <Tooltip title={option.name_eng}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <span>{option.name_rus}</span>
                          <span></span> 
                        </div>
                      </Tooltip>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        required: currFlt.selExpScenarioValues.length === 0,
                        value: tableExpScenarioFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="Сценарии поступления"
                      placeholder="Сценарии поступления"
                      required
                    />
                  )}
                />
              </td>
              <td>&nbsp;&nbsp;</td>
              <td>
                <IconButton
                  onClick={async () => {
                    const filtered = filterOptions(tableExpScenarioFiltered, { inputValue: searchValueExpScenario, getOptionLabel: (option) => option.name_rus });
                    setCurrFlt({
                      ...currFlt,
                      selExpScenarioValues: filtered,
                    });
                    setSearchValueExpScenario('');
                  }}
                  color="primary"
                  size="small"
                  title="Выбрать все"
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>
              </td>
            </>
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
              onChange={(event, newValue) => {
                setCurrFlt({
                  ...currFlt,
                  selIsotopeValues: newValue,
                });
              }}
              onInputChange={(event, newInputValue, reason) => {
                if (reason !== "reset") {
                  setSearchValueNuclide(newInputValue);
                }
              }}
              inputValue={searchValueNuclide}
              multiple
              limitTags={7}
              id="autocomplete-isotope"
              options={tableIsotopeFiltered}
              getOptionLabel={(option) => option.title}
              disableCloseOnSelect
              filterOptions={filterOptions}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    size="small"
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    required: currFlt.selIsotopeValues.length === 0,
                    value: tableIsotopeFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
                  }}
                  label="Нуклиды"
                  placeholder="Нуклиды"
                  required  
                />
              )}
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>      
            <IconButton
              onClick={async () => {
                const filtered = filterOptions(tableIsotopeFiltered, { inputValue: searchValueNuclide, getOptionLabel: (option) => option.title });
                setCurrFlt({
                  ...currFlt,
                  selIsotopeValues: filtered,
                });
                setSearchValueNuclide('');  // очищаем поле ввода после нажатия на "Выбрать все"
              }} 
              color="primary" 
              size="small" 
              title="Выбрать все"
              >  
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
            </IconButton> 
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          <td width={348}>
              <Autocomplete
                size="small"
                value={currFlt.selIntegralPeriodValues}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  setCurrFlt({
                    ...currFlt,
                    selIntegralPeriodValues: newValue,
                  });
                }}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason !== "reset") {
                    setSearchValueIntegralPeriod(newInputValue);
                  }
                }}
                inputValue={searchValueIntegralPeriod}
                multiple
                limitTags={7}
                id="autocomplete-integral"
                options={tableIntegralPeriodFiltered}
                getOptionLabel={(option) => option.name_rus}
                disableCloseOnSelect
                filterOptions={filterOptions}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      size="small"
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    <Tooltip title={option.name_eng}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.name_rus}</span>
                        <span></span> 
                      </div>
                    </Tooltip>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      required: currFlt.selIntegralPeriodValues.length === 0,
                      value: tableIntegralPeriodFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                    }}
                    label="Периоды интегрирования"
                    placeholder="Периоды интегрирования"
                    required  
                  />
                )}
              />
            </td>
            <td>
              &nbsp;&nbsp;
            </td>
            <td>
              <IconButton
                onClick={async () => {
                  const filtered = filterOptions(tableIntegralPeriodFiltered, { inputValue: searchValueIntegralPeriod, getOptionLabel: (option) => option.name_rus });
                  setCurrFlt({
                    ...currFlt,
                    selIntegralPeriodValues: filtered,
                  });
                  setSearchValueIntegralPeriod('');  // очищаем поле ввода после нажатия на "Выбрать все"
                }}
                color="primary"
                size="small"
                title="Выбрать все"
              >
                <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
              </IconButton>
            </td>
          </tr>
          </tbody>
        </table>
        <p></p>  

        <IconButton onClick={()=>reloadDataHandler()} color="primary" size="small" 
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
              <td style={{ verticalAlign: 'top' }}>
              <div style={{ height: 390 }} > 
                <DataGrid
                  style={{ width: 1500 }}
                  components={{ Toolbar: CustomToolbar1 }}
                  hideFooterSelectedRowCount={true}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                  rowHeight={25}
                  //loading={isLoading}
                  rows={tableValueIntDose}
                  columns={columnsValueIntDose}
                  apiRef={apiRef}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onSelectionModelChange={(newSelectionModel) => {
                    setselectionModel(newSelectionModel);
                  }}
                  selectionModel={selectionModel}
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  columnVisibilityModel={vidColumnVisibilityModel}
                  onRowClick={handleRowClick}
                  {...tableValueIntDose}
                />              
                </div>    
              </td>
            </tr>
            <tr>
              <td style={{ height: 50, verticalAlign: 'top' }}>
              <Box>
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

        </AccordionDetails>
      </Accordion>

      <Dialog open={openEdit} onClose={handleCloseEditNo} fullWidth={false} maxWidth="960px">
      <DialogTitle>{valueID !== null ? `Редактировать запись, id ${valueID}` : "Добавить запись"}</DialogTitle>
      <Divider />
        <DialogContent style={{height:'480px', width: '940px'}}>

        <form ref={formRefDialog}> 
        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td style={{ width: '290px'}}>      
          <Autocomplete
            disabled={true}
            size="small"  
            value={tableDoseRatio.find((option) => option.id === valueDoseRatioID)  }
            onChange={handleChangeDoseRatio}
            id="autocomplete-dose_ratio"
            options={ tableDoseRatioFiltered.filter((row) => row.dr_type === "i") }
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
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>

          {
          //!((!currFlt.selDataSourceValues.length)||(!currFlt.selDoseRatioValue)||(!doseRatioToOrganParentIds.includes(currFlt.selDoseRatioValue.id)))
          //&&
          ( 
            <>   
            <td style={{ width: '290px'}}>    
            <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selOrganValues.length===1)}
            value={tableOrganFilteredEdit.find((option) => option.id === valueOrganID)  }
            id="autocomplete-organ_edit"
            options={tableOrganFilteredEdit}
            getOptionLabel={(option) => option.name_rus?option.name_rus:''}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableOrganFilteredEdit.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Органы и ткани" placeholder="Органы и ткани"/>;
            }}                 
            />        
            </td>
            <td style={{ width: '16px'}}>  
            &nbsp;
            </td>
            </>            
          )}
          
            <td style={{ width: '290px'}}> 
            <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selLetLevelValues.length===1)}
            value={tableLetLevelFilteredEdit.find((option) => option.id === valueLetLevelID)  }
            id="autocomplete-let_level_edit"
            options={tableLetLevelFilteredEdit}
            getOptionLabel={(option) => option.name_rus?option.name_rus:''}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableLetLevelFilteredEdit.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Уровни ЛПЭ" placeholder="Уровни ЛПЭ"/>;
            }}                 
            />    
            </td>
          </tr>
          </tbody></table> 
          <p></p>
          <Divider />
          <p></p>

          <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td style={{ width: '290px'}}>            
          <Autocomplete
            size="small"
            disabled={true}
            value={tableIrradiation.find((option) => option.id === valueIrradiationID) }
            onChange={(event, newValueAC) => { setValueIrradiationID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-irradiation_edit"
            options={ tableIrradiationFiltered } //фильтрация условных 2,6, 30319, 30316 делается из tableIntDoseAttr
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
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>
          <td style={{ width: '290px'}}>          
          <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selSubstFormValues.length===1)}
            value={tableSubstFormFilteredEdit.find((option) => option.id === valueSubstFormID) }
            id="autocomplete-subst_form_edit"
            options={tableSubstFormFilteredEdit}
            getOptionLabel={(option) => option.name_rus?option.name_rus:''}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableSubstFormFilteredEdit.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Формы вещества" placeholder="Формы вещества" required/>;
            }}                 
          />   
          </td>
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>
          <td style={{ width: '290px'}}>            
            <Autocomplete
              size="small"
              disabled={(valueID !== null)}
              value={tableChemCompGrFilteredEdit.find((option) => option.id === valueChemCompGrID) || null}
              onChange={(event, newValueAC) => { setValueChemCompGrID(newValueAC ? newValueAC.id : null); }}              
              id="autocomplete-chem_comp_gr_dialog"
              options={ tableChemCompGrFilteredEdit }
              getOptionLabel={(option) => option.name_rus}
              renderInput={(params) => {
                const inputProps = {
                  ...params.inputProps,
                  value: tableSubstFormFilteredEdit.length===0 ? "Выбор отсутствует" : params.inputProps.value,
                };
                return <TextField {...params} inputProps={inputProps} label="Химическое соединение (группа)" placeholder="Химическое соединение (группа)" />;
              }}                  
            />
          </td>
        </tr>
        </tbody></table>  
        <p></p>
        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>
          <td style={{ width: '290px'}}>
            &nbsp;       
          </td>                  
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>
          <td style={{ width: '290px'}}> 
          <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selAerosolSolValues.length===1)}
            value={tableAerosolSolFilteredEdit.find((option) => option.id === valueAerosolSolID)  }
            id="autocomplete-aerosol_sol_edit"
            options={tableAerosolSolFilteredEdit}
            getOptionLabel={(option) => option.name_rus?option.name_rus:''}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableAerosolSolFilteredEdit.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="Типы растворимости аэрозолей" placeholder="Типы растворимости аэрозолей" required/>;
            }}                 
          />        
          </td>
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>
          <td style={{ width: '250px'}}>      
          <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selAerosolAMADValues.length===1)}
            value={tableAerosolAMADFilteredEdit.find((option) => option.id === valueAerosolAMADID) || null}
            id="autocomplete-aerosol_amad_edit"
            options={tableAerosolAMADFilteredEdit}
            onChange={(event, newValueAC) => { setValueAerosolAMADID(newValueAC ? newValueAC.id : null); }}              
            getOptionLabel={(option) => option.name_rus?option.name_rus:''}
            renderInput={(params) => {
              const inputProps = {
                ...params.inputProps,
                value: tableAerosolAMADFilteredEdit.length===0 ? "Выбор отсутствует" : params.inputProps.value,
              };
              return <TextField {...params} inputProps={inputProps} label="AMAD аэрозолей" placeholder="AMAD аэрозолей" required/>;
            }}                 
          />        
          </td>

        </tr>
        </tbody></table>  
        <p></p>
        <Divider />
        <p></p>

        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td style={{ width: '290px'}}>            
          <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selPeopleClassValues.length===1)}
            value={tablePeopleClassFilteredEdit.find((option) => option.id === valuePeopleClassID)  }
            onChange={(event, newValueAC) => { console.log('aaa '+newValueAC?newValueAC.id:-1); setValuePeopleClassID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-people_class_edit"
            options={ tablePeopleClassFilteredEdit }
            getOptionLabel={(option) => option.name_rus}
            renderInput={(params) => (
              <TextField {...params} label="Тип облучаемых лиц" placeholder="Тип облучаемых лиц" />
            )}
          />
          </td>
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>
          <td style={{ width: '290px'}}>  
          <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selAgeGroupValues.length===1)}
            value={tableAgeGroupFilteredEdit.find((option) => option.id === valueAgeGroupID) }
            onChange={(event, newValueAC) => { console.log('aaa '+newValueAC?newValueAC.id:-1); setValueAgeGroupID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-agegroup_edit"
            options={ tableAgeGroupFilteredEdit }
            getOptionLabel={(option) => option.name_rus}
            renderInput={(params) => (
              <TextField {...params} label="Возрастная группа населения" placeholder="Возрастная группа населения" />
            )}
          />

          </td>
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>
          <td style={{ width: '290px'}}>            
          <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selExpScenarioValues.length===1)}
            value={tableExpScenarioFilteredEdit.find((option) => option.id === valueExpScenarioID)  }
            onChange={(event, newValueAC) => { console.log('aaa '+newValueAC?newValueAC.id:-1); setValueExpScenarioID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-exp_scenario_edit"
            options={ tableExpScenarioFilteredEdit }
            getOptionLabel={(option) => option.name_rus}
            renderInput={(params) => (
              <TextField {...params} label="Сценарий поступления" placeholder="Сценарий поступления" />
            )}
          />
          </td>
        </tr>
        </tbody></table>  
        <p></p>
        <Divider />
        <p></p>
        <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td style={{ width: '290px'}}> 
          <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selDataSourceValues.length===1)}
            value={tableDataSourceFilteredEdit.find((option) => option.id === valueDataSourceID) }
            onChange={(event, newValueAC) => { console.log('data_source_edit '+newValueAC?newValueAC.id:-1); setValueDataSourceID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-data_source_edit"
            options={ tableDataSourceFilteredEdit }
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Источник данных" placeholder="Источник данных" />
            )}
          />
          </td>
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>
          <td style={{ width: '290px'}}> 
            <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selIntegralPeriodValues.length===1)}
            value={tableIntegralPeriodFilteredEdit.find((option) => option.id === valueIntegralPeriodID)  }
            onChange={(event, newValueAC) => { setValueIntegralPeriodID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-integral_period_edit"
            options={ tableIntegralPeriodFilteredEdit }
            getOptionLabel={(option) => option.name_rus}
            renderInput={(params) => (
              <TextField {...params} label="Период интегрирования" placeholder="Период интегрирования" />
            )}
          />
          </td>
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>          
          <td style={{ width: '290px'}}>
            &nbsp;
          </td>
        </tr>
        </tbody></table>  

          <p></p>
          <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td style={{ width: '290px'}}>
          <Autocomplete
            size="small"
            disabled={(valueID !== null)||(applFlt.selIsotopeValues.length===1)}
            value={tableIsotopeFiltered.find((option) => option.id === valueIsotopeID)  }
            onChange={(event, newValueAC) => { setValueIsotopeID(newValueAC?newValueAC.id:-1) } }
            id="autocomplete-isotope_edit"
            options={ tableIsotopeFiltered }
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Нуклид" placeholder="Нуклид" />
            )}
          />
          </td>          
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>          
          <td style={{ width: '290px'}}>
            &nbsp;
          </td>
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>          
          <td style={{ width: '290px'}}>
            &nbsp;
          </td>
        </tr>
        </tbody></table>            
          <p></p>
          <Divider />
          <p></p>
          <table border = "0" cellSpacing="0" cellPadding="0"><tbody>
          <tr>      
          <td style={{ width: '596px'}}>
          <TextField
            size="small"
            variant="outlined"
            id="dr_value_edit"
            label="Значение"
            required
            value={valueDrValue || ''}
            fullWidth
            onChange={e => setValueDrValue(e.target.value)}
          />  
          </td>
          <td style={{ width: '16px'}}>  
            &nbsp;
          </td>          
          <td style={{ width: '290px'}}>
          <TextField
            size="small"
            disabled={true}
            variant="outlined"
            id="updatetime_edit"
            label="Дата и время обновления"
            value={valueUpdateTime || ''}
            fullWidth
            onChange={e => setValueUpdateTime(e.target.value)}
          />
        </td>
        </tr>
        </tbody></table>
        </form>                      
          </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseEditNo}>Отмена</Button>
          <Button variant="outlined" onClick={handleCloseEditYes}>Сохранить</Button>
        </DialogActions>
      </Dialog>

  <Dialog open={openDel} onClose={handleCloseDelNo} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
          В таблице "{table_names[props.table_name]}" предложена к удалению  запись:<p></p>Код в БД = <b>{valueID}</b><p></p>
          Вы желаете удалить указанную запись?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseDelNo} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleCloseDelYes} >Да</Button>
      </DialogActions>
  </Dialog>
  </form>
  {(isLoading) && 
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop> }  
  </div>     
  )
}

export { BigTableValueIntDose }
