import React,  { useState, useEffect } from 'react'
import { DataGrid, useGridApiRef, ruRU } from '@mui/x-data-grid'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Box, Grid, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as EditLightIcon } from "./../icons/edit.svg";
import { ReactComponent as PlusLightIcon } from "./../icons/plus.svg";
import { ReactComponent as InfoLightIcon } from "./../icons/info.svg";
import { ReactComponent as TrashLightIcon } from "./../icons/trash.svg";
import { table_names } from './table_names';
import { useGridScrollPagination } from './../helpers/gridScrollHelper';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';


function DataTableDataSourceClass(props)  {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const [open, setOpen] = React.useState(false);
  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [addedId, setAddedId] = useState(0);
  const [tableDataSrc, setTableDataSrc] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);   
  const {paginationModel, setPaginationModel, scrollToIndexRef} = useGridScrollPagination(apiRef, tableData, setRowSelectionModel);
  const [clickedRowId, setClickedRowId] = useState(null);

  useEffect(() => {
    if (addedId !== null){  
        scrollToIndexRef.current = addedId;
        setAddedId(null);
        setRowSelectionModel([addedId]);
    }
  }, [addedId, scrollToIndexRef]);

  const handleClickEdit = () => {
    setOpen(true);
  };

  const handleClickAdd = () => {
    setValueID(null);
    setValueDataSourceId(null);
    setValueRecID(props.rec_id);
    setValueTableName(props.table_name);
    setValueTitleSrc("");
    setValueNameSrc("");
    setOpen(true);
  };

  const handleCloseYes = () => {
    setOpen(false);
    saveRec();
  };

  const handleCloseNo = () => {
    setOpen(false);
    setValueID(clickedRowId);
  };

  const columns_src = [
    { field: 'id', headerName: 'Код', width: 60 },
    { field: 'data_source_id', headerName: 'Код источника данных', width: 100 },
    { field: 'table_name', headerName: 'Имя таблицы БД', width: 180 },
    { field: 'rec_id', headerName: `Идентификатор записи в таблице ${props.table_name}`, width: 100 },
    { field: 'title', headerName: 'Источник', width: 200 },
    { field: 'title_src', headerName: 'Обозначение', width: 180, hideable: false },
    { field: 'name_src', headerName: 'Название', width: 250 },
    { field: 'shortname', headerName: 'Краткое название', width: 250 },
    { field: 'fullname', headerName: 'Полное название', width: 250 },
    { field: 'descr', headerName: 'Комментарий', width: 250 },
    { field: 'external_ds', headerName: 'Внешний источник данных', width: 250 },
  ]

  useEffect(() => {
    setOpenAlert(false);
    setlastSrcClassID(0);
    setIsLoading(true);
  
    if (props.rec_id === null || props.rec_id === undefined || props.rec_id === '') {
      setTableData([]); // загружаем пустой результат
    } else {
      fetch(`/data_source_class?table_name=${props.table_name}&rec_id=${props.rec_id||0}`)
      .then((data) => data.json())
      .then((data) => {
        setTableData(data);
        // Если массив данных не пустой, обновляем состояния
        if (data.length > 0 && !addedId) {
          console.log('После загрузки выставляем ', data[0]?.id, addedId)
          setAddedId(data[0]?.id);
          setValueID(data[0]?.id);
          console.log('После загрузки выставили ', data[0]?.id)
        }
      });
    }
    setlastSrcClassID(0);
    setIsLoading(false);
  }, [props.table_name, props.rec_id]);

 /*  useEffect(() => {
    setOpenAlert(false);
    setlastSrcClassID(0);
    setIsLoading(true);

    if (props.rec_id === null || props.rec_id === undefined || props.rec_id === '') {
      setTableData([]); // загружаем пустой результат
    } else {
      fetch(`/data_source_class?table_name=${props.table_name}&rec_id=${props.rec_id||0}`)
      .then((data) => data.json())
      .then((data) => {
        setTableData(data);
        // Если массив данных не пустой, обновляем состояния
        console.log('После загрузки выставляем ', data[0].id, addedId)
        if (data.length > 0 && !addedId) {
          setAddedId(data[0].id);
          setValueID(data[0].id);
          console.log('После загрузки выставили ', data[0].id)
        }
      
      });
    }
    setlastSrcClassID(0);
    setIsLoading(false);
  }, [props.table_name, props.rec_id]) */

  useEffect(() => {
    fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => setTableDataSrc(data));
  }, [])

