import React, { useState, useEffect, useCallback } from 'react';
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
import { ReactComponent as CollapseIcon } from "./../icons/chevron-double-right.svg";
import { ReactComponent as ExpandIcon } from "./../icons/chevron-double-down.svg";
import { ReactComponent as SearchIcon } from "./../icons/search.svg";
import { ReactComponent as TimesCircleIcon } from "./../icons/times-circle.svg";
import { ReactComponent as FolderIcon } from "./../icons/folder.svg";
import { ReactComponent as FileIcon } from "./../icons/file.svg";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
/* import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material"; */
import CircularProgress from '@material-ui/core/CircularProgress';
import { ExportToCsv } from 'export-to-csv-fix-source-map';
import { table_names } from './table_names';
import Backdrop from '@mui/material/Backdrop';
import { InputAdornment } from "@material-ui/core";
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { DataTableActionCriterion } from './dt_action_criterion';
import { listToTree } from '../helpers/treeHelper';
import { Grid } from '@mui/material';
/* import TreeSelect, {
  DefaultOption,
  getDefaultOptionProps,  
} from "mui-tree-select"; */

import HierarchicalAutocomplete, { transformData } from '../component/HierarchicalAutocomplete';


var lastId = 0;
//var clickedId = 0;
var clickAfterReload = false;

