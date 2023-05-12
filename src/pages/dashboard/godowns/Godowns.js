import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from "formik";
import moment from "moment";
import Notification from "../../../Components/Notification";
import UpdateGodown from "./UpdateGodown";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const initialValues = {
  id: "",
  location: "",
  managerId: "",
  capacity: "",
  date: "",
};

const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

function formatDate(date) {
  // Extract the year, month, and day values from the Date object
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  // Convert the month and day to double digits if necessary
  month = month.toString().padStart(2, "0");
  day = day.toString().padStart(2, "0");

  // Format the date string
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}

function Godowns() {
  const classes = useStyles();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(null);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [godowns, setGodowns] = useState([]);
  const [managers, setManagers] = useState([]);
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    axios
      .get("http://localhost:8080/api/godowns")
      .then((response) => {
        response.data.sort((g1, g2) => {
          if (g1.location < g2.location) {
            return -1;
          } else if (g1.location > g2.location) {
            return 1;
          }

          return 0;
        });
        setGodowns(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:8080/api/employees")
      .then((response) => {
        setManagers(
          response.data.filter((employee) => employee.role.role === "manager")
        );
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:8080/api/employeeRoles")
      .then((response) => {
        setRoles(response.data.filter((role) => role.role === "manager"));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleClickAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleClickEditModalOpen = (godown) => {
    setEditModalOpen(godown);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(null);
    getData();
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/godowns/${id}`)
      .then((response) => {
        setNotify({
          isOpen: true,
          message: "Godown deleted Successfully",
          type: "success",
        });
        setGodowns(godowns.filter((user) => user.id !== id));
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Oops! An error occurred while performing this operation.",
          type: "error",
        });
        console.error(error);
      });
  };

  const handleClickSeeStock = (godown) => {
    navigate(`/godown/${godown.id}/stock`, { state: godown });
  };

  const validationSchema = Yup.object().shape({
    location: Yup.string().required("Location is required"),
    capacity: Yup.number()
      .typeError("Capacity must be a number")
      .required("Capacity is required")
      .min(1, "Capacity must be at least 1"),

    startDate: Yup.date().required("Date is required"),
    managerName: Yup.string().required("Manager Name is required"),
    managerUsername: Yup.string().required("This field is required"),
    managerRoleId: Yup.number().required("This field is required"),
  });
  const formik = useFormik({
    initialValues: {
      location: null,
      capacity: null,
      startDate: null,
      managerName: null,
      managerUsername: null,
      managerRoleId: null,
    },
    validationSchema: validationSchema,

    onSubmit: (values, { resetForm }) => {
      let formData = {};
      formData["location"] = values.location;
      formData["capacityInQuintals"] = values.capacity;
      formData["manager"] = {
        name: values.managerName,
        username: values.managerUsername,
        role: {
          id: values.managerRoleId,
        },
        isLocked: false,
      };

      const startDateObj = new Date(values.startDate);
      const formattedDate = moment(startDateObj).format("DD/MM/YYYY");
      formData["startDate"] = formattedDate;

      console.log(formData);

      axios
        .post("http://localhost:8080/api/godowns", formData)
        .then((response) => {
          resetForm();
          setAddModalOpen(false);

          setNotify({
            isOpen: true,
            message: "Godown added Successfully",
            type: "success",
          });
          getData();
        })
        .catch((error) => {
          setNotify({
            isOpen: true,
            message: "Oops! An error occurred while performing this operation.",
            type: "error",
          });
          console.error(error);
        });
    },
  });
  useEffect(() => {
    if (!addModalOpen) {
      formik.resetForm();
    }
  }, [addModalOpen]);

  return (
    <div className="App">
      <Box display="flex" mb={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClickAddModalOpen}
        >
          Add new
        </Button>
      </Box>

      <Dialog
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Add a godown
        </DialogTitle>
        <DialogContent>
          <Formik>
            {(formikProps) => (
              <Form onSubmit={formik.handleSubmit}>
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
                    id="location"
                    label="Location"
                    type="text"
                    variant="outlined"
                    {...formik.getFieldProps("location")}
                    error={
                      formik.touched.location && formik.errors.location
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.location && formik.errors.location
                    }
                  />
                  <TextField
                    id="capacity"
                    label="Capacity"
                    type="number"
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    {...formik.getFieldProps("capacity")}
                    error={
                      formik.touched.capacity && formik.errors.capacity
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.capacity && formik.errors.capacity
                    }
                  />
                  <TextField
                    id="startDate"
                    label="Start date"
                    type="date"
                    variant="outlined"
                    {...formik.getFieldProps("startDate")}
                    error={
                      formik.touched.startDate && formik.errors.startDate
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.startDate && formik.errors.startDate
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="managerName"
                    label="Manager name"
                    type="text"
                    variant="outlined"
                    {...formik.getFieldProps("managerName")}
                    error={
                      formik.touched.managerName && formik.errors.managerName
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.managerName && formik.errors.managerName
                    }
                  />
                  <TextField
                    id="managerUsername"
                    label="Manager username"
                    type="text"
                    variant="outlined"
                    {...formik.getFieldProps("managerUsername")}
                    error={
                      formik.touched.managerUsername &&
                        formik.errors.managerUsername
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.managerUsername &&
                      formik.errors.managerUsername
                    }
                  />

                  <FormControl>
                    <InputLabel id="roleIdLabel">Manager role</InputLabel>
                    <Select
                      labelId="roleIdLabel"
                      id="roleId"
                      label="Manager role"
                      {...formik.getFieldProps("managerRoleId")}
                      error={
                        formik.touched.managerRoleId &&
                          formik.errors.managerRoleId
                          ? true
                          : false
                      }
                    >
                      {roles.map((role, index) => (
                        <MenuItem key={index} value={role.id}>
                          {role.role}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.managerRoleId &&
                      formik.errors.managerRoleId && (
                        <FormHelperText error>
                          {formik.touched.managerRoleId &&
                            formik.errors.managerRoleId}
                        </FormHelperText>
                      )}
                  </FormControl>
                </div>

                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={() => setAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!formik.isValid || !formik.dirty}
                    type="submit"
                    variant="contained"
                    className={classes.actionButtons}
                  >
                    Add
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Grid container spacing={6}>
        {godowns.map((godown) => (
          <Grid item xs={12} sm={6} md={4} key={godown.id}>
            <Card
              style={{
                padding: "16px 24px",
              }}
            >
              <CardContent
                style={{
                  padding: "0px",
                }}
              >
                <Typography
                  gutterBottom
                  style={{ fontWeight: "bold" }}
                  variant="h6"
                  component="h4"
                >
                  {godown.location}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      {"Manager name:"}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {godown.manager.name}
                    </Typography>
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      {"Start date:"}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {godown.startDate}
                    </Typography>
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      {"Total capacity (in quintals):"}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {godown.capacityInQuintals}
                    </Typography>
                  </div>
                </div>
              </CardContent>
              <CardActions
                style={{
                  padding: "0px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <IconButton
                    color="success"
                    aria-label="edit"
                    onClick={() => handleClickEditModalOpen(godown)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    aria-label="delete"
                    onClick={() => handleDelete(godown.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
                <Button
                  variant="outlined"
                  onClick={() => handleClickSeeStock(godown)}
                >
                  See stock
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
      <UpdateGodown
        godown={editModalOpen}
        managers={managers}
        roles={roles}
        handleClose={handleEditModalClose}
      />
    </div>
  );
}

export default Godowns;
