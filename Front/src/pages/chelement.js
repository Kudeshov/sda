import { DataTableChelement } from './dt_chelement';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function Chelement() {
  useDocumentTitle(table_names['chelement']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['chelement']}
    </Typography>
    <DataTableChelement table_name="chelement"/>
    </Box>
  );
}

export default Chelement;