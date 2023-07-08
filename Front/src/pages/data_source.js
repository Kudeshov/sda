import { DataTableDataSource } from './dt_data_source';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Sources() {
  useDocumentTitle(table_names['data_source']);
  return (
  <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['data_source']}
    </Typography>
    <DataTableDataSource table_name="data_source"/>
  </Box>
  );
}

export default Sources;