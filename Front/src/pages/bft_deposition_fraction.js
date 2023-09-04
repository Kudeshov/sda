/**
 * Модуль, предоставляющий интерфейс пользователя для работы с данными Доли осаждения в RТ .
 * 
 * Этот модуль подразумевает использование API, реализованное в deposition_fraction_queries.
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

const BigTableDepositionFraction = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const [tableDepositionFraction, setTableDepositionFraction] = useState([]); 
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [valueID, setValueID] = React.useState();
  const [valueIDInitial, setValueIDInitial] = React.useState();
  const [valueOrganID, setValueOrganID] = React.useState();
  const [valueAgeGroupID, setValueAgeGroupID] = React.useState();
  const [valueDataSourceID, setValueDataSourceID] = React.useState();
  const [valueDfValue, setValueDfValue] = React.useState();
  const [valueAdValue, setValueAdValue] = React.useState();
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
    setValueOrganID(params.row.organ_id);
    setValueAgeGroupID(params.row.agegroup_id);
    setValueDataSourceID(params.row.data_source_id);
    setValueDfValue(params.row.df_value);
    setValueAdValue(params.row.ad);
    setValueUpdateTime( formatDate(params.row.updatetime) ); 
  }, [setValueID, setValueIDInitial, setValueOrganID, setValueAgeGroupID, 
    setValueDataSourceID, setValueDfValue, setValueAdValue, setValueUpdateTime]); 

  const handleRowClickAndCloseAlert = (rowParams) => {
    handleRowClick(rowParams);
    setOpenAlert(false);
  };    

  // Scrolling and positionning
  const { paginationModel, setPaginationModel, scrollToIndexRef } = useGridScrollPagination(apiRef, tableDepositionFraction, setRowSelectionModel);

  // заголовки столбцов основной таблицы
  const columnsDepositionFraction = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'organ_name_rus', headerName: 'Орган/ткань', width: 200 },
    { field: 'agegroup_name_rus', headerName: 'Возрастная группа населения', width: 200 },
    { field: 'ad', headerName: 'Аэродинамический диаметр (AD), мкм', width: 250 },
    { field: 'data_source_title', headerName: 'Источник данных', width: 200 },
    { field: 'df_value', headerName: 'Доля осаждения', width: 250 },
    { 
      field: 'updatetime', 
      headerName: 'Время последнего изменения', 
      width: 280,
      valueGetter: (params) => formatDate(params.value)
    },    
   ]

  //объект для хранения текущего состояния фильтра - значения, выбранные в автокомплитах
  const [currFlt, setCurrFlt] = useState({
    selDataSourceValues: [],
    selOrganValues: [],
    selAgeGroupValues: [],
  });

  //примененный setApplFlt - то, что применено к таблице
  const [applFlt, setApplFlt] = useState({
    selDataSourceValues: [],
    selOrganValues: [],
    selAgeGroupValues: [],
  });

  const handleClearFilter = () => {
    setCurrFlt({
      selDataSourceValues: [],
      selOrganValues: [],
      selAgeGroupValues: [],
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
/*       // Следующее сделано для того, чтобы невидимые (скрытые) контролы не попадали в примененный фильтр
      if (!organVisible) { newState.selOrganValues = []; } 
      if (!agegroupVisible) { newState.selAgeGroupValues = []; }

      setOrganVisibleD(organVisible);
      setAgegroupVisibleD(agegroupVisible);  

          // Обновляем значения состояний
      if (newState.selDataSourceValues[0] && newState.selDataSourceValues[0].id) {
        setValueDataSourceID(newState.selDataSourceValues[0].id);
      }
      if (newState.selOrganValues[0] && newState.selOrganValues[0].id) {
        setValueOrganID(newState.selOrganValues[0].id);
      }
      if (newState.selAgeGroupValues[0] && newState.selAgeGroupValues[0].id) {
        setValueAgeGroupID(newState.selAgeGroupValues[0].id);
      } */
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
  const [tableAgeGroup, setTableAgeGroup] = useState([]); //возрастные группы населения
  const [tableAgeGroupFiltered, settableAgeGroupFiltered] = useState([]);

  const [tableDepositionFractionAttr, setTableDepositionFractionAttr] = useState([]); 
  
  const [selectionModel, setselectionModel] = React.useState([]);
  const [tableDataSourceClass, setTableDataSourceClass] = useState([]);
  
  const [searchValueDataSource, setSearchValueDataSource] = useState('');  
  const [searchValueOrgan, setSearchValueOrgan] = useState('');
  const [searchValueAgeGroup, setSearchValueAgeGroup] = useState('');

  // Состояния, определяющие видимость выпадающих списков
  const [organVisible, setOrganVisible] = useState(false);
  const [agegroupVisible, setAgegroupVisible] = useState(false);
  
  // Состояния, определяющие видимость выпадающих списков в диалоге
  const [organVisibleD, setOrganVisibleD] = useState(false);
  const [agegroupVisibleD, setAgegroupVisibleD] = useState(false);

  useEffect(() => { 
    let isOrganVisible = false;
    
    if ((currFlt.selDoseRatioValue && currFlt.selDoseRatioValue.hasOwnProperty('id')) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableDepositionFractionAttr.forEach(item => {
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchDataSource){
          if(item.organ_id >= 0) isOrganVisible = true;
        }
      });
    }
  
    setOrganVisible(isOrganVisible);
    if (!isOrganVisible)
      updateCurrentFilter({ selOrganValues: [] });     
  }, [ tableDepositionFractionAttr, currFlt.selDoseRatioValue, currFlt.selDataSourceValues ]);


  useEffect(() => { 
    // Получаем все уникальные data_source_id из tableDepositionFractionAttr
    const uniqueDataSourceIds = [...new Set(tableDepositionFractionAttr.map(item => item.data_source_id))];
    // Фильтруем tableDataSource по уникальным data_source_id
    const filteredDataSource = tableDataSource.filter(item => uniqueDataSourceIds.includes(item.id));
    // Устанавливаем отфильтрованные данные в состояние
    setTableDataSourceFiltered(filteredDataSource);

    if (filteredDataSource.length===1) 
    {
      currFlt.selDataSourceValues = filteredDataSource;
    }
    
  }, [tableDepositionFractionAttr, tableDataSource]);
  
  
