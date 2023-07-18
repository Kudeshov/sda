import { DataTableIsotope } from './dt_isotope';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function Isotope() {
  useDocumentTitle(table_names['isotope']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
      <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
        {table_names['isotope']}
      </Typography>
      <DataTableIsotope table_name="isotope"/>
    </Box>
  );
}
export default Isotope;
