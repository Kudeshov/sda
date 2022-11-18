//import { Typography } from "@material-ui/core";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import * as React from 'react';

function Db() {

  const [name, setName] = React.useState('Cat in the Hat');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
/*     <Box
      component="form"
      sx={{'& > :not(style)': { m: 1, width: '25ch' }, }}
      noValidate
      autoComplete="off"
    > */
      <TextField
        id="outlined-name"
        label="Name"
        value={name}
        onChange={handleChange}
      />
/*       <TextField
        id="outlined-uncontrolled"
        label="Uncontrolled"
        defaultValue="foo"
      /> */
/*     </Box> */
  );

}
export default Db;

