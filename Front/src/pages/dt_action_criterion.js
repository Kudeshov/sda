import React, { useState, useEffect } from 'react';
import {
  DataGrid, 
  ruRU,
  GridToolbarContainer,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
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
import Divider from '@mui/material/Divider';

function DataTableActionCriterion(props)  {
  const apiRef = useGridApiRef(); // init DataGrid API for scrolling
  const [open, setOpen] = React.useState(false);
  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [addedId, setAddedId] = useState(0);
  const [tableAction, setTableAction] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);   
  const {paginationModel, setPaginationModel, scrollToIndexRef} = useGridScrollPagination(apiRef, tableData, setRowSelectionModel);
  const [clickedRowId, setClickedRowId] = useState(null);

  const handleClickEdit = () => {
    setOpen(true);
  };

  const handleClickAdd = () => {
    setValueID(null);
    setValueActionId(null);
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
 
  useEffect(() => {
    if (addedId !== null){  
        scrollToIndexRef.current = addedId;
        setAddedId(null);
        setRowSelectionModel([addedId]);
    }
  }, [addedId, scrollToIndexRef]);


const columns_src = [
  { field: 'id', headerName: 'Код', width: 60 },
  { field: 'action_id', headerName: 'Код действия', width: 100 },
  { field: 'criterion_id', headerName: 'Код критерия', width: 100 },
  { field: 'title', headerName: 'Обозначение', width: 300 },
  { field: 'name_rus', headerName: 'Название', width: 400, },
  { field: 'name_eng', headerName: 'Название (англ)', width: 180, hideable: false },
  { field: 'descr_rus', headerName: 'Описание (рус)', width: 250 },
  { field: 'descr_eng', headerName: 'Описание (англ)', width: 250 },
];

useEffect(() => {
  setOpenAlert(false);
  setlastSrcClassID(0);
  setIsLoading(true);
  fetch(`/action_criterion?criterion_id=${props.rec_id||0}`)
    .then((data) => data.json())
    .then((data) => setTableData(data));
  setlastSrcClassID(0);
  setIsLoading(false);
}, [props.table_name, props.rec_id])


useEffect(() => {
  fetch(`/action`)
    .then((data) => data.json())
    .then((data) => setTableAction(data));
}, [])

const [valueId,  setValueID] = React.useState();
const [valueTitle, setValueTitle] = React.useState();
const [valueNameRus, setValueNameRus] = React.useState();
const [valueNameEng, setValueNameEng] = React.useState();
const [valueDescrRus, setValueDescrRus] = React.useState();
const [valueDescrEng, setValueDescrEng] = React.useState();
const [valueActionId,  setValueActionId] = React.useState();
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

const reloadData = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`/action_criterion?criterion_id=${props.rec_id||0}`);
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
  const sortedAndFilteredRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const deletingRowIndex = sortedAndFilteredRowIds.indexOf(Number(valueId));
  let previousRowId = 0;
  if (deletingRowIndex > 0) {
    previousRowId = sortedAndFilteredRowIds[deletingRowIndex - 1];
  } else {
    previousRowId = sortedAndFilteredRowIds[deletingRowIndex + 1];
  }  
  setIsLoading(true);

  try {
    const response = await fetch('/action_criterion/'+valueId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    //очищаем фильтр, если там только одна (удаленная) запись
    if (sortedAndFilteredRowIds.length === 1) {
      apiRef.current.setFilterModel({ items: [] });
    }
    setAlertSeverity('success');
    setAlertText(await response.text());
    // Переключаемся на предыдущую запись после удаления
    if (previousRowId)
    {
      setValueID(previousRowId);
      setAddedId(previousRowId);
    }
    else
    {
      if (tableData[0]) {
        setValueID(tableData[0].id);
        setAddedId(tableData[0].id);
      }
    }    
  } catch (err) {
    setAlertSeverity('error');
    setAlertText(err.message);
  } finally {
    setIsLoading(false);
    setOpenAlert(true);
    reloadData(); 
  }
};

const saveRec = async () => {
  if (formRef.current.reportValidity()) {
    // Объявляем переменные, которые изменятся в зависимости от наличия valueId
    let url;
    let method;
    let data;

    if (valueId) {
      // Если valueId существует, будем выполнять запрос PUT
      url = '/action_criterion/' + valueId;
      method = 'PUT';
      data = {
        action_criterion_id: valueId,
        action_id: valueActionId,
      };
    } else {
      // Если valueId не существует, будем выполнять запрос POST
      url = '/action_criterion/';
      method = 'POST';
      data = {
        action_id: valueActionId,
        criterion_id: props.rec_id,
      };
    }

    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'Application/json',
          Accept: '*/*',
        },
      });

      let aSeverity;
      let aText;

      if (!response.ok) {
        aSeverity = 'error';
        aText = await response.text();
      } else {
        if (method === 'POST') {
          const { id } = await response.json();
          aSeverity = "success";
          aText = `Добавлена запись с кодом ${id}`;
          setValueID(id);
        } else {
          aSeverity = "success";
          aText = await response.text();
        }
      }

      setAlertText(aText);
      setAlertSeverity(aSeverity);
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

