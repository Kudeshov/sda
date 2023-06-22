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
//import { DataTableDataSourceClass } from './dt_data_source_class';
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
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import CircularProgress from '@material-ui/core/CircularProgress';
import { ExportToCsv } from 'export-to-csv-fix-source-map';
import { table_names } from './sda_types';
import Backdrop from '@mui/material/Backdrop';
import { InputAdornment } from "@material-ui/core";
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { DataTableActionCriterion } from './dt_action_criterion';

var alertText = "Сообщение";
var alertSeverity = "info";
var lastId = 0;
var clickedId = 0;
var clickAfterReload = false;

const DataTableCriterion = (props) => {
  const [tableCalcfunction, settableCalcfunction] = useState([]); 
  //const [tableCriterionGr, settableCriterionGr] = useState([]); 
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
  const [tableExpScenario, settableExpScenario] = useState([]); 
  // const [tableCrvalue, settableCrvalue] = useState([0,1,2,3,4,5,6]); 
  const [valueCalcfunctionID, setValueCalcfunctionID] = useState(); 
  const [valueCrValue, setValueCrValue] = useState(); 
  const [valueTimeend, setValueTimeend] = useState(); 
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
  const [valueNormativ, setValueNormativ] = React.useState();
  const [valueNormativInitial, setValueNormativInitial] = React.useState();

  const [isLoading, setIsLoading] = React.useState("false");
  const [tableData, setTableData] = useState([]); 
  const [tableNormativ, setNormativ] = useState([]); 
  const [treeData, setTreeData] = useState([]); 
  const [editStarted, setEditStarted] = useState([false]);
  const [isEmpty, setIsEmpty] = useState([false]);
  const [valueCrit, setValueCrit] = React.useState();

  useEffect(() => {
    setIsEmpty((''===valueTitle)&&(''===valueNameRus)&&(''===valueNameEng)&&(''===valueDescrEng)&&(''===valueDescrRus)   
      &&(''===valueParentID)&&(''===valueNormativ));
    }, [ valueTitle, valueNameRus, valueNameEng, valueDescrEng, valueDescrRus, 
      valueParentID, valueNormativ]); 

  useEffect(() => {
    //console.log('setEditStarted valueTitleInitial='+valueTitleInitial+' valueTitle = '+ valueTitle);    
    setEditStarted(       
       (valueTitleInitial!==valueTitle)||(valueNameRusInitial!==valueNameRus)||(valueNameEngInitial!==valueNameEng)
      ||(valueDescrEngInitial!==valueDescrEng) ||(valueDescrRusInitial!==valueDescrRus)||(valueParentIDInitial!==valueParentID)/*||(valueNormativInitial!==valueNormativ)*/);
    }, [valueTitleInitial, valueTitle, valueNameRusInitial, valueNameRus, valueNameEngInitial, valueNameEng, 
        valueDescrEngInitial, valueDescrEng, valueDescrRusInitial, valueDescrRus, valueParentID, valueParentIDInitial, valueNormativ, valueNormativInitial]); 

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
        setValueNormativ(tableData[0].normativ_id);
        setValueNormativInitial(tableData[0].normativ_id);  
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
              setValueNormativ(res[0].normativ_id);      

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
              
          }; 
        
      if (clickAfterReload) {
          clickAfterReload = false;
          if (lastId!==0)
            updateCurrentRec(lastId); 
      }
    }, [ tableData] );

    const getTreeItemsFromData = treeItems => {
      return treeItems.map(treeItemData => {
        let children = undefined;
        if (treeItemData.children && treeItemData.children.length > 0) {
          children = getTreeItemsFromData(treeItemData.children);
        }
        return ( 
          <TreeItem
            key={treeItemData.id}
            nodeId={treeItemData.id?treeItemData.id.toString():0}
            label={treeItemData.title}
            children={children}
          />
        );
      });
    };

    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState('');

    const handleToggle = (event, nodeIds) => {
      setExpanded(nodeIds);
    };
  
    const handleSelect = (event, nodeIds) => {
      setSelected(nodeIds);
      handleItemClick(nodeIds);
    };  

    const [treeFilterString, setTreeFilterString] = React.useState('');

    const DataTreeView = ({ treeItems }) => {
      return (
        <div>
        <p></p>
        <TreeView
          aria-label="Tree navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
          expanded={expanded}
          selected={selected}          
          //onNodeToggle={handleChange}
          //defaultExpanded={[1,2]}
          //expanded={true}
          loading={isLoading}
          //defaultExpanded={ids}
        >
          {getTreeItemsFromData(treeItems)}
        </TreeView></div>
      );
    };

  const handleItemClick = (id) => {
    setOpenAlert(false);  
    console.log( 'isEmpty = '+isEmpty);
    clickedId = id;
    if (editStarted&&(!isEmpty))
    {
      handleClickSave(id);
    } 
    else 
    {
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
      setValueNormativ(res[0].normativ_id);      
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
      
      console.log(res[0].crit);
      setValueCrit(res[0].crit);
    }   
  }; 

  const handleClearClick = (params) => {
    if (editStarted&&(!isEmpty))
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
      setValueParentID(valueParentID); //-1
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
      .then((data) => setTableData(data))
      .then((data) => {  //lastId = data[0].id||0; clickAfterReload = true; console.log( 'setSelected ');  //console.log( tableData[0].id||0 ); 
          } ); 
  }, [props.table_name])

  useEffect(() => {

    function updateCurrentRec (id)  {
      if (id)
        lastId = id;
      var res = tableData.filter(function(item) {
        return item.id.toString() === id;
      });

      //console.log('res.length ' + res.length);
      setValueID(res[0].id); 
      setValueTitle(res[0].title);
      setValueNameRus(res[0].name_rus);
      setValueNameEng(res[0].name_eng);
      setValueDescrRus(res[0].descr_rus);
      setValueDescrEng(res[0].descr_eng);    
      setValueParentID(res[0].parent_id||-1);    
      setValueNormativ(res[0].normativ_id);      
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
    }; 

    //console.log( 'selected = ' + selected + ' tableData.length ' + tableData.length );
    if ((!selected)&&(tableData.length))
    {
      //console.log( 'setSelected(tableData[0].id.toString()); = ' + tableData[0].id.toString()  );

      setSelected(tableData[0].id.toString());
      updateCurrentRec(tableData[0].id.toString());
    }      
  }, [tableData, selected])

  useEffect(() => {
    fetch(`/normativ`)
      .then((data) => data.json())
      .then((data) => setNormativ(data))
      .then((data) => { /* lastId = 0; */} ); 
  }, [valueNormativ])


  useEffect(() => {
    fetch(`/calcfunction`)
      .then((data) => data.json())
      .then((data) => settableCalcfunction(data))
      .then((data) => { lastId = 0;} ); 
  }, [])

