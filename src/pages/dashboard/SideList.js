import React, { useState, useContext, useEffect } from "react";
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
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useNavigate } from "react-router-dom";
import { Context } from "../../context/ContextProvider";

import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import GroupIcon from "@mui/icons-material/Group";

import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip } from "@mui/material";
import { Logout } from "@mui/icons-material";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { Form, Formik, useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core";
import Notification from "../../Components/Notification";
const drawerWidth = 200;

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

const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

export default function SideList({ children }) {
  const [user] = useContext(Context);
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const [currentUser, setCurrentUser] = useContext(Context);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
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
    ]);
  }
  else {
    links.push(...[
      {
        label: "Stock",
        path: "./",
        icon: <InventoryIcon style={{ color: "#171717" }} />,
      },
    ])
  }

  links.push(...[
    {
      label: "Inwards",
      path: "./inwards",
      icon: <LocalShippingIcon style={{ color: "#171717" }} />,
    },
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
    {
      label: "Analytics",
      path: "./analytics",
      icon: <AnalyticsIcon style={{ color: "#171717" }} />,
    },
  ]);

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().required("New password is required"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: null,
      newPassword: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm, setFieldError }) => {
      let formData = {};

      formData["currentPassword"] = values.currentPassword;
      formData["newPassword"] = values.newPassword;

      console.log(formData);

      axios
        .patch(`http://localhost:8080/api/employees/${user?.id}/password`, formData)
        .then((response) => {
          resetForm();
          setChangePasswordModalOpen(false);
          setNotify({
            isOpen: true,
            message: "Password changed successfully",
            type: "success",
          });
          handleLogout();
        })
        .catch((error) => {
          console.error(error);
          if (error.response.data.code === "WRONG_PASSWORD") {
            setFieldError("currentPassword", "Entered password is wrong");
          }
          setNotify({
            isOpen: true,
            message: "Password change failed",
            type: "error",
          });
        });
    },
  });

  useEffect(() => {
    if (!changePasswordModalOpen) {
      formik.resetForm();
    }
  }, [changePasswordModalOpen]);

  function toSentenceCase(str) {
    if (str === undefined || str === null) {
      return;
    }
    if (str.length === 1) {
      return str.toUpperCase();
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <>
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
            {/* <IconButton sx={{ display: { xs: 'flex', md: 'none' } }}
            
            >
              <HomeIcon style={{color:"#000000"}}/>
            </IconButton> */}

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Box sx={{ mx: "auto", mt: 1, mb: 1 }}>
            <Tooltip title={currentUser?.name}>
              <Avatar
                {...(open && { sx: { width: 50, height: 50 } })}
              />
            </Tooltip>
          </Box>
          <Box>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon
                onClick={handleDrawerClose}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "8px",
                  cursor: "pointer",
                }}
              />
            ) : (
              <ChevronLeftIcon
                onClick={handleDrawerClose}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "8px",
                  cursor: "pointer",
                }}
              />
            )}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              {open && <Typography>{currentUser?.name}</Typography>}
              {open && <Typography variant="caption" color="textSecondary">{"Username: " + currentUser?.username}</Typography>}
              {open && <Typography variant="caption" color="textSecondary">
                {"Role: " + toSentenceCase(currentUser?.role)}
              </Typography>}
              {open && currentUser?.godown && <Typography variant="caption" color="textSecondary">{"Location: " + currentUser?.godown.location}</Typography>}
              <Button sx={{ mt: open ? 1 : 2, mb: 1 }} variant={open ? "contained" : null} size="small" onClick={handleLogout}>
                <Logout />
                {open && <Typography sx={{ ml: 1 }} variant="caption">
                  Logout
                </Typography>}
              </Button>
              {open && <Button style={{ textTransform: "capitalize", marginBottom: "16px" }} variant="outlined" size="small" onClick={() => setChangePasswordModalOpen(true)}>
                Change password
              </Button>}
            </Box>
          </Box>
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
        </Drawer >
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box >

      <Dialog
        open={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Change password
        </DialogTitle>
        <DialogContent>
          <Formik>
            {(formikProps) => (
              <Form onSubmit={formik.handleSubmit}>
                <div
                  style={{
                    marginTop: "32px",
                    marginBottom: "16px",
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    columnGap: "16px",
                    rowGap: "24px",
                  }}
                >
                  <TextField
                    id="currentPassword"
                    label="Current password"
                    type="password"
                    variant="outlined"
                    {...formik.getFieldProps("currentPassword")}
                    error={
                      formik.touched.currentPassword && formik.errors.currentPassword ? true : false
                    }
                    helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                  />
                  <TextField
                    id="newPassword"
                    label="New password"
                    type="password"
                    variant="outlined"
                    {...formik.getFieldProps("newPassword")}
                    error={
                      formik.touched.newPassword && formik.errors.newPassword
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.newPassword && formik.errors.newPassword
                    }
                  />
                </div>

                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={() => setChangePasswordModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
}
