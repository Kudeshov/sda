/**
 * Модуль, предоставляющий интерфейс пользователя для работы с данными о дозах внутреннего облучения.
 * 
 * Этот модуль подразумевает использование API, реализованное в value_int_dose_queries.
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { table_names } from './table_names';
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import Divider from '@mui/material/Divider';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ReactComponent as CheckDoubleIcon } from "./../icons/check-double.svg";
import { InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import HierarchicalAutocomplete, { transformData } from '../component/HierarchicalAutocomplete';

const MAX_ROWS = 50000;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const StyledIconButton = styled(IconButton)({
  position: 'absolute',
  right: 58, 
  top: '50%',
  transform: 'translateY(-50%)',
  padding: 4, // Уменьшить размер кнопки, но оставить иконку того же размера
});

const filterOptions = (options, { inputValue }) => {
  return options.filter(option => 
    option.title.toLowerCase().includes(inputValue.toLowerCase())
  );
}

const filterOptionsNameRus = (options, { inputValue }) => {
  return options.filter(option => 
    option.name_rus.toLowerCase().includes(inputValue.toLowerCase())
  );
}

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 11,
    borderRadius: 0, 
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.common.white,
  },
}));

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
  const [valueRegionRTID, setValueRegionRTID] = React.useState();
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
  
  const [addedId, setAddedId] = useState();

  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");

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
    setValueRegionRTID(params.row.organ_source_id);
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
  }, [setValueID, setValueIDInitial, setValueDoseRatioID, setValuePeopleClassID, setValueIsotopeID, 
    setValueIntegralPeriodID, setValueOrganID, setValueRegionRTID, setValueLetLevelID, setValueAgeGroupID, 
    setValueDataSourceID, setValueDrValue, setValueChemCompGrID, setValueSubstFormID, setValueAerosolSolID, 
    setValueAerosolAMADID, setValueExpScenarioID, setValueIrradiationID, setValueUpdateTime]); 

  const handleRowClickAndCloseAlert = (rowParams) => {
    handleRowClick(rowParams);
    setOpenAlert(false);
  };    

  // Scrolling and positionning
  const { paginationModel, setPaginationModel, scrollToIndexRef } = useGridScrollPagination(apiRef, tableValueIntDose, setRowSelectionModel);

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
    { field: 'region_rt_name_rus', headerName: 'Регион РТ', width: 200 },    
    { field: 'let_level_name_rus', headerName: 'Уровень ЛПЭ', width: 200 },
    { field: 'data_source_title', headerName: 'Источник данных', width: 200 },
    { field: 'dr_value', headerName: 'Значение', width: 180 },
    { 
      field: 'updatetime', 
      headerName: 'Время последнего изменения', 
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
    selRegionRTValues: [],
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
    selRegionRTValues: [],
  });

  const handleClearFilter = () => {
    setCurrFlt({
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
      selRegionRTValues: [],
    });
  }
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
      if (!regionRTVisible) { newState.selRegionRTValues = []; }

      setOrganVisibleD(organVisible);
      setSubstFormVisibleD(substFormVisible);
      setAerosolSolVisibleD(aerosolSolVisible);
      setAerosolAmadVisibleD(aerosolAmadVisible);
      setLetLevelVisibleD(letLevelVisible);
      setAgegroupVisibleD(agegroupVisible);
      setExpScenarioVisibleD(expScenarioVisible);  
      setRegionRTVisibleD(regionRTVisible);  

          // Обновляем значения состояний
      if (newState.selDataSourceValues[0] && newState.selDataSourceValues[0].id) {
        setValueDataSourceID(newState.selDataSourceValues[0].id);
      }
      if (newState.selDoseRatioValue && newState.selDoseRatioValue.id) {
        setValueDoseRatioID(newState.selDoseRatioValue.id);
      }
      if (newState.selIrradiationValue && newState.selIrradiationValue.id) {
        setValueIrradiationID(newState.selIrradiationValue.id);
      }
      if (newState.selPeopleClassValues[0] && newState.selPeopleClassValues[0].id) {
        setValuePeopleClassID(newState.selPeopleClassValues[0].id);
      }
      if (newState.selSubstFormValues[0] && newState.selSubstFormValues[0].id) {
        setValueSubstFormID(newState.selSubstFormValues[0].id);
      }
      if (newState.selIsotopeValues[0] && newState.selIsotopeValues[0].id) {
        setValueIsotopeID(newState.selIsotopeValues[0].id);
      }
      if (newState.selIntegralPeriodValues[0] && newState.selIntegralPeriodValues[0].id) {
        setValueIntegralPeriodID(newState.selIntegralPeriodValues[0].id);
      }
      if (newState.selOrganValues[0] && newState.selOrganValues[0].id) {
        setValueOrganID(newState.selOrganValues[0].id);
      }
      if (newState.selLetLevelValues[0] && newState.selLetLevelValues[0].id) {
        setValueLetLevelID(newState.selLetLevelValues[0].id);
      }
      if (newState.selAgeGroupValues[0] && newState.selAgeGroupValues[0].id) {
        setValueAgeGroupID(newState.selAgeGroupValues[0].id);
      }
      if (newState.selExpScenarioValues[0] && newState.selExpScenarioValues[0].id) {
        setValueExpScenarioID(newState.selExpScenarioValues[0].id);
      }
      if (newState.selAerosolSolValues[0] && newState.selAerosolSolValues[0].id) {
        setValueAerosolSolID(newState.selAerosolSolValues[0].id);
      }
      if (newState.selAerosolAMADValues[0] && newState.selAerosolAMADValues[0].id) {
        setValueAerosolAMADID(newState.selAerosolAMADValues[0].id);
      }
      // Возвращаем новый объект, который будет новым состоянием
      return newState;
    });
  };

  //массивы, содержащие данные для автокомплитов
  const [tableDataSource, setTableDataSource] = useState([]); 
  const [tableDataSourceFiltered, setTableDataSourceFiltered] = useState([]);    
  const [tableDataSourceFilteredEdit, settableDataSourceFilteredEdit] = useState([]); 

  const [tableOrgan, setTableOrgan] = useState([]);
  const [tableOrganFiltered, settableOrganFiltered] = useState([]);
  const [tableOrganFilteredNP, settableOrganFilteredNP] = useState([]); //without parents

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
  const [tableExpScenarioFilteredNP, settableExpScenarioFilteredNP] = useState([]); //Сценарии поступления
  const [tablePeopleClass, setTablePeopleClass] = useState([]); //Типы облучаемых лиц
  const [tablePeopleClassFiltered, settablePeopleClassFiltered] = useState([]); //Типы облучаемых лиц  

  const [tableRegionRT, setTableRegionRT] = useState([]); //Регион РТ
  const [tableRegionRTFiltered, settableRegionRTFiltered] = useState([]); //Регион РТ
  const [tableRegionRTFilteredNP, settableRegionRTFilteredNP] = useState([]); //without parents

  //это только для добавления в автокомплит
  const [tableChemCompGr, setTableChemCompGr] = useState([]);  
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
  const [searchValueRegionRT, setSearchValueRegionRT] = useState('');

  // Состояния, определяющие видимость выпадающих списков
  const [organVisible, setOrganVisible] = useState(false);
  const [substFormVisible, setSubstFormVisible] = useState(false);
  const [aerosolSolVisible, setAerosolSolVisible] = useState(false);
  const [aerosolAmadVisible, setAerosolAmadVisible] = useState(false);
  const [letLevelVisible, setLetLevelVisible] = useState(false);
  const [agegroupVisible, setAgegroupVisible] = useState(false);
  const [expScenarioVisible, setExpScenarioVisible] = useState(false);
  const [regionRTVisible, setRegionRTVisible] = useState(false);
  
  // Состояния, определяющие видимость выпадающих списков в диалоге
  const [organVisibleD, setOrganVisibleD] = useState(false);
  const [substFormVisibleD, setSubstFormVisibleD] = useState(false);
  const [aerosolSolVisibleD, setAerosolSolVisibleD] = useState(false);
  const [aerosolAmadVisibleD, setAerosolAmadVisibleD] = useState(false);
  const [letLevelVisibleD, setLetLevelVisibleD] = useState(false);
  const [agegroupVisibleD, setAgegroupVisibleD] = useState(false);
  const [expScenarioVisibleD, setExpScenarioVisibleD] = useState(false);
  const [regionRTVisibleD, setRegionRTVisibleD] = useState(false);

  useEffect(() => { 
    let isOrganVisible = false;
    let isLetLevelVisible = false;
    
    if ((currFlt.selDoseRatioValue && currFlt.selDoseRatioValue.hasOwnProperty('id')) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableIntDoseAttr.forEach(item => {
        const matchDoseRatio = currFlt.selDoseRatioValue && item.dose_ratio_id === currFlt.selDoseRatioValue.id;
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchDoseRatio && matchDataSource){
          if(item.organ_id >= 0) isOrganVisible = true;
          if(item.let_level_id >= 0) isLetLevelVisible = true;
        }
      });
    }
  
    setOrganVisible(isOrganVisible);
    setLetLevelVisible(isLetLevelVisible);
    if (!isOrganVisible)
      updateCurrentFilter({ selOrganValues: [] });     
    if (!isLetLevelVisible)
      updateCurrentFilter({ selLetLevelValues: [] });
 
    // Получаем все уникальные data_source_id из tableIntDoseAttr
    const uniqueDataSourceIds = [...new Set(tableIntDoseAttr.map(item => item.data_source_id))];
    // Фильтруем tableDataSource по уникальным data_source_id
    const filteredDataSource = tableDataSource.filter(item => uniqueDataSourceIds.includes(item.id));
    // Устанавливаем отфильтрованные данные в состояние
    setTableDataSourceFiltered(filteredDataSource);      
  }, [ tableIntDoseAttr, tableDataSource, currFlt.selDoseRatioValue, currFlt.selDataSourceValues ]);
  
  
  useEffect(() => { 
    let isSubstFormVisible = false;
    
    if ((currFlt.selIrradiationValue && currFlt.selIrradiationValue.hasOwnProperty('id')) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableIntDoseAttr.forEach(item => {
        const matchIrradiation = currFlt.selIrradiationValue && item.irradiation_id === currFlt.selIrradiationValue.id;
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchIrradiation && matchDataSource){
          if(item.subst_form_id >= 0) isSubstFormVisible = true;
        }
      });
    }
    
    setSubstFormVisible(isSubstFormVisible);
    if (!isSubstFormVisible)
      updateCurrentFilter({ selSubstFormValues: [] }); 
  }, [tableIntDoseAttr, currFlt.selIrradiationValue, currFlt.selDataSourceValues]);
  
  useEffect(() => { 
    let isAerosolSolVisible = false;
    let isAerosolAmadVisible = false;
    let isRegionRTVisible = false;
    if ((currFlt.selSubstFormValues && currFlt.selSubstFormValues.length > 0) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableIntDoseAttr.forEach(item => {
        const matchSubstForm = currFlt.selSubstFormValues.some(substForm => substForm.id === item.subst_form_id);
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchSubstForm && matchDataSource){
          if(item.aerosol_sol_id >= 0) isAerosolSolVisible = true;
          if(item.aerosol_amad_id >= 0) isAerosolAmadVisible = true;
          if(item.organ_source_id >= 0) isRegionRTVisible = true;
        }
      });
    }
  
    setAerosolSolVisible(isAerosolSolVisible);
    if (!isAerosolSolVisible)
      updateCurrentFilter({ selAerosolSolValues: [] }); 
  
    setAerosolAmadVisible(isAerosolAmadVisible);
    if (!isAerosolAmadVisible)
      updateCurrentFilter({ selAerosolAMADValues: [] });     

    setRegionRTVisible(isRegionRTVisible);
    if (!isRegionRTVisible)
      updateCurrentFilter({ selRegionRTValues: [] });     
  
  }, [tableIntDoseAttr, currFlt.selSubstFormValues, currFlt.selDataSourceValues]);

  useEffect(() => { 
    let isAgegroupVisible = false;
    let isExpScenarioVisible = false;
    
    if ((currFlt.selPeopleClassValues && currFlt.selPeopleClassValues.length > 0) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableIntDoseAttr.forEach(item => {
        const matchPeopleClass = currFlt.selPeopleClassValues.some(peopleClass => peopleClass.id === item.people_class_id);
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchPeopleClass && matchDataSource){
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
  }, [tableIntDoseAttr, currFlt.selPeopleClassValues, currFlt.selDataSourceValues]);

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
  
  function addParentItems(item, sourceTable, targetTable) {
    if (!item || !item.parent_id) return;
  
    const parentItem = sourceTable.find(e => e.id === item.parent_id);
  
    if (parentItem) {
      // Проверить, есть ли уже родительский элемент в targetTable
      if (!targetTable.some(e => e.id === parentItem.id)) {
        targetTable.push(parentItem);
      }
      // Рекурсивно идем вверх по дереву
      addParentItems(parentItem, sourceTable, targetTable);
    }
  }

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
      updateCurrentFilter({ selDoseRatioValue: [] });

    // то же самое для остальных автокомплитов
    let ids_irradiation = tableDataSourceClass.filter(item => ((item.table_name === 'irradiation' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIrradiation = tableIrradiation.filter(item => ((ids_irradiation.includes(item.id))) );
    const prefix = "INT_";
    filteredIrradiation = filteredIrradiation.filter(irradiation => irradiation.title.startsWith(prefix));

    settableIrradiationFiltered( filteredIrradiation ); 
    if ((filteredIrradiation&&currFlt.selIrradiationValue)&&(!filteredIrradiation.some(item => item.id === currFlt.selIrradiationValue.id) )) 
      updateCurrentFilter({ selIrradiationValue: [] });

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

    let ids_region_rt = tableDataSourceClass.filter(item => ((item.table_name === 'organ' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredRegionRT = tableRegionRT.filter(item => ((ids_region_rt.includes(item.id))) );
    settableRegionRTFilteredNP([...filteredRegionRT]);  // используем spread operator, чтобы передать копию массива
    // Добавление родительских элементов
    filteredRegionRT.forEach(item => {
      addParentItems(item, tableRegionRT, filteredRegionRT);
    });    
    settableRegionRTFiltered( filteredRegionRT );       
    //удалить недоступные значения из фильтра
    const newRegionRTValues = currFlt.selRegionRTValues.filter((value) => 
      filteredRegionRT.some((filteredValue) => filteredValue.id === value.id));
    updateCurrentFilter({ selRegionRTValues: newRegionRTValues });           

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
    settableOrganFilteredNP([...filteredOrgan]);  // используем spread operator, чтобы передать копию массива
    filteredOrgan.forEach(item => {
      addParentItems(item, tableOrgan, filteredOrgan);
    });
    settableOrganFiltered(filteredOrgan);
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
    settableExpScenarioFilteredNP([...filteredExpScenario]);  // используем spread operator, чтобы передать копию массива
    // Добавление родительских элементов
    filteredExpScenario.forEach(item => {
      addParentItems(item, tableExpScenario, filteredExpScenario);
    });
    
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
      regionRTVisible,
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
      tableIntDoseAttr,
      tableRegionRT
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
    if (valueIDInitial) {
      const foundRow = tableValueIntDose.find(row => row.id === valueIDInitial);
      if (foundRow) {
        handleRowClick({ row: foundRow });
      }
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
    if (formRefDialog.current.reportValidity() ) {
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
  
        const responseText = await response.text();
  
        setAlertSeverity(response.ok ? "success" : "error");
        setAlertText(responseText);
        setOpenAlert(true);
      } catch (err) {
        setAlertText(err.message);
        setAlertSeverity('error');
        setOpenAlert(true);
      } finally {
        setIsLoading(false);
        reloadData();     
      }
    }
  };
  
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
const addRec = async () => {
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
    irradiation_id: valueIrradiationID,
    organ_source_id: valueRegionRTID,
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

    let responseText = await response.text();
    
    if (responseText.includes('value_int_dose_1_uidx')) {
      responseText = 'Запись не добавлена. Запись с таким набором значений классификаторов уже существует';
    } else if (response.ok) {
      responseText = 'Запись добавлена';
      reloadData(true);
    }
    
    setAlertSeverity(response.ok ? "success" : "error");
    setAlertText(responseText);
    setOpenAlert(true);

  } catch (err) {
    const errorMessage = err.message.includes('value_int_dose_1_uidx') 
      ? 'Запись не добавлена. Запись с таким набором значений классификаторов уже существует'
      : err.message;

    setAlertSeverity('error');
    setAlertText(errorMessage);
    setOpenAlert(true);
  } finally {
    setIsLoading(false);
  }
};
/////////////////////////////////////////////////////////////////// DELETE /////////////////////

const delRec = async () => {

  const sortedAndFilteredRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const deletingRowIndex = sortedAndFilteredRowIds.indexOf(Number(valueID));
  let previousRowId = 0;
  if (deletingRowIndex > 0) {
    previousRowId = sortedAndFilteredRowIds[deletingRowIndex - 1];
  } else {
    previousRowId = sortedAndFilteredRowIds[deletingRowIndex + 1];
  }

  setIsLoading(true);

  try {
    const response = await fetch(`/${props.table_name}/` + valueID, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
      },
    });

    const responseText = await response.text();

    setAlertSeverity(response.ok ? "success" : "error");
    setAlertText(responseText);
    setOpenAlert(true); 

    if (response.ok) {
      // Переключаемся на предыдущую запись после удаления
      if (previousRowId)
      {
        setValueID(previousRowId);
        setAddedId(previousRowId);
      }
      else
      {
        if (tableValueIntDose[0]) {
          setValueID(tableValueIntDose[0].id);
          setAddedId(tableValueIntDose[0].id);
        }
      }          
      reloadData();
/*       if (tableValueIntDose && tableValueIntDose.length > 0) {
        handleRowClick({ row: tableValueIntDose[0] });
      } */
    }
  } catch (err) {
    setAlertText(err.message);
    setAlertSeverity('error');
    setOpenAlert(true);
  } finally {
    setIsLoading(false);
  }
};

