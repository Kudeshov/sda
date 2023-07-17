import { BigTableValueIntDose } from './bft_value_int_dose';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function ValueIntDose() {
  useDocumentTitle(table_names['value_int_dose']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['value_int_dose']}
    </Typography>
    <BigTableValueIntDose table_name="value_int_dose"/>
    </Box>
  );
}
export default ValueIntDose;
