// Компонент HierarchicalAutocomplete
import React from "react";
import { Autocomplete } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

export const transformData = (data, available) => {
  let idMap = new Map();
  let treeData = [];
  let parentMap = new Map();

  const availableSet = new Set(available.map(node => node.id));

  // Create idMap for all nodes
  data.forEach((node) => {
      idMap.set(node.id, { ...node, children: [], level: 0 });
  });

  // Create a parent map, where each parent node has a reference to its children
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

      // If this node is in the available list, add all of its ancestors to the parentMap
      if (availableSet.has(node.id)) {
          let parent = idMap.get(node.parent_id);
          while (parent) {
              if (!parentMap.has(parent.id)) {
                  parentMap.set(parent.id, parent);
              }
              parent = idMap.get(parent.parent_id);
          }
      }
  });

  // Flatten the tree, but only include nodes that are in the available list or the parentMap
  const flattenTree = (treeNodes) => {
      return treeNodes.reduce((acc, node) => {
          if (availableSet.has(node.id) || parentMap.has(node.id)) {
              return [...acc, node, ...flattenTree(node.children)];
          } else {
              return [...acc, ...flattenTree(node.children)];
          }
      }, []);
  };

  return flattenTree(treeData);
};

const HierarchicalAutocomplete = ({
  data,
  value,
  onChange,
  size,
  label,
  placeholder,
  getOptionDisabled,
  disabled,
  displayField = 'title'  // добавлен новый проп с дефолтным значением 'title'
}) => {
  return (
    <Autocomplete
      options={data}
      getOptionLabel={(option) => option[displayField]} // использование displayField
      value={value}
      onChange={onChange}
      size={size}
      getOptionDisabled={getOptionDisabled}
      disabled={disabled}
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
            <div>{option[displayField]}</div>  {/* использование displayField */}
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

/*   const HierarchicalAutocomplete = ({ data, value, onChange, size, label, placeholder, getOptionDisabled, disabled }) => {
    return (
      <Autocomplete
        options={data}
        getOptionLabel={(option) => option.title}
        value={value}
        onChange={onChange}
        size={size}
        getOptionDisabled={getOptionDisabled}
        disabled={disabled}
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
  }; */
  
  export default HierarchicalAutocomplete;