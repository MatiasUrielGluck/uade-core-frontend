import { Link as RouterLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from "../../theme/ColorModeProvider.tsx";

type Props = {
  showBurger: boolean;
  onBurgerClick: () => void;
  userName: string;
  avatarSrc?: string;
};

function Navbar({showBurger, onBurgerClick, userName, avatarSrc = '/avatar.png'}: Props) {
  const theme = useTheme();
  const {mode, toggleColorMode} = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  return (
    <AppBar position="fixed" elevation={1} sx={{zIndex: (t) => t.zIndex.drawer + 1}}>
      <Toolbar>
        {showBurger && (
          <IconButton color="inherit" edge="start" onClick={onBurgerClick} sx={{mr: 1}}
                      aria-label="open navigation menu">
            <MenuIcon/>
          </IconButton>
        )}

        <Typography
          variant="h6"
          noWrap
          component={RouterLink}
          to="/"
          style={{textDecoration: 'none', color: 'inherit'}}
          sx={{mr: 2}}
        >
          CoreHub
        </Typography>

        <span style={{flex: 1}}/>

        <Tooltip title={mode === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro'}>
          <IconButton
            color="inherit"
            onClick={toggleColorMode}
            aria-label="toggle color mode"
            sx={{'&:focus,&:focus-visible': {outline: 'none'}, '&:hover': {backgroundColor: 'transparent'}}}
          >
            {theme.palette.mode === 'dark' ? <LightModeIcon/> : <DarkModeIcon/>}
          </IconButton>
        </Tooltip>

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="small"
          sx={{p: 0.5, '&:focus,&:focus-visible': {outline: 'none'}}}
          aria-label="user menu"
        >
          <Avatar alt={userName} src={avatarSrc}/>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
          transformOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          sx={(theme) => ({
            '& .MuiMenuItem-root:hover': {
              color: theme.palette.primary.main,                 // texto celeste SOLO en hover
              '& .MuiListItemIcon-root': {color: theme.palette.primary.main},
            },
          })}
        >
          <MenuItem component={RouterLink} to="/profile">
            <ListItemIcon><AccountCircle fontSize="small"/></ListItemIcon>
            Editar perfil
          </MenuItem>
          <MenuItem component={RouterLink} to="/settings">
            <ListItemIcon><Settings fontSize="small"/></ListItemIcon>
            Configuración
          </MenuItem>
          <Divider/>
          <MenuItem component={RouterLink} to="/login">
            <ListItemIcon><Logout fontSize="small"/></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;