import { DataTableExpScenario } from './dt_exp_scenario';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function ExpScenario() {
  useDocumentTitle(table_names['exp_scenario']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['exp_scenario']}
    </Typography>
    <DataTableExpScenario table_name="exp_scenario"/>
    </Box>
  );
}
export default ExpScenario;