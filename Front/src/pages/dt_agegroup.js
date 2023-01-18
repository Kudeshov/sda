import React, { useState, useEffect } from 'react'
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
import { DataTableDataSourceClass } from './dt_data_source_class';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as SaveLightIcon } from "./../icons/save.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as UndoLightIcon } from "./../icons/undo.svg";
import { ReactComponent as DownloadLightIcon } from "./../icons/download.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { ReactComponent as RepeatLightIcon } from "./../icons/repeat.svg";
import { table_names } from './sda_types';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTableAgeGroup = (props) => {
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();
  const [valueNameRus, setValueNameRus] = React.useState();
  const [valueNameRusInitial, setValueNameRusInitial] = React.useState();
  const [valueNameEng, setValueNameEng] = React.useState();
  const [valueNameEngInitial, setValueNameEngInitial] = React.useState();
  const [valueDescrEng, setValueDescrEng] = React.useState();
  const [valueDescrEngInitial, setValueDescrEngInitial] = React.useState();
  const [valueDescrRus, setValueDescrRus] = React.useState();
  const [valueDescrRusInitial, setValueDescrRusInitial] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState([false]);

  const [valueRespRate, setValueRespRate] = React.useState();
  const [valueRespRateInitial, setValueRespRateInitial] = React.useState();
  const [valueRespYear, setValueRespYear] = React.useState();
  const [valueRespYearInitial, setValueRespYearInitial] = React.useState();
  const [valueIndoor, setValueIndoor] = React.useState();
  const [valueIndoorInitial, setValueIndoorInitial] = React.useState();
  const [valueExtCloud, setValueExtCloud] = React.useState();
  const [valueExtCloudInitial, setValueExtCloudInitial] = React.useState();
  const [valueExtGround, setValueExtGround] = React.useState();
  const [valueExtGroundInitial, setValueExtGroundInitial] = React.useState();

  useEffect(() => {
    //console.log([valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
    //  valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus]); 

    //console.log('valueRespRateInitial'+valueRespRateInitial);
    //console.log('valueRespRate'+valueRespRate);

    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng)||(valueDescrRusInitial!==valueDescrRus)   
      ||(valueRespRateInitial!==valueRespRate)||(valueRespYearInitial!==valueRespYear)||(valueIndoorInitial!==valueIndoor)
      ||(valueExtCloudInitial!==valueExtCloud)||(valueExtGroundInitial!==valueExtGround));
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, 
        valueRespRateInitial, valueRespRate, valueRespYearInitial, valueRespYear, valueIndoorInitial, valueIndoor, valueExtCloudInitial, valueExtCloud, valueExtGroundInitial, valueExtGround]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        //console.log('isLoading, tableData ON lastId '+lastId);
        lastId = tableData[0].id;
        setSelectionModel([tableData[0].id]);
        setValueID(tableData[0].id);
        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueDescrRus(tableData[0].descr_rus);
        setValueDescrEng(tableData[0].descr_eng);

        setValueRespRate(tableData[0].resp_rate);
        setValueRespYear(`${tableData[0].resp_year}`);
        setValueIndoor(`${tableData[0].indoor}`);
        setValueExtCloud(`${tableData[0].ext_cloud}`);
        setValueExtGround(`${tableData[0].ext_ground}`);
        //console.log('useEffect Refresh initial '+tableData[0].title+' '+tableData[0].name_rus);
        setValueTitleInitial(tableData[0].title);       
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueDescrRusInitial(tableData[0].descr_rus);
        setValueDescrEngInitial(tableData[0].descr_eng);

        setValueRespRateInitial(tableData[0].resp_rate);
        setValueRespYearInitial(`${tableData[0].resp_year}`);
        setValueIndoorInitial(`${tableData[0].indoor}`);
        setValueExtCloudInitial(`${tableData[0].ext_cloud}`);
        setValueExtGroundInitial(`${tableData[0].ext_ground}`);
      }
    }
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {
    setOpenAlert(false);
    if (editStarted)
    {
      handleClickSave(params);
    } 
    else 
    {
      setValueID(params.row.id);
      setValueTitle(params.row.title);
      setValueNameRus(params.row.name_rus);
      setValueNameEng(params.row.name_eng);
      setValueDescrRus(params.row.descr_rus);
      setValueDescrEng(params.row.descr_eng);

      setValueRespRate(`${params.row.resp_rate}` );
      setValueRespYear(`${params.row.resp_year}` );
      setValueIndoor(`${params.row.indoor}` );
      setValueExtCloud(`${params.row.ext_cloud}` );
      setValueExtGround(`${params.row.ext_ground}` );
      //console.log('handleRowClick Refresh initial '+params.row.title+' '+params.row.name_rus);
      setValueTitleInitial(params.row.title);
      setValueNameRusInitial(params.row.name_rus);
      setValueNameEngInitial(params.row.name_eng);
      setValueDescrRusInitial(params.row.descr_rus);
      setValueDescrEngInitial(params.row.descr_eng);

      setValueRespRateInitial(`${params.row.resp_rate}` );
      setValueRespYearInitial(`${params.row.resp_year}` );
      setValueIndoorInitial(`${params.row.indoor}` );
      setValueExtCloudInitial(`${params.row.ext_cloud}` );
      setValueExtGroundInitial(`${params.row.ext_ground}` );
    }
  }; 

  const handleClearClick = (params) => {
    if (editStarted)
    {
      handleClickSaveWhenNew(params);
    } 
    else 
    {
      setValueID(``);
      setValueTitle(``);
      setValueNameRus(``);
      setValueNameEng(``);
      setValueDescrRus(``);
      setValueDescrEng(``);

      setValueRespRate(``);
      console.log('before assign '+ valueRespYear);

      setValueRespYear(``);
      console.log('after assign '+ valueRespYear);      
      setValueIndoor(``);
      setValueExtCloud(``);
      setValueExtGround(``);      
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => { lastId = 0;} ); 
  }, [props.table_name])

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      resp_rate: valueRespRate,
      resp_year: valueRespYear,
      indoor: valueIndoor,
      ext_cloud: valueExtCloud,
      ext_ground: valueExtGround
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
       setValueNameRusInitial(valueNameRus); 
       setValueNameEngInitial(valueNameEng);
       setValueDescrRusInitial(valueDescrRus);
       setValueDescrEngInitial(valueDescrEng);  
       setValueRespRateInitial(valueRespRate);
       setValueRespYearInitial(valueRespYear);
       setValueIndoorInitial(valueIndoor);
       setValueExtCloudInitial(valueExtCloud);
       setValueExtGroundInitial(valueExtGround);         
     }
    reloadData();     
   }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,

      resp_rate: valueRespRate,
      resp_year: valueRespYear,
      indoor: valueIndoor,
      ext_cloud: valueExtCloud,
      ext_ground: valueExtGround        
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
        const { id } = await response.json();
        alertText = `Добавлена запись с кодом ${id}`;
        lastId = id;          
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
      //console.log('addRec Refresh initial '+valueTitle+' '+valueNameRus);
      setValueTitle(valueTitle);
      setValueNameRus(valueNameRus);
      setValueNameEng(valueNameEng);
      setValueDescrRus(valueDescrRus);
      setValueDescrEng(valueDescrEng);
      setValueRespRate(valueRespRate)
      setValueRespYear(valueRespYear)
      setValueIndoor(valueIndoor)
      setValueExtCloud(valueExtCloud)          
      setValueExtGround(valueExtGround)
       
      setValueTitleInitial(valueTitle);
      setValueNameRusInitial(valueNameRus);
      setValueNameEngInitial(valueNameEng);
      setValueDescrRusInitial(valueDescrRus);
      setValueDescrEngInitial(valueDescrEng); 
      setValueRespRateInitial(valueRespRate)
      setValueRespYearInitial(valueRespYear)
      setValueIndoorInitial(valueIndoor)
      setValueExtCloudInitial(valueExtCloud)          
      setValueExtGroundInitial(valueExtGround)
    }
  };

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
  const delRec =  async () => {
    const js = JSON.stringify({
        id: valueId,
        title: valueTitle,
    });
    setIsLoading(true);
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
        setSelectionModel([tableData[0].id ]);  
        setValueID(tableData[0].id);
        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueDescrRus(tableData[0].descr_rus);
        setValueDescrEng(tableData[0].descr_eng);

        setValueRespRate(tableData[0].resp_rate);
        setValueRespYear(`${tableData[0].resp_year}`);
        setValueIndoor(`${tableData[0].indoor}`);
        setValueExtCloud(`${tableData[0].ext_cloud}`);
        setValueExtGround(`${tableData[0].ext_ground}`);

        setValueTitleInitial(tableData[0].title);
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueDescrRusInitial(tableData[0].descr_rus);
        setValueDescrEngInitial(tableData[0].descr_eng);

        setValueRespRateInitial(tableData[0].resp_rate);
        setValueRespYearInitial(`${tableData[0].resp_year}`);
        setValueIndoorInitial(`${tableData[0].indoor}`);
        setValueExtCloudInitial(`${tableData[0].ext_cloud}`);
        setValueExtGroundInitial(`${tableData[0].ext_ground}`);
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
      const response = await fetch(`/${props.table_name}/`);
       if (!response.ok) {
        alertText = `Ошибка при обновлении данных: ${response.status}`;
        alertSeverity = "false";
        const error = response.status + ' (' +response.statusText+')';  
        throw new Error(`${error}`);
      }
      else
      {  
        const result = await response.json();
        setTableData(result);
      }
    } catch (err) {
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
    setOpenSave(true);
  };

  const handleCloseSaveNo = () => {
    setOpenSave(false);
    handleCancelClick();
  };

  const handleCloseSaveYes = () => {
    setOpenSave(false);
    saveRec(false);
    handleCancelClick();
  };

  const handleClickSaveWhenNew = () => {
    setOpenSaveWhenNew(true);
  };

  const handleCloseSaveWhenNewNo = () => {
    setOpenSaveWhenNew(false);

    setValueID(``);
    setValueTitle(``);
    setValueNameRus(``);
    setValueNameEng(``);
    setValueDescrRus(``);
    setValueDescrEng(``);

    setValueRespRate(``);
    setValueRespYear(``);
    setValueIndoor(``);
    setValueExtCloud(``);
    setValueExtGround(``);   

  };

  const handleCloseSaveWhenNewYes = () => {
    setOpenSaveWhenNew(false);
    saveRec(true);
    setValueID(``);
    setValueTitle(``);
    setValueNameRus(``);
    setValueNameEng(``);
    setValueDescrRus(``);
    setValueDescrEng(`` );
    setValueRespRate(``);
    setValueRespYear(``);
    setValueIndoor(``);
    setValueExtCloud(``);
    setValueExtGround(`` );
  };


  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 250 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'descr_rus', headerName: 'Комментарий (рус.яз)', width: 180 },
    { field: 'descr_eng', headerName: 'Комментарий (англ.яз)', width: 180 },
  ]

  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    const selectedIDs = new Set(selectionModel);
    //console.log(selectedIDs);
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    //console.log(selectedRowData);
    if (selectedRowData.length)
    {
      setValueID(selectedRowData[0].id);
      setValueTitle(selectedRowData[0].title);
      setValueNameRus(selectedRowData[0].name_rus);
      setValueNameEng(selectedRowData[0].name_eng );
      setValueDescrRus(selectedRowData[0].descr_rus);
      setValueDescrEng(selectedRowData[0].descr_eng);
      setValueRespRate(`${selectedRowData[0].resp_rate}` );
      setValueRespYear(`${selectedRowData[0].resp_year}` );
      setValueIndoor(`${selectedRowData[0].indoor}` );
      setValueExtCloud(`${selectedRowData[0].ext_cloud}` );
      setValueExtGround(`${selectedRowData[0].ext_ground}` );
      //console.log('handleCancelClick Refresh initial '+selectedRowData[0].title+' '+selectedRowData[0].name_rus);
      setValueTitleInitial(selectedRowData[0].title);
      setValueNameRusInitial(selectedRowData[0].name_rus);
      setValueNameEngInitial(selectedRowData[0].name_eng );
      setValueDescrRusInitial(selectedRowData[0].descr_rus);
      setValueDescrEngInitial(selectedRowData[0].descr_eng);
      setValueRespRateInitial(`${selectedRowData[0].resp_rate}` );
      setValueRespYearInitial(`${selectedRowData[0].resp_year}` );
      setValueIndoorInitial(`${selectedRowData[0].indoor}` );
      setValueExtCloudInitial(`${selectedRowData[0].ext_cloud}` );
      setValueExtGroundInitial(`${selectedRowData[0].ext_ground}` );
    }
  }

  function CustomToolbar1() {
    const apiRef = useGridApiContext();
    const handleExport = (options) =>
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

      <DataGrid
        components={{ Toolbar: CustomToolbar1 }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableData}
        loading={isLoading}
        columns={columns}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}        
        initialState={{
          columns: {
            columnVisibilityModel: {
              name_eng: false,
              descr_rus: false,
              descr_eng: false,
            },
          },
        }}        
        onRowClick={handleRowClick} {...tableData} 
      />
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
      <TextField  id="ch_id"  disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={valueId || ''} size="small"  onChange={e => setValueID(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
      <p></p>
      <TextField  id="ch_name_rus" sx={{ width: '49ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '49ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
      <p></p>
      <TextField  id="ch_resp_rate" sx={{ width: '100ch' }} label="Скорость дыхания, куб.м/сек"  size="small" multiline maxRows={4} variant="outlined" value={valueRespRate || ''} onChange={e => setValueRespRate(e.target.value)}/>
      <p></p> 
      <TextField  id="ch_resp_year" sx={{ width: '100ch' }} label="Годовой объем вдыхаемого воздуха, куб.м"  size="small" multiline maxRows={4} variant="outlined" value={valueRespYear || ''} onChange={e => setValueRespYear(e.target.value)}/>
      <p></p> 
      <TextField  id="ch_indoor" sx={{ width: '100ch' }} label="Доля времени, проводимая индивидуумом в помещении"  size="small" multiline maxRows={4} variant="outlined" value={valueIndoor || ''} onChange={e => setValueIndoor(e.target.value)}/>
      <p></p> 
      <TextField  id="ch_ext_cloud" sx={{ width: '100ch' }} label="Коэффициент для дозы внешнего облучения от облака"  size="small" multiline maxRows={4} variant="outlined" value={valueExtCloud || ''} onChange={e => setValueExtCloud(e.target.value)}/>
      <p></p> 
      <TextField  id="ch_ext_ground" sx={{ width: '100ch' }} label="Коэффициент для дозы внешнего облучения от поверхности"  size="small" multiline maxRows={4} variant="outlined" value={valueExtGround || ''} onChange={e => setValueExtGround(e.target.value)}/>
      <p></p> 
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} onChange={e => setValueDescrRus(e.target.value)}/>
      <p></p> 
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} onChange={e => setValueDescrEng(e.target.value)}/>
      <p></p>
      <div style={{ height: 300, width: 800 }}>
        <DataTableDataSourceClass table_name={props.table_name} rec_id={valueId} />
      </div>
    </td>
  </tr>
  </tbody>
  </table>

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
            В запись таблицы {table_names[props.table_name]} с кодом <b>{valueId}</b> внесены изменения.<p></p>
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p></p>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p></p>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p></p>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p></p>
            {valueRespRate === valueRespRateInitial ? '' : 'Скорость дыхания, куб.м/сек: '+valueRespRate+'; ' }<p></p>
            {valueRespYear === valueRespYearInitial ? '' : 'Годовой объем вдыхаемого воздуха, куб.м: '+valueRespYear+'; ' }<p></p>
            {valueIndoor === valueIndoorInitial ? '' : 'Доля времени, проводимая индивидуумом в помещении: '+valueIndoor+'; ' }<p></p>
            {valueExtCloud === valueExtCloudInitial ? '' : 'Коэффициент для дозы внешнего облучения от облака: '+valueExtCloud+'; ' }<p></p>
            {valueExtGround === valueExtGroundInitial ? '' : 'Коэффициент для дозы внешнего облучения от поверхности: '+valueExtGround+'; ' }<p></p>
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
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p></p>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p></p>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p></p>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p></p>
            {valueRespRate === valueRespRateInitial ? '' : 'Скорость дыхания, куб.м/сек: '+valueRespRate+'; ' }<p></p>
            {valueRespYear === valueRespYearInitial ? '' : 'Годовой объем вдыхаемого воздуха, куб.м: '+valueRespYear+'; ' }<p></p>
            {valueIndoor === valueIndoorInitial ? '' : 'Доля времени, проводимая индивидуумом в помещении: '+valueIndoor+'; ' }<p></p>
            {valueExtCloud === valueExtCloudInitial ? '' : 'Коэффициент для дозы внешнего облучения от облака: '+valueExtCloud+'; ' }<p></p>
            {valueExtGround === valueExtGroundInitial ? '' : 'Коэффициент для дозы внешнего облучения от поверхности: '+valueExtGround+'; ' }<p></p>
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

export { DataTableAgeGroup, lastId }
