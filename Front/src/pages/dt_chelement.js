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

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;

const DataTableChelement = (props) => {
  const [valueId, setValueID] = React.useState();
  const [valueTitle, setValueTitle] = React.useState();
  const [valueTitleInitial, setValueTitleInitial] = React.useState();
  const [valueNameRus, setValueNameRus] = React.useState();
  const [valueNameRusInitial, setValueNameRusInitial] = React.useState();
  const [valueNameEng, setValueNameEng] = React.useState();
  const [valueNameEngInitial, setValueNameEngInitial] = React.useState();
  const [valueAtomicNum, setValueAtomicNum] = React.useState();
  const [valueAtomicNumInitial, setValueAtomicNumInitial] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]); 
  const [tablePhchForm, setTablePhchForm] = useState([]); 
  const [tablePhchFormFiltered, setTablePhchFormFiltered] = useState([]); 
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [editStarted, setEditStarted] = useState([false]);
  const [tableNuclide, setTableNuclide] = useState([]); 

  useEffect(() => {
    setEditStarted((valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueAtomicNumInitial!==valueAtomicNum));
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
       valueAtomicNumInitial, valueAtomicNum]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        lastId = tableData[0].id;
        setSelectionModel([tableData[0].id]);
        setValueID(`${tableData[0].id}`);
        setValueTitle(`${tableData[0].title}`);
        setValueNameRus(`${tableData[0].name_rus}`);
        setValueNameEng(`${tableData[0].name_eng}`);
        setValueAtomicNum(`${tableData[0].atomic_num}`);
        setValueTitleInitial(`${tableData[0].title}`);       
        setValueNameRusInitial(`${tableData[0].name_rus}`);
        setValueNameEngInitial(`${tableData[0].name_eng}`);
        setValueAtomicNumInitial(`${tableData[0].atomic_num}`);
      }
    }
    }, [ isLoading, tableData] );

  const handleRowClick = (params) => {
    if (editStarted)
    {
      handleClickSave(params);
    } 
    else 
    {
      setValueID(`${params.row.id}`);
      setValueTitle(`${params.row.title}`);
      setValueNameRus(`${params.row.name_rus}`);
      setValueNameEng(`${params.row.name_eng}`);
      setValueAtomicNum(`${params.row.atomic_num}`);
      setValueTitleInitial(`${params.row.title}`);
      setValueNameRusInitial(`${params.row.name_rus}`);
      setValueNameEngInitial(`${params.row.name_eng}`);
      setValueAtomicNumInitial(`${params.row.atomic_num}`);
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
      setValueAtomicNum(``);
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data))
      .then((data) => { lastId = 0;} ); 
  }, [props.table_name])

  useEffect(() => {
    fetch(`/phchform_chelem`)
      .then((data) => data.json())
      .then((data) => setTablePhchForm(data)); 
  }, [])

  useEffect(() => {
    if (!valueId) 
      return;

    fetch(`/nuclide/`+valueId)
      .then((data) => data.json())
      .then((data) => setTableNuclide(data))
      .then(console.log('грузим нуклиды'));
  }, [valueId])

  useEffect(() => {
    let f = tablePhchForm.filter(item => ( Number(item.chelement_id) === Number(valueId) ));
    console.log(f);
    setTablePhchFormFiltered(f);
  }, [valueId, tablePhchForm])


  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      atomic_num: valueAtomicNum,      
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
       setValueAtomicNumInitial(valueAtomicNum);         
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
      atomic_num: valueAtomicNum,       
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
      setValueTitleInitial(valueTitle);
      setValueNameRusInitial(valueNameRus);
      setValueNameEngInitial(valueNameEng);
      setValueAtomicNumInitial(valueAtomicNum);         
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
        setValueID(`${tableData[0].id}`);
        setValueTitle(`${tableData[0].title}`);
        setValueNameRus(`${tableData[0].name_rus}`);
        setValueNameEng(`${tableData[0].name_eng}`);
        setValueAtomicNum(`${tableData[0].atomic_num}`);
        setValueTitleInitial(`${tableData[0].title}`);
        setValueNameRusInitial(`${tableData[0].name_rus}`);
        setValueNameEngInitial(`${tableData[0].name_eng}`);
        setValueAtomicNumInitial(`${tableData[0].atomic_num}`);
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
    setValueAtomicNum(``);
  };

  const handleCloseSaveWhenNewYes = () => {
    setOpenSaveWhenNew(false);
    saveRec(true);
    setValueID(``);
    setValueTitle(``);
    setValueNameRus(``);
    setValueNameEng(``);
    setValueAtomicNum(``);
  };

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const columns = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'title', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_rus', headerName: 'Название (рус.яз)', width: 250 },
    { field: 'name_eng', headerName: 'Название (англ.яз)', width: 180 },
    { field: 'atomic_num', headerName: 'Комментарий (рус.яз)', width: 180 },
    { field: 'descr_eng', headerName: 'Комментарий (англ.яз)', width: 180 },
  ]

  /*
{"id":1533,"chelement_id":143,"subst_form_id":3,"chem_comp_gr_id":167,"subst_form_title":"gases_vapours",
"subst_form_nls_name":"газы и пары","subst_form_nls_descr":"растворимые или химически активные газы или пары",
"chem_comp_gr_title":"noble_gas","chem_comp_gr_formula":null,"chem_comp_gr_nls_name":"инертные газы","chem_comp_gr_nls_descr":null,"chelement_title":"Ar","chelement_atomic_num":null}
  */

  const columnsPhchform = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'chelement_id', headerName: 'Химический элемент, код', width: 80 },
    { field: 'subst_form_id', headerName: 'Форма вещества, код', width: 80 },
    { field: 'chem_comp_gr_id', headerName: 'Группа химических соединений, код', width: 180 },
    { field: 'subst_form_title', headerName: 'Форма вещества, обозначение', width: 180 },
    { field: 'subst_form_nls_name', headerName: 'Форма вещества, наименование (рус.яз)', width: 180 },
    { field: 'chem_comp_gr_title', headerName: 'Группа химических соединений, обозначение ', width: 180 },
    { field: 'chem_comp_gr_formula', headerName: 'Формула химических соединения ', width: 180 },
    { field: 'chem_comp_gr_nls_name', headerName: 'Группа химических соединений, наименование (рус.яз)', width: 180 },
    { field: 'chem_comp_gr_nls_descr', headerName: 'Группа химических соединений, описание', width: 180 },
    { field: 'chelement_title', headerName: 'Химический элемент, обозначение', width: 180 },
    { field: 'chelement_atomic_num', headerName: 'Химический элемент, атомное значение', width: 180 },
  ]

  
  const columnsNuclide = [
    { field: 'id', headerName: 'Код', width: 80 },
    { field: 'chelement_id', headerName: 'Химический элемент, код', width: 80 },
    { field: 'name', headerName: 'Обозначение', width: 300 },
    { field: 'mass_number', headerName: 'Массовое число', width: 180 },
  ]


  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    const selectedIDs = new Set(selectionModel);
    const selectedRowData = tableData.filter((row) => selectedIDs.has(row.id));
    if (selectedRowData.length)
    {
      setValueID(`${selectedRowData[0].id}`);
      setValueTitle(`${selectedRowData[0].title}`);
      setValueNameRus(`${selectedRowData[0].name_rus}`);
      setValueNameEng(`${selectedRowData[0].name_eng}` );
      setValueAtomicNum(`${selectedRowData[0].atomic_num}`);
      setValueTitleInitial(`${selectedRowData[0].title}`);
      setValueNameRusInitial(`${selectedRowData[0].name_rus}`);
      setValueNameEngInitial(`${selectedRowData[0].name_eng}` );
      setValueAtomicNumInitial(`${selectedRowData[0].atomic_num}`);
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
              atomic_num: false,
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
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
      <p/>
      <TextField  id="ch_atomic_num" sx={{ width: '40ch' }} label="Атомный номер" size="small" variant="outlined" value={valueAtomicNum || ''} onChange={e => setValueAtomicNum(e.target.value)}/>
      <p/>
      <TextField  id="ch_name_rus" sx={{ width: '40ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '40ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
      <p/>
      <DataGrid
        sx={{ height: 200 }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tablePhchFormFiltered}
        loading={isLoading}
        columns={columnsPhchform}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              chelement_id: false,
              subst_form_id: false,
              chem_comp_gr_id: false,
              chem_comp_gr_formula: false,
              chem_comp_gr_nls_descr: false,
              chelement_title: false,
              chelement_atomic_num: false,
            },
          },
        }}        
      />
      <p/>
      <DataGrid
        sx={{ height: 200 }}
        hideFooterSelectedRowCount={true}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        rows={tableNuclide}
        loading={isLoading}
        columns={columnsNuclide}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              chelement_id: false,
            },
          },
        }}        
      />
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
          В таблице "{table_names[props.table_name]}" предложена к удалению следующая запись:<p/><b>{valueTitle}</b>; Код в БД = <b>{valueId}</b><p/>
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
            В запись таблицы {table_names[props.table_name]} с кодом <b>{valueId}</b> внесены изменения.<p/>
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p/>
            {valueAtomicNum === valueAtomicNumInitial ? '' : 'Атомный номер: '+valueAtomicNum+'; ' }<p/>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p/>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p/>
            <p/>Вы желаете сохранить указанную запись?
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
            В запись таблицы {table_names[props.table_name]} с кодом <b>{valueId}</b> внесены изменения.<p/>
            {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p/>
            {valueAtomicNum === valueAtomicNumInitial ? '' : 'Атомный номер: '+valueAtomicNum+'; ' }<p/>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p/>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p/>
            <p/>Вы желаете сохранить указанную запись?
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

export { DataTableChelement, lastId }