/*   useEffect(() => {
    fetch(`/criterion_gr`)
      .then((data) => data.json())
      .then((data) => settableCriterionGr(data))
      .then((data) => {  lastId = 0;} ); 
  }, []) */

  useEffect(() => {
    fetch(`/action_level`)
      .then((data) => data.json())
      .then((data) => settableActionLevel(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  useEffect(() => {
    fetch(`/irradiation`)
      .then((data) => data.json())
      .then((data) => settableIrradiation(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  useEffect(() => {
    fetch(`/people_class`)
      .then((data) => data.json())
      .then((data) => settablePeopleClass(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  useEffect(() => {
    fetch(`/agegroup`)
      .then((data) => data.json())
      .then((data) => settableAgegroup(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  
  useEffect(() => {
    fetch(`/exp_scenario`)
      .then((data) => data.json())
      .then((data) => settableExpScenario(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

   
  useEffect(() => {
    fetch(`/integral_period`)
      .then((data) => data.json())
      .then((data) => settableIntegralPeriod(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  useEffect(() => {
    fetch(`/organ`)
      .then((data) => data.json())
      .then((data) => settableOrgan(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  useEffect(() => {
    fetch(`/isotope`)
      .then((data) => data.json())
      .then((data) => settableIsotope(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  useEffect(() => {
    fetch(`/subst_form`)
      .then((data) => data.json())
      .then((data) => settableSubstForm(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  
  useEffect(() => {
    fetch(`/aerosol_sol`)
      .then((data) => data.json())
      .then((data) => settableAerosolSol(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  useEffect(() => {
    fetch(`/chem_comp_gr_min`)
      .then((data) => data.json())
      .then((data) => settableChemCompGr(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])


  useEffect(() => {
    fetch(`/aerosol_amad`)
      .then((data) => data.json())
      .then((data) => settableAerosolAmad(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])

  
  useEffect(() => {
    fetch(`/data_source`)
      .then((data) => data.json())
      .then((data) => settableDataSource(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])



/*   useEffect(() => {
    fetch(`/cr_value`)
      .then((data) => data.json())SubstForm
      .then((data) => settableCrvalue(data))
      .then((data) => {  lastId = 0;} ); 
  }, [])
 */


///////////////////////////////////////////////////////////////////  Tree load functions and hook  /////////////////////
  useEffect(() => {
    function filterTree( tree1, filterS )
    {
      var i;
      i = 0;
      while (i < tree1.length) 
      {
        if (tree1[i].children.length === 0)
        {
          if (tree1[i].title.toLowerCase().indexOf(filterS.toLowerCase()) === -1)
          {
            tree1.splice(i, 1); 
            i--;
          }
        }
        else
        {
          filterTree( tree1[i].children, filterS );
        }
        i++;
      }
      i = 0;
      while (i < tree1.length) 
      {
        if (tree1[i].children.length === 0)
        {
          if (tree1[i].title.toLowerCase().indexOf(filterS.toLowerCase()) === -1)
          {
            tree1.splice(i, 1); 
            i--;
          }
        }
        else
        {
          filterTree( tree1[i].children, filterS );
        }
        i++;
      }      
    }
    function list_to_tree1(list, filterString) { 
      var map = {}, node, roots = [], i;
       for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i;   // initialize the map
        list[i].children = []; // initialize the children
      }
      filterString=filterString||'';
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent_id) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.parent_id]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      filterTree(roots, filterString.toLowerCase());  
      return roots;
    }

    let arr = list_to_tree1( tableData, treeFilterString );
    setTreeData( arr );
  }, [tableData, treeFilterString]) 

  ///////////////////////////////////////////////////////////////////  SAVE  /////////////////////
  const saveRec = async ( fromToolbar ) => {

    if (formRef.current.reportValidity() )
    {

    console.log('valueParentID = ' + valueParentID)
    console.log('valueChemCompGr = ' + valueChemCompGr)

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
     setIsLoading('false');
     if (fromToolbar) 
     {
       //console.log('fromToolbar valueTitle'+valueTitle)
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
           
       
     }
    reloadData();     
   }
  }
 };
/////////////////////////////////////////////////////////////////// ADDREC ///////////////////// 
  const addRec = async ()  => {
    //let myParentID;
    //myParentID = valueParentID === -1 ? null : valueParentID;
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
        console.log('setSelected lastId' + lastId);
        setValueID(lastId);
        console.log('setSelected toString' + lastId.toString());
        setSelected(lastId.toString());
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
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
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
        //console.log('response not OK');
        alertSeverity = 'error';
        alertText = await response.text();
        setOpenAlert(true);          
      }
      else
      {
        //console.log('response OK');
        alertSeverity = "success";
        alertText = await response.text();
        setOpenAlert(true); 
        reloadData();
        //setSelectionModel(tableData[0].id );  
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
        setValueNormativ(tableData[0].normativ_id);
        setValueNormativInitial(tableData[0].normativ_id);
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
      }
    } catch (err) {
      alertText = err.message;
      alertSeverity = 'error';
      setOpenAlert(true);
    } finally {
      setIsLoading("false");
    }
  };  

  /////////////////////////////////////////////////////////////////// RELOAD /////////////////////
  const handleClickReload = async () => {
    alertSeverity = "info";
    alertText =  'Данные успешно обновлены';
    try 
    {
      //console.log('handleClickReload await reloadData();');
      clickAfterReload = true;
      await reloadData().then( console.log('after reload, title = '+tableData[0].title) ) ;
      //console.log('handleClickReload handleItemClick(lastId); lastId= '+lastId);
      //handleItemClick(lastId);
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
      setIsLoading("false");
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

  function updateCurrentRecHandles (id)  {
    if (id)
      lastId = id;
    var res = tableData.filter(function(item) {
      return item.id.toString() === id;
    });
    //console.log('res.length ' + res.length);
    setValueID(res[0].id); 
    setValueTitle(res[0].title);
    setValueNameRus(res[0].name_rus);
    setValueNameEng(res[0].name_eng);
    setValueDescrRus(res[0].descr_rus);
    setValueDescrEng(res[0].descr_eng);    
    setValueParentID(res[0].parent_id||-1);    
    setValueNormativ(res[0].normativ_id);      
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
    
     
  }; 

  const handleCloseSaveNo = () => {
    setOpenSave(false);
    //handleCancelClick();
    updateCurrentRecHandles(clickedId);
  };

  const handleCloseSaveYes = () => {
    setOpenSave(false);
    saveRec(false);
    //handleCancelClick();
    updateCurrentRecHandles(clickedId);
  };

  const handleClickSaveWhenNew = () => {
    setOpenSaveWhenNew(true);
  };

  const handleCloseSaveWhenNewNo = () => {
    setOpenSaveWhenNew(false);
    //updateCurrentRecHandles(clickedId);    
  };

  const handleCloseSaveWhenNewYes = () => {
    //console.log('handleCloseSaveWhenNewYes');
    setOpenSaveWhenNew(false);
    saveRec(true);
    //console.log('handleCloseSaveWhenNewYes lastId = '+lastId);
    //updateCurrentRec(lastId);    
  };

  //////////////////////////////////////////////////////// ACTIONS ///////////////////////////////
  const [openAlert, setOpenAlert] = React.useState(false, '');
  const handleCancelClick = () => 
  {
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
      setValueNormativ(selectedRowData[0].normativ_id);
      setValueNormativInitial(selectedRowData[0].normativ_id);

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
      

    }
  }

  function getHeaders(atable)
  {
    if (atable==='criterion_gr') 
      return ['Обозначение','Название(рус.яз)','Название(англ.яз)','Нормативная база','Родительский класс','Комментарий(рус.яз)','Комментарий(англ.яз)'];
    if (atable==='organ') 
      return ['Обозначение','Название(рус.яз)','Название(англ.яз)','Родительский класс','Комментарий(рус.яз)','Комментарий(англ.яз)'];
    if (atable==='exp_scenario') 
      return ['Обозначение','Название(рус.яз)','Название(англ.яз)','Родительский класс','Комментарий(рус.яз)','Комментарий(англ.яз)'];
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



  function getTableDataForExcel( t ) 
  {
    function replacer(i, val) {
      if ( val === null ) 
      { 
         return ""; // change null to empty string
      } else {
         return val; // return unchanged
      }
     }

    var arr_excel = [];
    
    if (props.table_name==='criterion_gr')  
      arr_excel= t.map(({title, name_rus, name_eng, descr_rus, descr_eng, parent_name, normativ_title}) => ({title, name_rus, name_eng, normativ_title, parent_name, descr_rus, descr_eng}))
    else
      arr_excel= t.map(({title, name_rus, name_eng, descr_rus, descr_eng, parent_name}) => ({title, name_rus, name_eng, parent_name, descr_rus, descr_eng}));

    //arr_excel = JSON.parse(JSON.stringify(arr_excel).replace(/\:null/gi, "\:\"\"")); 
    arr_excel = JSON.parse( JSON.stringify(arr_excel, replacer) );

    return(arr_excel);
  }

  const exportDataCSV = async () => {
    const csvExporter = new ExportToCsv(optionsCSV);
    console.log(treeFilterString);
    const filteredData = tableData.filter(item =>
      item.title.toLowerCase().includes(treeFilterString.toLowerCase())
    );
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

    <div style={{ height: 650, width: 1500 }}>
    <form ref={formRef}>  

    <table border = "0" style={{ height: 650, width: 1500 }} ><tbody>
    <tr>
      <td style={{ height: 550, width: 600, verticalAlign: 'top' }}>
      <div style={{ height: 500, width: 585 }}>
      <Box sx={{ border: 1, borderRadius: '4px', borderColor: 'grey.300', height: 500, p: '4px' }} >
        <IconButton onClick={()=>handleClearClick()}  color="primary" size="small" title="Создать запись">
          <SvgIcon fontSize="small" component={PlusLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>saveRec(true)}  color="primary" size="small" title="Сохранить запись в БД">
          <SvgIcon fontSize="small" component={SaveLightIcon} inheritViewBox/></IconButton>
        <IconButton onClick={()=>handleClickDelete()}  color="primary" size="small" title="Удалить запись">
          <SvgIcon fontSize="small" component={TrashLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleCancelClick()} disabled={!editStarted} color="primary" size="small" title="Отменить редактирование">
          <SvgIcon fontSize="small" component={UndoLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>handleClickReload()} color="primary" size="small" title="Обновить данные">
          <SvgIcon fontSize="small" component={RepeatLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>exportDataCSV()} color="primary" size="small" title="Сохранить в формате CSV">
          <SvgIcon fontSize="small" component={DownloadLightIcon} inheritViewBox /></IconButton>
        <IconButton onClick={()=>expandTree()} color="primary" size="small" title={expanded.length !== 0?"Свернуть все":"Развернуть все"} >
          <SvgIcon fontSize="small" component={expanded.length !== 0?CollapseIcon:ExpandIcon} inheritViewBox /></IconButton>
        <br/><TextField label="Фильтр ..." size = "small" variant="standard" value={filter}
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
        />
        <Box sx={{ height: 415, overflowY: 'false' }}>
          {(isLoading==="true") && 
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop> } 
          <Box sx={{ height: 415, flexGrow: 1, overflowY: 'auto' }} >     
            <DataTreeView treeItems={treeData} />
          </Box> 
        </Box>
      </Box>
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
      {( valueCrit === 1) &&
      <>
      <TextField  id="ch_id" disabled={true} label="Код" sx={{ width: '12ch' }} variant="outlined" value={ valueId ||''} size="small" /* onChange={e => setValueID(e.target.value)} *//>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name" sx={{ width: '40ch' }} label="Обозначение" required size="small" variant="outlined" value={valueTitle || ''} onChange={e => setValueTitle(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <FormControl sx={{ width: '30ch' }} size="small">
        <InputLabel id="ch_parent_id"required>Группа критериев</InputLabel>
          <Select labelId="ch_parent_id" id="ch_parent_id1" label="Группа критериев"  value={valueParentID  || ""  }  onChange={e => setValueParentID(e.target.value) }  >
          <MenuItem key={-1} value={-1}>
                    {'Не задан'}
                  </MenuItem>
                  {tableData?.map(option => {
                  return (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title ?? option.id}
                  </MenuItem>
                  );
                })}
        </Select>
      </FormControl>  

      <p></p> 
      <div>
      {(() => {
        if (props.table_name==='criterion_gr') {
          return (
            <div>
              <FormControl sx={{ width: '30ch' }} size="small">
                <InputLabel id="ch_normativ_id"required>Нормативная база</InputLabel>
                  <Select labelId="ch_normativ_id" id="ch_normativ_id1" label="Нормативная база" required value={valueNormativ  || "" } onChange={e => setValueNormativ(e.target.value)} >
                          {tableNormativ?.map(option => {
                          return (
                          <MenuItem key={option.id} value={option.id}>
                            {option.title ?? option.id}
                          </MenuItem>
                          );
                        })}
                </Select>
              </FormControl>   
            </div>
          )
        } 
      })()}
      </div>

      <p></p> 
      <TextField  id="ch_name_rus" sx={{ width: '49ch' }}  size="small" label="Название (рус.яз)"  variant="outlined"  value={valueNameRus || ''} onChange={e => setValueNameRus(e.target.value)} />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <TextField  id="ch_name_eng" sx={{ width: '49ch' }} size="small" label="Название (англ.яз)"  variant="outlined" value={valueNameEng || ''} onChange={e => setValueNameEng(e.target.value)}/>
      <p></p>
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (рус.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrRus || ''} onChange={e => setValueDescrRus(e.target.value)}/>
      <p></p> 
      <TextField  id="ch_descr_rus" sx={{ width: '100ch' }} label="Комментарий (англ.яз)"  size="small" multiline maxRows={4} variant="outlined" value={valueDescrEng || ''} onChange={e => setValueDescrEng(e.target.value)}/>
      <p></p>

      <Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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
     <p></p>
     <TextField  id="ch_name" sx={{ width: '40ch' }} label="Значение" required size="small" variant="outlined" 
       value={valueCrValue || ''} onChange={e => setValueCrValue(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;&nbsp;

      <p></p>


    
     
     <TextField  id="timeend" sx={{ width: '40ch' }} label="Время облучения, сек" required size="small" variant="outlined" 
       value={valueTimeend || ''} onChange={e => setValueTimeend(e.target.value)}/>
      &nbsp;&nbsp;&nbsp;&nbsp;

      <p></p>

      <Autocomplete
      fullWidth
      sx={{ width: '60ch' }}
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
      clearable
    />



<p></p>


<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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
          clearable
        />  


<p></p>


<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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

<p></p>


<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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
          clearable
        />  

<p></p>


<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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

<p></p>


<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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

<p></p>


<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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
        />  

<p></p>


<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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
<p></p>



<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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

<p></p>



<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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

<p></p>



<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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

<p></p>


        
<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
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

<p></p>

        
<Autocomplete
          fullWidth
          sx={{ width: '60ch' }}
          size="small"
          disablePortal
          disableClearable
          id="combo-box-data-source"
          value={tableDataSource.find((option) => option.id === valueDataSource) || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValueAC) => { setValueDataSource(newValueAC ? newValueAC.id : null) }}
          options={tableDataSource}
          getOptionLabel={option => option ? option.title : ""}
          renderInput={(params) => <TextField {...params} label="Источник данных" required  />}
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

      <div style={{ height: 300, width: 800 }}>
        <td>Действия критерия<br/>
          <DataTableActionCriterion table_name={props.table_name} rec_id={valueId} />
        </td>
      </div>

      </>}
    </td>
  </tr>

  </tbody>
  </table>

  <Dialog open={openDel}  onClose={handleCloseDelNo} fullWidth={true}>
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
{/*             {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueParentID === valueParentIDInitial ? '' : 'Родительский класс: '+valueParentID+'; ' }<p></p>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p></p>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p></p>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p></p>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p></p> */}
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
{/*             {valueTitle === valueTitleInitial ? '' : 'Обозначение: '+valueTitle+'; ' }<p></p>
            {valueParentID === valueParentIDInitial ? '' : 'Родительский класс: '+valueParentID+'; ' }<p></p>
            {valueNameRus === valueNameRusInitial ? '' : 'Название (рус. яз): '+valueNameRus+'; ' }<p></p>
            {valueNameEng === valueNameEngInitial ? '' : 'Название (англ. яз): '+valueNameEng+'; ' }<p></p>
            {valueDescrRus === valueDescrRusInitial ? '' : 'Комментарий (рус. яз): '+valueDescrRus+'; ' }<p></p>
            {valueDescrEng === valueDescrEngInitial ? '' : 'Комментарий (англ. яз): '+valueDescrEng+'; ' }<p></p> */}
          <br/>Вы желаете сохранить указанную запись?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewNo} autoFocus>Нет</Button>
        <Button variant="outlined" onClick={handleCloseSaveWhenNewYes} >Да</Button>
    </DialogActions>
  </Dialog>
  </form>
 </div>     
  )
}

export { DataTableCriterion, lastId }
