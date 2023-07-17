import { DataTableChemCompGr } from './dt_chem_comp_gr';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function ChemCompGr() {
  useDocumentTitle(table_names['chem_comp_gr']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
      <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
        {table_names['chem_comp_gr']}
      </Typography>
      <DataTableChemCompGr table_name="chem_comp_gr"/>
    </Box>
  );
}

export default ChemCompGr;