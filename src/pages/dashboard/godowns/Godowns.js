import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { Formik, Form, Field, ErrorMessage } from "formik";
import moment from "moment";
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
} from "@mui/material";

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
  const [managerId, setmanagerId] = useState("");
  const [date, setDate] = useState("");

  const [godowns, setGodowns] = useState([]);
  const [managers, setManagers] = useState([]);

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
  };
  // const handleDelete = async (id) => {

  //       try {

  //         // Delete godown from server

  //         await fetch(`http://localhost:8080/api/godowns/91/${id}`, {

  //           method: 'DELETE',

  //         });

  //         // Delete godown from local state

  //           setUsers(users.filter((user) => user.id !== id));

  //       } catch (error) {

  //         console.error('Error deleting godown:', error);

  //       }

  //     };

  // const handleEdit = () => {
  //   setEditing(true);
  // };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };
  const handleManagerIdChange = (event) => {
    setmanagerId(event.target.value);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = (event) => {
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

    axios
      .post("http://localhost:8080/api/godowns", formData)
      .then((response) => {
        getData();
      })
      .catch((error) => {
        console.error(error);
      });

    setLocation("");
    setCapacity("");
    setmanagerId("");
    setDate("");
    setAddModalOpen(false);
  };

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
                    onClick={handleSubmit}
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
                }}
              >
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
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <UpdateGodown
        godown={editModalOpen}
        managers={managers}
        handleClose={handleEditModalClose}
      />
    </div>
  );
}

export default Godowns;
