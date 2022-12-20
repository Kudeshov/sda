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
import { table_names } from '../pages/sda_types';

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
  const [menuDecay, setMenuDecay] = useState(false);
  const [anchorEl, setAnchorEl] = useState()

  const recordButtonPositionDecay = (event/* : any */) => {
      setAnchorEl(event.currentTarget);
      setMenuDecay(true);
  }
  let closeMenuDecay = () => {
      setMenuDecay(false);
  }

  const [menuCoeff, setMenuCoeff] = useState(false);
  const [anchorE2, setAnchorE2] = useState()

  const recordButtonPositionCoeff = (event/* : any */) => {
      setAnchorE2(event.currentTarget);
      setMenuCoeff(true);
  }
  let closeMenuCoeff = () => {
      setMenuCoeff(false);
  }

  const [menuNorm, setMenuNorm] = useState(false);
  const [anchorE3, setAnchorE3] = useState()

  const recordButtonPositionNorm = (event/* : any */) => {
      setAnchorE3(event.currentTarget);
      setMenuNorm(true);
  }
  let closeMenuNorm = () => {
      setMenuNorm(false);
  }
  
  const [menuSubstance, setMenuSubstance] = useState(false);
  const [anchorE5, setAnchorE5] = useState()

  const recordButtonPositionSubstance = (event/* : any */) => {
      setAnchorE5(event.currentTarget);
      setMenuSubstance(true);
  }
  let closeMenuSubstance = () => {
      setMenuSubstance(false);
  }

  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          IBRAE:SDA
          
        </Typography>
       { 
          <div className={classes.navlinks}>
            <Link onClick={recordButtonPositionSubstance} className={classes.link}>
              Вещество
            </Link>
            <Menu
                anchorEl={anchorE5}
                open={menuSubstance}
                onClose={closeMenuSubstance}>
                <MenuItem onClick={closeMenuSubstance} component={Link} disabled={true} to="/">Химические элементы</MenuItem> 
            </Menu> 

            <Link onClick={recordButtonPositionDecay} className={classes.link}>
              Радиоактивный распад
            </Link>
            <Menu
                anchorEl={anchorEl}
                open={menuDecay}
                onClose={closeMenuDecay}>
                <MenuItem onClick={closeMenuDecay} component={Link} disabled={true} to="/">Радионуклиды</MenuItem> 
 
                <Divider />
                <MenuItem onClick={closeMenuDecay} component={Link} disabled={true} to="/">Параметры</MenuItem> 
                <MenuItem onClick={closeMenuDecay} component={Link} disabled={true} to="/">Тип излучения</MenuItem> 
                <MenuItem onClick={closeMenuDecay} component={Link} disabled={true} to="/">Форма распада</MenuItem> 
            </Menu>            
            <Link onClick={recordButtonPositionCoeff}  className={classes.link}>
              Дозовые коэффициенты
            </Link>            
            <Menu
                anchorEl={anchorE2}
                open={menuCoeff}
                onClose={closeMenuCoeff}>
                <MenuItem onClick={closeMenuCoeff} component={Link} disabled={true} to="/">Внутреннее облучение</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} disabled={true} to="/">Внешнее облучение</MenuItem> 
                <Divider />
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/dose_ratio">{table_names['dose_ratio']}</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/irradiation">{table_names['irradiation']}</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/integral_period">Периоды интегрирования</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/db">Формы вещества</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/coeff">Типы облучаемых лиц</MenuItem>
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/aerosol_sol">{table_names['aerosol_sol']}</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/aerosol_amad">{table_names['aerosol_amad']}</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/let_level">{table_names['let_level']}</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/exp_scenario">{table_names['exp_scenario']}</MenuItem> 
                <MenuItem onClick={closeMenuCoeff} component={Link} to="/agegroup">Возрастные группы населения</MenuItem> 

             </Menu>

            <Link onClick={recordButtonPositionNorm} className={classes.link}>
              Нормы и критерии
            </Link>
            <Menu 
             anchorEl={anchorE3}
             open={menuNorm}
             onClose={closeMenuNorm}>
            <MenuItem onClick={closeMenuNorm} component={Link} disabled={true} to="/">Нормы и критерии</MenuItem> 
            <MenuItem onClick={closeMenuNorm} component={Link} to="/calcfunction">Функции</MenuItem> 
            <MenuItem onClick={closeMenuNorm} component={Link} disabled={true} to="/">Группы критериев</MenuItem> 
            <MenuItem onClick={closeMenuNorm} component={Link} to="/action">Действия</MenuItem>
            <MenuItem onClick={closeMenuNorm} component={Link} to="/action_level">Уровни вмешательства</MenuItem> 
            </Menu>

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
