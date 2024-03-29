/**
 * Модуль, предоставляющий интерфейс пользователя для работы с данными о дозах внешнего облучения.
 * 
 * Этот модуль подразумевает использование API, реализованное в value_ext_dose_queries.
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

const BigTableValueExtDose = (props) => {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const [tableValueExtDose, setTableValueExtDose] = useState([]); 
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [valueID, setValueID] = React.useState();
  const [valueIDInitial, setValueIDInitial] = React.useState();
  const [valueDoseRatioID, setValueDoseRatioID] = React.useState();
  const [valueIrradiationID, setValueIrradiationID] = React.useState();
  const [valuePeopleClassID, setValuePeopleClassID] = React.useState();
  //const [valueSubstFormID, setValueSubstFormID] = React.useState();
  const [valueIsotopeID, setValueIsotopeID] = React.useState();
  //const [valueIntegralPeriodID, setValueIntegralPeriodID] = React.useState();
  const [valueOrganID, setValueOrganID] = React.useState();
  const [valueAgeGroupID, setValueAgeGroupID] = React.useState();
  const [valueDataSourceID, setValueDataSourceID] = React.useState();
  const [valueDrValue, setValueDrValue] = React.useState();
  const [valueUpdateTime, setValueUpdateTime] = React.useState();
  const [valueRadTypeCode, setValueRadTypeCode] = React.useState('');

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
    setValueOrganID(params.row.organ_id);
    setValueAgeGroupID(params.row.agegroup_id);
    setValueDataSourceID(params.row.data_source_id);
    setValueDrValue(params.row.dr_value);
    setValueRadTypeCode(params.row.rad_type_code);
    //setValueSubstFormID(params.row.subst_form_id);
    setValueIrradiationID(params.row.irradiation_id);
    setValueUpdateTime( formatDate(params.row.updatetime) ); 
  }, [setValueID, setValueIDInitial, setValueDoseRatioID, setValuePeopleClassID, setValueIsotopeID, 
    /* setValueIntegralPeriodID, */ setValueOrganID, setValueAgeGroupID, 
    setValueDataSourceID, setValueDrValue, setValueRadTypeCode, /* setValueSubstFormID, */ setValueIrradiationID, setValueUpdateTime]); 

  const handleRowClickAndCloseAlert = (rowParams) => {
    handleRowClick(rowParams);
    setOpenAlert(false);
  };    

  // Scrolling and positionning
  const { paginationModel, setPaginationModel, scrollToIndexRef } = useGridScrollPagination(apiRef, tableValueExtDose, setRowSelectionModel);

  // заголовки столбцов основной таблицы
  const columnsValueExtDose = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'people_class_name_rus', headerName: 'Тип облучаемых лиц', width: 180 },
    { field: 'isotope_title', headerName: 'Нуклид', width: 100 },
    { field: 'organ_name_rus', headerName: 'Орган', width: 200 },
    { field: 'agegroup_name_rus', headerName: 'Возрастная группа населения', width: 200 },
    { field: 'data_source_title', headerName: 'Источник данных', width: 200 },
    { field: 'dr_value', headerName: 'Значение', width: 180 },
    { 
      field: 'updatetime', 
      headerName: 'Время последнего изменения', 
      width: 280,
      valueGetter: (params) => formatDate(params.value)
    },    
    { field: 'rad_type_name_rus', headerName: 'Тип излучения', width: 200 },