/*    useEffect(() => { 
    let isRadTypeVisible = false;
    
    if ((currFlt.selIrradiationValue && currFlt.selIrradiationValue.hasOwnProperty('id')) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableDepositionFractionAttr.forEach(item => {
        const matchIrradiation = currFlt.selIrradiationValue && item.irradiation_id === currFlt.selIrradiationValue.id;
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchIrradiation && matchDataSource){
          if(item.rad_type_code > '0') isRadTypeVisible = true;
        }
      });
    }
    
    setRadTypeVisible(isRadTypeVisible);
    if (!isRadTypeVisible)
      updateCurrentFilter({ selRadTypeValues: [] }); 
  }, [tableDepositionFractionAttr, currFlt.selIrradiationValue, currFlt.selDataSourceValues]);
   */
  useEffect(() => { 
    let isAgegroupVisible = false;
    
    if ((currFlt.selPeopleClassValues && currFlt.selPeopleClassValues.length > 0) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableDepositionFractionAttr.forEach(item => {
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchDataSource){
          if(item.agegroup_id >= 0) isAgegroupVisible = true;
        }
      });
    }
    
    setAgegroupVisible(isAgegroupVisible);
    if (!isAgegroupVisible)
      updateCurrentFilter({ selAgeGroupValues: [] });     
  }, [tableDepositionFractionAttr, currFlt.selDataSourceValues]);

  const handleChangeDataSource = (event, value) => {
    // Обновление значения компонента Autocomplete
    const newFilter = {
      selDataSourceValues: value,
      selOrganValues: [],
      selAgeGroupValues: [],
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
    // Добавление родительских элементов
    filteredOrgan.forEach(item => {
      addParentItems(item, tableOrgan, filteredOrgan);
    });
    settableOrganFiltered( filteredOrgan );     
    //удалить недоступные значения из фильтра
    let newOrganValues = [];
    if (organVisible) {
      newOrganValues = currFlt.selOrganValues.filter((value) => 
        filteredOrgan.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selOrganValues: newOrganValues });       

 
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currFlt.selDataSourceValues,
      organVisible,
      agegroupVisible,
      tableDataSourceClass, 
      tableAgeGroup,
      tableOrgan,
      tableDepositionFractionAttr
    ]);
 
  //обработчики автокомплитов
  const handleChangeDoseRatio =      (event, value) => { updateCurrentFilter({ selDoseRatioValue: value }); };
  const handleChangeIrradiation =    (event, value) => { updateCurrentFilter({ selIrradiationValue: value }); }; 

  // переменные, относящиеся к редактированию данных в таблице
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDel, setOpenDel] = React.useState(false); 

  const handleClickEditNew = () => {
    setValueID(null);
    setValueDfValue(null);
    setValueAdValue(null);
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
      const foundRow = tableDepositionFraction.find(row => row.id === valueIDInitial);
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
        df_value: valueDfValue,
        ad: valueAdValue,
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
    df_value: valueDfValue,
    ad: valueAdValue,
    organ_id: valueOrganID,
    agegroup_id: valueAgeGroupID,
    data_source_id: valueDataSourceID,
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
    
    if (responseText.includes('deposition_fraction_1_uidx')) {
      responseText = 'Запись не добавлена. Запись с таким набором значений классификаторов уже существует';
    } else if (response.ok) {
      responseText = 'Запись добавлена';
      reloadData(true);
    }
    
    setAlertSeverity(response.ok ? "success" : "error");
    setAlertText(responseText);
    setOpenAlert(true);

  } catch (err) {
    const errorMessage = err.message.includes('deposition_fraction_1_uidx') 
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
        if (tableDepositionFraction[0]) {
          setValueID(tableDepositionFraction[0].id);
          setAddedId(tableDepositionFraction[0].id);
        }
      }          
      reloadData();
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
  fetchData(`/deposition_fraction_attr`, setTableDepositionFractionAttr);
  fetchData(`/organ`, setTableOrgan);
  fetchData(`/agegroup`, setTableAgeGroup);
}, [props.table_name]);

