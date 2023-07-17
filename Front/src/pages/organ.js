import { DataTableExpScenario } from './dt_exp_scenario';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function Organ() {
  useDocumentTitle(table_names['organ']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['organ']}
    </Typography>
    <DataTableExpScenario table_name="organ"/>
    </Box>
  );
}

export default Organ;