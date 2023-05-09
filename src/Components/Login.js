import axios from "axios";
import signin from "./assets/signin.svg";
import stock from "./assets/stock.jpeg";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useContext, useState } from "react";

import { Alert, AlertTitle, Button } from "@mui/material";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import Snackbar from "@mui/material/Snackbar";

import Slide from "@mui/material/Slide";

import { makeStyles } from "@material-ui/core/styles";

import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/ContextProvider";

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
  const [alert, setalert] = useState(0);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [open, setOpen] = useState(false);
  const vertical = "top";
  const horizontal = "right";

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/api/auth/login", {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        const loginUser = {
          name: res.data.name,
          username: res.data.username,
          role: res.data.role.role,
          godown: res.data.godown,
        };
        setUser(loginUser);
        localStorage.setItem("user", JSON.stringify(loginUser));
        navigate("/");
      })
      .catch((err) => setOpen(true));
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
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={TransitionLeft}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          severity="error"
          TransitionComponent={TransitionLeft}
          sx={{ width: "100%" }}
        >
          Failed! Enter correct username and password.
        </Alert>
      </Snackbar>
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
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  backgroundSize: "cover",
                  backgroundColor: "#339999",
                  padding: "48px 48px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
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
                      Sign in
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
                </ThemeProvider>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                  }}
                >
                  Sign in
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