const DataTableCriterion = (props) => {
  const [tableCalcfunction, settableCalcfunction] = useState([]); 
  const [tableActionLevel, settableActionLevel] = useState([]); 
  const [tableIrradiation, settableIrradiation] = useState([]); 
  const [tablePeopleClass, settablePeopleClass] = useState([]); 
  const [tableAgegroup, settableAgegroup] = useState([]); 
  const [tableIntegralPeriod, settableIntegralPeriod] = useState([]); 
  const [tableOrgan, settableOrgan] = useState([]);
  const [tableIsotope, settableIsotope] = useState([]); 
  const [tableSubstForm, settableSubstForm] = useState([]);
  const [tableAerosolSol, settableAerosolSol] = useState([]);
  const [tableChemCompGr, settableChemCompGr] = useState([]);
  const [tableAerosolAmad, settableAerosolAmad] = useState([]);
  const [tableDataSource, settableDataSource] = useState([]);
  const [tableCriterionGr, settableCriterionGr] = useState([]);

  const [tableExpScenario, settableExpScenario] = useState([]); 
  const [valueCalcfunctionID, setValueCalcfunctionID] = useState(); 
  const [valueCrValue, setValueCrValue] = useState(); 
  const [valueTimeend, setValueTimeend] = useState(); 
  const [valueCalcfunctionIDInitial, setValueCalcfunctionIDInitial] = useState(); 
  const [valueCrValueInitial, setValueCrValueInitial] = useState(); 
  const [valueTimeendInitial, setValueTimeendInitial] = useState(); 
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
  const [valueParentID, setValueParentID] = React.useState();
  const [valuePeopleClass, setValuePeopleClass] = React.useState();
  const [valueActionLevel, setValueActionLevel] = React.useState();
  const [valueIrradiation, setValueIrradiation] = React.useState();
  const [valueAgegroup, setValueAgegroup] = React.useState();
  const [valueExpScenario, setValueExpScenario] = React.useState();
  const [valueIntegralPeriod, setValueIntegralPeriod] = React.useState();
  const [valueOrgan, setValueOrgan] = React.useState();
  const [valueDataSource, setValueDataSource] = React.useState();
  const [valueChemCompGr, setValueChemCompGr] = React.useState();
  const [valueAerosolSol, setValueAerosolSol] = React.useState();
  const [valueAerosolAmad, setValueAerosolAmad] = React.useState();
  const [valueSubstForm, setValueSubstForm] = React.useState();
  const [valueIsotope, setValueIsotope] = React.useState();
  const [valueParentIDInitial, setValueParentIDInitial] = React.useState();
  const [valuePeopleClassInitial, setValuePeopleClassInitial] = React.useState();
  const [valueActionLevelInitial, setValueActionLevelInitial] = React.useState();
  const [valueIrradiationInitial, setValueIrradiationInitial] = React.useState();
  const [valueAgegroupInitial, setValueAgegroupInitial] = React.useState();
  const [valueExpScenarioInitial, setValueExpScenarioInitial] = React.useState();
  const [valueIntegralPeriodInitial, setValueIntegralPeriodInitial] = React.useState();
  const [valueOrganInitial, setValueOrganInitial] = React.useState();
  const [valueDataSourceInitial, setValueDataSourceInitial] = React.useState();
  const [valueChemCompGrInitial, setValueChemCompGrInitial] = React.useState();
  const [valueAerosolSolInitial, setValueAerosolSolInitial] = React.useState();
  const [valueAerosolAmadInitial, setValueAerosolAmadInitial] = React.useState();
  const [valueSubstFormInitial, setValueSubstFormInitial] = React.useState();
  const [valueIsotopeInitial, setValueIsotopeInitial] = React.useState();
  const [valueNormativ, setValueNormativ] = React.useState();
  const [valueNormativInitial, setValueNormativInitial] = React.useState();
  const [isLoading, setIsLoading] = React.useState("false");
  const [tableData, setTableData] = useState([]); 
  const [treeData, setTreeData] = useState([]); 
  const [editStarted, setEditStarted] = useState(false);
  //const [isEmpty, setIsEmpty] = useState([false]);
  const [valueCrit, setValueCrit] = React.useState(0);

  const [alertText, setAlertText] = useState("Сообщение");
  const [alertSeverity, setAlertSeverity] = useState("info");


/* 
   useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueNameRus)&&(''===valueNameEng)&&(''===valueDescrEng)&&(''===valueDescrRus)   
      &&(''===valueParentID)&&(''===valueCalcfunctionID)(''===valueCrValue)&&(''===valueTimeend)&&(''===valuePeopleClass)&&(''===valueIrradiation)&&(''===valueAgegroup)   
      &&(''===valueActionLevel)&&(''===valueExpScenario)(''===valueIntegralPeriod)&&(''===valueOrgan)&&(''===valueDataSource)&&(''===valueChemCompGr)&&(''===valueAerosolSol)   
      &&(''===valueAerosolAmad)&&(''===valueSubstForm)&&(''===valueIsotope));
    }, [ valueTitle, valueNameRus, valueNameEng, valueDescrEng, valueDescrRus, valueParentID, valueNormativ, valueCalcfunctionID,
      valueCrValue, valueTimeend, valuePeopleClass, valueIrradiation, valueAgegroup, valueActionLevel, valueExpScenario, valueIntegralPeriod,
      valueOrgan, valueDataSource, valueChemCompGr, valueAerosolSol, valueAerosolAmad, valueSubstForm, valueIsotope]);    

    useEffect(() => {
      setIsEmpty(('' === valueTitle) && ('' === valueNameRus) && ('' === valueNameEng) && ('' === valueDescrEng) && ('' === valueDescrRus)
        && ('' === valueParentID) && ('' === valueNormativ) && ('' === valueCalcfunctionID) && ('' === valueCrValue) && ('' === valueTimeend)
        && ('' === valuePeopleClass) && ('' === valueIrradiation) && ('' === valueAgegroup) && ('' === valueActionLevel) && ('' === valueExpScenario)
        && ('' === valueIntegralPeriod) && ('' === valueOrgan) && ('' === valueDataSource) && ('' === valueChemCompGr) && ('' === valueAerosolSol)
        && ('' === valueAerosolAmad) && ('' === valueSubstForm) && ('' === valueIsotope));
    }, [
      valueTitle, valueNameRus, valueNameEng, valueDescrEng, valueDescrRus, valueParentID, valueNormativ, valueCalcfunctionID,
      valueCrValue, valueTimeend, valuePeopleClass, valueIrradiation, valueAgegroup, valueActionLevel, valueExpScenario, valueIntegralPeriod,
      valueOrgan, valueDataSource, valueChemCompGr, valueAerosolSol, valueAerosolAmad, valueSubstForm, valueIsotope
    ]);
    
 */
/*   useEffect(() => {
    setEditStarted(       
       (valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrRusInitial!==valueDescrRus)||(valueDescrEngInitial!==valueDescrEng) ||(valueCrValueInitial!==valueCrValue)||(valueParentIDInitial!==valueParentID)||(valueParentIDInitial!==valueParentID)||(valueNormativ!==valueNormativInitial)
      ||(valueCalcfunctionIDInitial!==valueCalcfunctionID)||(valueTimeendInitial!==valueTimeend)||(valueExpScenarioInitial!==valueExpScenario)||(valueIntegralPeriodInitial!==valueIntegralPeriod)
      ||(valueOrganInitial!==valueOrgan)||(valueDataSourceInitial!==valueDataSource)||(valueChemCompGrInitial!==valueChemCompGr)||(valueAerosolSolInitial!==valueAerosolSol)||(valueAerosolAmadInitial!==valueAerosolAmad)
      ||(valueDataSourceInitial!==valueDataSource)||(valueChemCompGrInitial!==valueChemCompGr)||(valueAerosolAmadInitial!==valueAerosolAmad)
      ||(valueSubstFormInitial!==valueSubstForm)
      ||(valueIsotopeInitial!==valueIsotope)||(valueAerosolAmadInitial!==valueAerosolAmad)||(valueActionLevelInitial!==valueActionLevel)|(valueAgegroupInitial!==valueAgegroup));

    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, valueParentID, valueParentIDInitial, valueNormativ, valueNormativInitial, valueCalcfunctionID, valueCalcfunctionIDInitial,
      valueCrValueInitial, valueCrValue,  valueTimeend,valueTimeendInitial,valuePeopleClass, valuePeopleClassInitial,
       valueIrradiation, valueIrradiationInitial, valueAgegroup, valueAgegroupInitial, valueActionLevel, valueActionLevelInitial,
    valueExpScenario, valueExpScenarioInitial, valueIntegralPeriod, valueIntegralPeriodInitial, valueOrgan, valueOrganInitial,valueDataSource,
    valueDataSourceInitial, valueChemCompGr, valueChemCompGrInitial, valueAerosolSol,
    valueAerosolSolInitial, valueAerosolAmad, valueAerosolAmadInitial, valueSubstForm, valueSubstFormInitial, valueIsotope, valueIsotopeInitial,]); 
 */
    useEffect(() => {
      const fields = [
        ['valueTitleInitial', valueTitleInitial, 'valueTitle', valueTitle],
        ['valueNameRusInitial', valueNameRusInitial, 'valueNameRus', valueNameRus],
        ['valueNameEngInitial', valueNameEngInitial, 'valueNameEng', valueNameEng],
        ['valueDescrRusInitial', valueDescrRusInitial, 'valueDescrRus', valueDescrRus],
        ['valueDescrEngInitial', valueDescrEngInitial, 'valueDescrEng', valueDescrEng],
        ['valueCrValueInitial', valueCrValueInitial, 'valueCrValue', valueCrValue],
        ['valueParentIDInitial', valueParentIDInitial, 'valueParentID', valueParentID],
/*         ['valueNormativInitial', valueNormativInitial, 'valueNormativ', valueNormativ], */
        ['valueCalcfunctionIDInitial', valueCalcfunctionIDInitial, 'valueCalcfunctionID', valueCalcfunctionID],
        ['valueTimeendInitial', valueTimeendInitial, 'valueTimeend', valueTimeend],
        ['valueExpScenarioInitial', valueExpScenarioInitial, 'valueExpScenario', valueExpScenario],
        ['valueIntegralPeriodInitial', valueIntegralPeriodInitial, 'valueIntegralPeriod', valueIntegralPeriod],
        ['valueOrganInitial', valueOrganInitial, 'valueOrgan', valueOrgan],
        ['valueDataSourceInitial', valueDataSourceInitial, 'valueDataSource', valueDataSource],
        ['valueChemCompGrInitial', valueChemCompGrInitial, 'valueChemCompGr', valueChemCompGr],
        ['valueAerosolSolInitial', valueAerosolSolInitial, 'valueAerosolSol', valueAerosolSol],
        ['valueAerosolAmadInitial', valueAerosolAmadInitial, 'valueAerosolAmad', valueAerosolAmad],
        ['valueSubstFormInitial', valueSubstFormInitial, 'valueSubstForm', valueSubstForm],
        ['valueIsotopeInitial', valueIsotopeInitial, 'valueIsotope', valueIsotope],
        ['valueActionLevelInitial', valueActionLevelInitial, 'valueActionLevel', valueActionLevel],
        ['valueAgegroupInitial', valueAgegroupInitial, 'valueAgegroup', valueAgegroup],
        ['valuePeopleClassInitial', valuePeopleClassInitial, 'valuePeopleClass', valuePeopleClass],
      ];

      let editStarted = false;
      
      for (let i = 0; i < fields.length; i++) {
        const [initialName, initialValue, currentName, currentValue] = fields[i];
        
        if (initialValue !== currentValue) {
          console.log(`Variable ${currentName} changed from ${initialValue} to ${currentValue}`);
          editStarted = true;
        }
      }

      setEditStarted(editStarted);
      }, [
      valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
      valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, valueParentID, valueParentIDInitial, 
      valueNormativ, valueNormativInitial, valueCalcfunctionID, valueCalcfunctionIDInitial,
      valueCrValueInitial, valueCrValue,  valueTimeend, valueTimeendInitial, 
      valueExpScenario, valueExpScenarioInitial, valueIntegralPeriod, valueIntegralPeriodInitial, 
      valueOrgan, valueOrganInitial, valueDataSource, valueDataSourceInitial, 
      valueChemCompGr, valueChemCompGrInitial, valueAerosolSol, valueAerosolSolInitial, 
      valueAerosolAmad, valueAerosolAmadInitial, valueSubstForm, valueSubstFormInitial, 
      valueIsotope, valueIsotopeInitial, valueActionLevel, valueActionLevelInitial,
      valueAgegroup, valueAgegroupInitial
      ]); 

  useEffect(() => {
    if ((!isLoading) && (tableData) && (tableData.length)) {
      if (!lastId) 
      {
        lastId = tableData[0].id;
        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueDescrRus(tableData[0].descr_rus);
        setValueDescrEng(tableData[0].descr_eng);
        setValueTitleInitial(tableData[0].title);       
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueDescrRusInitial(tableData[0].descr_rus);
        setValueDescrEngInitial(tableData[0].descr_eng);
        setValueParentID(tableData[0].parent_id||-1);
        setValueParentIDInitial(tableData[0].parent_id||-1);

        setValueCalcfunctionID(tableData[0].calcfunction_id);
        setValueIrradiation(tableData[0].irradiation_id);
        setValueAgegroup(tableData[0].agegroup_id);
        setValueExpScenario(tableData[0].exp_scenario_id);
        setValueIntegralPeriod(tableData[0].integral_period_id);
        setValueOrgan(tableData[0].organ_id);
        setValueDataSource(tableData[0].data_source_id);
        setValueAerosolAmad(tableData[0].aerosol_amad_id);
        setValueAerosolSol(tableData[0].aerosol_sol_id);
        setValueChemCompGr(tableData[0].chem_comp_gr_id);
        setValueSubstForm(tableData[0].subst_form_id);
        setValueIsotope(tableData[0].isotope_id);
        setValueActionLevel(tableData[0].action_level_id);
        setValuePeopleClass(tableData[0].people_class_id);
        setValueCrValue(tableData[0].cr_value);
        setValueTimeend(tableData[0].timeend);

        setValueCalcfunctionIDInitial(tableData[0].calcfunction_id);
        setValueIrradiationInitial(tableData[0].irradiation_id);
        setValueAgegroupInitial(tableData[0].agegroup_id);
        setValueExpScenarioInitial(tableData[0].exp_scenario_id);
        setValueIntegralPeriodInitial(tableData[0].integral_period_id);
        setValueOrganInitial(tableData[0].organ_id);
        setValueDataSourceInitial(tableData[0].data_source_id);
        setValueAerosolAmadInitial(tableData[0].aerosol_amad_id);
        setValueAerosolSolInitial(tableData[0].aerosol_sol_id);
        setValueChemCompGrInitial(tableData[0].chem_comp_gr_id);
        setValueSubstFormInitial(tableData[0].subst_form_id);
        setValueIsotopeInitial(tableData[0].isotope_id);
        setValueActionLevelInitial(tableData[0].action_level_id);
        setValuePeopleClassInitial(tableData[0].people_class_id);
        setValueCrValueInitial(tableData[0].cr_value);
        setValueTimeendInitial(tableData[0].timeend);
      }
    }
    }, [ isLoading, tableData] );

    useEffect(() => {
      function updateCurrentRec (id)  {
              if (id)
                lastId = id;
              var res = tableData.filter(function(item) {
                return item.id.toString() === id;
              });
              if (res.length === 0)
                return;
              setValueID(res[0].id); 
              setValueTitle(res[0].title);
              setValueNameRus(res[0].name_rus);
              setValueNameEng(res[0].name_eng);
              setValueDescrRus(res[0].descr_rus);
              setValueDescrEng(res[0].descr_eng);    
              setValueParentID(res[0].parent_id||-1);    
              setValueTitleInitial(res[0].title);
              setValueNameRusInitial(res[0].name_rus);
              setValueNameEngInitial(res[0].name_eng);
              setValueDescrRusInitial(res[0].descr_rus);
              setValueDescrEngInitial(res[0].descr_eng);
              setValueParentIDInitial(res[0].parent_id||-1); 
              setValueCalcfunctionID(res[0].calcfunction_id);
              setValueIrradiation(res[0].irradiation_id);
              setValueAgegroup(res[0].agegroup_id);
              setValueExpScenario(res[0].exp_scenario_id);
              setValueIntegralPeriod(res[0].integral_period_id);
              setValueOrgan(res[0].organ_id);
              setValueDataSource(res[0].data_source_id);
              setValueAerosolAmad(res[0].aerosol_amad_id);
              setValueAerosolSol(res[0].aerosol_sol_id);
              setValueChemCompGr(res[0].chem_comp_gr_id);
              setValueSubstForm(res[0].subst_form_id);
              setValueIsotope(res[0].isotope_id);
              setValueActionLevel(res[0].action_level_id);
              setValuePeopleClass(res[0].people_class_id);
              setValueCrValue(res[0].cr_value);
              setValueTimeend(res[0].timeend);

              setValueCalcfunctionIDInitial(res[0].calcfunction_id);
              setValueIrradiationInitial(res[0].irradiation_id);
              setValueAgegroupInitial(res[0].agegroup_id);
              setValueExpScenarioInitial(res[0].exp_scenario_id);
              setValueIntegralPeriodInitial(res[0].integral_period_id);
              setValueOrganInitial(res[0].organ_id);
              setValueDataSourceInitial(res[0].data_source_id);
              setValueAerosolAmadInitial(res[0].aerosol_amad_id);
              setValueAerosolSolInitial(res[0].aerosol_sol_id);
              setValueChemCompGrInitial(res[0].chem_comp_gr_id);
              setValueSubstFormInitial(res[0].subst_form_id);
              setValueIsotopeInitial(res[0].isotope_id);
              setValueActionLevelInitial(res[0].action_level_id);
              setValuePeopleClassInitial(res[0].people_class_id);
              setValueCrValueInitial(res[0].cr_value);
              setValueTimeendInitial(res[0].timeend);
          }; 
        
      if (clickAfterReload) {
          clickAfterReload = false;
          if (lastId!==0)
            updateCurrentRec(lastId); 
      }
    }, [tableData] );

    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState('');
    const [updated, setUpdated] = React.useState(false);  

    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };
  
    const [treeFilterString, setTreeFilterString] = React.useState('');
    const nodeRefs = React.useRef({}); 
    const scrollContainerRef = React.useRef();

    useEffect(() => {
      if (updated && selected && nodeRefs.current[selected]) {
        const node = nodeRefs.current[selected];
        const scrollContainer = scrollContainerRef.current;

        if (node && scrollContainer) {

          const nodePosition = node.offsetTop;
          //const scrollContainerPosition = scrollContainer.offsetTop;
          
          //console.log('Node position:', nodePosition);
          //console.log('Scroll container position:', scrollContainerPosition);
          //console.log('Scroll container client height:', scrollContainer.clientHeight);
          
          if (nodePosition < scrollContainer.scrollTop || nodePosition > (scrollContainer.scrollTop + scrollContainer.clientHeight)) {
              //console.log('Node is outside of the visible scroll container area. Scrolling...');

            scrollContainer.scrollTop = nodePosition - scrollContainer.clientHeight / 2;
              // console.log('New scroll container scrollTop value:', scrollContainer.scrollTop);
          } else {
              //console.log('Node is within the visible scroll container area. No scrolling needed.');
          }
        }
        setUpdated(false); // Reset the updated state to false after scrolling
      }
    }, [updated, selected]);
    

    const DataTreeView = ({ treeItems }) => {
      const getTreeItemsFromData = treeItems => {
      
        return treeItems.map(treeItemData => {
          let children = undefined;
          if (treeItemData.children && treeItemData.children.length > 0) {
            children = getTreeItemsFromData(treeItemData.children);
          }
          return (
            <TreeItem
            sx={{ 
              '&.Mui-selected': {
                '& .MuiTreeItem-label': {
                  backgroundColor: 'rgba(0, 0, 0, 0.11)',
                },
              },
              '&.Mui-selected:focus': {
                '& .MuiTreeItem-label': {
                  backgroundColor: 'rgba(0, 0, 0, 0.11)',
                },
              },
            }}              
              key={treeItemData.id}
              nodeId={treeItemData.id?treeItemData.id.toString():0}
              ref={(el) => (nodeRefs.current[treeItemData.id] = el)}
              label={
                <Tooltip title={treeItemData.name_rus}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {treeItemData.crit === 0 ?
                    <SvgIcon fontSize="small" style={{ color: '#4b77d1', fontSize: '19px' }} component={FolderIcon} inheritViewBox />: 
                    <SvgIcon fontSize="small" style={{ color: '#4b77d1', fontSize: '19px' }} component={FileIcon} inheritViewBox />
                  }
                  <span style={{ marginLeft: '5px' }}>{treeItemData.title}</span>
                </div>
                </Tooltip>
              }
              children={children}
            />
          );
        });
      };
  
      return (
        <div>
        <p></p>
        <TreeView
          aria-label="Tree navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ 
            height: 240, 
            flexGrow: 1, 
            maxWidth: 400, 
            overflowY: 'auto',
            '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content': {
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
            },
            '& .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content': {
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
            },
          }}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
          expanded={expanded}
          selected={selected}          
          loading={isLoading}
        >
          {getTreeItemsFromData(treeItems)}
        </TreeView></div>
      );
    };

  useEffect(() => {
    // Здесь код, который будет выполняться после каждого обновления treeData
    setUpdated(true);
  }, [treeData]);    


  const setValues = (row) => {

    const valueSetters = {
      title: setValueTitle,
      name_rus: setValueNameRus,
      name_eng: setValueNameEng,
      descr_rus: setValueDescrRus,
      descr_eng: setValueDescrEng,
      parent_id: setValueParentID,
      calcfunction_id: setValueCalcfunctionID,
      irradiation_id: setValueIrradiation,
      agegroup_id: setValueAgegroup,
      exp_scenario_id: setValueExpScenario,
      integral_period_id: setValueIntegralPeriod,
      organ_id: setValueOrgan,
      data_source_id: setValueDataSource,
      aerosol_amad_id: setValueAerosolAmad,
      aerosol_sol_id: setValueAerosolSol,
      chem_comp_gr_id: setValueChemCompGr,
      subst_form_id: setValueSubstForm,
      isotope_id: setValueIsotope,
      action_level_id: setValueActionLevel,
      people_class_id: setValuePeopleClass,
      cr_value: setValueCrValue,
      timeend: setValueTimeend,
      crit: setValueCrit
    }
    
    const initialValueSetters = {
      title: setValueTitleInitial,
      name_rus: setValueNameRusInitial,
      name_eng: setValueNameEngInitial,
      descr_rus: setValueDescrRusInitial,
      descr_eng: setValueDescrEngInitial,
      parent_id: setValueParentIDInitial,
      calcfunction_id: setValueCalcfunctionIDInitial,
      irradiation_id: setValueIrradiationInitial,
      agegroup_id: setValueAgegroupInitial,
      exp_scenario_id: setValueExpScenarioInitial,
      integral_period_id: setValueIntegralPeriodInitial,
      organ_id: setValueOrganInitial,
      data_source_id: setValueDataSourceInitial,
      aerosol_amad_id: setValueAerosolAmadInitial,
      aerosol_sol_id: setValueAerosolSolInitial,
      chem_comp_gr_id: setValueChemCompGrInitial,
      subst_form_id: setValueSubstFormInitial,
      isotope_id: setValueIsotopeInitial,
      action_level_id: setValueActionLevelInitial,
      people_class_id: setValuePeopleClassInitial,
      cr_value: setValueCrValueInitial,
      timeend: setValueTimeendInitial
    }

    Object.keys(valueSetters).forEach((key) => {
        const setValue = valueSetters[key];
        if(key in row) { // проверить, существует ли ключ в объекте row
            setValue(row[key]);
        } else { // если ключ не существует
            console.log("Ключа " + key + " не существует в объекте row"); // выводим имя ключа в консоль
        }
    });
    
    Object.keys(initialValueSetters).forEach((key) => {
        const setValueInitial = initialValueSetters[key];
        if(key in row) { // проверить, существует ли ключ в объекте row
            setValueInitial(row[key]);
        } else { // если ключ не существует
            console.log("Ключа " + key + " не существует в объекте row"); // выводим имя ключа в консоль
        }
    });
  };

  useEffect(() => {
    const rowData = tableData.find(row => row.id === valueId);
    console.log('if (rowData) {', valueId, rowData);
    if (rowData) {
      setValues(rowData);
    }
  }, [tableData, valueId]);

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    setOpenAlert(false);  
    const id = Number(nodeIds); // преобразуем id в число
    //clickedId = id;
    console.log('setClickedRowId id = ' + id);
    setClickedRowId(id);
  
    if (editStarted /* && (!isEmpty) */) {

      setDialogType('save');
      //handleClickSave(id);
    } else {
      if (id) {
        lastId = id;
      }
  
/*       var res = tableData.filter(function(item) {
        return item.id === id;
      });
      const newNode = nodes.find(node => node.value === res[0].parent_id);
      setSelectedNode(newNode);
 */
      setValueID(id);
      // setBranch(newNode);
    }
  };

  //const treeDataCriterionGr = transformData(tableCriterionGr);
  const treeDataCriterionGr = React.useMemo(() => transformData(tableCriterionGr), [tableCriterionGr]);
  const treeDataOrgan = React.useMemo(() => transformData(tableOrgan), [tableOrgan]);
  //const treeDataChemCompGr = React.useMemo(() => transformData(tableChemCompGr), [tableChemCompGr]);
  //const [selectedValueCriterionGr, setSelectedValueCriterionGr] = useState(null); 