const fetchData = async (url, setStateFunc) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    setStateFunc(data);
  } catch (error) {
    console.error(`Failed to fetch data from ${url}: ${error.message}`);
  }
}

useEffect(() => {
  fetchData('/data_source', setTableDataSource);
  fetchData(`/data_source_class_min`, setTableDataSourceClass);
  fetchData(`/irradiation`, setTableIrradiation);
  fetchData(`/isotope_min`, setTableIsotope);
  fetchData(`/integral_period/`, setTableIntegralPeriod);
  fetchData(`/dose_ratio/`, setTableDoseRatio);
  fetchData(`/let_level/`, setTableLetLevel);
  fetchData(`/agegroup/`, setTableAgeGroup);
  fetchData(`/subst_form/`, setTableSubstForm);
  fetchData(`/aerosol_sol/`, setTableAerosolSol);
  fetchData(`/aerosol_amad/`, setTableAerosolAMAD);
  fetchData(`/exp_scenario/`, setTableExpScenario);
  fetchData(`/people_class/`, setTablePeopleClass);
  fetchData(`/chem_comp_gr_min/`, setTableChemCompGr);
  fetchData(`/int_dose_attr`, setTableIntDoseAttr);

  // Загружаем все органы и сохраняем их в setTableOrgan
  fetchData(`/organ`, data => {
    setTableOrgan(data);

    // Фильтрация данных по заданному критерию
    const filterByTitle = (title, arr) => {
      let filteredData = [];
      for (const item of arr) {
        if (item.parent_id === title) {
          filteredData.push(item);
          filteredData = filteredData.concat(filterByTitle(item.id, arr));
        }
      }
      return filteredData;
    };

    const rootRT = data.find(item => item.title === '_RT');
    if (rootRT) {
      const filteredData = filterByTitle(rootRT.id, data);
      setTableRegionRT([rootRT, ...filteredData]);
    }
  });

}, [props.table_name]);

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
    'region_rt_name_rus': 'selRegionRTValues',
    'exp_scenario_name_rus': 'selExpScenarioValues', 
    'people_class_name_rus': 'selPeopleClassValues',
    'data_source_title': 'selDataSourceValues' 
  };

  for (let colName in specialCols) {
    let currFltName = specialCols[colName];
    const noFilterValues = !flt[currFltName] || flt[currFltName].length === 0;
    
    if (noFilterValues) {
      columnsToShow[colName] = false; // скрываем колонку, если в фильтре не выбрано ни одного значения
    } else {
      const onlyOneFilterValue = flt[currFltName] && flt[currFltName].length === 1;
      let allColumnValuesSame = onlyOneFilterValue;
      if (data.length > 0) {
        allColumnValuesSame = onlyOneFilterValue && data.every((row) => row[colName] === data[0][colName]);
      }
      columnsToShow[colName] = !allColumnValuesSame;
    }
  }

  return columnsToShow;
}, []);

