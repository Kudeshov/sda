import { DataTablePeopleClass } from './dt_people_class';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function Irradiation() {
  useDocumentTitle(table_names['irradiation']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['irradiation']}
    </Typography>
    <DataTablePeopleClass table_name="irradiation"/>
    </Box>
  );
}

export default Irradiation;