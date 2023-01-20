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
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { table_names } from './sda_types';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const BigTableValueIntDose = (props) => {
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();

  const [valueShortName, setValueShortName] = React.useState();
  const [valueFullName, setValueFullName] = React.useState();
  const [valueDescr, setValueDescr] = React.useState();
  const [valueExternalDS, setValueExternalDS] = React.useState();

  const [valueShortNameInitial, setValueShortNameInitial] = React.useState();
  const [valueFullNameInitial, setValueFullNameInitial] = React.useState();
  const [valueDescrInitial, setValueDescrInitial] = React.useState();
  const [valueExternalDSInitial, setValueExternalDSInitial] = React.useState();

  const [isLoading, setIsLoading] = React.useState(false);
  const [tableDataSource, setTableDataSource] = useState([]); 
  const [tableOrgan, setTableOrgan] = useState([]); 
  const [tableValueIntDose, setTableValueIntDose] = useState([]); 
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState([false]);

  const valuesExtDS = [
    { label: 'Целевая БД', value: 'false' },
    { label: 'Внешний источник', value: 'true' } ];

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
    }, [ isLoading, tableDataSource] );

  const handleRowClick = (params) => {
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

  useEffect(() => {
    fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => setTableDataSource(data))
      .then((data) => { lastId = 0;} ); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/organ`)
      .then((data) => data.json())
      .then((data) => setTableOrgan(data))
      .then((data) => { lastId = 0;} ); 
  }, [props.table_name])



  useEffect(() => {
    var ds_id = 0;
    console.log(selDataSourceValues);
    if (selDataSourceValues.length)
      ds_id = selDataSourceValues[0].id;

    fetch(`/value_int_dose/`)
      .then((data) => data.json())
      .then((data) => setTableValueIntDose(data))
      .then((data) => { lastId = 0;} ); 
  }, [props.table_name])

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
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

      const response = await fetch(`/value_int_dose?data_source_id=`+idsDS+`&organ_id=`+idsOrgan);

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


  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
 
  const columnsValueIntDose = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'dr_value', headerName: 'Значение', width: 180 },
    { field: 'updatetime', headerName: 'Время последнего измерения', width: 280 },
    { field: 'data_source_title', headerName: 'Источник данных', width: 200 },
    { field: 'organ_name_rus', headerName: 'Орган', width: 200 },
  ]
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const [selDataSourceValues, setSelDataSourceValues] = useState([]);
  const [selOrganValues, setSelOrganValues] = useState([]);
  const handleChangeDataSource = (event, value) => {
    setSelDataSourceValues(value);
    setValueTitle(value);
    console.log(value);
  };

  const handleChangeOrgan = (event, value) => {
    setSelOrganValues(value);
    //setValueTitle(value);
    console.log(value);
  };
  const handleCancelClick = () => 
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

  function CustomToolbar1() {
    const apiRef = useGridApiContext();
    const handleExport = (options/* : GridCsvExportOptions */) =>
      apiRef.current.exportDataAsCsv(options);

    return (
      <GridToolbarContainer>
        <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" title="Создать запись">
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
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
      </GridToolbarContainer>
    );
  }

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
          id="tags-standard"
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
        <p></p>

        <Autocomplete
          size="small"
          value={selOrganValues}
          onChange={handleChangeOrgan}
          multiple
          id="tags-standard"
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

{/*       <DataGrid
        components={{ Toolbar: CustomToolbar1 }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableData}
        columns={columns}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}        
        initialState={{
          columns: {
            columnVisibilityModel: {
              fullname: false,
              external_ds: false,
              descr: false,
            },
          },
        }}        
        onRowClick={handleRowClick} {...tableData} 
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
      <DataGrid
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
              fullname: false,
              external_ds: false,
              descr: false,
            },
          },
        }}        
        //onRowClick={handleRowClick} {...tableData} 
      /> 
      <p></p>  

      <FormControl sx={{ width: '40ch' }} size="small">
        <InputLabel id="demo-controlled-open-select-label">Тип источника</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={valueExternalDS}
          label="Тип источника"
          defaultValue={true}
          
          onChange={e => setValueExternalDS(e.target.value)}
        >
        {valuesExtDS?.map(option => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.label ?? option.value}
              </MenuItem>
            );
        })}
        </Select>
      </FormControl>  
      <p></p> 

      <TextField  id="ch_descr" sx={{ width: '100ch' }} size="small" label="Комментарий" multiline rows={7} variant="outlined"   value={valueDescr || ''} onChange={e => setValueDescr(e.target.value)}/>
      <p></p> 

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

  <Dialog open={openDel} onClose={handleCloseDelNo} fullWidth={true}>
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
  </Dialog>
 </div>     
  )
}

export { BigTableValueIntDose }