/* 

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
      'region_rt_name_rus': 'selRegionRTValues',
      'exp_scenario_name_rus': 'selExpScenarioValues', 
      'people_class_name_rus': 'selPeopleClassValues',
      'data_source_title': 'selDataSourceValues' 
    };
    
    if (data.length === 0) {
      for (let key in specialCols) {
        columnsToShow[key] = false;
      }
      console.log('data.length ', data.length, columnsToShow); 
      return columnsToShow;
    }    
  
    if (!data[0]) {
      throw new Error('The first item in the data array is null or undefined');
    }
  
    const columnNames = Object.keys(data[0]);

    console.log('selOrganValues ', currFlt.selOrganValues);
  
    columnNames.forEach((colName) => {
      if (colName in columnsToShow) return;
      if (colName in specialCols) {
        let currFltName = specialCols[colName];
        const noFilterValues = !flt[currFltName] || flt[currFltName].length === 0;
        if (noFilterValues) {
          columnsToShow[colName] = false; // скрываем колонку, если в фильтре не выбрано ни одного значения
        } else {
          const onlyOneFilterValue = flt[currFltName] && flt[currFltName].length === 1;
          const allColumnValuesSame = onlyOneFilterValue && data.every((row) => row[colName] === data[0][colName]);
          columnsToShow[colName] = !allColumnValuesSame;
        }
      } else {
        columnsToShow[colName] = false;
      } 
    });
    return columnsToShow;
  }, []); */
  
  const [vidColumnVisibilityModel, setVidColumnVisibilityModel] = useState();

  const getIdList = (item) => {
    return Array.isArray(item) ? item.map(item => item.id).join(',') : item?.id || [];
  }
  
  const reloadData = React.useCallback(async (wasAddOperation = false) => {

    if ((!applFlt.selDataSourceValues) || (applFlt.selDataSourceValues.length === 0)) {
      setTableValueIntDose([]);
      return;
    }
  
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        data_source_id: getIdList(applFlt.selDataSourceValues),
        organ_id: getIdList(applFlt.selOrganValues),
        irradiation_id: getIdList(applFlt.selIrradiationValue),
        isotope_id: getIdList(applFlt.selIsotopeValues),
        integral_period_id: getIdList(applFlt.selIntegralPeriodValues),
        dose_ratio_id: getIdList(applFlt.selDoseRatioValue),
        let_level_id: getIdList(applFlt.selLetLevelValues),
        agegroup_id: getIdList(applFlt.selAgeGroupValues),
        subst_form_id: getIdList(applFlt.selSubstFormValues),
        aerosol_sol_id: getIdList(applFlt.selAerosolSolValues),
        aerosol_amad_id: getIdList(applFlt.selAerosolAMADValues),
        exp_scenario_id: getIdList(applFlt.selExpScenarioValues),
        people_class_id: getIdList(applFlt.selPeopleClassValues),
        organ_source_id: getIdList(applFlt.selRegionRTValues),
        page: pageState.page + 1,
        pagesize: pageState.pageSize
      });
  
      const response = await fetch(`/value_int_dose?${params}`); 
  
      if (!response.ok) {
        setAlertSeverity("false");
        setAlertText(`Ошибка при обновлении данных: ${response.status}`);
        throw new Error(`${response.status} (${response.statusText})`);
      }
      
      const result = await response.json();
      const vidColumnVisibilityModel1 = checkColumns(result, applFlt);
      setTableValueIntDose(result);
      setVidColumnVisibilityModel(vidColumnVisibilityModel1);

      console.log( 'vidColumnVisibilityModel', vidColumnVisibilityModel1 );
      console.log( 'result.length', result.length );
      if (result && result.length >= MAX_ROWS) {
        setAlertSeverity("warning");
        setAlertText(`Внимание, отобрано первые ${MAX_ROWS} строк. Укажите более строгий фильтр, чтобы уточнить результат.`);
      } 

      console.log( 'if (result && result.length > 0) {' );

      if (result && result.length > 0) {
          if (wasAddOperation) {
            const max_id = Math.max(...result.map(item => item.id));
            console.log( 'max_id', max_id );
            scrollToIndexRef.current = max_id;
            setAddedId(max_id);
          }
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [applFlt, pageState, checkColumns, scrollToIndexRef]);


  useEffect(() => {
    if (addedId !== null){  
        scrollToIndexRef.current = addedId;
        setAddedId(null);
        //setEditStarted(false);
        setRowSelectionModel([addedId]);
    }
  }, [addedId, scrollToIndexRef]);

  
