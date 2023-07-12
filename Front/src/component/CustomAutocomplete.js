import React, { useState } from "react";
import { Grid, Autocomplete, TextField, InputAdornment, Checkbox, IconButton, Tooltip, SvgIcon } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ReactComponent as CheckDoubleIcon } from "./../icons/check-double.svg";
import { styled } from '@mui/system';

/* const StyledIconButton = styled(IconButton)({
  padding: 0,

});  */

const StyledIconButton = styled(IconButton)({
  position: 'absolute',
  right: 58, 
  top: '50%',
  transform: 'translateY(-50%)',
  padding: 4, // Уменьшить размер кнопки, но оставить иконку того же размера
});

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 11,
    borderRadius: 0, 
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.common.white,
  },
}));

const CustomAutocomplete = ({ options, value, onChange, label, width, tooltipField, displayField }) => {
  const [searchValue, setSearchValue] = useState('');

  const filterOptions = (options, state) => {
    return options.filter((option) =>
      option[displayField] && option[displayField].toLowerCase().includes(state.inputValue.toLowerCase())
    );
  };

  const icon = <Checkbox />;
  const checkedIcon = <Checkbox checked />;

  return (
    <Grid container spacing={1} style={{ width: `${width}px` }}>
    <Grid item xs={11}>
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
        onClose={() => { setSearchValue(""); }}
        multiple
        limitTags={7}
        id="autocomplete-isotope"
        options={options}
        getOptionLabel={(option) => option[displayField]}
        disableCloseOnSelect
        filterOptions={filterOptions}
        renderOption={(props, option, { selected }) => (
          <li {...props} style={{ padding: '4px 8px' }}>
            <Checkbox
              size="small"
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8, height: 32, width: 32 }} 
              checked={selected}
            />
            <Tooltip title={option[tooltipField]}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <span>{option[displayField]}</span>
                <span></span>
              </div>
            </Tooltip>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <div>
                  {searchValue && (
                    <InputAdornment position="end">
                      <LightTooltip title="Добавить найденные">
                        <StyledIconButton
                          onClick={() => {
                            const filteredOptions = filterOptions(options, { inputValue: searchValue });
                            const newValues = [...value, ...filteredOptions];
                            onChange(null, newValues);
                            setSearchValue("");
                            params.inputProps.ref.current.blur();
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </StyledIconButton>
                      </LightTooltip>
                    </InputAdornment>
                  )}
                  {params.InputProps.endAdornment}
                </div>
              ),
            }}
            inputProps={{
              ...params.inputProps,
              required: value.length === 0,
              value: options.length === 0 ? "Выбор отсутствует" : params.inputProps.value,
            }}
            label={label}
            placeholder={label}
            required
          />
        )}
      />
    </Grid>
    <Grid item xs={1} display="flex" alignItems="center">
      <IconButton
        onClick={() => {
          onChange(null, options);
        }}
        color="primary"
        size="small"
        title="Выбрать все"
        style={{ marginLeft: -2 }}   
      >
        <SvgIcon fontSize="small" component={CheckDoubleIcon} inheritViewBox />
      </IconButton>
 
      </Grid>
    </Grid>
  );
};

export default CustomAutocomplete;
