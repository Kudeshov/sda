import { DataTableExpScenario } from './dt_exp_scenario';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function CriterionGr() {
  useDocumentTitle(table_names['criterion_gr']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['criterion_gr']}
    </Typography>
    <DataTableExpScenario table_name="criterion_gr"/>
    </Box>
  );
}

export default CriterionGr;