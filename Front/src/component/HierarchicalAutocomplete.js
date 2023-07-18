// Компонент HierarchicalAutocomplete
import React from "react";
import { Autocomplete } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

export const transformData = (data) => {
    let idMap = new Map();
    let treeData = [];
  
    data.forEach((node) => {
      idMap.set(node.id, {...node, children: [], level: 0});
    });
  
    idMap.forEach((node) => {
      if(node.parent_id !== null){
        const parentNode = idMap.get(node.parent_id);
        if(parentNode){
          node.level = parentNode.level + 1;
          parentNode.children.push(node);
        }
      } else {
        treeData.push(node);
      }
    });
  
    const flattenTree = (treeNodes) => {
      return treeNodes.reduce((acc, node) => {
        return [...acc, node, ...flattenTree(node.children)];
      }, []);
    };
  
    return flattenTree(treeData);
  };

  const HierarchicalAutocomplete = ({ data, value, onChange, size, label, placeholder, getOptionDisabled }) => {
    return (
      <Autocomplete
        options={data}
        getOptionLabel={(option) => option.title}
        value={value}
        onChange={onChange}
        size={size}
        getOptionDisabled={getOptionDisabled}
        renderOption={(props, option, { selected }) => (
          <div
            {...props}
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: `${(option.level + (option.children.length === 0 ? 1 : 0)) * 20}px`,
            }}
          >
            {option.children.length > 0 && <ExpandMoreIcon fontSize="small" />}
            <Tooltip title={option.name_rus}>
                <div>{option.title}</div>
            </Tooltip>
          </div>
        )}
        renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} />}
        disableClearable
        label={label} 
        placeholder={placeholder}
      />
    );
  };
  
  export default HierarchicalAutocomplete;