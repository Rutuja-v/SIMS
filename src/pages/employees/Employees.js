import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Notification from "../../Components/Notification";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import profileIcon from "../../Components/assets/profile.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Grid,
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
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Badge,
  Avatar,
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
import { useFormik } from "formik";
const Excel = require("exceljs");

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
  { id: "godown", label: "Godown" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Employees() {
  const employeesExcel = async () => {
    let reportData = [];

    for (let i = 0; i < employees.length; i++) {
      let item = employees[i];

      let obj = {
        "Employee Name": item.name,
        "Employee Username": item.username,
        "Employee Role": item.role == null ? null : item.role.role,
        Godown: item.godown == null ? null : item.godown.location,
      };

      reportData.push(obj);
    }

    let workbook = new Excel.Workbook();

    let keys = Object.keys(reportData[0]);

    let headers = getColumnHeaders(keys, keys);

    let columnHeaders = getExcelColumnHeaders(headers);

    let sheet = workbook.addWorksheet("Employees", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    console.log("Headers", headers, "Column Headers", columnHeaders);

    sheet.columns = columnHeaders;

    // add data to excel sheet
    sheet.addRows(reportData);

    // make the header bold
    sheet.getRow(1).font = { bold: true };

    console.log("report", reportData);

    let fileBuffer = await workbook.xlsx.writeBuffer();

    const fileBlob = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `${"Employees"}_${new Date().toISOString()}.xlsx`;

    const url = URL.createObjectURL(fileBlob);

    let link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", fileName);

    document.body.appendChild(link);

    link.click();

    URL.revokeObjectURL(url);
  };

  const getColumnHeaders = (columns, keys = []) => {
    const columnHeaders = [];
    for (let i = 0; i < columns.length; i++) {
      let currrentColumn = columns[i].trim();
      columnHeaders.push({
        header: currrentColumn,
        key: keys[i] ? keys[i] : currrentColumn,
      });
    }

    return columnHeaders;
  };

  const getExcelColumnHeaders = (headers) => {
    let columnHeaders = [];
    for (let i = 0; i < headers.length; i++) {
      columnHeaders.push({
        header: headers[i].header,
        key: headers[i].key,
        width:
          headers[i].header == "Message" ? 50 : headers[i].header.length + 10,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          },
          bgColor: { argb: "#008000" },
        },
      });
    }

    return columnHeaders;
  };

  const classes = useStyles();
  const [employees, setEmployees] = useState(null);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
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

  const [roles, setRoles] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [lockedEmployees, setLockedEmployees] = useState([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalItem, setEditModalItem] = useState(null);

  const [unlockAccountsModalOpen, setUnlockAccountsModalOpen] = useState(null);

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
  };

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x.name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employees/${id}`)
      .then((response) => {
        setEmployees(employees.filter((record) => record.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setNotify({
      isOpen: true,
      message: "Employee Deleted Successfully",
      type: "error",
    });
  };

  const handleUnlockAccount = (id) => {
    axios
      .patch(`http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employees/${id}/unlock`)
      .then((response) => {
        setLockedEmployees(
          lockedEmployees.filter((employee) => employee.id !== id)
        );
        setNotify({
          isOpen: true,
          message: "Unlocked the account",
          type: "success",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLockedAccountDelete = (id) => {
    axios
      .delete(`http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employees/${id}`)
      .then((response) => {
        setLockedEmployees(
          lockedEmployees.filter((employee) => employee.id !== id)
        );
        setNotify({
          isOpen: true,
          message: "Deleted the account",
          type: "success",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    username: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters"),
    // password: Yup.string()
    //   .required("Password is required")
    //   .min(6, "Password must be at least 8 characters"),
    roleId: Yup.number().required("Role is required"),
    godownId: Yup.number().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: null,
      username: null,
      // password: null,
      roleId: null,
      godownId: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      let formData = {};

      formData["name"] = values.name;
      formData["username"] = values.username;
      // formData["password"] = values.password;
      formData["role"] = {
        id: values.roleId,
      };
      if (values.godownId != -1) {
        formData["godown"] = {
          id: values.godownId,
        };
      }

      console.log(formData);

      axios
        .post("http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employees", formData)
        .then((response) => {
          getData();
        })
        .catch((error) => {
          console.error(error);
        });

      resetForm();

      setAddModalOpen(false);
      setNotify({
        isOpen: true,
        message: "Employee Added Successfully",
        type: "success",
      });
    },
  });

  function getData() {
    axios
      .get("http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employees", {})
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let obj = {
            id: item.id,
            name: item.name,
            username: item.username,
            // password: item.password,
            role: item.role,
            godown: item.godown,
          };
          rows.push(obj);
        }
        rows.sort((e1, e2) => e1.name.localeCompare(e2.name));
        setEmployees(rows);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employeeRoles")
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/godowns")
      .then((res) => {
        setGodowns(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employees/locked")
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let obj = {
            id: item.id,
            name: item.name,
            username: item.username,
            // password: item.password,
            role: item.role,
            godown: item.godown,
          };
          rows.push(obj);
        }
        rows.sort((e1, e2) => e1.name.localeCompare(e2.name));
        setLockedEmployees(rows);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getData();
  }, []);

  function toSentenceCase(str) {
    if (str === undefined || str === null) {
      return;
    }
    if (str.length === 1) {
      return str.toUpperCase();
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  useEffect(() => {
    if (!addModalOpen) {
      formik.resetForm();
    }
  }, [addModalOpen]);

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Grid container spacing={2} direction="row">
            <Grid item>
              <TextField
                disabled={recordsAfterPagingAndSorting()?.length === 0}
                label="Search by supplier name"
                className={classes.searchInput}
                sx={{ width: "680px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearch}
              />
            </Grid>

            <Grid
              item
              style={{
                marginLeft: "auto",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              <IconButton color="success" onClick={employeesExcel}>
                <DownloadIcon />
              </IconButton>

              <IconButton
                color="success"
                onClick={() => setUnlockAccountsModalOpen(true)}
              >
                <Badge badgeContent={lockedEmployees.length} color="primary">
                  <LockIcon />
                </Badge>
              </IconButton>

              <Button
                variant="outlined"
                sx={{ marginLeft: "8px" }}
                startIcon={<AddIcon />}
                className={classes.newButton}
                onClick={handleAddModalOpen}
              >
                Add new
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
        {recordsAfterPagingAndSorting()?.length === 0 ? (
          <Grid sx={{ mt: 2, ml: 3 }}>
            There are currently 0 employees records.
          </Grid>
        ) : (
          <>
            <TblContainer>
              <TblHead />
              <TableBody>
                {recordsAfterPagingAndSorting()?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{toSentenceCase(item.role.role)}</TableCell>
                    <TableCell>
                      {item.godown === null ? "None" : item.godown.location}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditModalOpen(item)}>
                        <EditOutlinedIcon fontSize="small" />
                      </Button>

                      <Button
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
                        <DeleteIcon fontSize="small" color="error" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TblContainer>
            <TblPagination />
          </>
        )}
      </Paper>

      <Dialog
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Add an employee
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
                    id="name"
                    label="Name"
                    type="text"
                    variant="outlined"
                    {...formik.getFieldProps("name")}
                    error={
                      formik.touched.name && formik.errors.name ? true : false
                    }
                    helperText={formik.touched.name && formik.errors.name}
                  />
                  <TextField
                    id="username"
                    label="Username"
                    type="text"
                    variant="outlined"
                    {...formik.getFieldProps("username")}
                    error={
                      formik.touched.username && formik.errors.username
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                  />
                  {/* <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    {...formik.getFieldProps("password")}
                    error={
                      formik.touched.password && formik.errors.password
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  /> */}
                  <FormControl>
                    <InputLabel id="roleIdLabel">Role</InputLabel>
                    <Select
                      labelId="roleIdLabel"
                      id="roleId"
                      label="Role"
                      {...formik.getFieldProps("roleId")}
                      error={
                        formik.touched.roleId && formik.errors.roleId
                          ? true
                          : false
                      }
                    >
                      {roles
                        .filter((role) => role.role !== "superadmin")
                        .map((role, index) => (
                          <MenuItem key={index} value={role.id}>
                            {role.role}
                          </MenuItem>
                        ))}
                    </Select>
                    {formik.touched.roleId && formik.errors.roleId && (
                      <FormHelperText error>
                        {formik.touched.roleId && formik.errors.roleId}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl>
                    <InputLabel id="godownIdLabel">Godown</InputLabel>
                    <Select
                      labelId="godownIdLabel"
                      id="godownId"
                      label="Godown"
                      {...formik.getFieldProps("godownId")}
                      error={
                        formik.touched.godownId && formik.errors.godownId
                          ? true
                          : false
                      }
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
                    {formik.touched.godownId && formik.errors.godownId && (
                      <FormHelperText error>
                        {formik.touched.godownId && formik.errors.godownId}
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

      <Dialog
        open={unlockAccountsModalOpen}
        onClose={() => {
          setUnlockAccountsModalOpen(false);
          getData();
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Unlock locked accounts
        </DialogTitle>
        <DialogContent>
          {lockedEmployees.length === 0 ? (
            <Grid item style={{ padding: "36px 36px 0px 36px" }}>
              There are currently no locked accounts.
            </Grid>
          ) : (
            <List>
              {lockedEmployees.map((employee, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <div edge="end">
                      <IconButton
                        aria-label="unlock"
                        color="primary"
                        onClick={() => handleUnlockAccount(employee.id)}
                      >
                        <LockOpenIcon />
                      </IconButton>
                      <IconButton
                        aria-label="unlock"
                        color="error"
                        onClick={() => handleLockedAccountDelete(employee.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  }
                >
                  <Avatar sx={{ mr: 1 }} src={profileIcon} />
                  <ListItemText
                    style={{ marginRight: "96px" }}
                    primary={employee.name}
                    secondary={employee.username}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setUnlockAccountsModalOpen(false);
              getData();
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <UpdateEmployee
        employee={editModalItem}
        roles={roles}
        godowns={godowns}
        handleClose={handleEditModalClose}
      />
    </>
  );
}
