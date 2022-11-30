import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
//  useTheme,
 // useMediaQuery, 
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//import { Event } from "@material-ui/icons";
//import DrawerComponent from "./Drawer";

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
  //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 //  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  //const open11 = Boolean(anchorEl);
   /*const open11 = false;
  const handleClick = (Event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleClose = () => {
    setAnchorEl(null);
  };   
  */
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState()

  const recordButtonPosition = (event: any) => {
      setAnchorEl(event.currentTarget);
      setMenuOpen(true);
  }

  let closeMenu = () => {
      setMenuOpen(false);
  }

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
{/*             <Link to="/coeff" className={classes.link}>
              Дозовые коэффициенты
            </Link> 
            <Button onClick={recordButtonPosition}>
              Дозовые коэффициенты
            </Button>*/}
            <Link onClick={recordButtonPosition}  className={classes.link}>
              Дозовые коэффициенты
            </Link>            
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={closeMenu}>
                <MenuItem onClick={closeMenu} component={Link} disabled={true} to="/">Внутреннее облучение</MenuItem> 
                <MenuItem onClick={closeMenu} component={Link} disabled={true} to="/">Внешнее облучение</MenuItem> 
                <Divider />
                <MenuItem onClick={closeMenu} component={Link} to="/coeff">Типы облучаемых лиц</MenuItem> 
                <MenuItem onClick={closeMenu} component={Link} to="/db">Формы вещества</MenuItem> 
            </Menu>

{/*             <Button
              id="basic-button"
              //aria-controls={open11 ? 'basic-menu' : undefined}
              aria-haspopup="true"
             // aria-expanded={open11 ? 'true' : undefined}
              //onClick={handleClick}
            >
              Дозовые коэффициенты
            </Button> */}
  {/*           <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu> */}
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
