import * as React from 'react';
import { useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import { ReactComponent as CheckDoubleIcon } from "./../icons/check-double.svg";
import Box from '@mui/material/Box';

// Icons for the Autocomplete component
const icon = <Checkbox />;
const checkedIcon = <Checkbox checked />;

function CustomAutocomplete({
  value,
  onChange,
  options,
  getOptionLabel,
  getOptionDisplay = getOptionLabel, // use getOptionLabel as default
  required,
  label,
  placeholder
}) {
  const [searchValue, setSearchValue] = useState('');
  
  const filterOptions = createFilterOptions({
    stringify: getOptionDisplay,
  });

  return (
    <Box display="flex" alignItems="center">
      <Autocomplete
        size="small"
        value={value}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={onChange}
        onInputChange={(event, newInputValue, reason) => {
          if (reason !== "reset") {
            setSearchValue(newInputValue);
          }
        }}
        inputValue={searchValue}
        multiple
        limitTags={7}
        id="autocomplete-isotope"
        options={options}
        getOptionLabel={getOptionLabel}
        disableCloseOnSelect
        filterOptions={filterOptions}
        renderOption={(props, option, { selected }) => (
          <Box 
            {...props} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              height: 'auto',
              lineHeight: 'normal',
            }}
          >
            <Checkbox
              size="small"
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {getOptionDisplay(option)}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              required: value.length === 0,
              value: options.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
            }}
            label={label}
            placeholder={placeholder}
            required  
          />
        )}
      />
      <IconButton
        onClick={() => {
          const filtered = filterOptions(options, searchValue);
          onChange({}, filtered);
          setSearchValue('');  // очищаем поле ввода после нажатия на "Выбрать все"
        }} 
        color="primary" 
        size="small" 
        title="Выбрать все"
      >  
        <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
      </IconButton>
    </Box>
  );
}

export default CustomAutocomplete;
