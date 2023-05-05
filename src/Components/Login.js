import stock from "./assets/stock.jpeg";
import signin from "./assets/signin.svg";
import axios from "axios";

import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Snackbar from "@mui/material/Snackbar";

import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/ContextProvider";

const useStyles = makeStyles({
  container: {
    overflow: "hidden",
    position: "relative",
    height: "30px",
  },
  scrollingText: {
    color: "#fff",
    position: "absolute",
    whiteSpace: "nowrap",
    animation: "$scroll 10s linear infinite",
  },
  "@keyframes scroll": {
    "0%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(-100%)" },
  },
});
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const boxstyle = {
  mt: 4,
  mb: 4,
  width: "75%",
  backgroundColor: "background.paper",
  boxShadow: 24,
};

export default function Login() {
  const [user, setUser] = useContext(Context);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState();
  const classes = useStyles();
  const [values, setValues] = useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const vertical = "top";
  const horizontal = "right";
  //   const navigate = useNavigate();

  //   const handleSubmit = async (event) => {
  //     setOpen(true);
  //     event.preventDefault();
  //     const data = new FormData(event.currentTarget);
  //   };
  const handleSubmit = (e) => {
    e.preventDefault();

    //     console.log(values.username, values. password);
    //     history("/dashboard");
    //   };
    axios
      .post("http://localhost:8080/api/auth/login", {
        username: values.username,
        password: values.password,
      })

      .then((res) => {
        localStorage.setItem("token", res.data.token);
        const loginUser = {
          name: res.data.name,
          email: res.data.username,
          role: res.data.role.role,
        };
        setUser(loginUser);
        localStorage.setItem("user", JSON.stringify(loginUser));
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  return (
    <>
      {/* <div className={classes.container}>
      <Typography   style={{
          backgroundImage: `url(${stock})`,
       
        }}
        variant="subtitle1"
        className={classes.scrollingText}
      >
      Smart Inventory Management System 
      </Typography>
    </div> */}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={TransitionLeft}
        anchorOrigin={{ vertical, horizontal }}
      ></Snackbar>
      <div
        style={{
          backgroundImage: `url(${stock})`,
          backgroundSize: "cover",
          height: "100%",
          minHeight: "100vh",
          color: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <marquee direction="left" width="30px" height="50px">
          {" "}
          <div style={{ marginTop: "-500px", position: "absolute" }}>
            welcome
          </div>{" "}
        </marquee>
        <Box sx={boxstyle}>
          <Grid
            container
            style={{
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              lg={6}
              style={{
                backgroundImage: `url(${signin})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#f5f5f5",
              }}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={12}
              lg={6}
              style={{
                backgroundSize: "cover",
                backgroundColor: "#339999",
                padding: "48px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemeProvider theme={darkTheme}>
                <Typography style={{ textAlign: "center" }} variant="h5">
                  Smart Inventory Management System
                </Typography>

                <Box
                  style={{
                    marginTop: "32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#ffffff" }}></Avatar>
                  <Typography component="h1" variant="h6">
                    Sign In
                  </Typography>
                </Box>

                <TextField
                  sx={{
                    mt: 2,
                    width: "75%",
                  }}
                  required
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  onChange={(e) =>
                    setValues({ ...values, username: e.target.value })
                  }
                />

                <TextField
                  sx={{
                    mt: 2,
                    width: "75%",
                  }}
                  required
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="password"
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    backgroundColor: "#1976d2",
                    color: "#FFFFFF",
                    borderRadius: 24,
                  }}
                  onClick={handleSubmit}
                >
                  Sign in
                </Button>
              </ThemeProvider>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
