import { DataTableAgeGroup } from './dt_agegroup';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function AgeGroup() {
  useDocumentTitle(table_names['agegroup']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['agegroup']}
    </Typography>
    <DataTableAgeGroup table_name="agegroup"/>
    </Box>
  );
}
export default AgeGroup;