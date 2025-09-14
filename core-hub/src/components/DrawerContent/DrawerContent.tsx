import * as React from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Logout from '@mui/icons-material/Logout'
import { Avatar } from "@mui/material";
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import PlaylistAddCheckOutlined from '@mui/icons-material/PlaylistAddCheckOutlined'
import SubscriptionsOutlined from '@mui/icons-material/SubscriptionsOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import ReplayOutlined from '@mui/icons-material/ReplayOutlined'
import HealthAndSafetyOutlined from '@mui/icons-material/HealthAndSafetyOutlined'
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom'
import { alpha } from '@mui/material/styles'

type NavItem = {
  label: string
  path: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlined/>},
  {label: 'My Queues', path: '/my-queues', icon: <PlaylistAddCheckOutlined/>},
  {label: 'My Subscriptions', path: '/my-subscriptions', icon: <SubscriptionsOutlined/>},
  {label: 'Search', path: '/search', icon: <SearchOutlined/>},
  {label: 'Replay', path: '/replay', icon: <ReplayOutlined/>},
  {label: 'Health', path: '/health', icon: <HealthAndSafetyOutlined/>},
]

function DrawerContent({onNavigate}: { onNavigate?: () => void }) {
  return (
    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Toolbar sx={{px: 2}}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          onClick={onNavigate}
          style={{textDecoration: 'none', color: 'inherit'}}
        >
          CoreHub
        </Typography>
      </Toolbar>
      <Divider/>

      <List sx={{px: 1, py: 1}}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{mb: 0.5}}>
            <ListItemButton
              component={RouterNavLink}
              to={item.path}
              onClick={onNavigate}
              sx={(theme) => ({
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&.active': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.16),
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              })}
            >
              <ListItemIcon sx={{minWidth: 40}}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{flexGrow: 1}}/>
      <Divider/>
      <Box sx={{p: 2}}>
        <ListItem disableGutters sx={{px: 0}}>
          <ListItemAvatar>
            <Avatar alt="Tomás Álvarez" src="/avatar.png"/>
          </ListItemAvatar>
          <ListItemText primary="Tomás Álvarez" secondary="Admin"/>
        </ListItem>
        <Box sx={{display: 'flex', gap: 1, mt: 1}}>
          <IconButton
            component={RouterLink}
            to="/login"
            color="inherit"
            sx={(theme) => ({
              flexGrow: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              fontSize: "1rem",
              '&:hover': {
                color: theme.palette.primary.main,
              },
            })}
          >
            <Logout
              sx={{mr: 1}}
            /> Logout
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default DrawerContent;