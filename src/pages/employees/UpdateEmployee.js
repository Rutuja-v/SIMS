import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";
import * as Yup from "yup";

import { Formik, Form } from "formik";

export const validationSchema = Yup.object().shape({});

const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

function UpdateEmployee({ employee, roles, godowns, handleClose }) {
  const classes = useStyles();

  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [godownId, setGodownId] = useState(null);

  useEffect(() => {
    setName(employee?.name);
    setUsername(employee?.username);
    setRoleId(employee?.role.id);
    setGodownId(employee?.godown === null ? -1 : employee?.godown?.id);
  }, [employee]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleRoleIdChange = (event) => {
    setRoleId(event.target.value);
  };
  const handleGodownIdChange = (event) => {
    setGodownId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formData = {};
    formData["name"] = name;
    formData["username"] = username;
    if (password != null) {
      formData["password"] = password;
    }
    formData["role"] = {
      id: roleId,
    };
    if (godownId !== -1) {
      formData["godown"] = {
        id: Number(godownId),
      };
    }

    console.log(formData);

    await axios
      .put(`http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employees/${employee?.id}`, formData)
      .then((response) => {
        setName(null);
        setUsername(null);
        setPassword(null);
        setRoleId(null);
        setGodownId(null);
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Dialog
      open={employee != null}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className={classes.customTitle}>
        Edit employee
      </DialogTitle>
      <DialogContent>
        <Formik validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                  id="name"
                  label="Name"
                  type="text"
                  variant="outlined"
                  value={name}
                  onChange={handleNameChange}
                />
                <TextField
                  id="username"
                  label="Username"
                  type="text"
                  variant="outlined"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <TextField
                  id="password"
                  label="Password (optional)"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {employee?.role.role !== "superadmin" && (
                  <FormControl>
                    <InputLabel id="roleIdLabel">Role</InputLabel>
                    <Select
                      labelId="roleIdLabel"
                      id="roleId"
                      defaultValue={employee?.role.id}
                      value={roleId}
                      label="Role"
                      onChange={handleRoleIdChange}
                    >
                      {roles
                        .filter((role) => role.role !== "superadmin")
                        .map((role, index) => (
                          <MenuItem key={index} value={role.id}>
                            {role.role}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
                {employee?.role.role !== "superadmin" && (
                  <FormControl>
                    <InputLabel id="godownIdLabel">Godown</InputLabel>
                    <Select
                      labelId="godownIdLabel"
                      id="godownId"
                      defaultValue={
                        employee?.godown == null ? -1 : employee?.godown.id
                      }
                      value={godownId}
                      label="Godown"
                      onChange={handleGodownIdChange}
                    >
                      <MenuItem key={0} value={-1}>
                        None
                      </MenuItem>
                      {godowns.map((godown, index) => (
                        <MenuItem key={index + 1} value={godown.id}>
                          {godown.location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateEmployee;
