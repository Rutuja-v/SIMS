import axios from "axios";
import signin from "./assets/signin.svg";
import stock from "./assets/stock.jpeg";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useContext, useState } from "react";

import { Alert, Button, Link } from "@mui/material";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import Snackbar from "@mui/material/Snackbar";

import Slide from "@mui/material/Slide";

import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/ContextProvider";
import Notification from "./Notification";

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
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [usernameErrorText, setUsernameErrorText] = useState(null);
  const [passwordErrorText, setPasswordErrorText] = useState(null);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [open, setOpen] = useState(false);
  const vertical = "top";
  const horizontal = "right";

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://ec2-100-26-21-150.compute-1.amazonaws.com/api/auth/login", {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        const loginUser = {
          id: res.data.id,
          name: res.data.name,
          username: res.data.username,
          role: res.data.role.role,
          godown: res.data.godown,
        };
        setUser(loginUser);
        localStorage.setItem("user", JSON.stringify(loginUser));
        navigate("/");
      })
      .catch((error) => {
        if (error.response.data.code === "INVALID_USERNAME") {
          setUsernameErrorText("This username does not exist");
        } else if (error.response.data.code === "WRONG_PASSWORD") {
          setPasswordErrorText("The entered password is wrong");
        } else if (error.response.data.code === "ACCOUNT_LOCKED") {
          setOpen(true);
        }
      });
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
          Oops! Your account is locked. Please contact the superadmin.
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
                  backgroundSize: "cover",
                  backgroundColor: "#E8E8E8",
                  padding: "48px 48px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
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
                  <Avatar sx={{ bgcolor: "#000000" }}></Avatar>
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
                  onChange={(e) => {
                    if (usernameErrorText !== null) {
                      setUsernameErrorText(null);
                    }
                    setValues({ ...values, username: e.target.value });
                  }}
                  error={usernameErrorText !== null}
                  helperText={usernameErrorText}
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
                  onChange={(e) => {
                    if (passwordErrorText !== null) {
                      setPasswordErrorText(null);
                    }
                    setValues({ ...values, password: e.target.value });
                  }}
                  error={passwordErrorText !== null}
                  helperText={passwordErrorText}
                />

                <Link
                  onClick={() => {
                    navigate("/reset-password");
                  }}
                  style={{ marginTop: "16px", cursor: "pointer" }}
                >
                  Forgot password?
                </Link>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                  }}
                >
                  Sign in
                </Button>
                <Typography
                  variant="body1"
                  component="span"
                  style={{ marginTop: "20px" }}
                >
                  Not registered yet?{" "}
                  <Link
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Create an Account
                  </Link>
                </Typography>
              </form>
            </Grid>
          </Grid>
        </Box>
      </div>

      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
}






export { Login as LoginTest }


