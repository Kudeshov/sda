import { DataTablePeopleClass } from './dt_people_class';
import { table_names } from './table_names';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}
function PeopleClass() {
  useDocumentTitle(table_names['people_class']);
  return (
    <Box sx={{ marginTop: '0.4rem' }}>
    <Typography variant="subtitle1" sx={{ paddingLeft: '1rem' }}>
      {table_names['people_class']}
    </Typography>
    <DataTablePeopleClass table_name="people_class"/>
    </Box>
  );
}

export default PeopleClass;
