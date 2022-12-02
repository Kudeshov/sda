import { Typography } from "@material-ui/core";
import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
     document.title = title
  }, [title])
}


function Substance() {
  useDocumentTitle("Вещество");
  return <Typography>Вещество</Typography>;
}
export default Substance;
