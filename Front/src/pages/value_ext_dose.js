import { BigTableValueExtDose } from './bft_value_ext_dose';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function ValueExtDose() {
  useDocumentTitle(table_names['value_ext_dose']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['value_ext_dose']}
    </Typography>
    <BigTableValueExtDose table_name="value_ext_dose"/>
    </Box>
  );
}
export default ValueExtDose;
