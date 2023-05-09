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

function UpdateGodown({ godown, managers, roles, handleClose }) {
  const classes = useStyles();

  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");
  const [managerId, setManagerId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerUsername, setManagerUsername] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [managerRoleId, setManagerRoleId] = useState("");

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
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  const handleManagerIdChange = (event) => {
    setManagerId(event.target.value);
  };
  const handleManagerNameChange = (event) => {
    setManagerName(event.target.value);
  };
  const handleManagerUsernameChange = (event) => {
    setManagerUsername(event.target.value);
  };
  const handleManagerPasswordChange = (event) => {
    setManagerPassword(event.target.value);
  };
  const handleManagerRoleIdChange = (event) => {
    setManagerRoleId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formData = {};
    formData["location"] = location;
    formData["capacityInQuintals"] = capacity;
    if (managerId != -1) {
      formData["manager"] = {
        id: Number(managerId),
      };
    }
    else {
      formData["manager"] = {
        name: managerName,
        username: managerUsername,
        password: managerPassword,
        role: {
          id: Number(managerRoleId)
        },
      };
    }

    const dateObj = new Date(date);
    const formattedDate = moment(dateObj).format("DD/MM/YYYY");
    formData["startDate"] = formattedDate;

    console.log(formData);

    await axios
      .put(`http://localhost:8080/api/godowns/${godown?.id}`, formData)
      .then((response) => {

      })
      .catch((error) => {
        console.error(error);
      });

    setLocation("");
    setCapacity("");
    setDate("");
    setManagerId("");
    setManagerName("");
    setManagerUsername("");
    setManagerPassword("");
    setManagerRoleId("");
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
                  inputProps={{min:1}}
                  variant="outlined"
                  value={capacity}
                  onChange={handleCapacityChange}
                />
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
                    <MenuItem key={0} value={-1}>
                      Add new manager
                    </MenuItem>
                    {managers.map((manager, index) => (
                      <MenuItem key={index + 1} value={manager.id}>
                        {manager.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {managerId == -1 && (
                  <>
                    <TextField
                      id="managerName"
                      label="Manager name"
                      type="text"
                      variant="outlined"
                      value={managerName}
                      onChange={handleManagerNameChange}
                    />
                    <TextField
                      id="managerUsername"
                      label="Manager username"
                      type="text"
                      variant="outlined"
                      value={managerUsername}
                      onChange={handleManagerUsernameChange}
                    />
                    <TextField
                      id="managerPassword"
                      label="Manager Password"
                      type="text"
                      variant="outlined"
                      value={managerPassword}
                      onChange={handleManagerPasswordChange}
                    />
                    <FormControl>
                      <InputLabel id="managerRoleIdLabel">Manager role</InputLabel>
                      <Select
                        labelId="managerRoleIdLabel"
                        id="managerRoleId"
                        defaultValue={godown?.manager.role.id}
                        value={managerRoleId}
                        label="Manager role"
                        onChange={handleManagerRoleIdChange}
                      >
                        {roles.map((role, index) => (
                          <MenuItem key={index} value={role.id}>
                            {role.role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}
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
