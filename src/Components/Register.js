import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import signin from "./assets/signin.svg";
import stock from "./assets/stock.jpeg";
import Button from "@mui/material/Button";

import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";

import axios from "axios";

import React, { useContext, useState } from "react";

import Typography from "@mui/material/Typography";

import Snackbar from "@mui/material/Snackbar";

import Slide from "@mui/material/Slide";

import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Alert, Link } from "@mui/material";

const boxstyle = {
  mt: 4,
  mb: 4,
  width: "75%",
  backgroundColor: "background.paper",
  boxShadow: 24,
};

export default function Register() {
  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const vertical = "top";
  const horizontal = "right";
  const navigate = useNavigate();

  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const [usernameErrorText, setUsernameErrorText] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {};

    formData["name"] = name;
    formData["username"] = username;
    formData["password"] = password;

    console.log(formData);

    axios
      .post("http://localhost:8080/api/auth/signUp", formData)
      .then((response) => {
        setOpen(true);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.code === "UNIQUE_CONSTRAINT_VIOLATION") {
          setUsernameErrorText("This username already exists");
        }
      });
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleUsernameChange = (event) => {
    if (usernameErrorText !== null) {
      setUsernameErrorText(null);
    }
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
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
          severity="success"
          TransitionComponent={TransitionLeft}
          sx={{ width: "100%" }}
        >
          Your account has been created. Please wait until the superadmin
          approves your account.
        </Alert>
      </Snackbar>
      <div
        style={{
          backgroundImage: `url(${stock})`,
          backgroundSize: "cover",
          height: "100%",
          minHeight: "100vh",
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

            <Grid item xs={12} sm={12} lg={6}>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundSize: "cover",
                  padding: "48px 48px",
                  backgroundColor: "#E8E8E8",
                }}
              >
                <Typography style={{ textAlign: "center" }} variant="h5">
                  Smart Inventory Management System
                </Typography>

                <Box
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#000000" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h6">
                    Create Account
                  </Typography>
                </Box>

                <TextField
                  sx={{
                    mt: 2,
                    width: "75%",
                  }}
                  required
                  id="name"
                  label="Name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={handleNameChange}
                />
                <TextField
                  sx={{
                    mt: 2,
                    width: "75%",
                  }}
                  required
                  name="username"
                  label="Username"
                  type="text"
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={handleUsernameChange}
                  error={usernameErrorText !== null}
                  helperText={usernameErrorText}
                />
                <TextField
                  sx={{
                    mt: 2,
                    width: "75%",
                  }}
                  required
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                  }}
                >
                  Register
                </Button>
                <Typography
                  variant="body1"
                  component="span"
                  style={{ marginTop: "10px" }}
                >
                  Already have an account?{" "}
                  <Link
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </form>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
