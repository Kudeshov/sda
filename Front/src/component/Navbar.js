import React from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import DrawerComponent from "./Drawer";

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
    color: "white",
    fontSize: "14px",
    marginLeft: theme.spacing(10),
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid white",
    },
  },
}));

function Navbar() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          IBRAE:SDA
          
        </Typography>
       { //isMobile ? (
          //<DrawerComponent containerStyle={{height: 40, top: 64}} />
        //) : (
          <div className={classes.navlinks}>
            <Link to="/substance" className={classes.link}>
              Вещество
            </Link>
            <Link to="/decay" className={classes.link}>
              Радиоактивный распад
            </Link>
            <Link to="/coeff" className={classes.link}>
              Дозовые коэффициенты
            </Link>
            <Link to="/norms" className={classes.link}>
              Нормы и критерии
            </Link>
            <Link to="/sources" className={classes.link}>
              Источники данных
            </Link>
            <Link to="/db" className={classes.link}>
              Целевые БД
            </Link>
          </div>
        //)
        }
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