const [valueId, setValueID] = React.useState();
const [valueDataSourceId, setValueDataSourceId] = React.useState();
const [valueRecId, setValueRecID] = React.useState();
const [valueTableName, setValueTableName] = React.useState();
const [valueTitle, setValueTitle] = React.useState();
const [valueTitleSrc, setValueTitleSrc] = React.useState();
const [valueNameSrc, setValueNameSrc] = React.useState();
const [valueShortName, setValueShortName] = React.useState();
const [valueFullName, setValueFullName] = React.useState();
const [valueDescr, setValueDescr] = React.useState();
const [valueExternalDS, setValueExternalDS] = React.useState();
const [isLoading, setIsLoading] = React.useState(false);
const [openAlert, setOpenAlert] = React.useState(false, '');
const [selectionModel, setSelectionModel] = React.useState([]);
const [lastSrcClassID, setlastSrcClassID] = React.useState([0]);

useEffect(() => {
  if ((!isLoading) && (tableData) )
  {
    //обновить блокировку кнопок "Редактировать" и "Удалить" в зависимости от наличия записей в таблице
    setNoRecords(!tableData.length);
  }
}, [isLoading, tableData, lastSrcClassID]); 

const reloadDataSrcClass = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`/data_source_class?table_name=${props.table_name}&rec_id=${props.rec_id||0}`);
     if (!response.ok) {
      setAlertText('Ошибка при обновлении данных');
      setAlertSeverity('error');
      setOpenAlert(true);  
      throw new Error(`Error! status: ${response.status}`);
    }  
    const result = await response.json();
    setlastSrcClassID(0);
    setTableData(result);
  } catch (err) {
    setAlertText('Ошибка при обновлении данных');
    setAlertSeverity('error')
    setOpenAlert(true);     
  } finally {
    setIsLoading(false);
  }
};

const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false); 
const [openDSInfo, setOpenDSInfo] = React.useState(false); 
const handleOpenDSInfo = () => {
  setOpenDSInfo(true);
};

const handleCloseDSInfo = () => {
  setOpenDSInfo(false);
};

const handleClickDelete = () => {
  setOpenConfirmDelete(true);
};

const handleCloseConfirmDelete = () => {
  setOpenConfirmDelete(false);
};