/* 
  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    handleItemClick(nodeIds);
  };  

  const handleItemClick = (id) => {
    setOpenAlert(false);  
    console.log( 'isEmpty = '+isEmpty);
    clickedId = id;
    if (editStarted&&(!isEmpty)) {
      handleClickSave(id);
    } else {
      if (id)
        lastId = id;
  
      var res = tableData.filter(function(item) {
        return item.id.toString() === id;
      });
      console.log('id', id);
      console.log('type of id:', typeof id);
      setValueID(id);
  
      const newNode = nodes.find(node => node.value === res[0].parent_id);
      setSelectedNode(newNode);
      // setBranch(newNode);
    }   
  };  */
 


  const handleClearClick = (params) => {
    if (editStarted/* &&(!isEmpty) */)
    {
      setDialogType('save');
    } 
    else 
    {
      setValueID(``);
      setValueTitle(``);
      setValueNameRus(``);
      setValueNameEng(``);
      setValueDescrRus(``);
      setValueDescrEng(``);
      setValueParentID(valueParentID);  
      setValueNormativ(``);
      setValueCalcfunctionID(``);
      setValueIrradiation(``);
      setValueAgegroup(``);
      setValueExpScenario(``);
      setValueIntegralPeriod(``);
      setValueOrgan(``);
      setValueDataSource(``);
      setValueAerosolAmad(``);
      setValueAerosolSol(``);
      setValueChemCompGr(``);
      setValueSubstForm(``);
      setValueIsotope(``);
      setValueActionLevel(``);
      setValuePeopleClass(``);
      setValueCrValue(``);
      setValueTimeend(``);
    }
  }; 

  useEffect(() => {
    fetch(`/${props.table_name}`)
      .then((data) => data.json())
      .then((data) => setTableData(data)); 
  }, [props.table_name])

  useEffect(() => {

    function updateCurrentRec (id)  {
      if (id)
        lastId = id;
      var res = tableData.filter(function(item) {
        return item.id.toString() === id;
      });

      setValueID(res[0].id); 
      setValueTitle(res[0].title);
      setValueNameRus(res[0].name_rus);
      setValueNameEng(res[0].name_eng);
      setValueDescrRus(res[0].descr_rus);
      setValueDescrEng(res[0].descr_eng);    
      setValueParentID(res[0].parent_id||-1);    
      setValueTitleInitial(res[0].title);
      setValueNameRusInitial(res[0].name_rus);
      setValueNameEngInitial(res[0].name_eng);
      setValueDescrRusInitial(res[0].descr_rus);
      setValueDescrEngInitial(res[0].descr_eng);
      setValueParentIDInitial(res[0].parent_id||-1); 
      setValueCalcfunctionID(res[0].calcfunction_id);
      setValueIrradiation(res[0].irradiation_id);
      setValueAgegroup(res[0].agegroup_id);
      setValueExpScenario(res[0].exp_scenario_id);
      setValueIntegralPeriod(res[0].integral_period_id);
      setValueOrgan(res[0].organ_id);
      setValueDataSource(res[0].data_source_id);
      setValueAerosolAmad(res[0].aerosol_amad_id);
      setValueAerosolSol(res[0].aerosol_sol_id);
      setValueChemCompGr(res[0].chem_comp_gr_id);
      setValueSubstForm(res[0].subst_form_id);
      setValueIsotope(res[0].isotope_id);
      setValueActionLevel(res[0].action_level_id);
      setValuePeopleClass(res[0].people_class_id);
      setValueCrValue(res[0].cr_value);
      setValueTimeend(res[0].timeend);

      setValueCalcfunctionIDInitial(res[0].calcfunction_id);
      setValueIrradiationInitial(res[0].irradiation_id);
      setValueAgegroupInitial(res[0].agegroup_id);
      setValueExpScenarioInitial(res[0].exp_scenario_id);
      setValueIntegralPeriodInitial(res[0].integral_period_id);
      setValueOrganInitial(res[0].organ_id);
      setValueDataSourceInitial(res[0].data_source_id);
      setValueAerosolAmadInitial(res[0].aerosol_amad_id);
      setValueAerosolSolInitial(res[0].aerosol_sol_id);
      setValueChemCompGrInitial(res[0].chem_comp_gr_id);
      setValueSubstFormInitial(res[0].subst_form_id);
      setValueIsotopeInitial(res[0].isotope_id);
      setValueActionLevelInitial(res[0].action_level_id);
      //setValuePeopleClassInitial(res[0].people_class_id);
      setValueCrValueInitial(res[0].cr_value);
      setValueTimeendInitial(res[0].timeend);
    }; 
    if ((!selected)&&(tableData.length))
    {
      setSelected(tableData[0].id.toString());
      updateCurrentRec(tableData[0].id.toString());
    }      
  }, [tableData, selected])

  const fetchData = async (url, setStateFunc) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStateFunc(data);
    } catch (error) {
      console.error(`Failed to fetch data from ${url}: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData('/calcfunction', settableCalcfunction);
    fetchData('/action_level', settableActionLevel);
    fetchData('/irradiation', settableIrradiation);
    fetchData('/people_class', settablePeopleClass);
    fetchData('/agegroup', settableAgegroup);
    fetchData('/exp_scenario', settableExpScenario);
    fetchData('/integral_period', settableIntegralPeriod);
    fetchData('/organ', settableOrgan);
    fetchData('/isotope', settableIsotope);
    fetchData('/subst_form', settableSubstForm);
    fetchData('/aerosol_sol', settableAerosolSol);
    fetchData('/chem_comp_gr_min', settableChemCompGr);
    fetchData('/aerosol_amad', settableAerosolAmad);
    fetchData('/data_source', settableDataSource);
    fetchData('/criterion_gr', settableCriterionGr);
  }, []);

  ///////////////////////////////////////////////////////////////////  Tree load functions and hook  /////////////////////
  useEffect(() => {
    // Преобразуем tableData из списка в структуру дерева и обновляем состояние treeData
    const arr = listToTree(tableData, treeFilterString);
    setTreeData(arr);
  }, [tableData, treeFilterString]);

  function getParentIds(tree, targetId) {
    const result = [];
    for (const item of tree) {
      if (item.id === targetId) {
        return [item.id]; // Если это целевой элемент, возвращаем его id в массиве
      } else if (item.children) {
        const childResult = getParentIds(item.children, targetId); // Если есть дети, ищем в детях
        if (childResult.length > 0) {
          // Если нашли в детях, добавляем текущий id в результат и возвращаем
          return [item.id, ...childResult];
        }
      }
    }
    return result; // Если не нашли, возвращаем пустой массив
  }

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {
    if (formRef.current.reportValidity() )
    {
    const js = JSON.stringify({
      id: valueId,
      title: valueTitle,
      name_rus: valueNameRus,
      name_eng: valueNameEng,
      descr_rus: valueDescrRus,
      descr_eng: valueDescrEng,
      criterion_gr_id: valueParentID, 
      calcfunction_id: valueCalcfunctionID,
      irradiation_id: valueIrradiation,
      agegroup_id: valueAgegroup,
      exp_scenario_id: valueExpScenario,
      integral_period_id: valueIntegralPeriod,
      organ_id: valueOrgan,
      data_source_id: valueDataSource,
      aerosol_amad_id: valueAerosolAmad,
      aerosol_sol_id: valueAerosolSol,
      chem_comp_gr_id: valueChemCompGr,
      subst_form_id: valueSubstForm,
      isotope_id: valueIsotope,
      action_level_id: valueActionLevel,
      people_class_id: valuePeopleClass,
      cr_value: valueCrValue,
      timeend: valueTimeend
    });

    if (!valueId) {
      addRec();
      return;
    }
    setIsLoading("true");
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
        setAlertSeverity('error');
        setAlertText(await response.text());
      }
      else
      {
        setAlertSeverity('success');
        setAlertText(await response.text());        
        //console.log('reloadData');
        //console.log(treeData);
        if (valueParentID) {
          const parentIds = getParentIds(treeData, valueParentID).map(String); // получите список всех родительских элементов
          const newExpanded = new Set([...expanded, ...parentIds]); // добавьте их к уже раскрытым элементам, убрав дубликаты
          setExpanded(Array.from(newExpanded)); // преобразуйте обратно в массив и установите как новое состояние
        }  
        if (valueParentID && !expanded.includes(valueParentID.toString())) {
          setExpanded(prevExpanded => [...prevExpanded, valueParentID.toString()]);
        }
        await reloadData();
      }
      setOpenAlert(true); 
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);
      setOpenAlert(true);
    } finally {
      setIsLoading('false');
      if (fromToolbar) 
      {
        setValueTitleInitial(valueTitle);       
        setValueNameRusInitial(valueNameRus); 
        setValueNameEngInitial(valueNameEng);
        setValueDescrRusInitial(valueDescrRus);
        setValueDescrEngInitial(valueDescrEng);    
        setValueParentIDInitial(valueParentID);
        setValueNormativInitial(valueNormativ);
        setValueTitleInitial(valueTitle);       
        setValueNameRusInitial(valueNameRus); 
        setValueNameEngInitial(valueNameEng);
        setValueDescrRusInitial(valueDescrRus);
        setValueDescrEngInitial(valueDescrEng);    
        setValueParentIDInitial(valueParentID);
        setValueNormativInitial(valueNormativ);     

        setValueCalcfunctionID(valueCalcfunctionID);
        setValueIrradiation(valueIrradiation);
        setValueAgegroup(valueAgegroup);
        setValueExpScenario(valueExpScenario);
        setValueIntegralPeriod(valueIntegralPeriod);
        setValueOrgan(valueOrgan);
        setValueDataSource(valueDataSource);
        setValueAerosolAmad(valueAerosolAmad);
        setValueAerosolSol(valueAerosolSol);
        setValueChemCompGr(valueChemCompGr);
        setValueSubstForm(valueSubstForm);
        setValueIsotope(valueIsotope);
        setValueActionLevel(valueActionLevel);
        setValuePeopleClass(valuePeopleClass);
        setValueCrValue(valueCrValue);
        setValueTimeend(valueTimeend);

        setValueCalcfunctionIDInitial(valueCalcfunctionID);
        setValueIrradiationInitial(valueIrradiation);
        setValueAgegroupInitial(valueAgegroup);
        setValueExpScenarioInitial(valueExpScenario);
        setValueIntegralPeriodInitial(valueIntegralPeriod);
        setValueOrganInitial(valueOrgan);
        setValueDataSourceInitial(valueDataSource);
        setValueAerosolAmadInitial(valueAerosolAmad);
        setValueAerosolSolInitial(valueAerosolSol);
        setValueChemCompGrInitial(valueChemCompGr);
        setValueSubstFormInitial(valueSubstForm);
        setValueIsotopeInitial(valueIsotope);
        setValueActionLevelInitial(valueActionLevel);
        setValuePeopleClassInitial(valuePeopleClass);
        setValueCrValueInitial(valueCrValue);
        setValueTimeendInitial(valueTimeend);
     }
   }
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
      criterion_gr_id: valueParentID,   
      calcfunction_id: valueCalcfunctionID,
      irradiation_id: valueIrradiation,
      agegroup_id: valueAgegroup,
      exp_scenario_id: valueExpScenario,
      integral_period_id: valueIntegralPeriod,
      organ_id: valueOrgan,
      data_source_id: valueDataSource,
      aerosol_amad_id: valueAerosolAmad,
      aerosol_sol_id: valueAerosolSol,
      chem_comp_gr_id: valueChemCompGr,
      subst_form_id: valueSubstForm,
      isotope_id: valueIsotope,
      action_level_id: valueActionLevel,
      people_class_id: valuePeopleClass,
      cr_value: valueCrValue,
      timeend: valueTimeend 
    });
    setIsLoading("true");
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
        setAlertSeverity('error');
        setAlertText(await response.text());        
      }
      else
      {
        const { id } = await response.json();
        setAlertSeverity('success');
        setAlertText(`Добавлена запись с кодом ${id}`);        
        lastId = id;         
        console.log('setSelected lastId' + lastId);
        setValueID(lastId);
        console.log('setSelected toString' + lastId.toString());
        setSelected(lastId.toString());

        if (valueParentID) {
          const parentIds = getParentIds(treeData, valueParentID).map(String); // получите список всех родительских элементов
          const newExpanded = new Set([...expanded, ...parentIds]); // добавьте их к уже раскрытым элементам, убрав дубликаты
          setExpanded(Array.from(newExpanded)); // преобразуйте обратно в массив и установите как новое состояние
        }  
        if (valueParentID && !expanded.includes(valueParentID.toString())) {
          setExpanded(prevExpanded => [...prevExpanded, valueParentID.toString()]);
        }

        setValueTitle(valueTitle);       
        setValueNameRus(valueNameRus); 
        setValueNameEng(valueNameEng);
        setValueDescrRus(valueDescrRus);
        setValueDescrEng(valueDescrEng);    
        setValueParentID(valueParentID);
        setValueNormativ(valueNormativ);         
        setValueTitleInitial(valueTitle);       
        setValueNameRusInitial(valueNameRus); 
        setValueNameEngInitial(valueNameEng);
        setValueDescrRusInitial(valueDescrRus);
        setValueDescrEngInitial(valueDescrEng);    
        setValueParentIDInitial(valueParentID);
        setValueNormativInitial(valueNormativ);     
        setValueCalcfunctionID(valueCalcfunctionID);
        setValueIrradiation(valueIrradiation);
        setValueAgegroup(valueAgegroup);
        setValueExpScenario(valueExpScenario);
        setValueIntegralPeriod(valueIntegralPeriod);
        setValueOrgan(valueOrgan);
        setValueDataSource(valueDataSource);
        setValueAerosolAmad(valueAerosolAmad);
        setValueAerosolSol(valueAerosolSol);
        setValueChemCompGr(valueChemCompGr);
        setValueSubstForm(valueSubstForm);
        setValueIsotope(valueIsotope);
        setValueActionLevel(valueActionLevel);
        setValuePeopleClass(valuePeopleClass);
        setValueCrValue(valueCrValue);
        setValueTimeend(valueTimeend);
        setOpenAlert(true);  

        setValueCalcfunctionIDInitial(valueCalcfunctionID);
        setValueIrradiationInitial(valueIrradiation);
        setValueAgegroupInitial(valueAgegroup);
        setValueExpScenarioInitial(valueExpScenario);
        setValueIntegralPeriodInitial(valueIntegralPeriod);
        setValueOrganInitial(valueOrgan);
        setValueDataSourceInitial(valueDataSource);
        setValueAerosolAmadInitial(valueAerosolAmad);
        setValueAerosolSolInitial(valueAerosolSol);
        setValueChemCompGrInitial(valueChemCompGr);
        setValueSubstFormInitial(valueSubstForm);
        setValueIsotopeInitial(valueIsotope);
        setValueActionLevelInitial(valueActionLevel);
        setValuePeopleClassInitial(valuePeopleClass);
        setValueCrValueInitial(valueCrValue);
        setValueTimeendInitial(valueTimeend);
      }
      setOpenAlert(true);
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);
      setOpenAlert(true);
    } finally {
      setIsLoading("false");
      reloadData();
    }
  };

/////////////////////////////////////////////////////////////////// DELETE /////////////////////
  const delRec =  async () => {
    const js = JSON.stringify({
        id: valueId,
        title: valueTitle,
    });
    setIsLoading("true");
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
        setAlertSeverity('error');
        setAlertText(await response.text());
      }
      else
      {
        setAlertSeverity('success');
        setAlertText(await response.text());        
        reloadData();
        setValueID(tableData[0].id);
        setValueTitle(tableData[0].title);
        setValueNameRus(tableData[0].name_rus);
        setValueNameEng(tableData[0].name_eng);
        setValueDescrRus(tableData[0].descr_rus);
        setValueDescrEng(tableData[0].descr_eng);
        setValueTitleInitial(tableData[0].title);
        setValueNameRusInitial(tableData[0].name_rus);
        setValueNameEngInitial(tableData[0].name_eng);
        setValueDescrRusInitial(tableData[0].descr_rus);
        setValueDescrEngInitial(tableData[0].descr_eng);
        setValueParentID(tableData[0].parent_id||-1);
        setValueParentIDInitial(tableData[0].parent_id||-1);
        setValueCalcfunctionID(tableData[0].calcfunction_id);
        setValueIrradiation(tableData[0].irradiation_id);
        setValueAgegroup(tableData[0].agegroup_id);
        setValueExpScenario(tableData[0].exp_scenario_id);
        setValueIntegralPeriod(tableData[0].integral_period_id);
        setValueOrgan(tableData[0].organ_id);
        setValueDataSource(tableData[0].data_source_id);
        setValueAerosolAmad(tableData[0].aerosol_amad_id);
        setValueAerosolSol(tableData[0].aerosol_sol_id);
        setValueChemCompGr(tableData[0].chem_comp_gr_id);
        setValueSubstForm(tableData[0].subst_form_id);
        setValueIsotope(tableData[0].isotope_id);
        setValueActionLevel(tableData[0].action_level_id);
        setValuePeopleClass(tableData[0].people_class_id);
        setValueCrValue(tableData[0].cr_value);
        setValueTimeend(tableData[0].timeend);

        setValueCalcfunctionIDInitial(tableData[0].calcfunction_id);
        setValueIrradiationInitial(tableData[0].irradiation_id);
        setValueAgegroupInitial(tableData[0].agegroup_id);
        setValueExpScenarioInitial(tableData[0].exp_scenario_id);
        setValueIntegralPeriodInitial(tableData[0].integral_period_id);
        setValueOrganInitial(tableData[0].organ_id);
        setValueDataSourceInitial(tableData[0].data_source_id);
        setValueAerosolAmadInitial(tableData[0].aerosol_amad_id);
        setValueAerosolSolInitial(tableData[0].aerosol_sol_id);
        setValueChemCompGrInitial(tableData[0].chem_comp_gr_id);
        setValueSubstFormInitial(tableData[0].subst_form_id);
        setValueIsotopeInitial(tableData[0].isotope_id);
        setValueActionLevelInitial(tableData[0].action_level_id);
        setValuePeopleClassInitial(tableData[0].people_class_id);
        setValueCrValueInitial(tableData[0].cr_value);
        setValueTimeendInitial(tableData[0].timeend);
      }
      setOpenAlert(true);  
    } catch (err) {
      setAlertSeverity('error');
      setAlertText(err.message);
      setOpenAlert(true);
    } finally {
      setIsLoading("false");
    }
  };  

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////
  const handleClickReload = async () => {
    setAlertSeverity('info');
    setAlertText('Данные успешно обновлены');
    try 
    {
      clickAfterReload = true;
      await reloadData().then( console.log('after reload, title = '+tableData[0].title) ) ;
    } catch(e)
    {
      setAlertSeverity('error');
      setAlertText('Ошибка при обновлении данных: '+e.message);
      setOpenAlert(true);
      return;
    }    
    setOpenAlert(true);        
  }

  const reloadData = async () => {
    
    try {
      const response = await fetch(`/${props.table_name}/`);
      if (!response.ok) {
        setAlertSeverity('error');
        setAlertText(`Ошибка при обновлении данных: ${response.status}`);
        const error = response.status + ' (' +response.statusText+')';  
        throw new Error(`${error}`);
      }
      else
      {  
        const result = await response.json();
        setTableData(result);
        console.log('after reload');
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading("false");
    }
  };

  /////////////////////////////////////////
  /* const [openDel, setOpenDel] = React.useState(false); 
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

  function updateCurrentRecHandles (id)  {
    if (id)
      lastId = id;
    var res = tableData.filter(function(item) {
      return item.id.toString() === id;
    });
    setValueID(res[0].id); 
    setValueTitle(res[0].title);
    setValueNameRus(res[0].name_rus);
    setValueNameEng(res[0].name_eng);
    setValueDescrRus(res[0].descr_rus);
    setValueDescrEng(res[0].descr_eng);    
    setValueParentID(res[0].parent_id||-1);    
 
    setValueTitleInitial(res[0].title);
    setValueNameRusInitial(res[0].name_rus);
    setValueNameEngInitial(res[0].name_eng);
    setValueDescrRusInitial(res[0].descr_rus);
    setValueDescrEngInitial(res[0].descr_eng);
    setValueParentIDInitial(res[0].parent_id||-1); 
    setValueNormativInitial(res[0].normativ_id);     
    setValueCalcfunctionID(res[0].calcfunction_id);
    setValueIrradiation(res[0].irradiation_id);
    setValueAgegroup(res[0].agegroup_id);
    setValueExpScenario(res[0].exp_scenario_id);
    setValueIntegralPeriod(res[0].integral_period_id);
    setValueOrgan(res[0].organ_id);
    setValueDataSource(res[0].data_source_id);
    setValueAerosolAmad(res[0].aerosol_amad_id);
    setValueAerosolSol(res[0].aerosol_sol_id);
    setValueChemCompGr(res[0].chem_comp_gr_id);
    setValueSubstForm(res[0].subst_form_id);
    setValueIsotope(res[0].isotope_id);
    setValueActionLevel(res[0].action_level_id);
    setValuePeopleClass(res[0].people_class_id);
    setValueCrValue(res[0].cr_value);
    setValueTimeend(res[0].timeend);

    
    setValueCalcfunctionIDInitial(res[0].calcfunction_id);
    setValueIrradiationInitial(res[0].irradiation_id);
    setValueAgegroupInitial(res[0].agegroup_id);
    setValueExpScenarioInitial(res[0].exp_scenario_id);
    setValueIntegralPeriodInitial(res[0].integral_period_id);
    setValueOrganInitial(res[0].organ_id);
    setValueDataSourceInitial(res[0].data_source_id);
    setValueAerosolAmadInitial(res[0].aerosol_amad_id);
    setValueAerosolSolInitial(res[0].aerosol_sol_id);
    setValueChemCompGrInitial(res[0].chem_comp_gr_id);
    setValueSubstFormInitial(res[0].subst_form_id);
    setValueIsotopeInitial(res[0].isotope_id);
    setValueActionLevelInitial(res[0].action_level_id);
    setValuePeopleClassInitial(res[0].people_class_id);
    setValueCrValueInitial(res[0].cr_value);
    setValueTimeendInitial(res[0].timeend);
  };
   */
  ///////////////////////////////////////// DIALOG
  const [dialogType, setDialogType] = useState('');
  const [clickedRowId, setClickedRowId] = useState(null);

  const setValuesById = (id) => {
    //console.log( 'id = '+id);
    //if (id)
    //  lastId = id;
    var res = tableData.filter(function(item) {
      return item.id === id;
    });
    console.log('console ', id, res[0]);
    setValues(res[0]);
  };   

  const getDialogContentText = () => {
    const allRequiredFieldsFilled = formRef.current?.checkValidity();
    switch (dialogType) {
      case 'delete':
        return (
          <>
            В таблице "{table_names[props.table_name]}" предложена к удалению следующая запись: 
            <br />
            {valueTitle}; Код в БД = {valueId}. 
            <br />
            Вы желаете удалить указанную запись?
          </>);
      case 'save':
        if (!valueId) { // если это новая запись
          if (allRequiredFieldsFilled) {
            return `Создана новая запись, сохранить?`;
          } else {
            return (
              <>
                Не заданы обязательные поля, запись не будет создана.
                <br />
                Перейти без сохранения изменений?
              </>
            );
          }
        } else { // если это редактируемая запись
          if (allRequiredFieldsFilled) {
            return `В запись внесены изменения, сохранить изменения?`;
          } else {
            return (
              <>
                Не заданы обязательные поля, изменения не будут сохранены
                <br />
                Перейти без сохранения изменений?
              </>
            );            
          }
        }
      default:
        return '';
    }
  };

  const handleCloseNo = () => {
    switch (dialogType) {
      case 'save':
        //console.log('no save ', clickedRowId, clickedId);
        setEditStarted(false);
        setValueID(clickedRowId);
        //setValuesById(clickedRowId);
        setSelected(clickedRowId.toString());
        // setRowSelectionModel([clickedRowId]);
        break;
      default:
    }
    setDialogType('');
  };

  const handleCloseCancel = () => {
    switch (dialogType) {
      case 'save':
        //console.log('no save 1 clickedRowId valueId', clickedRowId, valueId);
        //setClickedRowId( valueId );
        //console.log('no save 2 clickedRowId valueId', clickedRowId, valueId);
        setSelected(valueId.toString());
        //setValueID(valueId);        
        break;
      default:
        break;
    }
    setDialogType('');
  };
  
  const handleCloseYes = () => {
    switch (dialogType) {
      case 'delete':
        delRec();
        break;
      case 'save':
        saveRec(false);
        break;
      default:
        break;
    }
    
    setDialogType('');

    if (clickedRowId>0) {
      setEditStarted(false);
      console.log('yes', clickedRowId);
      setSelected(clickedRowId.toString());
      //setRowSelectionModel([clickedRowId]);
      const rowData = tableData.find(row => row.id === clickedRowId);
      setValues(rowData);
      setValueID(clickedRowId);
      setEditStarted(false);
    }
  };

  function DialogButtons() {
    const allRequiredFieldsFilled = formRef.current?.checkValidity();
  
    if (dialogType === 'save' && !allRequiredFieldsFilled) {
      return (
        <>
          <Button variant="outlined" onClick={handleCloseNo} >Да</Button>
          <Button variant="outlined" onClick={handleCloseCancel} >Отмена</Button>
        </>
      );
    } else {
      return (
        <>
          <Button variant="outlined" onClick={handleCloseYes} >Да</Button>
          <Button variant="outlined" onClick={handleCloseNo} >Нет</Button>
          {dialogType !== 'delete' && <Button variant="outlined" onClick={handleCloseCancel} >Отмена</Button>}
        </>
      );
    }
  }
  
/* 
  const handleCloseSaveNo = () => {
    setOpenSave(false);
    updateCurrentRecHandles(clickedId);
  };

  const handleCloseSaveYes = () => {
    setOpenSave(false);
    saveRec(false);
    updateCurrentRecHandles(clickedId);
  };

  const handleClickSaveWhenNew = () => {
    setOpenSaveWhenNew(true);
  };

  const handleCloseSaveWhenNewNo = () => {
    setOpenSaveWhenNew(false);
  };

  const handleCloseSaveWhenNewYes = () => {
    setOpenSaveWhenNew(false);
    saveRec(true);
  }; */

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
    setEditStarted(false);
    setValuesById(valueId);
    //setValueID(valueId);
/* 
    const selectedIDs = selected;
    const selectedRowData = tableData.filter((row) => selectedIDs===row.id.toString());
    if (selectedRowData.length)
    {
      setValueID(selectedRowData[0].id);
      setValueTitle(selectedRowData[0].title);
      setValueNameRus(selectedRowData[0].name_rus);
      setValueNameEng(selectedRowData[0].name_eng );
      setValueDescrRus(selectedRowData[0].descr_rus);
      setValueDescrEng(selectedRowData[0].descr_eng );
      setValueTitleInitial(selectedRowData[0].title);
      setValueNameRusInitial(selectedRowData[0].name_rus);
      setValueNameEngInitial(selectedRowData[0].name_eng );
      setValueDescrRusInitial(selectedRowData[0].descr_rus);
      setValueDescrEngInitial(selectedRowData[0].descr_eng);
      setValueParentID(selectedRowData[0].parent_id||-1);
      setValueParentIDInitial(selectedRowData[0].parent_id||-1);
      setValueCalcfunctionID(selectedRowData[0].calcfunction_id);
      setValueIrradiation(selectedRowData[0].irradiation_id);
      setValueAgegroup(selectedRowData[0].agegroup_id);
      setValueExpScenario(selectedRowData[0].exp_scenario_id);
      setValueIntegralPeriod(selectedRowData[0].integral_period_id);
      setValueOrgan(selectedRowData[0].organ_id);
      setValueDataSource(selectedRowData[0].data_source_id);
      setValueAerosolAmad(selectedRowData[0].aerosol_amad_id);
      setValueAerosolSol(selectedRowData[0].aerosol_sol_id);
      setValueChemCompGr(selectedRowData[0].chem_comp_gr_id);
      setValueSubstForm(selectedRowData[0].subst_form_id);
      setValueIsotope(selectedRowData[0].isotope_id);
      setValueActionLevel(selectedRowData[0].action_level_id);
      setValuePeopleClass(selectedRowData[0].people_class_id);
      setValueCrValue(selectedRowData[0].cr_value);
      setValueTimeend(selectedRowData[0].timeend);

      setValueCalcfunctionIDInitial(selectedRowData[0].calcfunction_id);
      setValueIrradiationInitial(selectedRowData[0].irradiation_id);
      setValueAgegroupInitial(selectedRowData[0].agegroup_id);
      setValueExpScenarioInitial(selectedRowData[0].exp_scenario_id);
      setValueIntegralPeriodInitial(selectedRowData[0].integral_period_id);
      setValueOrganInitial(selectedRowData[0].organ_id);
      setValueDataSourceInitial(selectedRowData[0].data_source_id);
      setValueAerosolAmadInitial(selectedRowData[0].aerosol_amad_id);
      setValueAerosolSolInitial(selectedRowData[0].aerosol_sol_id);
      setValueChemCompGrInitial(selectedRowData[0].chem_comp_gr_id);
      setValueSubstFormInitial(selectedRowData[0].subst_form_id);
      setValueIsotopeInitial(selectedRowData[0].isotope_id);
      setValueActionLevelInitial(selectedRowData[0].action_level_id);
      setValuePeopleClassInitial(selectedRowData[0].people_class_id);
      setValueCrValueInitial(selectedRowData[0].cr_value);
      setValueTimeendInitial(selectedRowData[0].timeend);

      //const newNode = nodes.find(node => node.value === selectedRowData[0].parent_id);
      // Обновляем selectedNode
      //setSelectedNode(newNode);
      //setBranch(newNode);      
    } */
  }

  function getHeaders(atable)
  {
    if (atable==='criterion') 
      return ['Обозначение','Название(рус.яз)','Название(англ.яз)','Группа критериев','Комментарий(рус.яз)','Комментарий(англ.яз)','Функция',
      'Значение','Время облучения, сек',
      'Уровень вмешательства',
      'Тип облучения','Тип облучаемых лиц','Возрастная группа населения','Сценарий поступления','Период интегрирования','Орган / Ткань','Нуклид',
      'Форма вещества','Химические соединения (группа)','Тип растворимости','AMAD','Источник данных', ];
  }
  function getTableDataForExcel(t) {
    function replacer(i, val) {
        if (val === null) {
            return ""; // change null to empty string
        } else {
            return val; // return unchanged
        }
    }
    var arr_excel = t.map(({
        title, name_rus, name_eng, descr_rus, descr_eng, parent_name, normativ_title, calcfunction_title, cr_value, timeend,
        action_level_title,
        irradiation_title, people_class_title, agegroup_title, exp_scenario_title, integral_period_title, organ_title, isotope_title, 
        subst_form_title, chem_comp_gr_title, aerosol_sol_title, aerosol_amad_title, data_source_title,
    }) => ({
        title, name_rus, name_eng, parent_name, descr_rus, descr_eng, normativ_title, calcfunction_title, cr_value, timeend,
        action_level_title,
        irradiation_title, people_class_title, agegroup_title, exp_scenario_title, integral_period_title, organ_title, isotope_title, 
        subst_form_title, chem_comp_gr_title, aerosol_sol_title, aerosol_amad_title, data_source_title
    }));
    arr_excel = JSON.parse(JSON.stringify(arr_excel, replacer));

    return (arr_excel);
  }

  const optionsCSV = {
    filename: table_names[props.table_name],
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: getHeaders(props.table_name)
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };


  const exportDataCSV = async () => {
    const csvExporter = new ExportToCsv(optionsCSV);

    // Start by filtering the tableData
    let filteredData = tableData.filter(item =>
        item.title.toLowerCase().includes(treeFilterString.toLowerCase()) && item.crit === 1
    );

    // Log the filtered tableData for debugging
    console.log('Filtered tableData:', filteredData);
    console.log('tableAgegroup', tableAgegroup);
    console.log('tableAgegroup[item.agegroup_id]', tableAgegroup.find(group => group.id === 61));

    // Then, map each _id field to its corresponding _title in the filteredData
    filteredData = filteredData.map(item => {
        // Map each _id field to its corresponding _title
        const findInArrayById = (array, id) => {
            const foundItem = array.find(element => element.id === id);
            return foundItem ? foundItem.title : null;
        }

        item.irradiation_title = findInArrayById(tableIrradiation, item.irradiation_id);
        item.calcfunction_title = findInArrayById(tableCalcfunction, item.calcfunction_id);
        item.agegroup_title = findInArrayById(tableAgegroup, item.agegroup_id);
        item.exp_scenario_title = findInArrayById(tableExpScenario, item.exp_scenario_id);
        item.integral_period_title = findInArrayById(tableIntegralPeriod, item.integral_period_id);
        item.organ_title = findInArrayById(tableOrgan, item.organ_id);
        item.data_source_title = findInArrayById(tableDataSource, item.data_source_id);
        item.aerosol_amad_title = findInArrayById(tableAerosolAmad, item.aerosol_amad_id);
        item.aerosol_sol_title = findInArrayById(tableAerosolSol, item.aerosol_sol_id);
        item.chem_comp_gr_title = findInArrayById(tableChemCompGr, item.chem_comp_gr_id);
        item.subst_form_title = findInArrayById(tableSubstForm, item.subst_form_id);
        item.isotope_title = findInArrayById(tableIsotope, item.isotope_id);
        item.action_level_title = findInArrayById(tableActionLevel, item.action_level_id);
        item.people_class_title = findInArrayById(tablePeopleClass, item.people_class_id);

        return item;
    });
    csvExporter.generateCsv(getTableDataForExcel(filteredData));
  }
      
  const setTreeFilter = (e) => { 
    const value = e;
    const filter = value.trim();
    setTreeFilterString(filter);
  }  

  const [filter, setFilter] = useState(""); //значение фильтра
  const [filterApplied, setFilterApplied] = useState(false); //состояние применен фильтр или нет

  const clearFilter = useCallback(() => {
    setFilter("");
    setFilterApplied(false);
    setTreeFilter("");
  }, []);

  const applyFilter = useCallback(() => {
    if (filter.trim() === "") return;
    setFilterApplied(true);
    setTreeFilter(filter);
  }, [filter]);

  const expandTree = useCallback(() => { //развернуть дерево
    const hasChild = [];
    tableData.forEach((item) => {
      if (item.parent_id && !hasChild.includes(item.parent_id.toString())) {
        hasChild.push(item.parent_id.toString());
      }
    });
    const expandedNew = expanded.length ? [] : hasChild;
    setExpanded(expandedNew);
  }, [expanded, tableData]);


  const formRef = React.useRef();
  return (
    <>
    
    <Box sx={{ width: 1445, height: 650, padding: 1 }}>
      <Grid container spacing={1}>
        <Grid item sx={{width: 570, border: '0px solid green', ml: 1 }}>
        <div style={{ height: 500, width: 570 }}>
          <Box sx={{ border: 1, borderRadius: '4px', borderColor: 'rgba(0, 0, 0, 0.23)', height: 500, p: '4px' }} >
            <IconButton onClick={()=>handleClearClick()} disabled={valueCrit===0||editStarted} color="primary" size="small" title="Создать запись">
              <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>saveRec(true)} disabled={valueCrit===0} color="primary" size="small" title="Сохранить запись в БД">
              <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
            <IconButton onClick={()=>setDialogType('delete')} disabled={valueCrit===0} color="primary" size="small" title="Удалить запись">
              <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" title="Отменить редактирование">
              <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>handleClickReload()} color="primary" size="small" title="Обновить данные">
              <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>exportDataCSV()} color="primary" size="small" title="Сохранить в формате CSV">
              <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
            <IconButton onClick={()=>expandTree()} color="primary" size="small" title={expanded.length !== 0?"Свернуть все":"Развернуть все"} >
              <SvgIcon fontSize="small" component={expanded.length !== 0?CollapseIcon:ExpandIcon} inheritViewBox /></IconButton>
            <br/>
            <TextField
              label="Фильтр ..."
              size="small"
              variant="standard"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilter();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={applyFilter}
                      edge="end"
                      size="small"
                      color="primary"
                      disabled={!filter}
                      title="Применить фильтр"
                    >
                      <SvgIcon fontSize="small" component={SearchIcon} inheritViewBox />
                    </IconButton>
                    <IconButton
                      onClick={clearFilter}
                      edge="end"
                      size="small"
                      color="primary"
                      disabled={!filter && !filterApplied}
                      title={filterApplied ? "Сбросить фильтр" : "Очистить поле ввода"}
                    >
                      <SvgIcon fontSize="small" component={TimesCircleIcon} inheritViewBox />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

    {/*         <TextField label="Фильтр ..." size = "small" variant="standard" value={filter}
                    onChange={(e) => setFilter(e.target.value)} 
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={applyFilter} edge="end" size="small" color="primary" disabled={!filter} title="Применить фильтр">
                            <SvgIcon fontSize="small" component={SearchIcon} inheritViewBox />
                          </IconButton>
                          <IconButton onClick={clearFilter} edge="end" size="small" color="primary" disabled={!filter && !filterApplied} title={filterApplied ? "Сбросить фильтр" : "Очистить поле ввода"}>
                            <SvgIcon fontSize="small" component={TimesCircleIcon} inheritViewBox />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
            /> */}
            <Box sx={{ height: 415, overflowY: 'false' }}>
              {(isLoading==="true") && 
              <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                <CircularProgress color="inherit" />
              </Backdrop> } 
              <Box ref={scrollContainerRef} sx={{ height: 415, flexGrow: 1, overflowY: 'auto' }} >     
                <DataTreeView treeItems={treeData} />
              </Box> 
            </Box>
          </Box>
          </div>
          <Box sx={{ width: 583 }}>
          <Collapse in={openAlert}>
            <Alert
              item sx={{width: 571}}
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
        {/* <Grid item > */}
        <Grid sx={{ width: 801, padding: 1, ml: 1.5 }}>
        {/* <Grid item xs={7}   sx={{ ml: 1.5 }}> */}
        {( valueCrit === 1) &&
          <>
          <form ref={formRef}> 

          <Grid container spacing={1.5}>
            <Grid item xs={2}>
              <TextField  
                id="ch_id" 
                disabled={true} 
                label="Код" 
                variant="outlined" 
                value={ valueId ||''} 
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField  
                id="ch_name" 
                label="Обозначение" 
                required 
                size="small" 
                variant="outlined" 
                value={valueTitle || ''} 
                onChange={e => setValueTitle(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <HierarchicalAutocomplete
                data={treeDataCriterionGr}
                value={treeDataCriterionGr.find(item => item.id === valueParentID) || null}
                onChange={(event, newValue) => setValueParentID(newValue ? newValue.id : null)}
                size="small"
                fullWidth
                label="Группа критериев"
                placeholder="Группа критериев"
              />
            </Grid>

    {/*       <TextField  id="ch_id" disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={ valueId ||''} size="small" />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
          &nbsp;&nbsp;&nbsp;&nbsp;

          <HierarchicalAutocomplete
            data={treeDataCriterionGr}
            value={treeDataCriterionGr.find(item => item.id === valueParentID) || null}
            onChange={(event, newValue) => setValueParentID(newValue ? newValue.id : null)}
            size="small"
          /> */}
    {/* 
          <FormControl sx={{ width: '44ch' }} size="small">
            <TreeSelect
              size="small"
              enterText=""
              exitText=""
              currentPath= "" 
              valuePath= ""
              getChildren={(node) => node ? node.getChildren() : nodes.filter(node => node.parent === null)}
              getParent={(node) => node.getParent()}
              isBranch={(node) => node.isBranch()}
              //isOptionEqualToValue={(option, value) => option.isEqual(value)}
              //renderInput={(params) => <TextField {...params} />}
              renderInput={(params) => 
                <Tooltip enterDelay={1000} title={selectedNode?.name_rus || ""}>
                  <TextField label="Группа критериев" {...params} />
                </Tooltip>
              }
              getOptionLabel={option => option ? option.title : ""}
              onChange={(event, newValue) => {
                setSelectedNode(newValue);
                //setBranch(newValue);
                if (newValue) {
                  setValueParentID(newValue.value);
                } else {
                  setValueParentID(null);
                }
              }}
              renderOption={(props, option, state) => (
                <Tooltip enterDelay={1000} title={option.name_rus}> 
                  <li {...props} style={{ margin: 0, padding: 0 }}>
                    <DefaultOption {...getDefaultOptionProps(props, option, state)} />
                  </li>
                </Tooltip>  
              )}
              disableClearable={true}
              value={selectedNode}
              branch={branch}
              onBranchChange={(_, branch) => void setBranch(branch)} 
            />

          </FormControl>  */}
          {/* <FormControl sx={{ width: '30ch' }} size="small">
            <InputLabel id="ch_parent_id"required>Группа критериев</InputLabel>
              <Select labelId="ch_parent_id" id="ch_parent_id1" label="Группа критериев" value={valueParentID  || "" } onChange={e => setValueParentID(e.target.value) }  >
              <MenuItem key={-1} value={-1}>
                {'Не задан'}
                </MenuItem>
                {tableCriterionGr?.map(option => {
                return (
                <MenuItem key={option.id} value={option.id}>
                  {option.title ?? option.id}
                </MenuItem>
                );
              })}
            </Select>
          </FormControl>  
    */}


            <Grid item xs={6}>
              <TextField  
                id="ch_name_rus" 
                size="small" 
                label="Название (рус.яз)" 
                required 
                variant="outlined"  
                value={valueNameRus || ''} 
                onChange={e => setValueNameRus(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField  
                id="ch_name_eng" 
                size="small" 
                label="Название (англ.яз)"  
                variant="outlined" 
                value={valueNameEng || ''} 
                onChange={e => setValueNameEng(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField  
                id="ch_descr_rus" 
                label="Комментарий (рус.яз)"  
                size="small" 
                multiline 
                maxRows={4} 
                variant="outlined" 
                value={valueDescrRus || ''} 
                onChange={e => setValueDescrRus(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField  
                id="ch_descr_eng" 
                label="Комментарий (англ.яз)"  
                size="small" 
                multiline 
                maxRows={4} 
                variant="outlined" 
                value={valueDescrEng || ''} 
                onChange={e => setValueDescrEng(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                disableClearable
                id="combo-box-child-isotope"
                value={tableCalcfunction.find((option) => option.id === valueCalcfunctionID) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueCalcfunctionID(newValueAC ? newValueAC.id : -1) }}
                options={tableCalcfunction}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Функция" required />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />          
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth id="ch_name" label="Значение" required size="small" variant="outlined" 
                value={valueCrValue || ''} onChange={e => setValueCrValue(e.target.value)}/>
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth id="timeend" label="Время облучения, сек" required size="small" variant="outlined" 
                value={valueTimeend || ''} onChange={e => setValueTimeend(e.target.value)}/>
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-action-level"
                value={tableActionLevel.find((option) => option.id === valueActionLevel) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueActionLevel(newValueAC ? newValueAC.id : null) }}
                options={tableActionLevel}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Уровень вмешательства"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
                clearable="true"
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-irradiation"
                value={tableIrradiation.find((option) => option.id === valueIrradiation) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueIrradiation(newValueAC ? newValueAC.id : null) }}
                options={tableIrradiation}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Тип облучения"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
                clearable="true"
              />            
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-people-class"
                value={tablePeopleClass.find((option) => option.id === valuePeopleClass) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValuePeopleClass(newValueAC ? newValueAC.id : null) }}
                options={tablePeopleClass}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Тип облучаемых лиц"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-agegroup"
                value={tableAgegroup.find((option) => option.id === valueAgegroup) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueAgegroup(newValueAC ? newValueAC.id : null) }}
                options={tableAgegroup}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Возрастная группа населения"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
                clearable="true"
              />  
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-exp-scenario"
                value={tableExpScenario.find((option) => option.id === valueExpScenario) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueExpScenario(newValueAC ? newValueAC.id : null) }}
                options={tableExpScenario}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Сценарий поступления"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-integral-period"
                value={tableIntegralPeriod.find((option) => option.id === valueIntegralPeriod) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueIntegralPeriod(newValueAC ? newValueAC.id : null) }}
                options={tableIntegralPeriod}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Период интегрирования"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
            <Grid item xs={6}>
              <HierarchicalAutocomplete
                data={treeDataOrgan}
                value={treeDataOrgan.find(item => item.id === valueOrgan) || null}
                onChange={(event, newValue) => setValueOrgan(newValue ? newValue.id : null)}
                size="small"
                fullWidth
                label="Орган / ткань" 
                placeholder="Орган / ткань" 
              />              
{/*               <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-organ"
                value={tableOrgan.find((option) => option.id === valueOrgan) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueOrgan(newValueAC ? newValueAC.id : null) }}
                options={tableOrgan}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Орган / ткань"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />   */}
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-isotope"
                value={tableIsotope.find((option) => option.id === valueIsotope) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueIsotope(newValueAC ? newValueAC.id : null) }}
                options={tableIsotope}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Нуклид"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-subst-form"
                value={tableSubstForm.find((option) => option.id === valueSubstForm) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueSubstForm(newValueAC ? newValueAC.id : null) }}
                options={tableSubstForm}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Форма вещества"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
            <Grid item xs={6}>

{/*               <HierarchicalAutocomplete
                data={treeDataChemCompGr}
                value={treeDataChemCompGr.find(item => item.id === valueChemCompGr) || null}
                onChange={(event, newValue) => setValueChemCompGr(newValue ? newValue.id : null)}
                size="small"
                fullWidth
                label="Химические соединения (группа)" 
                placeholder="Химические соединения (группа)" 
              />    */}             
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-chem-comp-gr"
                value={tableChemCompGr.find((option) => option.id === valueChemCompGr) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueChemCompGr(newValueAC ? newValueAC.id : null) }}
                options={tableChemCompGr}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Химические соединения (группа)"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-aerosol-sol"
                value={tableAerosolSol.find((option) => option.id === valueAerosolSol) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueAerosolSol(newValueAC ? newValueAC.id : null) }}
                options={tableAerosolSol}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Тип растворимости"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-aerosol-amad"
                value={tableAerosolAmad.find((option) => option.id === valueAerosolAmad) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueAerosolAmad(newValueAC ? newValueAC.id : null) }}
                options={tableAerosolAmad}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="AMAD"  />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.name_rus}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                required
                //disableClearable
                id="combo-box-data-source"
                value={tableDataSource.find((option) => option.id === valueDataSource) || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValueAC) => { setValueDataSource(newValueAC ? newValueAC.id : null) }}
                options={tableDataSource}
                getOptionLabel={option => option ? option.title : ""}
                renderInput={(params) => <TextField {...params} label="Источник данных" required/>}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Tooltip title={option.shortname}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span>{option.title}</span>
                        <span></span>
                      </div>
                    </Tooltip>
                  </li>
                )}
              />  
            </Grid>
    {/*         <Grid item xs={6}>
            </Grid>
    */}
          </Grid>



          </form>
        
          <div style={{ height: 300, width: 800 }}>
            <td>Действия критерия<br/>
              <DataTableActionCriterion table_name={props.table_name} rec_id={valueId} />
            </td>
          </div>
          </>}
        </Grid>
      </Grid>
    </Box>

    <Dialog open={dialogType !== ''} onClose={handleCloseCancel} fullWidth={true}>
      <DialogTitle>Внимание</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {getDialogContentText()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DialogButtons />
      </DialogActions>
    </Dialog>      

{/*   <Dialog open={openDel}  onClose={handleCloseDelNo} fullWidth={true}>
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
          {valueId?
          `В запись таблицы "${table_names[props.table_name]}" внесены изменения.`:
          `В таблицу "${table_names[props.table_name]}" внесена новая несохраненная запись.`}
          <br/>Вы желаете сохранить указанную запись?
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
          {valueId?
          `В запись таблицы "${table_names[props.table_name]}" внесены изменения.`:
          `В таблицу "${table_names[props.table_name]}" внесена новая несохраненная запись.`}
          <br/>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewYes} >Да</Button>
    </DialogActions>
  </Dialog> */}
 </>     
  )
}

export { DataTableCriterion, lastId }