const [shouldReload, setShouldReload] = useState(false);

useEffect(() => {
  if ((!applFlt.selDataSourceValues) || (applFlt.selDataSourceValues.length === 0)) {
    setTableValueIntDose([]);
    return;
  }  

  setShouldReload(true);  // Устанавливаем shouldReload в true при изменении фильтра
}, [applFlt]);

useEffect(() => {
  if (shouldReload) {  // Если shouldReload равен true, вызываем reloadData
    const fetchData = async () => {
      try {
        await reloadData();
        setAlertSeverity("info");
        setAlertText('Данные успешно загружены');
        setIsTableExpanded(true);
      } catch (e) {
        setAlertSeverity("error");
        setAlertText(`Ошибка при обновлении данных: ${e.message}`);
      } finally {
        setOpenAlert(true);
        setShouldReload(false);  // Устанавливаем shouldReload обратно в false после загрузки данных
      }
    }
    fetchData();
  }
}, [shouldReload, reloadData]);

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
const [tableIsotopeFilteredEdit, settableIsotopeFilteredEdit] = useState([]);
const [tableRegionRTFilteredEdit, settableRegionRTFilteredEdit] = useState([]);

useEffect(() => { settableDataSourceFilteredEdit(applFlt.selDataSourceValues); }, [applFlt.selDataSourceValues]);
useEffect(() => { settableOrganFilteredEdit(applFlt.selOrganValues); }, [applFlt.selOrganValues]);
useEffect(() => { settableLetLevelFilteredEdit(applFlt.selLetLevelValues); }, [applFlt.selLetLevelValues]);
useEffect(() => { settableAerosolSolFilteredEdit(applFlt.selAerosolSolValues); }, [applFlt.selAerosolSolValues]);
useEffect(() => { settableSubstFormFilteredEdit(applFlt.selSubstFormValues); }, [applFlt.selSubstFormValues]);
useEffect(() => { settableAerosolAMADFilteredEdit(applFlt.selAerosolAMADValues); }, [applFlt.selAerosolAMADValues]);
useEffect(() => { settablePeopleClassFilteredEdit(applFlt.selPeopleClassValues); }, [applFlt.selPeopleClassValues]);
useEffect(() => { settableAgeGroupFilteredEdit(applFlt.selAgeGroupValues); }, [applFlt.selAgeGroupValues]);
useEffect(() => { settableExpScenarioFilteredEdit(applFlt.selExpScenarioValues); }, [applFlt.selExpScenarioValues]);
useEffect(() => { settableIntegralPeriodFilteredEdit(applFlt.selIntegralPeriodValues); }, [applFlt.selIntegralPeriodValues]);
useEffect(() => { settableIsotopeFilteredEdit(applFlt.selIsotopeValues); }, [applFlt.selIsotopeValues]);
useEffect(() => { settableRegionRTFilteredEdit(applFlt.selRegionRTValues); }, [applFlt.selRegionRTValues]);

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

  const filteredTableChemCompGr = filterTable('chem_comp_gr', tableChemCompGr);

  settableChemCompGrFilteredEdit(filteredTableChemCompGr);
     
}, [tableDataSourceClass, valueDataSourceID, tableChemCompGr]);

