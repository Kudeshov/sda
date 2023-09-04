import { BigTableValueRatioGit } from './bft_value_ratio_git';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function ValueRatioGit() {
  useDocumentTitle(table_names['value_ratio_git']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['value_ratio_git']}
    </Typography>
    <BigTableValueRatioGit table_name="value_ratio_git"/>
    </Box>
  );
}
export default ValueRatioGit;
