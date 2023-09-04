import { BigTableDepositionFraction } from './bft_deposition_fraction';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function DepositionFraction() {
  useDocumentTitle(table_names['deposition_fraction']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['deposition_fraction']}
    </Typography>
    <BigTableDepositionFraction table_name="deposition_fraction"/>
    </Box>
  );
}
export default DepositionFraction;