const handleCloseConfirmDeleteYes = () => {
  setOpenConfirmDelete(false);
  delRec();
};
/////////////////////////////////////////////////////////////////// DELETE /////////////////////
const delRec = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`/data_source_class/${valueId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    setAlertSeverity('success');
    setAlertText(await response.text());
    // Переключаемся на первую запись после удаления
    if (tableData[0]) {
      setValueID(tableData[0].id);
      setAddedId(tableData[0].id);
    }      
  } catch (err) {
    setAlertSeverity('error');
    setAlertText(err.message);
  } finally {
    setIsLoading(false);
    setOpenAlert(true);
    reloadDataSrcClass(); 
  }
};

const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    const data = {
      id: valueId,
      data_source_id: valueDataSourceId,
      table_name: valueTableName,
      rec_id: valueRecId, // valueId ? valueRecId : lastRecID,
      title_src: valueTitleSrc,
      name_src: valueNameSrc
    };

    setIsLoading(true);

    const url = '/data_source_class/' + (valueId || '');
    const method = valueId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'Application/json',
          Accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      //const responseBody = await response.json();
      let msg;

      if (method === 'POST') {
        const { id } = await response.json();
        msg = `Добавлена запись с кодом ${id}`;
        
        setAddedId(id);
        setValueID(id);
      } else {
        console.log('отредактировали запись', valueId);
        setAddedId(valueId);
        msg = `Запись с кодом ${valueId} обновлена`;
      }

      setAlertText(msg);
      setAlertSeverity('success');
      setOpenAlert(true);
    } catch (err) {
      setAlertText(err.message);
      setAlertSeverity('error');
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
      reloadDataSrcClass();
    }
  }
};
///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
/* const saveRec = async () => {

  if (formRef.current.reportValidity() )
    {

  const js = JSON.stringify({
    id: valueId,
    data_source_id: valueDataSourceId,
    table_name: valueTableName,
    rec_id: valueRecId,
    title_src: valueTitleSrc,
    name_src: valueNameSrc         
  });
  if (!valueId) { //если значение не задано - добавить запись
    addRec();
    return;
  }
  setIsLoading(true);
  try {
    const response = await fetch('/data_source_class/'+valueId, {
      method: 'PUT',
      body: js,
      headers: {
        'Content-Type': 'Application/json',
        Accept: '',
     },
   });
   if (!response.ok) {
      setAlertSeverity('error');
    }
    else
    {
      setAlertSeverity('success');
    }
    setAlertText(await response.text());
    setOpenAlert(true);    
 } catch (err) {
  setAlertText(err.message);
  setAlertSeverity('error');
  setOpenAlert(true);
 } finally {
   setIsLoading(false);
   reloadDataSrcClass();      
 }
}
};
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
const addRec = async ()  => {
  const js = JSON.stringify({
    id: valueId,
    data_source_id: valueDataSourceId,
    table_name: valueTableName,
    rec_id: lastRecID,
    title_src: valueTitleSrc,
    name_src: valueNameSrc         
  });
  setIsLoading(true);
  try {
    const response = await fetch('/data_source_class/', {
      method: 'POST',
      body: js,
      headers: {
        'Content-Type': 'Application/json',
        Accept: '',
      },
    });
    if (!response.ok) {
      setAlertSeverity('error');
      setAlertText(await response.text());
      setOpenAlert(true);          
    }
    else
    {
      setAlertSeverity('success');
      const { id } = await response.json();
      setAlertText(`Добавлена запись с кодом ${id}`);
      addedId =  id; 
      setValueID(addedId);
      setOpenAlert(true);  
    }
  } catch (err) {
    setAlertText(err.message);
    setAlertSeverity('error');
    setOpenAlert(true);
  } finally {
    setIsLoading(false);
    reloadDataSrcClass(); 
  }
}; */

const handleRowClick = (params) => {
  setOpenAlert(false);
  setValueID(params.row.id);
  setClickedRowId(params.row.id);
  setRowSelectionModel([params.row.id]);
}; 

const setValues = (row) => {
/*   setValueDataSourceId(row.data_source_id);
  setValueTableName(row.table_name);
  setValueRecID(row.rec_id);
  setValueTitleSrc(row.title_src);
  setValueNameSrc(row.name_src); */
  setValueDataSourceId(row.data_source_id);
  setValueTableName(row.table_name);
  setValueRecID(row.rec_id);
  setValueTitle(row.title);
  setValueTitleSrc(row.title_src);
  setValueNameSrc(row.name_src);
  setValueShortName(row.shortname);  
  setValueFullName(row.fullname);  
  setValueDescr(row.descr);  
  setValueExternalDS(row.external_ds);  
};

useEffect(() => {
  const rowData = tableData.find(row => row.id === valueId);
  if (rowData) {
    setValues(rowData);
  }
}, [tableData, valueId]);

const [noRecords, setNoRecords] = useState(true);

const formRef = React.useRef();

return (
  <div style={{ height: 270, width: 886 }}>
    <form ref={formRef}>
      <Box sx={{ border: '0px solid purple', height: 250, width: 886 }}>
        <Grid container spacing={1}>
          <Grid item sx={{ width: 780, border: '0px solid black', ml: 0 }}>
            <DataGrid
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor: ((valueId || '')==='') ? "transparent" : "rgba(0, 0, 0, 0.11)",
                },
                "& .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
              }}                 
              localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
              rowHeight={25}
              apiRef={apiRef}              
              columns={columns_src}
              rows={tableData}
              disableMultipleSelection={true}
              onPaginationModelChange={setPaginationModel}
              onRowClick={handleRowClick} {...tableData} 
              hideFooterSelectedRowCount={true}
              selectionModel={selectionModel}
              paginationModel={paginationModel}
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
              loading={isLoading}
              pageSize={25} // number of rows per page
              style={{ height: '270px', width: '786px' }} // set height of the DataGrid              
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    data_source_id: false,
                    table_name: false,
                    rec_id: false,
                    fullname: false,
                    shortname: false,
                    external_ds: false,
                    descr: false,
                  },
                },
              }}             
            />
          </Grid>

          <Grid item sx={{width: 45, border: '0px solid green', ml: 1 }}> 
            <Box sx={{ border: '0px solid purple', display: 'flex', flexDirection: 'column', gap: 0.1, alignItems: 'center', justifyContent: 'center' }}>
              <IconButton
                onClick={handleClickAdd}
                disabled={!props.rec_id} 
                color="primary"
                size="small"
                title="Добавить связь с источником данных"
              >
                <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox />
              </IconButton>
              <IconButton
                onClick={handleClickEdit}
                disabled={!props.rec_id||noRecords}
                color="primary"
                size="small"
                title="Редактировать связь с источником данных"
              >
                <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox />
              </IconButton>
              <IconButton
                onClick={handleClickDelete}
                disabled={!props.rec_id||noRecords}
                color="primary"
                size="small"
                title="Удалить связь с источником данных"
              >
                <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox />
              </IconButton>
              <IconButton
                onClick={handleOpenDSInfo}
                disabled={!props.rec_id||noRecords}
                color="primary"
                size="small"
                title="Информация по источнику данных"
              >
                <SvgIcon fontSize="small" component={InfoLightIcon} inheritViewBox />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Collapse in={openAlert}>
          <Alert
            style={{ width: '786px' }}
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

      <Dialog open={open} onClose={handleCloseNo} fullWidth={false} maxWidth="800px">
          <DialogTitle>Связь с источником данных</DialogTitle>  
            <DialogContent style={{height:'480px', width: '700px'}}>
              <DialogContentText>
                Задать связь с источником данных
              </DialogContentText>
              <Box sx={{ mt: 2, border: '0px solid red', padding: 0, display: 'flex', flexDirection: 'column', gap: 1.5}}>
        
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-controlled-open-select-label" required >Источник данных</InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={valueDataSourceId  || "" }
                  label="Источник данных"
                  defaultValue={true}
                  fullWidth
                  
                  onChange={e => setValueDataSourceId(e.target.value)}
                >
                {tableDataSrc?.map(option => {
                    return (
                      <MenuItem key={option.id} value={option.id}>
                      <Tooltip title={option.shortname ?? option.id} arrow>
                        <span>{option.title ?? option.id}</span>
                      </Tooltip>
                    </MenuItem>
                    );
                    
                })}
                </Select>
              </FormControl>  
              <TextField
                variant="outlined"
                margin="dense"
                id="title"
                size="small"
                label="Обозначение" required
                value={valueTitleSrc || ''}
                fullWidth
                onChange={e => setValueTitleSrc(e.target.value)}
              />
              <TextField
                variant="outlined"
                id="name_src"
                label="Название"
                size="small"
                value={valueNameSrc || ''}
                fullWidth
                onChange={e => setValueNameSrc(e.target.value)}
              />
              </Box>          
              </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleCloseNo}>Отмена</Button>
              <Button variant="outlined" disabled={!valueTitleSrc||!valueDataSourceId} onClick={handleCloseYes}>Сохранить</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} fullWidth={true}>
          <DialogTitle>
              Внимание
          </DialogTitle>
          <DialogContent>
              <DialogContentText>
                <Typography variant="body1" style={{marginBottom: "1em"}}>
                  В таблице "{table_names['data_source_class']}" предложена к удалению следующая запись:
                </Typography>
                <Typography variant="body1" style={{fontWeight: "bold", marginBottom: "1em"}}>
                  {valueTitleSrc}; Код в БД = {valueId}
                </Typography>
                <Typography variant="body1">
                  Вы желаете удалить указанную запись?        
                </Typography>
              </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseConfirmDeleteYes} >Да</Button>
            <Button variant="outlined" onClick={handleCloseConfirmDelete} autoFocus>Нет</Button>
          </DialogActions>
          </Dialog>

          <Dialog open={openDSInfo} onClose={handleCloseDSInfo} fullWidth={true}>
            <DialogTitle>
              <Typography variant="h6">Источник данных {valueTitle}</Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">Код: {valueDataSourceId}</Typography>
              <Typography variant="body1">Обозначение: {valueTitle}</Typography>
              <Typography variant="body1">Краткое название: {valueShortName}</Typography>
              <Typography variant="body1">Полное название: {valueFullName}</Typography>
              <Typography variant="body1">Источник данных: {valueExternalDS === 'false' ? 'Целевая БД' : 'Внешний источник' }</Typography>
              <Typography variant="body1">Комментарий: {valueDescr}</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleCloseDSInfo} autoFocus>Закрыть</Button>
            </DialogActions>
          </Dialog>
    </form>
  </div>
)

/*   return (
    
    <div style={{ height: 270, width: 886 }}>
      <form ref={formRef}>  
      <table cellSpacing={0} cellPadding={0} style={{ height: 270, width: 886, verticalAlign: 'top' }} border="0"><tbody><tr>
        <td style={{ height: 270, width: 800, verticalAlign: 'top' }}>
      <DataGrid
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        rowHeight={25}
        columns={columns_src}
        rows={tableData}
        disableMultipleSelection={true}
        onPaginationModelChange={setPaginationModel}
        onRowClick={handleRowClick} {...tableData} 
        hideFooterSelectedRowCount={true}
        selectionModel={selectionModel}
        paginationModel={paginationModel}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        loading={isLoading}        
        initialState={{
          columns: {
            columnVisibilityModel: {
              data_source_id: false,
              table_name: false,
              rec_id: false,
              fullname: false,
              shortname: false,
              external_ds: false,
              descr: false,
            },
          },
        }}             
      /></td>
      <td style={{ height: 270, width: 100, verticalAlign: 'top' }}>
      &nbsp;<IconButton onClick={()=>handleClickAdd()} disabled={false}  color="primary" size="small" title="Добавить связь с источником данных">
        <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleClickEdit()} disabled={noRecords} color="primary" size="small" title="Редактировать связь с источником данных">
        <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleClickDelete()} disabled={noRecords} color="primary" size="small" title="Удалить связь с источником данных">
        <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton><br/>
      &nbsp;<IconButton onClick={()=>handleOpenDSInfo()} disabled={noRecords} color="primary" size="small" title="Информация по источнику данных">
        <SvgIcon fontSize="small" component={InfoLightIcon} inheritViewBox /></IconButton>
      </td></tr>
      <tr>
        <td>
        <Box sx={{ width: '100%' }}>
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
            sx={{ mb: 2 }}
          >
            {alertText}
          </Alert>
        </Collapse>
        <div style={{
        marginLeft: '40%',
        }}>
        </div>
      </Box>
        </td>
      </tr>
      </tbody></table>

      <Dialog open={open} onClose={handleCloseNo} fullWidth={false} maxWidth="800px">
      <DialogTitle>Связь с источником данных</DialogTitle>  
        <DialogContent style={{height:'480px', width: '700px'}}>
          <DialogContentText>
            Задать связь с источником данных
          </DialogContentText>
        <p></p>        
        <FormControl fullWidth>
            <InputLabel id="demo-controlled-open-select-label" required >Источник данных</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              value={valueDataSourceId  || "" }
              label="Источник данных"
              defaultValue={true}
              fullWidth
              onChange={e => setValueDataSourceId(e.target.value)}
            >
            {tableDataSrc?.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title ?? option.id}
                  </MenuItem>
                );
            })}
            </Select>
          </FormControl>  
          <p></p> 
          <TextField
            variant="outlined"
            margin="dense"
            id="title"
            label="Обозначение" required
            value={valueTitleSrc || ''}
            fullWidth
            onChange={e => setValueTitleSrc(e.target.value)}
          />
          <p></p>
          <TextField
            variant="outlined"
            id="name_src"
            label="Название"
            value={valueNameSrc || ''}
            fullWidth
            onChange={e => setValueNameSrc(e.target.value)}
          />        
          </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseNo}>Отмена</Button>
          <Button variant="outlined" disabled={!valueTitleSrc||!valueDataSourceId} onClick={handleCloseYes}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              В таблице "{table_names['data_source_class']}" предложена к удалению следующая запись:<p></p><b>{valueTitleSrc}</b>; Код в БД = <b>{valueId}</b><p></p>
              Вы желаете удалить указанную запись?        
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseConfirmDelete} autoFocus>Нет</Button>
          <Button variant="outlined" onClick={handleCloseConfirmDeleteYes} >Да</Button>
      </DialogActions>

      </Dialog>
      <Dialog open={openDSInfo} onClose={handleCloseDSInfo} fullWidth={true}>
      <DialogTitle>
          Источник данных <b>{valueTitle}</b>
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              Код: <b>{valueDataSourceId}</b><p></p>
              Обозначение: <b>{valueTitle}</b><p></p>
              Краткое название: <b>{valueShortName}</b><p></p> 
              Полное название: <b>{valueFullName}</b><p></p> 
              Источник данных: <b>{valueExternalDS === 'false' ? 'Целевая БД' : 'Внешний источник' }</b><p></p> 
              Комментарий: <b>{valueDescr}</b><p></p> 
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseDSInfo} autoFocus>Закрыть</Button>
      </DialogActions>
      </Dialog>
      </form>
    </div>
    ) */
}
export  { DataTableDataSourceClass }
