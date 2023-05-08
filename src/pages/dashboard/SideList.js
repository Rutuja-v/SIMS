import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useNavigate } from "react-router-dom";
import { Context } from "../../context/ContextProvider";
import PersonIcon from "@mui/icons-material/Person";

import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import GroupIcon from "@mui/icons-material/Group";
import "./sidelist.css";
import { Avatar, Tooltip } from "@mui/material";
import { Logout } from "@mui/icons-material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideList({ children }) {
  const [user] = useContext(Context);
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const [currentUser, setCurrentUser] = useContext(Context);
  const handleLogout = () => {
    navigate("/");
    setCurrentUser(null);
    localStorage.removeItem("user");
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const links = [];
  if (user.role === "superadmin") {
    links.push(...[
      {
        label: "Godowns",
        path: "./",
        icon: <InventoryIcon style={{ color: "#171717" }} />,
      },
      {
        label: "Employees",
        path: "./employees",
        icon: <GroupIcon style={{ color: "#171717" }} />,
      },
      {
        label: "Inwards",
        path: "./inwards",
        icon: <LocalShippingIcon style={{ color: "#171717" }} />,
      },
    ]);
  }
  else {
    links.push(...[
      {
        label: "Inwards",
        path: "./",
        icon: <LocalShippingIcon style={{ color: "#171717" }} />,
      },
    ])
  }

  links.push(...[
    {
      label: "Outwards",
      path: "./outwards",
      icon: <TakeoutDiningIcon style={{ color: "#171717" }} />,
    },

    {
      label: "Returns",
      path: "./returns",
      icon: <AssignmentReturnedIcon style={{ color: "#171717" }} />,
    },

    {
      label: "Products",
      path: "./products",
      icon: <ProductionQuantityLimitsIcon style={{ color: "#171717" }} />,
    },
  ]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          style={{
            backgroundColor: "#1976d2",
            color: "white",
          }}
        >
          {!open && (
            <MenuIcon
              className="icon"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                cursor: "pointer",
                // display: open ? "none" : "block"
              }}
            />
          )}
          <Typography variant="h6" noWrap component="div">
            Smart Inventory Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon
              onClick={handleDrawerClose}
              style={{
                cursor: "pointer",
              }}
            />
          ) : (
            <ChevronLeftIcon
              onClick={handleDrawerClose}
              style={{
                cursor: "pointer",
              }}
            />
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {links.map((link, index) => (
            user.role !== "superadmin" &&
              (link.label === "Godowns" || link.label === "Employees") ? null : (
              <NavLink
                key={index}
                to={link.path}
                style={({ isActive }) => ({
                  color: isActive ? "#0a58ca" : "#171717",
                  textDecoration: "none",
                })}
              >
                <ListItem
                  disablePadding
                  sx={{
                    display: "flex",
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={link.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItem>
              </NavLink>
            )
          ))}
        </List>
        <Divider />
        <Box sx={{ mx: "auto", mt: 3, mb: 1 }}>
          <Tooltip title={currentUser?.username || ""}>
            <Avatar
              src={currentUser?.photoURL}
              {...(open && { sx: { width: 50, height: 50 } })}
            />
          </Tooltip>
        </Box>
        <Box>
          <Box sx={{ textAlign: "center" }}>
            {open && <Typography>{currentUser?.username}</Typography>}
            <Typography variant="body2">
              {currentUser?.role || "role"}
            </Typography>
            {open && (
              <Typography variant="body2">{currentUser?.email}</Typography>
            )}
            <Tooltip title="Logout" sx={{ mt: 1 }}>
              <IconButton style={{ color: "#171717" }} onClick={handleLogout}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
