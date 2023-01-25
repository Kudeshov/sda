//import { Typography } from "@material-ui/core";
import { useEffect } from 'react';
import { table_names } from './sda_types';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}

function Substance() {
  useDocumentTitle(table_names['chelement']);
  console.log(table_names);
//  return <Typography>Вещество</Typography>;
 /*  return <Typography>{table_names['chelement']}</Typography>;  */
}
export default Substance;