const checkColumns = React.useCallback((data, flt) => {
  let columnsToShow = {
    'id': false,
    'df_value': true,
    'ad': true,
    'updatetime': true,
  };

  const specialCols = {
    'organ_name_rus': 'selOrganValues', 
    'agegroup_name_rus': 'selAgeGroupValues', 
    'data_source_title': 'selDataSourceValues' 
  };

  console.log('flt.selOrganValues',flt.selOrganValues);
  console.log('flt.selAgeGroupValues',flt.selAgeGroupValues);

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
      columnsToShow[colName] =  !allColumnValuesSame;
    }
  }

  return columnsToShow;
}, []);

/* 

  const checkColumns = React.useCallback((data, flt) => {
    let columnsToShow = {
      'id': false,
      'df_value': true,
      'updatetime': true,
      'rad_type_code_name_rus': true,
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

  const getCodeList = (item) => {
    return Array.isArray(item) ? item.map(codeItem => `'${codeItem.code}'`).join(',') : item?.code ? `'${item.code}'` : [];
  };
  
  const reloadData = React.useCallback(async (wasAddOperation = false) => {

    if ((!applFlt.selDataSourceValues) || (applFlt.selDataSourceValues.length === 0)) {
      setTableDepositionFraction([]);
      return;
    }
  
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        data_source_id: getIdList(applFlt.selDataSourceValues),
        organ_id: getIdList(applFlt.selOrganValues),
        agegroup_id: getIdList(applFlt.selAgeGroupValues),
        page: pageState.page + 1,
        pagesize: pageState.pageSize
      });
  
      const response = await fetch(`/deposition_fraction?${params}`); 
  
      if (!response.ok) {
        setAlertSeverity("false");
        setAlertText(`Ошибка при обновлении данных: ${response.status}`);
        throw new Error(`${response.status} (${response.statusText})`);
      }
      
      const result = await response.json();
      const vidColumnVisibilityModel1 = checkColumns(result, applFlt);
      setTableDepositionFraction(result);
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
  }, [applFlt, pageState, checkColumns]);


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
    setTableDepositionFraction([]);
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

const [tableAgeGroupFilteredEdit, settableAgeGroupFilteredEdit] = useState([]);
const [tableOrganFilteredEdit, settableOrganFilteredEdit] = useState([]); //список органов в окне редактирования записи

useEffect(() => { settableDataSourceFilteredEdit(applFlt.selDataSourceValues); }, [applFlt.selDataSourceValues]);
useEffect(() => { settableOrganFilteredEdit(applFlt.selOrganValues); }, [applFlt.selOrganValues]);
useEffect(() => { settableAgeGroupFilteredEdit(applFlt.selAgeGroupValues); }, [applFlt.selAgeGroupValues]);

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
        const rowData = tableDepositionFraction.find((item) => item.id === row);
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

        <IconButton onClick={()=>handleClickEdit()} disabled={(!valueID || !tableDepositionFraction || tableDepositionFraction.length === 0 )} color="primary" size="small" title="Редактировать запись">
          <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton> 

        <IconButton onClick={()=>handleClickDelete()} disabled={(!valueID || !tableDepositionFraction || tableDepositionFraction.length === 0 )} color="primary" size="small" title="Удалить запись">
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
          disabled={( !tableDepositionFraction || tableDepositionFraction.length === 0 )}
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
        {applFlt.selAgeGroupValues.length === 1 && (
          <>
            Возрастная группа населения : {applFlt.selAgeGroupValues[0].name_rus}
            <br />
          </>
        )}
        {applFlt.selOrganValues.length === 1 && (
          <>
            Регион РТ: {applFlt.selOrganValues[0].name_rus}
            <br />
          </>
        )}
        {applFlt.selDataSourceValues.length === 1 && (
          <>
            Источник данных: {applFlt.selDataSourceValues[0].shortname}
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

  const treeTableOrgan = React.useMemo(() => 
    transformData(tableOrganFiltered, tableOrganFiltered), [tableOrganFiltered]);
  
  // основной генератор страницы
  return(
    <div>
    <form ref={formRef}>  
      {/* аккордеон по страницам */} 
      <Accordion expanded={isFilterExpanded} onChange={() => setIsFilterExpanded(!isFilterExpanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography variant="body2">Фильтр</Typography>
        </AccordionSummary>

        <AccordionDetails>
        <Grid container spacing={1.5}>
          <Grid item xs={4}>
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
                                    const filteredOptions = filterOptions(tableDataSourceFiltered, { inputValue: searchValueDataSource });
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
                        value: tableDataSourceFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
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
                    handleChangeDataSource(null, tableDataSourceFiltered);
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
          <Grid item xs={8}>
          </Grid>
 
          <Grid item xs={4}>
            { true && ( 
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
                  /* getOptionDisabled={(option) => !tableOrganFiltered.some(item => item.id === option.id)} */
                  getOptionLabel={(option) => option.name_rus}
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <div
                      {...props}
                      style={{
                        /* height: '35px', */
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
                            {searchValueOrgan && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableOrganFiltered, { inputValue: searchValueOrgan });
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
                      selOrganValues: tableOrganFiltered,
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
          <Grid item xs={8}>
          </Grid>

          { true && ( 
          <Grid item xs={4}>
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

          <Grid item xs={8}>
             
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
                    rows={tableDepositionFraction}
                    columns={columnsDepositionFraction}
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
                    {...tableDepositionFraction}
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
          <Grid item xs={6}>
            { true && (
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
          <Grid item xs={6}>          
          </Grid>


          <Divider />
          <Grid item xs={6}>
            {true&&(  
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
          <Grid item xs={6}>
          </Grid>
          <Divider />
          <Grid item xs={6}>
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
          <Grid item xs={6}>
          </Grid> 
          <Divider />
          <Grid item xs={4}>
            <TextField
              size="small"
              variant="outlined"
              id="df_value_edit"
              label="Доля осаждения"
              required
              value={valueDfValue || ''}
              fullWidth
              onChange={e => setValueDfValue(e.target.value)}
            />              
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              variant="outlined"
              id="ad_edit"
              label="Аэродинамический диаметр (AD), мкм"
              required
              value={valueAdValue || ''}
              fullWidth
              onChange={e => setValueAdValue(e.target.value)}
            />              
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

export { BigTableDepositionFraction }
