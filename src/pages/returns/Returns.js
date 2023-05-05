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
  Typography,
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
import CloseIcon from "@material-ui/icons/Close";
import ConfirmDialog from "../../Components/ConfirmDialog";
import { Form, Formik } from "formik";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
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
  { id: "godown", label: "Godown" },
  { id: "product_name", label: "Product name" },
  { id: "returned_by", label: "Returned by" },
  { id: "delivery_date", label: "Delivery date" },
  { id: "return_date", label: "Return date" },
  { id: "reason", label: "Reason" },
  { id: "invoice_no", label: "Invoice number" },
  { id: "receipt_no", label: "Receipt number" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Returns() {
  const classes = useStyles();
  const [returns, setOutwards] = useState([]);
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

  const [godownId, setGodownId] = useState("");
  const [productId, setProductId] = useState("");
  const [returnedBy, setReturnedBy] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [reason, setReason] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [receiptNo, setReceiptNo] = useState("");

  const [godowns, setGodowns] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(null);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(returns, headCells, filterFn);

  const handleClickAddModalOpen = () => {
    setAddModalOpen(true);
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleClickEditModalOpen = (employee) => {
    setEditModalOpen(employee);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(null);
    getData();
  };

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x.returned_by.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/returns/${id}`)
      .then((response) => {
        console.log(response);
        setEmployees(returns.filter((record) => record.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  const handleGodownIdChange = (event) => {
    setGodownId(event.target.value);
  };

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };
  const handleInvoiceIdChange = (event) => {
    setInvoiceId(event.target.value);
  };
  const handleReturnedByChange = (event) => {
    setReturnedBy(event.target.value);
  };
  const handleDeliveryDateChange = (event) => {
    setDeliveryDate(event.target.value);
  };
  const handleReturnDateChange = (event) => {
    setReturnDate(event.target.value);
  };
  const handleInvoiceNoChange = (event) => {
    setInvoiceNo(event.target.value);
  };
  const handleReceiptNoChange = (event) => {
    setReceiptNo(event.target.value);
  };
  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };
  // const handleQuantityChange = (event) => {
  //   setQuantity(event.target.value);
  // };
  // const handleBillValueChange = (event) => {
  //   setBillValue(event.target.value);
  // };
  // const handleBillValueCheckedByIdChange = (event) => {
  //   setBillCheckedById(event.target.value);
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = {};
    formData["godown"] = {
      id: godownId,
    };
    formData["product"] = {
      id: productId,
    };
    formData["invoice"] = {
      id: invoiceId,
    };
    formData["returnedBy"] = returnedBy;

    const supplyDateObj = new Date(deliveryDate);
    const formattedSupplyDate = moment(supplyDateObj).format("DD/MM/YYYY");
    formData["supplyDate"] = formattedSupplyDate;

    const deliveryDateObj = new Date(returnDate);
    const formattedDeliveryDate = moment(deliveryDateObj).format("DD/MM/YYYY");
    formData["deliveryDate"] = formattedDeliveryDate;

    formData["receiptNo"] = receiptNo;
    formData["purpose"] = reason;
    // formData["invoice"] = {
    //   quantity: quantity,
    //   billValue: billValue,
    //   billCheckedBy: {
    //     id: billCheckedById,
    //   },
    // };

    console.log(formData);

    axios
      .post("http://localhost:8080/api/returns", formData)
      .then((response) => {
        console.log(response);
        getData();
      })
      .catch((error) => {
        console.error(error);
      });

    setGodownId("");
    setProductId("");
    setInvoiceId("");
    setReturnedBy("");
    setDeliveryDate("");
    setReturnDate("");
    setInvoiceNo("");
    setReceiptNo("");
    setReason("");
    // setQuantity("");
    // setBillValue("");
    // setBillCheckedById("");
    handleAddModalClose();
    setAddModalOpen(false);
  };

  function getData() {
    axios
      .get("http://localhost:8080/api/returns", {})
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let obj = {
            id: item.id,
            godown: item.godown,
            product_name: item.product.name,
            delivered_to: item.deliveredTo,
            supply_date: item.supplyDate,
            delivery_date: item.deliveryDate,
            invoice_no: item.invoice.id,
            receipt_no: item.receiptNo,
            purpose: item.purpose,
          };
          rows.push(obj);
        }
        setOutwards(rows);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/api/godowns")
      .then((res) => {
        setGodowns(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/api/invoice")
      .then((res) => {
        setInvoices(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/api/employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <TextField
            label="Search Returns"
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
            onClick={handleClickAddModalOpen}
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
                <TableCell>
                  {item.purpose === "service" ? "Self" : item.delivered_to}
                </TableCell>
                <TableCell>{item.supply_date}</TableCell>
                <TableCell>{item.delivery_date}</TableCell>
                {/* <TableCell>{item.purpose}</TableCell> */}
                <TableCell>{item.invoice_no}</TableCell>
                <TableCell>{item.receipt_no}</TableCell>
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
                          handleDelete(item.id);
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

      <Dialog
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Add outwards
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
                    gridTemplateColumns: "auto auto auto",
                    columnGap: "16px",
                    rowGap: "24px",
                  }}
                >
                  <FormControl>
                    <InputLabel id="godownIdLabel">Godown</InputLabel>
                    <Select
                      labelId="godownIdLabel"
                      id="godownId"
                      value={godownId}
                      label="Godown"
                      onChange={handleGodownIdChange}
                    >
                      {godowns.map((godown, index) => (
                        <MenuItem key={index} value={godown.id}>
                          {godown.location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="productIdLabel">Product</InputLabel>
                    <Select
                      labelId="productIdLabel"
                      id="productId"
                      value={productId}
                      label="Product"
                      onChange={handleProductIdChange}
                    >
                      {products.map((product, index) => (
                        <MenuItem key={index} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="invoiceIdLabel">Invoice</InputLabel>
                    <Select
                      labelId="invoiceIdLabel"
                      id="invoiceId"
                      value={invoiceId}
                      label="Invoice"
                      onChange={handleInvoiceIdChange}
                    >
                      {invoices.map((invoice, index) => (
                        <MenuItem key={index} value={invoice.id}>
                          {invoice.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    id="deliveredTo"
                    label="Delivered to"
                    type="text"
                    variant="outlined"
                    value={returnedBy}
                    onChange={handleReturnedByChange}
                  />
                  <TextField
                    id="supplyDate"
                    label="Supply date"
                    type="date"
                    variant="outlined"
                    value={deliveryDate}
                    onChange={handleDeliveryDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="deliveryDate"
                    label="Delivery date"
                    type="date"
                    variant="outlined"
                    value={returnDate}
                    onChange={handleReturnDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="receiptNo"
                    label="Receipt No"
                    type="number"
                    variant="outlined"
                    value={receiptNo}
                    onChange={handleReceiptNoChange}
                  />
                  <FormControl>
                    <InputLabel id="purposeIdLabel">Purpose</InputLabel>
                    <Select
                      labelId="purposeIdLabel"
                      id="productId"
                      value={reason}
                      label="Purpose"
                      onChange={handleReasonChange}
                    >
                      <MenuItem value="sales">Sales</MenuItem>
                      <MenuItem value="service">Service</MenuItem>
                    </Select>
                  </FormControl>
                  {/* <TextField
                    id="quantity"
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  <TextField
                    id="billValue"
                    label="Bill Value"
                    type="number"
                    variant="outlined"
                    value={billValue}
                    onChange={handleBillValueChange}
                  />
                  <FormControl>
                    <InputLabel id="billCheckedByIdLabel">
                      Bill checked by
                    </InputLabel>
                    <Select
                      labelId="billCheckedByIdLabel"
                      id="billCheckedById"
                      value={billCheckedById}
                      label="Bill checked by"
                      onChange={handleBillValueCheckedByIdChange}
                    >
                      {employees.map((employee, index) => (
                        <MenuItem key={index} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select> */}
                  {/* </FormControl> */}
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

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
