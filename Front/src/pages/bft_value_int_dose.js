// Big fucking table VALUE_INT_DOSE

import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
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
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
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

//import ServerPaginationGrid from './sp_datagrid';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

var alertText = "Сообщение";
var alertSeverity = "info";


//var lastId = 0;

const BigTableValueIntDose = (props) => {

  const [pageState/* , setPageState */] = useState({
    page: 0,
    pageSize: 100,
    rows: [],
    rowCount: 0,
    isLoading: false
  });

  const columnsValueIntDose = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'dr_value', headerName: 'Значение', width: 180 },
    { field: 'updatetime', headerName: 'Время последнего измерения', width: 280 },
    { field: 'data_source_title', headerName: 'Источник данных', width: 200 },
    { field: 'organ_name_rus', headerName: 'Орган', width: 200 },
    { field: 'irradiation_name_rus', headerName: 'Тип облучения', width: 200 },
    { field: 'isotope_title', headerName: 'Нуклид', width: 200 },
    { field: 'integral_period_name_rus', headerName: 'Период интегрирования', width: 200 },
    { field: 'dose_ratio_title', headerName: 'Параметр', width: 200 },
    { field: 'let_level_name_rus', headerName: 'Уровень ЛПЭ', width: 200 },
    { field: 'agegroup_name_rus', headerName: 'Возрастная группа населения', width: 200 },
    { field: 'subst_form_name_rus', headerName: 'Форма вещества', width: 200 },    
    { field: 'aerosol_sol_name_rus', headerName: 'Тип растворимости аэрозолей', width: 200 },
    { field: 'aerosol_amad_name_rus', headerName: 'AMAD аэрозолей', width: 200 },
    { field: 'people_class_name_rus', headerName: 'Типы облучаемых лиц', width: 200 },
    { field: 'exp_scenario_name_rus', headerName: 'Сценарии поступления', width: 200 },
   ]
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const [selDataSourceValues, setSelDataSourceValues] = useState([]);
  const [selOrganValues, setSelOrganValues] = useState([]);
  const [selIrradiationValues, setSelIrradiationValues] = useState([]);
  const [selIsotopeValues, setSelIsotopeValues] = useState([]);
  const [selIntegralPeriodValues, setSelIntegralPeriodValues] = useState([]);
  const [selDoseRatioValues, setSelDoseRatioValues] = useState([]);
  const [selLetLevelValues, setSelLetLevelValues] = useState([]);
  const [selAgeGroupValues, setSelAgeGroupValues] = useState([]);
  const [selSubstFormValues, setSelSubstFormValues] = useState([]);
  const [selAerosolSolValues, setSelAerosolSolValues] = useState([]);
  const [selAerosolAMADValues, setSelAerosolAMADValues] = useState([]);
  const [selExpScenarioValues, setSelExpScenarioValues] = useState([]);
  const [selPeopleClassValues, setSelPeopleClassValues] = useState([]);

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

  const handleChangeLetLevel = (event, value) => {
    setSelLetLevelValues(value);
    console.log(value);
  };
  
  const handleChangeAgeGroup = (event, value) => {
    setSelAgeGroupValues(value);
    console.log(value);
  }; 

  const handleChangeSubstForm = (event, value) => {
    setSelSubstFormValues(value);
    console.log(value);
  };   

  const handleChangeAerosolSol = (event, value) => {
    setSelAerosolSolValues(value);
    console.log(value);
  }; 

  const handleChangeAerosolAMAD = (event, value) => {
    setSelAerosolAMADValues(value);
    console.log(value);
  };
  
  const handleChangeExpScenario = (event, value) => {
    setSelExpScenarioValues(value);
    console.log(value);
  };     
  
  const handleChangePeopleClass = (event, value) => {
    setSelPeopleClassValues(value);
    console.log(value);
  };  

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
  const [tableLetLevel, setTableLetLevel] = useState([]); //уровни ЛПЭ
  const [tableAgeGroup, setTableAgeGroup] = useState([]);   
  const [tableSubstForm, setTableSubstForm] = useState([]); //формы вещества  
  const [tableAerosolSol, setTableAerosolSol] = useState([]);   
  const [tableAerosolAMAD, setTableAerosolAMAD] = useState([]); //АМАД аэрозолей
  const [tableExpScenario, setTableExpScenario] = useState([]); //Сценарии поступления
  const [tablePeopleClass, setTablePeopleClass] = useState([]); //Типы облучаемых лиц
  const [tableValueIntDose, setTableValueIntDose] = useState([]); 
  const [selectionModel, setSelectionModel] = React.useState([]);

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
    setIsLoading(true);
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
      const  idsLetLevel =  selLetLevelValues.map(item => item.id).join(',');
      console.log('idsLetLevel = '+idsLetLevel);  
      const  idsAgeGroup =  selAgeGroupValues.map(item => item.id).join(',');
      console.log('idsAgeGroup = '+idsAgeGroup);  
      const  idsSubstForm =  selSubstFormValues.map(item => item.id).join(',');
      console.log('idsSubstForm = '+idsSubstForm);  
      const  idsAerosolSol =  selAerosolSolValues.map(item => item.id).join(',');
      console.log('idsAerosolSol = '+idsAerosolSol);  
      const  idsAerosolAMAD =  selAerosolAMADValues.map(item => item.id).join(',');
      console.log('idsAerosolAMAD = '+idsAerosolAMAD);  
      const  idsExpScenario =  selExpScenarioValues.map(item => item.id).join(',');
      console.log('idsExpScenario = '+idsExpScenario); 
      const  idsPeopleClass =  selPeopleClassValues.map(item => item.id).join(',');
      console.log('idsPeopleClass = '+idsPeopleClass); 

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
      //console.log('catch err');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* useEffect(() => {
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
      const  idsDoseRatio =  selDoseRatioValues.map(item => item.id).join(',');
      console.log('idsDoseRatio = '+idsDoseRatio);  
      const  idsLetLevel =  selLetLevelValues.map(item => item.id).join(',');
      console.log('idsLetLevel = '+idsLetLevel);  
      const  idsAgeGroup =  selAgeGroupValues.map(item => item.id).join(',');
      console.log('idsAgeGroup = '+idsAgeGroup);  
      const  idsSubstForm =  selSubstFormValues.map(item => item.id).join(',');
      console.log('idsSubstForm = '+idsSubstForm);  
      const  idsAerosolSol =  selAerosolSolValues.map(item => item.id).join(',');
      console.log('idsAerosolSol = '+idsAerosolSol);  
      const  idsAerosolAMAD =  selAerosolAMADValues.map(item => item.id).join(',');
      console.log('idsAerosolAMAD = '+idsAerosolAMAD);  

      const response = await fetch(`/value_int_dose?data_source_id=`+idsDS+`&organ_id=`+idsOrgan+
      `&irradiation_id=`+idsIrradiation+`&isotope_id=`+idsIsotope+
      `&integral_period_id=`+idsIntegralPeriod+`&dose_ratio_id=`+idsDoseRatio+
      `&let_level_id=`+idsLetLevel+`&agegroup_id=`+idsAgeGroup+`&subst_form_id=`+idsSubstForm+
      `&aerosol_sol_id=`+idsAerosolSol+`&aerosol_amad_id=`+idsAerosolAMAD+
      `&page=`+(pageState.page + 1)+`&pagesize=`+pageState.pageSize
      );   

      const json = await response.json();
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
  }, [pageState.pageSize, pageState.page, selDataSourceValues, selDoseRatioValues, selIntegralPeriodValues,
      selIrradiationValues, selIsotopeValues, selOrganValues, selLetLevelValues, selAgeGroupValues]);
 */
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

  function CustomToolbar1() {
  const apiRef = useGridApiContext();
     const handleExport = (options) =>
      apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <table border = "1" cellspacing="0" cellpadding="0" style={{ height: 300, width: 500, verticalAlign: 'top' }}><tbody>
          <tr>
          <td>
          <Autocomplete
              /* sx={(!disabled)?{width: '60ch', background: '#FFFFFF'}:{width: '60ch', background: '#EEEEEE'}} */  
              size="small"
              limitTags={10}
              disabled={ (!selDataSourceValues.length) }
              value={selDoseRatioValues}
              onChange={handleChangeDoseRatio}
              multiple
              id="autocomplete-dose_ratio"
              options={ tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id)) }
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
            <Autocomplete
              /* sx={(!disabled)?{width: '60ch', background: '#FFFFFF'}:{width: '60ch', background: '#EEEEEE'}} */  
              size="small"
              limitTags={10}
              disabled={ (!selDataSourceValues.length) }
              value={selDoseRatioValues}
              onChange={handleChangeDoseRatio}
              multiple
              id="autocomplete-dose_ratio"
              options={ tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id)) }
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
            <Autocomplete
              /* sx={(!disabled)?{width: '60ch', background: '#FFFFFF'}:{width: '60ch', background: '#EEEEEE'}} */  
              size="small"
              limitTags={10}
              disabled={ (!selDataSourceValues.length) }
              value={selDoseRatioValues}
              onChange={handleChangeDoseRatio}
              multiple
              id="autocomplete-dose_ratio"
              options={ tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id)) }
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
          </td>
          </tr>
          </tbody>
        </table>     

        <IconButton /* onClick={()=>handleClearClick()}  */ color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton /* onClick={()=>saveRec(true)}  */ color="primary" size="small" title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
        <IconButton /* onClick={()=>handleClickDelete()} */  color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
        <IconButton /* onClick={()=>handleCancelClick()}  disabled={!editStarted}*/ color="primary" size="small" title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
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
  }; */

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

  return (
    <div /* style={{ height: 640, width: 1500 }} */>
    <table border = "0" style={{ /* height: 550,  */width: 1500 }} ><tbody>
    <tr>
      <td style={{ /* height: 840, */ width: 1500, verticalAlign: 'top' }}>
      <div /* style={{ height: 786, width: 585 }} */>

        <table border = "0" cellspacing="0" cellpadding="0"><tbody>
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
        
        <table border = "0" cellspacing="0" cellpadding="0"><tbody>
          <tr>      
          <td width={348}>      
          <Autocomplete
            /* sx={(!disabled)?{width: '60ch', background: '#FFFFFF'}:{width: '60ch', background: '#EEEEEE'}} */  
            size="small"
            limitTags={10}
            disabled={ (!selDataSourceValues.length) }
            value={selDoseRatioValues}
            onChange={handleChangeDoseRatio}
            multiple
            id="autocomplete-dose_ratio"
            options={ tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id)) }
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
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelDoseRatioValues(tableDoseRatio.filter((row) => [1, 2, 8].includes(row.id)))} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          <td width={548}>      
          <Autocomplete
          /* sx={(selDataSourceValues.length)?{width: '60ch', background: '#FFFFFF'}:{width: '60ch', background: '#EEEEEE'}} */
          size="small"
          limitTags={7}
          value={selOrganValues}
          onChange={handleChangeOrgan}
          multiple
          disabled={ (!selDataSourceValues.length) || 
            (!(selDoseRatioValues.filter((row) => [2, 8].includes(row.id))).length)
          }
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
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelOrganValues(tableOrgan)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>

          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          <td width={348}>      
          <Autocomplete
          size="small"
          limitTags={7}
          value={selLetLevelValues}
          onChange={handleChangeLetLevel}
          multiple
          disabled={ (!selDataSourceValues.length) || 
            (!(selDoseRatioValues.filter((row) => [8].includes(row.id))).length)
          }
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
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelLetLevelValues(tableLetLevel)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          </tr>
        </tbody></table>  
        <p></p>        

        <table border = "0" cellspacing="0" cellpadding="0"><tbody>
          <tr>      
          <td width={348}>
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
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelIrradiationValues(tableIrradiation.filter((row) => [2,6, 30319, 30316].includes(row.id)))} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </td>
          <td width={300}>      
            <Autocomplete
            size="small"
            value={selSubstFormValues}
            onChange={handleChangeSubstForm}
            multiple
            id="autocomplete-subst_form"
            options={tableSubstForm}
            disabled={  (!selDataSourceValues.length) ||  
                ((selIrradiationValues.filter((row) => [2].includes(row.id))).length===0) 
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
          <td width={300}>      
            <Autocomplete
            size="small"
            value={selAerosolSolValues}
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
          </tr>
        </tbody></table>  
        <p></p>


        <table border = "0" cellspacing="0" cellpadding="0"><tbody>
          <tr>      
          <td width={348}>
            <Autocomplete
            size="small"
            value={selPeopleClassValues}
            onChange={handleChangePeopleClass}
            multiple
            id="autocomplete-people_class"
            options={tablePeopleClass}
            getOptionLabel={(option) => option.name_rus}
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
              <IconButton onClick={()=>setSelPeopleClassValues(tablePeopleClass)} color="primary" size="small" title="Выбрать все">
              <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
            </td>
            <td>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>
          <td width={348}>      
            <Autocomplete
            size="small"
            value={selAgeGroupValues}
            onChange={handleChangeAgeGroup}
            multiple
            id="autocomplete-age_group"
            disabled={  (!selDataSourceValues.length) ||  
              ((selPeopleClassValues.filter((row) => [1].includes(row.id))).length===0) 
            }              
            options={tableAgeGroup}
            getOptionLabel={(option) => option.name_rus}
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
          <td width={348}>      
            <Autocomplete
            size="small"
            value={selExpScenarioValues}
            onChange={handleChangeExpScenario}
            multiple
            id="autocomplete-aerosol_amad"
            options={tableExpScenario}
            disabled={ (!selDataSourceValues.length) ||  
              ((selPeopleClassValues.filter((row) => [3,4].includes(row.id))).length===0) 
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
              <TextField {...params} label="Сценарии поступления" placeholder="Сценарии поступления" />
            )}
            />
          </td>
          <td>
            &nbsp;&nbsp;
          </td>
          <td>        
            <IconButton onClick={()=>setSelExpScenarioValues(tableExpScenario)} color="primary" size="small" title="Выбрать все">
            <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox /></IconButton>
          </td>
          </tr>
          </tbody>
        </table>  
        <p></p>                           


        <table border = "0" cellspacing="0" cellpadding="0"><tbody>
          <tr>      
          <td width={348}>
            <Autocomplete
              size="small"
              value={selIsotopeValues}
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
 

        <IconButton onClick={()=>reloadDataAlert()} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={ArrowAltDownIcon} inheritViewBox /></IconButton>
      </div>
      </td>
  </tr>
  <tr>
  <td style={{ height: 550, width: 1200, verticalAlign: 'top' }}>
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
        //onRowClick={handleRowClick} {...tableData} 
      />  
{/*       <p></p>  
       <ServerPaginationGrid
        page={pageState.page}
        loading={pageState.isLoading}
        pageSize={pageState.pageSize}
        rows={pageState.rows}
        rowCount={pageState.rowCount}
        columns={columnsValueIntDose}
        onPageAlter={(newPage) => setPageState({ ...pageState, page: newPage })}
      />  */}

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
