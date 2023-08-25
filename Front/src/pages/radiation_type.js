import { DataTableRadiationType } from './dt_radiation_type';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function RadiationType() {
  useDocumentTitle(table_names['radiation_type']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['radiation_type']}
    </Typography>
    <DataTableRadiationType table_name="radiation_type"/>
    </Box>
  );
}

export default RadiationType;

