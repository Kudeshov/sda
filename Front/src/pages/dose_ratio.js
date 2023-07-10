import { DataTableDoseRatio } from './dt_dose_ratio';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function DoseRatio() {
  useDocumentTitle(table_names['dose_ratio']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['dose_ratio']}
    </Typography>
    <DataTableDoseRatio table_name="dose_ratio"/>
    </Box>
  );
}
export default DoseRatio;

