import { DataTableCriterion } from './dt_criterion';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function Criterion() {
  useDocumentTitle(table_names['criterion']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['criterion']}
    </Typography>
    <DataTableCriterion table_name="criterion"/>
    </Box>
  );
}

export default Criterion;

