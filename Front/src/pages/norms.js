import { Link } from "react-router-dom";
import React from "react";
import {
  Toolbar,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(5),
    display: "flex",
  },
  logo: {
    flexGrow: "1",
    cursor: "pointer",
  },
  height: 40,
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "14px",
    marginLeft: theme.spacing(10),
    "&:hover": {
      color: "blue",
      borderBottom: "1px solid white",
    },
  },
}));

function Norms()  {
  const classes = useStyles();
  return <div>
      <Toolbar>
        <Link to="/class_func" className={classes.link}>
          Нормы и критерии
        </Link>
        <Link to="/class_func" className={classes.link}>
          Функции
        </Link>
        <Link to="/class_func1" className={classes.link}>
          Группы критериев
        </Link>
        <Link to="/class_func1" className={classes.link}>
          Действия
        </Link>
        <Link to="/class_func1" className={classes.link}>
          Уровни вмешательства
        </Link>
      </Toolbar>
    </div>;
}

export default Norms;
