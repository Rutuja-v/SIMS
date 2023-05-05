import React, { useState } from "react";
import InwardsForm from "./inwardsForm";
import axios from "axios";
import { useEffect } from "react";
import Popup from "../../Components/Popup";
import { makeStyles } from "@material-ui/core";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import useTable from "../../Components/useTable";
import * as employeeService from "../../services/employeeService";
import Controls from "../../Components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../Components/Notification";
import ConfirmDialog from "../../Components/ConfirmDialog";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
}));

const headCells = [
  { id: "godown", label: "Godown" },
  { id: "product_name", label: "Product name" },
  { id: "supplier_name", label: "Supplier name" },
  { id: "supply_date", label: "Supply date" },
  { id: "invoice_no", label: "Invoice number" },
  { id: "receipt_no", label: "Receipt number" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Employees() {
  const [recordForEdit, setRecordForEdit] = useState(null);
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x.supplier_name.toLowerCase().includes(target.value)
          );
      },
    });
  };
  const addOrEdit = (employee, resetForm) => {
    if (employee.id === 0) employeeService.insertEmployee(employee);
    else employeeService.updateEmployee(employee);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
  };
  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };
  const onDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/inwards/${id}`)
      .then((response) => {
        console.log(response);
        setRecords(records.filter((record) => record.id !== id));
        setConfirmDialog({
          isOpen: false,
        });
      })
      .catch((error) => {
        console.error(error);
        setConfirmDialog({
          isOpen: false,
        });
      });
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/inwards", {})
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          console.log(item);
          let obj = {
            godown: item.godown,
            product_name: item.product.name,
            invoice_no: item.invoice.id,
            supplier_name: item.supplier.name,
            supply_date: item.supplyDate,
            receipt_no: item.receiptNo,
            id: item.id,
          };
          rows.push(obj);
        }
        setRecords(rows);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <TextField
            label="Search Inwards"
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
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          >
            Add new
          </Button>
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.godown.location}
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    component="p"
                  >
                    {"Capacity: " + item.godown.capacityInQuintals}
                  </Typography>
                </TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.supplier_name}</TableCell>
                <TableCell>{item.supply_date}</TableCell>
                {/* <TableCell>{item.delivery_date}</TableCell> */}
                <TableCell>{item.invoice_no}</TableCell>
                <TableCell>{item.receipt_no}</TableCell>
                {/* <TableCell>{item.delivered_to}</TableCell> */}
                <TableCell>
                  {/* <Controls.ActionButton
                    onClick={() => {
                      openInPopup(item);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton> */}
                  <Controls.ActionButton
                    //    color="secondary"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure to delete this record?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(item.id);
                        },
                      });
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <InwardsForm
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          setRecords={setRecords}
          records={records}
          setNotify={setNotify}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
