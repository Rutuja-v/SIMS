import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import signin from "./assets/signin.svg";
import stock from "./assets/stock.jpeg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuItem, InputLabel, Select, FormControl, Link } from "@mui/material";
import { useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

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

export default function ForgotPassword() {
  const [answer, setAnswer] = useState("");
  const [question2, setQuestion2] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [open, setOpen] = useState(false);

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
          // color: "#f5f5f5",
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
                  height: "70vh",
                  minHeight: "500px",
                  backgroundColor: "#E8E8E8",
                }}
              >
                {/* <ThemeProvider theme={darkTheme}> */}
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
                    Reset Password
                  </Typography>
                </Box>

                <Grid
                  container
                  spacing={1}
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid item sx={{ ml: "3em", mr: "3em" }}>
                    <FormControl fullWidth>
                      <InputLabel id="questionLabel">Question</InputLabel>
                      <Select
                        labelId="questionLabel"
                        id="question"
                        label="Question"
                      >
                        <MenuItem value={1}>
                          What is the name of the place you were born at?
                        </MenuItem>
                        <MenuItem value={2}>
                          What is the first school you attended?
                        </MenuItem>
                        <MenuItem value={3}>
                          What is your favourite food item?
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      sx={{ mt: 2 }}
                      required
                      fullWidth
                      id="answer"
                      label="Answer"
                      name="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 3,
                    }}
                  >
                    Reset Password
                  </Button>
                  <Link
                    style={{ cursor: "pointer" }}
                    sx={{ mt: 1 }}
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Go back
                  </Link>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
