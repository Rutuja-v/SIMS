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
import { Link } from "@mui/material";

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

const boxstyle = {
  mt: 4,
  mb: 4,
  width: "75%",
  backgroundColor: "background.paper",
  boxShadow: 24,
};

// const center = {
//   position: "relative",
//   top: "50%",
//   left: "30%",
// };

export default function Register() {
  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const vertical = "top";
  const horizontal = "right";
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setOpen(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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
      ></Snackbar>
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
              <Box
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

                <Grid
                  container
                  spacing={1}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid item sx={{ ml: "3em", mr: "3em" }}>
                    <TextField
                      sx={{
                        mt: 1,
                      }}
                      required
                      id="email"
                      label="Username"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item sx={{ ml: "3em", mr: "3em" }}>
                    <TextField
                      required
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item sx={{ ml: "3em", mr: "3em" }}>
                    <TextField
                      required
                      name="confirmpassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmpassword"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 2,
                    }}
                  >
                    Register
                  </Button>
                  <Grid item sx={{ mt: 1, ml: "3em", mr: "3em" }}>
                    <Typography
                      variant="body1"
                      component="span"
                      style={{ marginTop: "10px" }}
                    >
                      Already have an Account?{" "}
                      <Link
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Sign In
                      </Link>
                    </Typography>
                  </Grid>

                  <Grid></Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