const handleRowClick = (params) => {
  setOpenAlert(false);
  setValueID(params.row.id);
  setClickedRowId(params.row.id);
  setRowSelectionModel([params.row.id]);
}; 

const setValues = (row) => {
  setValueActionId(row.action_id);
  setValueTitle(row.title);    
  setValueNameRus(row.name_rus);    
  setValueNameEng(row.name_eng);    
  setValueDescrRus(row.descr_rus);    
  setValueDescrEng(row.descr_eng);   
};

useEffect(() => {
  const rowData = tableData.find(row => row.id === valueId);
  if (rowData) {
    setValues(rowData);
  }
}, [tableData, valueId]);

const [noRecords, setNoRecords] = useState(true);



  const CustomFooter = props => {
    return (
      <span>
        <Divider />
        <GridToolbarContainer 
          style={{ 
            justifyContent: 'flex-end', 
            paddingRight: '20px', // Отступ справа
            alignItems: 'center', 
            height: '56px' // Фиксированная высота
        }}
      >
        Всего строк: {tableData.length}
      </GridToolbarContainer>
    </span>
    );
  };  

const formRef = React.useRef();
  return (
    
    <div style={{ height: 270, width: 886 }}>
      <form ref={formRef}>  
      <Box sx={{ border: '0px solid purple', height: 250, width: 886 }}>
        <Grid container spacing={1}>
          <Grid item sx={{ width: 780, border: '0px solid black', ml: 0 }}>
            <DataGrid
	      components={{ Footer: CustomFooter }}
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
              pageSize={tableData.length}
              paginationMode="server"
              hideFooterPagination
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
              id: false,
              action_id: false,
              criterion_id: false,
              title: true,
              name_rus: true,
              name_eng: false,
              descr_rus: false,
              descr_eng: false,
            },
          },
        }}             
            />
          </Grid>
          <Grid item sx={{width: 45, border: '0px solid green', ml: 1 }}> 
            <Box sx={{ border: '0px solid purple', display: 'flex', flexDirection: 'column', gap: 0.1, alignItems: 'center', justifyContent: 'center' }}>
      <IconButton onClick={()=>handleClickAdd()}  disabled={false} color="primary" size="small" title="Добавить связь с источником данных">
                <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox />
              </IconButton>
        <IconButton onClick={()=>handleClickEdit()} disabled={noRecords} color="primary" size="small" title="Редактировать связь с источником данных">
                <SvgIcon fontSize="small" component={EditLightIcon} inheritViewBox />
              </IconButton>
        <IconButton onClick={()=>handleClickDelete()} disabled={noRecords} color="primary" size="small" title="Удалить связь с источником данных">
                <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox />
              </IconButton>
              <IconButton onClick={()=>handleOpenDSInfo()} disabled={noRecords} color="primary" size="small" title="Информация по источнику данных">
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
      <DialogTitle>Действие</DialogTitle>  
        <DialogContent style={{height:'280px', width: '700px'}}>
          <DialogContentText>
            Задать действие
          </DialogContentText>
        <p></p>        
        <FormControl fullWidth>
            <InputLabel id="demo-controlled-open-select-label" required >Действие</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              value={valueActionId  || "" }
              label="Действие"
              defaultValue={true}
              fullWidth
              onChange={e => setValueActionId(e.target.value)}
            >
            {tableAction?.map(option => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title ?? option.id}
                  </MenuItem>
                );
            })}
            </Select>
          </FormControl>
          </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseNo}>Отмена</Button>
          <Button variant="outlined" disabled={! valueActionId===null } onClick={handleCloseYes}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} fullWidth={true}>
      <DialogTitle>
          Внимание
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
                <Typography variant="body1" style={{marginBottom: "1em"}}>
              В таблице "{table_names['data_source_class']}" предложена к удалению следующая запись:<p></p><b>{valueTitle}</b>; Код в БД = <b>{valueId}</b><p></p>
                </Typography>
                <Typography variant="body1" style={{fontWeight: "bold", marginBottom: "1em"}}>
                  Код в БД = {valueId}
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
          <Typography variant="h6">Действие {valueTitle}</Typography>
      </DialogTitle>
      <DialogContent>
          <DialogContentText>
              Код: <b>{valueId}</b><p></p>
              Обозначение: <b>{valueTitle}</b><p></p>
              Название (рус.яз): <b>{valueNameRus}</b><p></p> 
              Название (англ.яз): <b>{valueNameEng}</b><p></p> 
              Комментарий (рус.яз): <b>{valueDescrRus}</b><p></p> 
              Комментарий (англ.яз): <b>{valueDescrEng}</b><p></p> 
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button variant="outlined" onClick={handleCloseDSInfo} autoFocus>Закрыть</Button>
      </DialogActions>
      </Dialog>
      </form>
    </div>
    )
}
 export  { DataTableActionCriterion }
