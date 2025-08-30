import { useContext, useState } from "react";
import { Link as RouterLink, Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import ListItemIcon from '@mui/material/ListItemIcon'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Logout from '@mui/icons-material/Logout'
import Settings from '@mui/icons-material/Settings'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { Avatar, Menu, MenuItem, type Theme } from "@mui/material";
import { ColorModeContext } from "../theme/ColorModeProvider"

import DrawerContent from "../components/DrawerContent/DrawerContent.tsx";

const drawerWidth = 260

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const theme = useTheme()
  const {mode, toggleColorMode} = useContext(ColorModeContext)

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)
  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  return (
    <Box sx={{display: 'flex', minHeight: '100vh'}}>
      <CssBaseline/>

      <AppBar position="fixed" elevation={1} sx={{zIndex: (t) => t.zIndex.drawer + 1}}>
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{mr: 1}}
              aria-label="open navigation menu"
            >
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

          <Box sx={{flexGrow: 1}}/>

          <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>

            <Tooltip title={mode === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro'}>
              <IconButton
                color="inherit"
                onClick={toggleColorMode}
                aria-label="toggle color mode"
                sx={{
                  border: "none",
                  outline: "none",
                  '&:focus': {outline: 'none'},
                  '&:focus-visible': {outline: 'none'},
                  '&:hover': {backgroundColor: 'transparent'},
                }}
              >
                {theme.palette.mode === 'dark'
                  ? <LightModeIcon/>
                  : <DarkModeIcon/>}
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={handleOpenMenu}
              size="small"
              sx={{
                '&:focus': {outline: 'none', border: "none"},
                '&:focus-visible': {outline: 'none', border: "none"},
                p: 0.5,
              }}
              aria-label="user menu"
            >
              <Avatar alt="Tomás Álvarez" src="/avatar.png"/>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleCloseMenu}
              onClick={handleCloseMenu}
              transformOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              sx={(theme) => ({
                '& .MuiMenuItem-root:hover': {
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              })}
            >
              <MenuItem component={RouterLink} to="/profile">
                <ListItemIcon>
                  <AccountCircle fontSize="small"/>
                </ListItemIcon>
                Editar perfil
              </MenuItem>

              <MenuItem component={RouterLink} to="/settings">
                <ListItemIcon>
                  <Settings fontSize="small"/>
                </ListItemIcon>
                Configuración
              </MenuItem>
              <Divider/>
              <MenuItem component={RouterLink} to="/login">
                <ListItemIcon>
                  <Logout fontSize="small"/>
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}} aria-label="sidebar navigation">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{keepMounted: true}}
          sx={{display: {xs: 'block', md: 'none'}, '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}}}
        >
          <DrawerContent onNavigate={handleDrawerToggle}/>
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{display: {xs: 'none', md: 'block'}, '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}}}
          open
        >
          <DrawerContent/>
        </Drawer>
      </Box>

      <Box component="main" sx={{flexGrow: 1, width: {md: `calc(100% - ${drawerWidth}px)`}}}>
        <Toolbar/>
        <Container sx={{py: 3}}>
          <Outlet/>
        </Container>
      </Box>
    </Box>
  )
}