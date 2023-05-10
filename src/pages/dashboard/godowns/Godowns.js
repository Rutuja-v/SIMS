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

export const validationSchema = Yup.object().shape({
  location: Yup.string().required("Location is required"),
  id: Yup.number().required("ID is required").positive("ID must be positive"),
  managerId: Yup.number()
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

function Godowns({ onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [godownData, setGodownData] = useState([]);
  const classes = useStyles();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(null);
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerUsername, setManagerUsername] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [managerRoleId, setManagerRoleId] = useState("");
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
        setGodowns(godowns.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
    setNotify({
      isOpen: true,
      message: "Godown Deleted Successfully",
      type: "error",
    });
  };

  const handleClickSeeStock = (godown) => {
    navigate(`/godown/${godown.id}/stock`, { state: godown });
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
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
  const validationSchema = Yup.object().shape({
    location: Yup.string().required("Location is required"),
    capacity: Yup.number()
      .typeError("Capacity must be a number")
      .required("Capacity is required")
      .min(1, "Capacity must be at least 1"),

    // date: Yup.date().required('Date is required'),
    managerRoleId: Yup.number().required("Manager Name is required"),
  });
  const formik = useFormik({
    initialValues: {
      location: null,
      capacity: null,
      date: null,
      managerName: null,
    },
    validationSchema: validationSchema,

    onSubmit: (values, { resetForm }) => {
      // event.preventDefault();
      let formData = {};
      formData["location"] = values.location;
      formData["capacityInQuintals"] = values.capacity;
      formData["manager"] = {
        name: managerName,
        username: managerUsername,
        password: managerPassword,
        role: {
          // id: Number(managerRoleId)
          id: values.managerRoleId,
        },
      };

      const dateObj = new Date(startDate);
      const formattedDate = moment(dateObj).format("DD/MM/YYYY");
      formData["startDate"] = formattedDate;

      console.log(formData);

      axios
        .post("http://localhost:8080/api/godowns", formData)
        .then((response) => {
          getData();
        })
        .catch((error) => {
          console.error(error);
        });

      // setLocation("");
      // setCapacity("");
      setStartDate("");
      // setManagerName("");
      // setManagerUsername("");
      // setManagerPassword("");
      // setManagerRoleId("");
      resetForm();
      setAddModalOpen(false);

      setNotify({
        isOpen: true,
        message: "Godown Submitted Successfully",
        type: "success",
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
          // onSubmit={handleSubmit}
          >
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
                    // value={location}
                    // onChange={handleLocationChange}
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
                    // value={capacity}
                    // onChange={handleCapacityChange}
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
                    value={startDate}
                    onChange={handleStartDateChange}
                    // {...formik.getFieldProps("date")}
                    // error={
                    //   formik.touched.date && formik.errors.date ? true : false
                    // }
                    // helperText={formik.touched.date && formik.errors.date}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
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
                  {/* <TextField
                    id="managerPassword"
                    label="Manager Password"
                    type="text"
                    variant="outlined"
                    value={managerPassword}
                    onChange={handleManagerPasswordChange}
                  /> */}
                  <FormControl>
                    <InputLabel id="roleIdLabel">Manager role</InputLabel>
                    <Select
                      labelId="roleIdLabel"
                      id="roleId"
                      defaultValue={
                        roles.find((role) => role.role === "manager")?.id
                      }
                      // value={managerRoleId}
                      label="Manager role"
                      // onChange={handleManagerRoleIdChange}
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
                    type="submit"
                    variant="contained"
                    className={classes.actionButtons}
                    onClick={() => formik.handleSubmit()}
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
                      {"Capacity (in quintals):"}
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
                  justifyContent: "space-between"
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
                <Button onClick={() => handleClickSeeStock(godown)}>See stock</Button>
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
