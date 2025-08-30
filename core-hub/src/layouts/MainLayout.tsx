import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { type Theme } from '@mui/material';
import DrawerContent from '../components/DrawerContent/DrawerContent';
import Navbar from "../components/Navbar/Navbar.tsx";

const drawerWidth = 260;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  return (
    <Box sx={{display: 'flex', minHeight: '100vh'}}>
      <CssBaseline/>

      <Navbar
        showBurger={!isDesktop}
        onBurgerClick={() => setMobileOpen((v) => !v)}
        userName="Tomás Álvarez"
        avatarSrc="/avatar.png"
      />

      <Box component="nav" sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}} aria-label="sidebar navigation">
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{keepMounted: true}}
          sx={{
            display: {xs: 'block', md: 'none'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
          }}
        >
          <DrawerContent onNavigate={() => setMobileOpen(false)}/>
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: {xs: 'none', md: 'block'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
          }}
          open
        >
          <DrawerContent/>
        </Drawer>
      </Box>

      <Box component="main" sx={{flexGrow: 1, width: {md: `calc(100% - ${drawerWidth}px)`}}}>
        <Toolbar/>
        <Container
          maxWidth={false}          // 👈 IMPORTANTE: boolean, no string
          disableGutters            // opcional: sin gutters del Container
          sx={{py: 3, px: {xs: 2, md: 3}}} // agregás padding manual
        >
          <Outlet/>
        </Container>
      </Box>
    </Box>
  );
}
