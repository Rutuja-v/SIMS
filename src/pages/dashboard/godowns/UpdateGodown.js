import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";
import * as Yup from "yup";

import { Formik, Form } from "formik";
import moment from "moment";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const validationSchema = Yup.object().shape({
  location: Yup.string().required("Location is required"),
  manager: Yup.number()
    .required("Manager ID is required")
    .positive("Manager ID must be positive"),
});
const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
  successButton: {
    borderRadius: "30px",
    padding: "12px 24px",
    backgroundColor: "	#4169e1",
    color: "#fff",

    "&:hover": {
      backgroundColor: " #198754",
    },
  },
  actionButton: {
    color: "#fff",
    backgroundColor: "#198754",

    "&:hover": {
      backgroundColor: " #4169e1",
    },
  },
}));

function UpdateGodown({ godown, managers, handleClose }) {
  const classes = useStyles();

  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [managerId, setManagerId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setLocation(godown?.location);
    setCapacity(godown?.capacityInQuintals);
    setManagerId(godown?.manager.id);

    const formattedDate = moment(godown?.startDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    setDate(formattedDate);
  }, [godown]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };
  const handleManagerIdChange = (event) => {
    setManagerId(event.target.value);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formData = {};
    formData["location"] = location;
    formData["capacityInQuintals"] = capacity;
    formData["manager"] = {
      id: Number(managerId),
    };

    const dateObj = new Date(date);
    const formattedDate = moment(dateObj).format("DD/MM/YYYY");
    formData["startDate"] = formattedDate;

    console.log(formData);

    await axios
      .put(`http://localhost:8080/api/godowns/${godown?.id}`, formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    setLocation("");
    setCapacity("");
    setManagerId("");
    setDate("");
    handleClose();
  };

  return (
    <Dialog
      open={godown != null}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className={classes.customTitle}>
        Edit godown
      </DialogTitle>
      <DialogContent>
        <Formik
          // initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <Form>
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
                  autoFocus
                  id="location"
                  label="Location"
                  type="text"
                  variant="outlined"
                  value={location}
                  onChange={handleLocationChange}
                />
                <TextField
                  id="capacity"
                  label="Capacity"
                  type="number"
                  variant="outlined"
                  value={capacity}
                  onChange={handleCapacityChange}
                />
                <FormControl>
                  <InputLabel id="managerIdLabel">Manager</InputLabel>
                  <Select
                    labelId="managerIdLabel"
                    id="managerId"
                    defaultValue={godown?.manager.id}
                    value={managerId}
                    label="Manager"
                    onChange={handleManagerIdChange}
                  >
                    {managers.map((manager, index) => (
                      <MenuItem key={index} value={manager.id}>
                        {manager.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  id="date"
                  label="Date"
                  type="date"
                  variant="outlined"
                  value={date}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Edit
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateGodown;
