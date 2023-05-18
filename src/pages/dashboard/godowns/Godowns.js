import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import { Formik, Form } from "formik";
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

const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

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
      .get("http://ec2-100-26-21-150.compute-1.amazonaws.com/api/godowns")
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
        console.error({ data: error.response.data, status: error.response.status });
      });

    axios
      .get("http://ec2-100-26-21-150.compute-1.amazonaws.com/api/employees")
      .then((response) => {
        setManagers(
          response.data.filter((employee) => employee.role.role === "manager" && employee.id !== employee.godown.manager.id)
        );
      })
      .catch((error) => {
        console.error({ data: error.response.data, status: error.response.status });
      });

    axios
      .get("http://ec2-100-26-21-150.compute-1.amazonaws.com/api/employeeRoles")
      .then((response) => {
        setRoles(response.data.filter((role) => role.role === "manager"));
      })
      .catch((error) => {
        console.error({ data: error.response.data, status: error.response.status });
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
      .delete(`http://ec2-100-26-21-150.compute-1.amazonaws.com/api/godowns/${id}`)
      .then((response) => {
        setNotify({
          isOpen: true,
          message: "Godown deleted successfully",
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
        console.error({ data: error.response.data, status: error.response.status });
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
    // managerId: Yup.number().required("Manager is required"),
    managerName: Yup.string().required("Manager name is required"),
    managerUsername: Yup.string().required("Username is required"),
    managerRoleId: Yup.number().required("This field is required"),
  });
  const formik = useFormik({
    initialValues: {
      location: null,
      capacity: null,
      startDate: null,
      // managerId: null,
      managerName: null,
      managerUsername: null,
      managerRoleId: null,
    },
    validationSchema: validationSchema,

    onSubmit: (values, { resetForm }) => {
      let formData = {};
      formData["location"] = values.location;
      formData["capacityInQuintals"] = values.capacity;
      // if (values.managerId !== -1) {
      //   formData["manager"] = {
      //     id: Number(values.managerId),
      //   };
      // }
      // else {
      formData["manager"] = {
        name: values.managerName,
        username: values.managerUsername,
        role: {
          id: values.managerRoleId,
        },
      };
      // }

      const startDateObj = new Date(values.startDate);
      const formattedDate = moment(startDateObj).format("DD/MM/YYYY");
      formData["startDate"] = formattedDate;

      console.log(formData);

      axios
        .post("http://ec2-100-26-21-150.compute-1.amazonaws.com/api/godowns", formData)
        .then((response) => {
          resetForm();
          setAddModalOpen(false);

          setNotify({
            isOpen: true,
            message: "Godown added successfully",
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
          console.error({ data: error.response.data, status: error.response.status });
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
                  {/* <FormControl>
                    <InputLabel id="managerIdLabel">Manager</InputLabel>
                    <Select
                      labelId="managerIdLabel"
                      id="managerId"
                      label="Manager"
                      {...formik.getFieldProps("managerId")}
                      error={
                        formik.touched.managerId &&
                          formik.errors.managerId
                          ? true
                          : false
                      }
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
                    {formik.touched.managerId &&
                      formik.errors.managerId && (
                        <FormHelperText error>
                          {formik.touched.managerId &&
                            formik.errors.managerId}
                        </FormHelperText>
                      )}
                  </FormControl> */}
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
                  marginTop: "8px",
                  padding: "0px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <IconButton
                    color="primary"
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