const reloadDataHandler = async () => {
  if (formRef.current.reportValidity()) {
    try {
      await applyFilter();
      setAlertSeverity("info");
      setAlertText('Данные успешно загружены');
      setIsFilterExpanded(false);
    } catch (e) {
      setAlertSeverity("error");
      setAlertText(`Ошибка при загрузке данных: ${e.message}`);
    } finally {
      setOpenAlert(true);
    }
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
      const rows = getRowsToExport();
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
        <IconButton onClick={()=>handleClickEditNew()} disabled={false} color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>

        <IconButton onClick={()=>handleClickEdit()} disabled={(!valueID || !tableValueIntDose || tableValueIntDose.length === 0 )} color="primary" size="small" title="Редактировать запись">
          <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton> 

        <IconButton onClick={()=>handleClickDelete()} disabled={(!valueID || !tableValueIntDose || tableValueIntDose.length === 0 )} color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>

        <IconButton onClick={()=>setShouldReload(true)} color="primary" size="small" title="Обновить данные">
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

  const GetFilterCaption = useCallback(() => {

    if (JSON.stringify(currFlt) !== JSON.stringify(applFlt) || (currFlt.selDataSourceValues&&currFlt.selDataSourceValues.length===0) )  {
      return (
        <><br />Нажмите кнопку "Получить данные", чтобы отобразить таблицу.</>
      );
    }
    return (
      <><br />
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
            {applFlt.selRegionRTValues.length === 1 ? `, ${applFlt.selRegionRTValues[0].name_rus}` : ''}
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
  
  }, [applFlt, currFlt]);

  const [filterCaption, setFilterCaption] = useState(GetFilterCaption());

  useEffect(() => {
    setFilterCaption(GetFilterCaption());
  }, [currFlt, GetFilterCaption]);
  
  const formRef = React.useRef();
  const formRefDialog = React.useRef();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


const treeDataOrganFilteredEdit = React.useMemo(() => {
  const transformedData = transformData(tableOrgan, tableOrganFilteredEdit);
  return transformedData;
}, [tableOrgan, tableOrganFilteredEdit]);

  const treeDataExpScenarioFilteredEdit = React.useMemo(() => 
    transformData(tableExpScenario, tableExpScenarioFilteredEdit), [tableExpScenario, tableExpScenarioFilteredEdit]);

  const treeTableOrgan = React.useMemo(() => 
    transformData(tableOrganFiltered, tableOrganFiltered), [tableOrganFiltered]);

  const treeTableExpScenario = React.useMemo(() => 
    transformData(tableExpScenarioFiltered, tableExpScenarioFiltered), [tableExpScenarioFiltered]);

  const treeTableRegionRT = React.useMemo(() => 
    transformData(tableRegionRTFiltered, tableRegionRTFiltered), [tableRegionRTFiltered]);

  const treeDataRegionRTFilteredEdit = React.useMemo(() => 
    transformData(tableRegionRT, tableRegionRTFilteredEdit), [tableRegionRT, tableRegionRTFilteredEdit]);

  
  // основной генератор страницы
  return(
    <div>
    <form ref={formRef}>  
      {/* аккордеон по страницам */} 
      <Accordion expanded={isFilterExpanded} onChange={() => setIsFilterExpanded(!isFilterExpanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography variant="body2">{/* {table_names['value_int_dose']}.  */}Фильтр</Typography>
        </AccordionSummary>

        <AccordionDetails>
        <Grid container spacing={1.5}>
          <Grid item xs={3}>
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  options={tableDataSourceFiltered}
                  onClose={() => { setSearchValueDataSource(""); }}
                  getOptionLabel={(option) => option.title}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <li {...props}/*  style={{ height: '35px', }} */>
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueDataSource && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptions(tableDataSource, { inputValue: searchValueDataSource });
                                    const newValues = [...currFlt.selDataSourceValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selDataSourceValues: newValues,
                                    });
                                    setSearchValueDataSource("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}                        
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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={() => {
                    handleChangeDataSource(null, tableDataSource);
                  }}
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> {/* container spacing={1} */}       
          </Grid> {/* item */}
          <Grid item xs={3}>
          </Grid>
          <Grid item xs={3}>
          </Grid>
          <Grid item xs={3}>
          </Grid>
 
          <Grid item xs={3}>
           <Grid item xs={11}>
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
          </Grid>
          <Grid item xs={1} display="flex" alignItems="center">
          </Grid>          
          </Grid>
          <Grid item xs={3}>
            { organVisible && ( 
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueOrgan(""); }}
                  inputValue={searchValueOrgan}
                  multiple
                  limitTags={7}
                  id="autocomplete-organ"
                  options={treeTableOrgan}
                  getOptionDisabled={(option) => !tableOrganFilteredNP.some(item => item.id === option.id)}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <div
                      {...props}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: `${10 + option.level * 20}px`,
                      }}
                    >
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
                    </div>
                  )}                  
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueOrgan && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableOrganFilteredNP, { inputValue: searchValueOrgan });
                                    const newValues = [...currFlt.selOrganValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selOrganValues: newValues,
                                    });
                                    setSearchValueOrgan("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}                       
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

              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selOrganValues: tableOrganFilteredNP,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> 
            )}  {/* container spacing={1} */}
          </Grid>
          <Grid item xs={3}>
            { letLevelVisible && ( 
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueLetLevel(""); }}
                  inputValue={searchValueLetLevel}
                  multiple
                  id="autocomplete-let_level"
                  options={tableLetLevelFiltered}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueLetLevel && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableLetLevelFiltered, { inputValue: searchValueLetLevel });
                                    const newValues = [...currFlt.selLetLevelValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selLetLevelValues: newValues,
                                    });
                                    setSearchValueLetLevel("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}                      
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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selLetLevelValues: tableLetLevelFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> 
            )}  {/* container spacing={1} */}
          </Grid>

          <Grid item xs={3}>
          </Grid>          

          <Grid item xs={3}>
            <Grid item xs={11}>
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
            </Grid><Grid item xs={1} display="flex" alignItems="center"></Grid>                
          </Grid>

          <Grid item xs={3}>
            { substFormVisible && ( 
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueSubstForm(""); }}
                  inputValue={searchValueSubstForm}
                  multiple
                  id="autocomplete-subst_form"
                  options={tableSubstFormFiltered}
                  disabled={ (!currFlt.selDataSourceValues.length) || (!currFlt.selIrradiationValue) }
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueSubstForm && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableSubstFormFiltered, { inputValue: searchValueSubstForm });
                                    const newValues = [...currFlt.selSubstFormValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selSubstFormValues: newValues,
                                    });
                                    setSearchValueSubstForm("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}

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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selSubstFormValues: tableSubstFormFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> 
            )}  {/* container spacing={1} */}
          </Grid>         

          { aerosolSolVisible && (  
          <Grid item xs={3}>
            
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueAerosolSol(""); }}
                  inputValue={searchValueAerosolSol}
                  multiple
                  id="autocomplete-aerosol_sol"
                  options={tableAerosolSolFiltered}
                  disabled={ !currFlt.selDataSourceValues.length }
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <li {...props} /* style={{ height: '35px', }} */>
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueAerosolSol && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableAerosolSolFiltered, { inputValue: searchValueAerosolSol });
                                    const newValues = [...currFlt.selAerosolSolValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selAerosolSolValues: newValues,
                                    });
                                    setSearchValueAerosolSol("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}

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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selAerosolSolValues: tableAerosolSolFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> {/* container spacing={1} */}
          </Grid>
          )}

          {/* AMAD */}
          <Grid item xs={3}>
            { aerosolAmadVisible && ( 
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueAerosolAMAD(""); }}
                  inputValue={searchValueAerosolAMAD}
                  limitTags={7}
                  multiple
                  id="autocomplete-aerosol_amad"
                  options={tableAerosolAMADFiltered}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueAerosolAMAD && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableAerosolAMADFiltered, { inputValue: searchValueAerosolAMAD });
                                    const newValues = [...currFlt.selAerosolAMADValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selAerosolAMADValues: newValues,
                                    });
                                    setSearchValueAerosolAMAD("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selAerosolAMADValues: tableAerosolAMADFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> 
            )}  {/* container spacing={1} */}

          {/* пока эти опции взаимоисключающие, запихнем в одну ячейку */}
          { regionRTVisible && (   
          <Grid container spacing={1}> 
              <Grid item xs={11}>
              <Autocomplete
                  size="small"
                  value={currFlt.selRegionRTValues}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, newValue) => {
                    setCurrFlt({
                      ...currFlt,
                      selRegionRTValues: newValue,
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                      setSearchValueRegionRT(newInputValue);
                    }
                  }}
                  onClose={() => { setSearchValueRegionRT(""); }}
                  inputValue={searchValueRegionRT}
                  limitTags={7}
                  multiple
                  id="autocomplete-region_rt"
                  options={treeTableRegionRT}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  getOptionDisabled={(option) => !tableRegionRTFilteredNP.some(item => item.id === option.id)}
                  renderOption={(props, option, { selected }) => (
                    <div
                      {...props}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: `${10 + option.level * 20}px`,
                      }}
                    >
                      {/* {option.children.length > 0 && <ExpandMoreIcon fontSize="small" />} */}
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
                    </div>
                  )}  
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueRegionRT && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableRegionRTFilteredNP, { inputValue: searchValueRegionRT });
                                    const newValues = [...currFlt.selRegionRTValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selRegionRTValues: newValues,
                                    });
                                    setSearchValueRegionRT("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      inputProps={{
                        ...params.inputProps,
                        required: currFlt.selRegionRTValues.length === 0,
                        value: tableRegionRTFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="Регион РТ"
                      placeholder="Регион РТ"
                      required
                    />
                  )}
                />                
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selRegionRTValues: tableRegionRTFilteredNP,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid>)}             
          </Grid>
          {!aerosolSolVisible && (
            <Grid item xs={3}>
          </Grid>)}

          

         {/*  <Grid item xs={2.25}>
          { regionRTVisible && (   
          <Grid container spacing={1}> 
              <Grid item xs={11}>
              <Autocomplete
                  size="small"
                  value={currFlt.selRegionRTValues}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, newValue) => {
                    setCurrFlt({
                      ...currFlt,
                      selRegionRTValues: newValue,
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                      setSearchValueRegionRT(newInputValue);
                    }
                  }}
                  onClose={() => { setSearchValueRegionRT(""); }}
                  inputValue={searchValueRegionRT}
                  limitTags={7}
                  multiple
                  id="autocomplete-region_rt"
                  options={treeTableRegionRT}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <div
                      {...props}
                      style={{
                        height: '35px',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: `${(option.level + (option.children.length === 0 ? 1 : 0)) * 20}px`,
                      }}
                    >
                      {option.children.length > 0 && <ExpandMoreIcon fontSize="small" />}
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
                    </div>
                  )}  
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueRegionRT && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableRegionRTFiltered, { inputValue: searchValueRegionRT });
                                    const newValues = [...currFlt.selRegionRTValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selRegionRTValues: newValues,
                                    });
                                    setSearchValueRegionRT("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      inputProps={{
                        ...params.inputProps,
                        required: currFlt.selRegionRTValues.length === 0,
                        value: tableRegionRTFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="Регион РТ"
                      placeholder="Регион РТ"
                      required
                    />
                  )}
                />                
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selAerosolAMADValues: tableAerosolAMADFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid>)} 
          </Grid> */}

          <Grid item xs={3}>
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValuePeopleClass(""); }}
                  inputValue={searchValuePeopleClass}
                  multiple
                  limitTags={7}
                  id="autocomplete-people_class"
                  options={tablePeopleClassFiltered}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <li {...props} /* style={{ height: '35px', }} */>
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValuePeopleClass && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tablePeopleClassFiltered, { inputValue: searchValuePeopleClass });
                                    const newValues = [...currFlt.selPeopleClassValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selPeopleClassValues: newValues,
                                    });
                                    setSearchValuePeopleClass("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}

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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selPeopleClassValues: tablePeopleClassFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> 
            {/* container spacing={1} */}
          </Grid>

          { agegroupVisible && ( 
          <Grid item xs={3}>
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueAgeGroup(""); }}
                  inputValue={searchValueAgeGroup}
                  multiple
                  id="autocomplete-age_group"
                  options={tableAgeGroupFiltered}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueAgeGroup && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableAgeGroupFiltered, { inputValue: searchValueAgeGroup });
                                    const newValues = [...currFlt.selAgeGroupValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selAgeGroupValues: newValues,
                                    });
                                    setSearchValueAgeGroup("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selAgeGroupValues: tableAgeGroupFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> 
              {/* container spacing={1} */}
          </Grid>
          )}

          <Grid item xs={3}>
            { expScenarioVisible && ( 
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueExpScenario(""); }}
                  inputValue={searchValueExpScenario}
                  multiple
                  limitTags={7}
                  id="autocomplete-exp_scenario"
                  options={treeTableExpScenario}
                  getOptionLabel={(option) => option.name_rus}
                  getOptionDisabled={(option) => !tableExpScenarioFilteredNP.some(item => item.id === option.id)}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <div
                      {...props}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: `${10 + option.level * 20}px`,
                      }}
                    >
                      {/* {option.children.length > 0 && <ExpandMoreIcon fontSize="small" />} */}
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
                    </div>
                  )}                  
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueExpScenario && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableExpScenarioFilteredNP, { inputValue: searchValueExpScenario });
                                    const newValues = [...currFlt.selExpScenarioValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selExpScenarioValues: newValues,
                                    });
                                    setSearchValueExpScenario("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}                      
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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selExpScenarioValues: tableExpScenarioFilteredNP,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid> 
            )}  {/* container spacing={1} */}
          </Grid>

          {!agegroupVisible && (
            <Grid item xs={3}>
          </Grid>)}

          <Grid item xs={3}>
          </Grid>

          <Grid item xs={3}>
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueNuclide(""); }}
                  multiple
                  limitTags={7}
                  id="autocomplete-isotope"
                  options={tableIsotopeFiltered}
                  getOptionLabel={(option) => option.title}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <li {...props} /* style={{ height: '35px', }} */>
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueNuclide && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptions(tableIsotopeFiltered, { inputValue: searchValueNuclide });
                                    const newValues = [...currFlt.selIsotopeValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selIsotopeValues: newValues,
                                    });
                                    setSearchValueNuclide("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
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
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selIsotopeValues: tableIsotopeFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid>  {/* container spacing={1} */}
          </Grid>

          <Grid item xs={3}>
            <Grid container spacing={1}> 
              <Grid item xs={11}>
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
                  onClose={() => { setSearchValueIntegralPeriod(""); }}
                  multiple
                  limitTags={7}
                  id="autocomplete-integral-period"
                  options={tableIntegralPeriodFiltered}
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <li {...props} /* style={{ height: '35px', }} */>
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchValueIntegralPeriod && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableIntegralPeriodFiltered, { inputValue: searchValueIntegralPeriod });
                                    const newValues = [...currFlt.selIntegralPeriodValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selIntegralPeriodValues: newValues,
                                    });
                                    setSearchValueIntegralPeriod("");
                                    params.inputProps.ref.current.blur();
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </StyledIconButton>
                                </LightTooltip>
                              </InputAdornment>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      inputProps={{
                        ...params.inputProps,
                        required: currFlt.selIntegralPeriodValues.length === 0,
                        value: tableIntegralPeriodFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="Периоды интегрирования"
                      placeholder="Периоды интегрирования"
                      required  
                    />
                  )}
                />                       
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <IconButton
                  onClick={async () => {
                    setCurrFlt({
                      ...currFlt,
                      selIntegralPeriodValues: tableIntegralPeriodFiltered,
                    });
                  }}                
                  color="primary"
                  size="small"
                  title="Выбрать все"
                  style={{ marginLeft: -2 }}   
                >
                  <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
                </IconButton>      
              </Grid>
            </Grid>  {/* container spacing={1} */}
          </Grid>                                           
        </Grid  >  {/* all container */}
        <p></p>
          <Button variant="outlined" onClick={reloadDataHandler}>Получить данные</Button>&nbsp;&nbsp;&nbsp;&nbsp; 
          <Button variant="outlined" onClick={handleClearFilter}>Очистить фильтр</Button>  
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={isTableExpanded}  onChange={() => {setIsTableExpanded(!isTableExpanded); }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography variant="body2">Таблица значений { filterCaption } 
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(JSON.stringify(currFlt) === JSON.stringify(applFlt) && (applFlt&&applFlt.selDataSourceValues.length>0) ) && (
            <Grid container>
              <Grid item xs={12}>
                <Box height={360} width="100%" overflow="auto">
                  <DataGrid
                    height={340}
                    style={{ width: windowWidth - 48 }}
                    components={{ Toolbar: CustomToolbar1 }}
                    hideFooterSelectedRowCount={true}
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                    rowHeight={25}
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
                    onRowClick={handleRowClickAndCloseAlert}
                    {...tableValueIntDose}
                  />    
                </Box>          
              </Grid>

              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>


      <Dialog open={openEdit} onClose={handleCloseEditNo} fullWidth={false} maxWidth="960px">
      <DialogTitle>{valueID !== null ? `Редактировать запись, id ${valueID}` : "Добавить запись"}</DialogTitle>
      <Divider />
        <DialogContent style={{height:'380px', width: '1000px'}}>

        <form ref={formRefDialog}> 

        <Grid container spacing={1.5}>
          <Grid item xs={4}>          
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
          </Grid>
          <Grid item xs={4}>
            { organVisibleD && (
              <HierarchicalAutocomplete
              disabled={(valueID !== null)||(applFlt.selOrganValues.length===1)}
              data={treeDataOrganFilteredEdit}
              value={treeDataOrganFilteredEdit.find(item => item.id === valueOrganID) || null}
              onChange={(event, newValue) => setValueOrganID(newValue ? newValue.id : null)}
              size="small"
              fullWidth
              label="Органы и ткани"
              placeholder="Органы и ткани"
              displayField="name_rus"
              getOptionDisabled={(option) => !tableOrganFilteredEdit.some(item => item.id === option.id)}
              />
            )}
          </Grid>
          <Grid item xs={4}>            
            {letLevelVisibleD && ( 
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
              )} 
          </Grid>
          <Grid item xs={4}>
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
          </Grid>
          <Grid item xs={4}>          
            { substFormVisibleD && (           
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
            )} 
          </Grid>
          <Grid item xs={4}>            
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
          </Grid>
          <Divider />
          <Grid item xs={4}>          
            { aerosolSolVisibleD && ( 
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
            )}
          </Grid>
          <Grid item xs={4}>
            { aerosolAmadVisibleD && ( 
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
            )}                 
          </Grid>
          <Grid item xs={4}>
            { regionRTVisibleD && (
              <HierarchicalAutocomplete
              disabled={(valueID !== null)||(applFlt.selRegionRTValues.length===1)}
              data={treeDataRegionRTFilteredEdit}
              value={treeDataRegionRTFilteredEdit.find(item => item.id === valueRegionRTID) || null}
              onChange={(event, newValue) => setValueRegionRTID(newValue ? newValue.id : null)}
              size="small"
              fullWidth
              label="Регион РТ"
              placeholder="Регион РТ"
              displayField="name_rus"
              getOptionDisabled={(option) => !tableRegionRTFiltered.some(item => item.id === option.id)}
              />
            )}
          </Grid>        
          <Divider />
          <Grid item xs={4}>
            <Autocomplete
              size="small"
              disabled={(valueID !== null)||(applFlt.selPeopleClassValues.length===1)}
              value={tablePeopleClassFilteredEdit.find((option) => option.id === valuePeopleClassID)  }
              onChange={(event, newValueAC) => { setValuePeopleClassID(newValueAC?newValueAC.id:-1) } }
              id="autocomplete-people_class_edit"
              options={ tablePeopleClassFilteredEdit }
              getOptionLabel={(option) => option.name_rus}
              renderInput={(params) => (
                <TextField {...params} label="Тип облучаемых лиц" placeholder="Тип облучаемых лиц" />
              )}
            />             
          </Grid>
          <Grid item xs={4}>
            {agegroupVisibleD&&(  
            <Autocomplete
              size="small"
              disabled={(valueID !== null)||(applFlt.selAgeGroupValues.length===1)}
              value={tableAgeGroupFilteredEdit.find((option) => option.id === valueAgeGroupID) }
              onChange={(event, newValueAC) => { setValueAgeGroupID(newValueAC?newValueAC.id:-1) } }
              id="autocomplete-agegroup_edit"
              options={ tableAgeGroupFilteredEdit }
              getOptionLabel={(option) => option.name_rus}
              renderInput={(params) => (
                <TextField {...params} label="Возрастная группа населения" placeholder="Возрастная группа населения" />
              )}
            />
            )}             
          </Grid>
          <Grid item xs={4}>
            {expScenarioVisibleD && (         
              <>
              <HierarchicalAutocomplete
                disabled={(valueID !== null)||(applFlt.selExpScenarioValues.length===1)}
                data={treeDataExpScenarioFilteredEdit}
                value={treeDataExpScenarioFilteredEdit.find(item => item.id === valueExpScenarioID) || null}
                onChange={(event, newValue) => setValueExpScenarioID(newValue ? newValue.id : null)}
                size="small"
                fullWidth
                label="Сценарий поступления"
                placeholder="Сценарий поступления"
                getOptionDisabled={(option) => !tableExpScenarioFilteredEdit.some(item => item.id === option.id)}
              />
{/*               <HierarchicalAutocomplete
                data={treeDataExpScenarioFilteredEdit}
                value={treeDataExpScenarioFilteredEdit.find(item => item.id === valueExpScenarioID) || null}
                onChange={(event, newValue) => setValueExpScenarioID(newValue ? newValue.id : null)}
                size="small"
                fullWidth
                label="Сценарий поступления"
                placeholder="Сценарий поступления"
              />   */}            
{/*              <Autocomplete
              size="small"
              disabled={(valueID !== null)||(applFlt.selExpScenarioValues.length===1)}
              value={tableExpScenarioFilteredEdit.find((option) => option.id === valueExpScenarioID)  }
              onChange={(event, newValueAC) => { setValueExpScenarioID(newValueAC?newValueAC.id:-1) } }
              id="autocomplete-exp_scenario_edit"
              options={ tableExpScenarioFilteredEdit }
              getOptionLabel={(option) => option.name_rus}
              renderInput={(params) => (
                <TextField {...params} label="Сценарий поступления" placeholder="Сценарий поступления" />
              )} 
            />*/}
            </> 
            )}             
          </Grid>
          <Divider />
          <Grid item xs={4}>
            <Autocomplete
              size="small"
              disabled={(valueID !== null)  ||(applFlt.selDataSourceValues.length===1)  }
              value={tableDataSourceFilteredEdit.find((option) => option.id === valueDataSourceID) }
              onChange={(event, newValueAC) => { setValueDataSourceID(newValueAC?newValueAC.id:-1) } }
              id="autocomplete-data_source_edit"
              options={ tableDataSourceFilteredEdit }
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="Источник данных" placeholder="Источник данных" />
              )}
            />             
          </Grid>
          <Grid item xs={4}>
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
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              size="small"
              disabled={(valueID !== null)||(applFlt.selIsotopeValues.length===1)}
              value={tableIsotopeFiltered.find((option) => option.id === valueIsotopeID)  }
              onChange={(event, newValueAC) => { setValueIsotopeID(newValueAC?newValueAC.id:-1) } }
              id="autocomplete-isotope_edit"
              options={ tableIsotopeFilteredEdit }
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="Нуклид" placeholder="Нуклид" />
              )}
            />             
          </Grid> 
          <Divider />
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={2}>
          <Box display="flex" alignItems="center" height="100%">
            {applFlt.selDoseRatioValue && applFlt.selDoseRatioValue.sign} 
          </Box>
        </Grid>
          <Grid item xs={4}>
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
          </Grid>
        </Grid>
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
