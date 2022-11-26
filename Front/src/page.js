import { useEffect } from "react";

const Page = (props) => {
  useEffect(() => {
    console.log(props.title);
    document.title = props.title || "типы облучаемых лиц";
  }, [props.title]);
  return props.children;
};

export default Page;
