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
import { MenuItem,InputLabel,Select,
FormControl } from "@mui/material";
import { useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";

import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

// const Alert = forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

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

// const center = {
//   position: "relative",
//   top: "50%",
//   left: "30%",
// };

export default function ForgotPassword() {
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
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
      >
       
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
          <Grid container
            style={{
              display: "flex",
              alignItems: "stretch",
            }}
          >
          
            <Grid item xs={12} sm={12} lg={6}
            
                style={{
                backgroundImage: `url(${signin})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#f5f5f5",
                }}
              >
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <Box
                style={{
                  backgroundSize: "cover",
                  height: "70vh",
                  minHeight: "500px",
                  backgroundColor: "#339999",
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
                      <Avatar
                        sx={{ bgcolor: "#ffffff" }}
                      >
                        <LockOutlinedIcon />
                      </Avatar>
                      <Typography component="h1" variant="h6">
                        Reset Password
                      </Typography>
                    </Box>
                    {/* <Box
                      component="form"
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 2 }}
                    >
        
                          <TextField
                           sx={{
                            mt: 2,
                            width: "75%",
                          }}
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                          />
                          </Box> */}
                           <FormControl fullWidth>
          <InputLabel id="question1-label">Question 1</InputLabel>
          <Select
            labelId="question1-label"
            id="question1"
            value={question1}
            onChange={(e) => setQuestion1(e.target.value)}
          >
            <MenuItem value="q1-option1">Question 1 Option 1</MenuItem>
            <MenuItem value="q1-option2">Question 1 Option 2</MenuItem>
            <MenuItem value="q1-option3">Question 1 Option 3</MenuItem>
          </Select>
        </FormControl>
                           {/* <TextField
          sx={{
            mt: 2,
            width: '75%',
          }}
          required
          fullWidth
          id="Answer"
          label="Answer "
          value={Answer}
          onChange={(e) => setQuestion1(e.target.value)}
        /> */}
        {/* <TextField
          sx={{
            mt: 2,
            width: '75%',
          }}
          required
          fullWidth
          id="question2"
          label="Question 2"
          value={question2}
          onChange={(e) => setQuestion2(e.target.value)}
        /> */}
                     </ThemeProvider>  
                      <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                  }}
                >
                  Send resend link
                </Button>
                        {/* <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                          <Stack direction="row" spacing={2}>
                            <Typography
                              variant="body1"
                              component="span"
                              style={{ marginTop: "10px" }}
                            >
                              Login to your Account.
                              <span
                                style={{ color: "#beb4fb", cursor: "pointer" }}
                                onClick={() => {
                                  navigate("/");
                                }}
                              >
                                {" "}Sign In
                              </span>
                            </Typography>
                          </Stack>
                        </Grid> */}
                     
                    

                   
                     </Box>
            </Grid>
           
         </Grid>
      
      </Box>
      </div>
    </>
  );
}
