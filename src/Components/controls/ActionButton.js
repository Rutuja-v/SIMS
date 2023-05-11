import React from "react";
import { makeStyles } from "@material-ui/core";
import { Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 0,
    margin: theme.spacing(0.5),
  },
  // secondary: {
  //     backgroundColor: theme.palette.secondary.light,
  //     '& .MuiButton-label': {
  //         color:
  //     }
  // },
  // primary: {
  //     // backgroundColor: theme.palette.primary.light,
  //     '& .MuiButton-label': {
  //         color: '#4BB543'
  //     }
  // },
}));

export default function ActionButton(props) {
  const { color, children, onClick } = props;
  const classes = useStyles();

  return (
    <Button className={`${classes.root} `} onClick={onClick}>
      {children}
    </Button>
  );
}
