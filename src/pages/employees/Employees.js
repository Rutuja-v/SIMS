import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
} from "@mui/material";
import useTable from "../../Components/useTable";
import Controls from "../../Components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import ConfirmDialog from "../../Components/ConfirmDialog";
import UpdateEmployee from "./UpdateEmployee";
import { Form, Formik } from "formik";
import Notification from '../../Components/Notification';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

const headCells = [
  { id: "name", label: "Employee name" },
  { id: "username", label: "Employee username" },
  { id: "role", label: "Employee role" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Employees() {
  const classes = useStyles();
  const [employees, setEmployees] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [roleId, setRoleId] = useState(null);

  const [roles, setRoles] = useState([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalItem, setEditModalItem] = useState(null);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  
  

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(employees, headCells, filterFn);

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (employee) => {
    setEditModalItem(employee);
  };
  const handleEditModalClose = () => {
    setEditModalItem(null);
    getData();
  }

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x.employee_name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/employees/${id}`)
      .then((response) => {
        setEmployees(employees.filter((record) => record.id !== id));
        setNotify({
          isOpen: true,
          message: 'Record Deleted Successfully.',
          type: 'success'
        })
      })
      .catch((error) => {
        console.error(error);
      });

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name == null || name == "") {
      setNotify({
        isOpen: true,
        message: 'Name is required.',
        type: 'error'
      })
      return;
    }
    if (username == null || username == "") {
      setNotify({
        isOpen: true,
        message: 'Username is required.',
        type: 'error'
      })
      return;
    }

    if (password == null || password == "") {
      setNotify({
        isOpen: true,
        message: 'Password is required.',
        type: 'error'
      })

      return;
    }

    
    if (password != null && password.length < 8 ) {
      setNotify({
        isOpen: true,
        message: 'Minimum password length required is 8 characters.',
        type: 'error',
        time: 3000
      })
      return;
    }

    if (roleId == null) {
      setNotify({
        isOpen: true,
        message: 'Role ID is required.',
        type: 'error'
      })
      return;
    }



    let formData = {};
    formData["name"] = name;
    formData["username"] = username;
    formData["password"] = password;
    formData["role"] = {
      id: Number(roleId),
    };

    console.log(formData);

    axios
      .post("http://localhost:8080/api/employees", formData)
      .then((response) => {
        getData();
        setNotify({
          isOpen: true,
          message: 'Record Added Successfully.',
          type: 'success'
        })
      })
      .catch((error) => {
        console.error(error);
      });

    setName("");
    setUsername("");
    setPassword("");
    setRoleId("");
    setAddModalOpen(false);
  };

  function getData() {
    axios
      .get("http://localhost:8080/api/employees", {})
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let obj = {
            id: item.id,
            name: item.name,
            username: item.username,
            password: item.password,
            role: item.role,
          };
          rows.push(obj);
        }
        setEmployees(rows);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/api/employeeRoles")
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getData();
  }, []);


  function handleCancelAddNewRecord()
  {
    setAddModalOpen(false);
    setName(null);
    setUsername(null);
    setPassword(null);
    setRoleId(null);
  
  }

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <TextField
            label="Search Employees"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
          <Button
            style={{ position: "absolute", right: "10px" }}
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={handleAddModalOpen}
          >
            Add new
          </Button>
        </Toolbar>

        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.role.role}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    onClick={() => handleEditModalOpen(item)}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  {(item.role.id == 72 || item.role.name == 'user') &&
                    <Controls.ActionButton
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure to delete this record?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            handleDelete(item.id);
                          },
                        });
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>

      <Notification
        notify={notify}
        setNotify={setNotify}

      />

      <Dialog
        open={addModalOpen}
        onClose={handleCancelAddNewRecord}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Add an employee
        </DialogTitle>
        <DialogContent>
          <Formik onSubmit={handleSubmit}>
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
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <FormControl>
                    <InputLabel id="roleIdLabel">Role</InputLabel>
                    <Select
                      labelId="roleIdLabel"
                      id="roleId"
                      value={roleId}
                      label="Role"
                      onChange={handleRoleIdChange}
                    >
                      {roles.map((role, index) => (
                        <MenuItem key={index} value={role.id}>
                          {role.role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={handleCancelAddNewRecord}
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

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <UpdateEmployee
        employee={editModalItem}
        roles={roles}
        handleClose={handleEditModalClose}
      />
    </>
  );
}