/*     { field: 'dose_ratio_title', headerName: 'Параметр', width: 200 }, */
   ]

  //объект для хранения текущего состояния фильтра - значения, выбранные в автокомплитах
  const [currFlt, setCurrFlt] = useState({
    selDataSourceValues: [],
    selDoseRatioValue: null,
    selOrganValues: [],
    selIrradiationValue: null,
    selIsotopeValues: [],
    selPeopleClassValues: [],
    selRadTypeValues: [],
    selAgeGroupValues: [],
  });

  //примененный setApplFlt - то, что применено к таблице
  const [applFlt, setApplFlt] = useState({
    selDataSourceValues: [],
    selDoseRatioValue: null,
    selOrganValues: [],
    selIrradiationValue: null,
    selIsotopeValues: [],
    selPeopleClassValues: [],
    selRegionRTValues: [],
    selAgeGroupValues: [],
  });

  const handleClearFilter = () => {
    setCurrFlt({
      selDataSourceValues: [],
      selDoseRatioValue: null,
      selOrganValues: [],
      selIrradiationValue: null,
      selIsotopeValues: [],
      selPeopleClassValues: [],
      selRadTypeValues: [],
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
      if (!agegroupVisible) { newState.selAgeGroupValues = []; }
      if (!radTypeVisible) { newState.selRadTypeValues = []; }

      setOrganVisibleD(organVisible);
      setRadTypeVisibleD(radTypeVisible);  
      setAgegroupVisibleD(agegroupVisible);  

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
      if (newState.selIsotopeValues[0] && newState.selIsotopeValues[0].id) {
        setValueIsotopeID(newState.selIsotopeValues[0].id);
      }
      if (newState.selOrganValues[0] && newState.selOrganValues[0].id) {
        setValueOrganID(newState.selOrganValues[0].id);
      }
      if (newState.selAgeGroupValues[0] && newState.selAgeGroupValues[0].id) {
        setValueAgeGroupID(newState.selAgeGroupValues[0].id);
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
  const [tableDoseRatio, setTableDoseRatio] = useState([]);
  const [tableDoseRatioFiltered, settableDoseRatioFiltered] = useState([]);
  const [tableAgeGroup, setTableAgeGroup] = useState([]); //возрастные группы населения
  const [tableAgeGroupFiltered, settableAgeGroupFiltered] = useState([]);
  const [tablePeopleClass, setTablePeopleClass] = useState([]); //Типы облучаемых лиц
  const [tablePeopleClassFiltered, settablePeopleClassFiltered] = useState([]); //Типы облучаемых лиц  
  const [tableRadType, setTableRadType] = useState([]); //Тип излучения
  const [tableRadTypeFiltered, settableRadTypeFiltered] = useState([]); //Тип излучения

  //это только для добавления в автокомплит
  const [tableChemCompGr, setTableChemCompGr] = useState([]);  
  const [tableExtDoseAttr, setTableExtDoseAttr] = useState([]); 
  
  const [selectionModel, setselectionModel] = React.useState([]);
  const [tableDataSourceClass, setTableDataSourceClass] = useState([]);
  
  const [searchValueNuclide, setSearchValueNuclide] = useState('');  
  const [searchValueDataSource, setSearchValueDataSource] = useState('');  
  const [searchValuePeopleClass, setSearchValuePeopleClass] = useState('');
  const [searchValueOrgan, setSearchValueOrgan] = useState('');
  const [searchValueAgeGroup, setSearchValueAgeGroup] = useState('');
  const [searchValueRadType, setSearchValueRadType] = useState('');

  // Состояния, определяющие видимость выпадающих списков
  const [organVisible, setOrganVisible] = useState(false);
  const [agegroupVisible, setAgegroupVisible] = useState(false);
  const [radTypeVisible, setRadTypeVisible] = useState(false);
  
  // Состояния, определяющие видимость выпадающих списков в диалоге
  const [organVisibleD, setOrganVisibleD] = useState(false);
  const [agegroupVisibleD, setAgegroupVisibleD] = useState(false);
  const [radTypeVisibleD, setRadTypeVisibleD] = useState(false);

  useEffect(() => { 
    let isOrganVisible = false;
    
    if ((currFlt.selDoseRatioValue && currFlt.selDoseRatioValue.hasOwnProperty('id')) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableExtDoseAttr.forEach(item => {
        const matchDoseRatio = currFlt.selDoseRatioValue && item.dose_ratio_id === currFlt.selDoseRatioValue.id;
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchDoseRatio && matchDataSource){
          if(item.organ_id >= 0) isOrganVisible = true;
        }
      });
    }
  
    setOrganVisible(isOrganVisible);
    if (!isOrganVisible)
      updateCurrentFilter({ selOrganValues: [] });     
  }, [ tableExtDoseAttr, currFlt.selDoseRatioValue, currFlt.selDataSourceValues ]);


  useEffect(() => { 
    // Получаем все уникальные data_source_id из tableExtDoseAttr
    const uniqueDataSourceIds = [...new Set(tableExtDoseAttr.map(item => item.data_source_id))];
    // Фильтруем tableDataSource по уникальным data_source_id
    const filteredDataSource = tableDataSource.filter(item => uniqueDataSourceIds.includes(item.id));
    // Устанавливаем отфильтрованные данные в состояние
    setTableDataSourceFiltered(filteredDataSource);
  }, [tableExtDoseAttr, tableDataSource]);
  
  
   useEffect(() => { 
    let isRadTypeVisible = false;
    
    if ((currFlt.selIrradiationValue && currFlt.selIrradiationValue.hasOwnProperty('id')) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableExtDoseAttr.forEach(item => {
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
  }, [tableExtDoseAttr, currFlt.selIrradiationValue, currFlt.selDataSourceValues]);
  
  useEffect(() => { 
    let isAgegroupVisible = false;
    
    if ((currFlt.selPeopleClassValues && currFlt.selPeopleClassValues.length > 0) ||
        (currFlt.selDataSourceValues && currFlt.selDataSourceValues.length > 0)) {
      tableExtDoseAttr.forEach(item => {
        const matchPeopleClass = currFlt.selPeopleClassValues.some(peopleClass => peopleClass.id === item.people_class_id);
        const matchDataSource = currFlt.selDataSourceValues.some(dataSource => dataSource.id === item.data_source_id);
        if(matchPeopleClass && matchDataSource){
          if(item.agegroup_id >= 0) isAgegroupVisible = true;
        }
      });
    }
    
    setAgegroupVisible(isAgegroupVisible);
    if (!isAgegroupVisible)
      updateCurrentFilter({ selAgeGroupValues: [] });     
  }, [tableExtDoseAttr, currFlt.selPeopleClassValues, currFlt.selDataSourceValues]);

  const handleChangeDataSource = (event, value) => {
    // Обновление значения компонента Autocomplete
    const newFilter = {
      selDataSourceValues: value,
      selDoseRatioValue: null,
      selOrganValues: [],
      selIrradiationValue: null,
      selRadTypeValues: [],
      selIsotopeValues: [],
      selPeopleClassValues: [],
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
    //отфильтровали dose_ratio.id для выбранных источников данных, чтобы отфильтровать его автокомплит
    let ids_dose_ratio = tableDataSourceClass.filter(item => ((item.table_name === 'dose_ratio' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredDoseRatio = tableDoseRatio.filter(item => ((ids_dose_ratio.includes(item.id))) );
    console.log('filteredDoseRatio', filteredDoseRatio);
    settableDoseRatioFiltered( filteredDoseRatio ); 
    // если отфильтрованная таблица DoseRatio не содержит значение, выбранное в выпадающем списке
    if ((filteredDoseRatio&&currFlt.selDoseRatioValue)&&(!filteredDoseRatio.some(item => item.id === currFlt.selDoseRatioValue.id) )) 
      updateCurrentFilter({ selDoseRatioValue: [] });

    // то же самое для остальных автокомплитов
    let ids_irradiation = tableDataSourceClass.filter(item => ((item.table_name === 'irradiation' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredIrradiation = tableIrradiation.filter(item => ((ids_irradiation.includes(item.id))) );
    const prefix = "EXT_";
    filteredIrradiation = filteredIrradiation.filter(irradiation => irradiation.title.startsWith(prefix));

    settableIrradiationFiltered( filteredIrradiation ); 
    if ((filteredIrradiation&&currFlt.selIrradiationValue)&&(!filteredIrradiation.some(item => item.id === currFlt.selIrradiationValue.id) )) 
      updateCurrentFilter({ selIrradiationValue: [] });

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

    let ids_rad_type = tableDataSourceClass.filter(item => ((item.table_name === 'radiation_type' )&&(ids.includes(item.data_source_id))) ).map(item => item.rec_id);
    let filteredRadType = tableRadType.filter(item => ((ids_rad_type.includes(item.id))) );
    settableRadTypeFiltered( filteredRadType );
    let newRadTypeValues = [];
    if (radTypeVisible) {
      newRadTypeValues = currFlt.selRadTypeValues.filter((value) => 
        filteredRadType.some((filteredValue) => filteredValue.id === value.id));
    }
    updateCurrentFilter({ selRadTypeValues: newRadTypeValues });


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

       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currFlt.selDataSourceValues,
      organVisible,
      agegroupVisible,
      radTypeVisible,
      tableDataSourceClass, 
      tableDoseRatio, 
      tableIrradiation,
      tableIntegralPeriod,  
      tableIsotope, 
      tablePeopleClass,
      tableAgeGroup,
      tableOrgan,
      tableExtDoseAttr,
      tableRadType
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
      const foundRow = tableValueExtDose.find(row => row.id === valueIDInitial);
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
        rad_type_code: valueRadTypeCode    
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
    people_class_id: valuePeopleClassID,
    isotope_id: valueIsotopeID,
    organ_id: valueOrganID,
    agegroup_id: valueAgeGroupID,
    data_source_id: valueDataSourceID,
    irradiation_id: valueIrradiationID,
    rad_type_code: valueRadTypeCode,
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
    
    if (responseText.includes('value_ext_dose_1_uidx')) {
      responseText = 'Запись не добавлена. Запись с таким набором значений классификаторов уже существует';
    } else if (response.ok) {
      responseText = 'Запись добавлена';
      reloadData(true);
    }
    
    setAlertSeverity(response.ok ? "success" : "error");
    setAlertText(responseText);
    setOpenAlert(true);

  } catch (err) {
    const errorMessage = err.message.includes('value_ext_dose_1_uidx') 
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
        if (tableValueExtDose[0]) {
          setValueID(tableValueExtDose[0].id);
          setAddedId(tableValueExtDose[0].id);
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
  fetchData(`/irradiation`, setTableIrradiation);
  fetchData(`/isotope_min`, setTableIsotope);
  fetchData(`/integral_period/`, setTableIntegralPeriod);
  fetchData(`/dose_ratio/`, setTableDoseRatio);
  fetchData(`/agegroup/`, setTableAgeGroup);
  fetchData(`/radiation_type/`, setTableRadType);
  fetchData(`/people_class/`, setTablePeopleClass);
  fetchData(`/ext_dose_attr`, setTableExtDoseAttr);
  fetchData(`/organ`, setTableOrgan);
}, [props.table_name]);

const checkColumns = React.useCallback((data, flt) => {
  let columnsToShow = {
    'id': false,
    'dr_value': true,
    'updatetime': true,
    'rad_type_code_name_rus': true,
    'dose_ratio_id': false,
    'irradiation_id': false
  };

  const specialCols = {
    'organ_name_rus': 'selOrganValues', 
    'agegroup_name_rus': 'selAgeGroupValues', 
    'isotope_title': 'selIsotopeValues', 
    'people_class_name_rus': 'selPeopleClassValues',
    'rad_type_name_rus': 'selRadTypeValues',
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
      setTableValueExtDose([]);
      return;
    }
  
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        data_source_id: getIdList(applFlt.selDataSourceValues),
        organ_id: getIdList(applFlt.selOrganValues),
        irradiation_id: getIdList(applFlt.selIrradiationValue),
        isotope_id: getIdList(applFlt.selIsotopeValues),
        dose_ratio_id: getIdList(applFlt.selDoseRatioValue),
        agegroup_id: getIdList(applFlt.selAgeGroupValues),
        people_class_id: getIdList(applFlt.selPeopleClassValues),
        rad_type_code: getCodeList(applFlt.selRadTypeValues),
        page: pageState.page + 1,
        pagesize: pageState.pageSize
      });
  
      const response = await fetch(`/value_ext_dose?${params}`); 
  
      if (!response.ok) {
        setAlertSeverity("false");
        setAlertText(`Ошибка при обновлении данных: ${response.status}`);
        throw new Error(`${response.status} (${response.statusText})`);
      }
      
      const result = await response.json();
      const vidColumnVisibilityModel1 = checkColumns(result, applFlt);
      setTableValueExtDose(result);
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
    setTableValueExtDose([]);
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

const [tablePeopleClassFilteredEdit, settablePeopleClassFilteredEdit] = useState([]);
const [tableAgeGroupFilteredEdit, settableAgeGroupFilteredEdit] = useState([]);
//const [tableIntegralPeriodFilteredEdit, settableIntegralPeriodFilteredEdit] = useState([]);
const [tableOrganFilteredEdit, settableOrganFilteredEdit] = useState([]); //список органов в окне редактирования записи
const [tableIsotopeFilteredEdit, settableIsotopeFilteredEdit] = useState([]);
//const [tableRadTypeFilteredEdit, settableRadTypeFilteredEdit] = useState([]);

useEffect(() => { settableDataSourceFilteredEdit(applFlt.selDataSourceValues); }, [applFlt.selDataSourceValues]);
useEffect(() => { settableOrganFilteredEdit(applFlt.selOrganValues); }, [applFlt.selOrganValues]);
useEffect(() => { settablePeopleClassFilteredEdit(applFlt.selPeopleClassValues); }, [applFlt.selPeopleClassValues]);
useEffect(() => { settableAgeGroupFilteredEdit(applFlt.selAgeGroupValues); }, [applFlt.selAgeGroupValues]);
//useEffect(() => { settableIntegralPeriodFilteredEdit(applFlt.selIntegralPeriodValues); }, [applFlt.selIntegralPeriodValues]);
useEffect(() => { settableIsotopeFilteredEdit(applFlt.selIsotopeValues); }, [applFlt.selIsotopeValues]);
//useEffect(() => { settableRadTypeFilteredEdit(applFlt.selRadTypeValues); }, [applFlt.selRadTypeValues]);

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
        const rowData = tableValueExtDose.find((item) => item.id === row);
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

        <IconButton onClick={()=>handleClickEdit()} disabled={(!valueID || !tableValueExtDose || tableValueExtDose.length === 0 )} color="primary" size="small" title="Редактировать запись">
          <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton> 

        <IconButton onClick={()=>handleClickDelete()} disabled={(!valueID || !tableValueExtDose || tableValueExtDose.length === 0 )} color="primary" size="small" title="Удалить запись">
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
          disabled={( !tableValueExtDose || tableValueExtDose.length === 0 )}
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
            <br />
          </>
        )}
        {applFlt.selIrradiationValue && (
          <>
            Тип облучения: {applFlt.selIrradiationValue.name_rus}
            {applFlt.selRadTypeValues.length === 1 ? `, ${applFlt.selRadTypeValues[0].name_rus}` : ''}
            <br />
          </>
        )}
        {applFlt.selPeopleClassValues.length === 1 && (
          <>
            Тип облучаемых лиц: {applFlt.selPeopleClassValues[0].name_rus}
            {applFlt.selAgeGroupValues.length === 1 ? `, ${applFlt.selAgeGroupValues[0].name_rus}` : ''}
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
            options={tableDoseRatioFiltered.filter((row) => row.dr_type === "e")}
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
                options={ tableIrradiationFiltered } 
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


           

          {/* Тип радиации */}
          <Grid item xs={3}>
            

          {/* пока эти опции взаимоисключающие, запихнем в одну ячейку */}
          { radTypeVisible && (
            
            <Grid container spacing={1}> 
              <Grid item xs={11}>
                <Autocomplete
                  size="small"
                  value={currFlt.selRadTypeValues}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, newValue) => {
                    setCurrFlt({
                      ...currFlt,
                      selRadTypeValues: newValue,
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                      setSearchValueRadType(newInputValue);
                    }
                  }}
                  onClose={() => { setSearchValueRadType(""); }}
                  inputValue={searchValueRadType}
                  multiple
                  limitTags={7}
                  id="autocomplete-people_class"
                  options={tableRadTypeFiltered}
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
                            {searchValueRadType && (
                              <InputAdornment position="end">
                                <LightTooltip title="Добавить найденные">
                                <StyledIconButton
                                  onClick={() => {
                                    const filteredOptions = filterOptionsNameRus(tableRadTypeFiltered, { inputValue: searchValueRadType });
                                    const newValues = [...currFlt.selRadTypeValues, ...filteredOptions];
                                    setCurrFlt({
                                      ...currFlt,
                                      selRadTypeValues: newValues,
                                    });
                                    setSearchValueRadType("");
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
                        required: currFlt.selRadTypeValues.length === 0,
                        value: tableRadTypeFiltered.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
                      }}
                      label="Типы излучения"
                      placeholder="Типы излучения"
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
                      selRadTypeValues: tableRadTypeFiltered,
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
            )}             
          </Grid>

          <Grid item xs={3}>
             
          </Grid>         
           
          <Grid item xs={3}>
             
          </Grid>

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
                    rows={tableValueExtDose}
                    columns={columnsValueExtDose}
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
                    {...tableValueExtDose}
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
          <Grid item xs={6}>
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
{/*           <Grid item xs={4}>            
          </Grid>
 */}
           <Grid item xs={6}>
            <Autocomplete
              size="small"
              disabled={true}
              value={tableIrradiation.find((option) => option.id === valueIrradiationID) }
              onChange={(event, newValueAC) => { setValueIrradiationID(newValueAC?newValueAC.id:-1) } }
              id="autocomplete-irradiation_edit"
              options={ tableIrradiationFiltered } 
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
          <Grid item xs={6}> 
            {radTypeVisibleD&&(  
            <Autocomplete
              size="small"
              disabled={true}
              value={tableRadType.find((option) => option.code === valueRadTypeCode) }
              onChange={(event, newValueAC) => { setValueRadTypeCode(newValueAC?newValueAC.code:-1) } }
              id="autocomplete-rad_type_edit"
              options={ tableRadTypeFiltered } 
              getOptionLabel={(option) => option.name_rus?option.name_rus:''}
              renderInput={(params) => {
                const inputProps = {
                  ...params.inputProps,
                  value: tableRadTypeFiltered.length===0 ? "Выбор отсутствует" : params.inputProps.value,
                };
                return <TextField {...params} inputProps={inputProps} label="Тип излучения" placeholder="Тип излучения" required/>;
              }}                 
            /> 
            )} 
          </Grid>
{/*           <Grid item xs={4}>
          </Grid>
 */}          <Divider />
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
{/*           <Grid item xs={4}>
          </Grid>
 */}          <Divider />
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
{/*           <Grid item xs={4}>
          </Grid>
 */}          <Divider />
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

export { BigTableValueExtDose }
