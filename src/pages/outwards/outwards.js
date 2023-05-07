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
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import ConfirmDialog from "../../Components/ConfirmDialog";
import { Form, Formik } from "formik";
import moment from "moment";
import UpdateOutwards from "./UpdateOutwards";
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
  { id: "godown", label: "Godown" },
  { id: "product_name", label: "Product name" },
  { id: "delivered_to", label: "Delivered To" },
  { id: "purpose", label: "Purpose" },
  { id: "supply_date", label: "Supply Date" },
  { id: "delivery_date", label: "Delivery Date" },
  { id: "invoice_no", label: "Invoice Number" },
  { id: "receipt_no", label: "Receipt Number" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Outwards() {
  const classes = useStyles();
  const [outwards, setOutwards] = useState([]);
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

  const [godownId, setGodownId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [deliveredTo, setDeliveredTo] = useState(null);
  const [purpose, setPurpose] = useState(null);
  const [supplyDate, setSupplyDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [receiptNo, setReceiptNo] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [billValue, setBillValue] = useState("");
  const [billCheckedById, setBillCheckedById] = useState("");

  const [godowns, setGodowns] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalItem, setEditModalItem] = useState(null);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(outwards, headCells, filterFn);

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (outwards) => {
    setEditModalItem(outwards);
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
            x.delivered_to.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`http://localhost:8080/api/outwards/${id}`)
      .then((response) => {
        setOutwards(outwards.filter((record) => record.id !== id));
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

  const handleGodownIdChange = (event) => {
    setGodownId(event.target.value);
  };
  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };
  const handleDeliveredToChange = (event) => {
    setDeliveredTo(event.target.value);
  };
  const handlePurposeChange = (event) => {
    setPurpose(event.target.value);
  };
  const handleSupplyDateChange = (event) => {
    setSupplyDate(event.target.value);
  };
  const handleDeliveryDateChange = (event) => {
    setDeliveryDate(event.target.value);
  };
  const handleInvoiceNoChange = (event) => {
    setInvoiceNo(event.target.value);
  };
  const handleInvoiceIdChange = (event) => {
    setInvoiceId(event.target.value);
  };
  const handleReceiptNoChange = (event) => {
    setReceiptNo(event.target.value);
  };
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };
  const handleBillValueChange = (event) => {
    setBillValue(event.target.value);
  };
  const handleBillValueCheckedByIdChange = (event) => {
    setBillCheckedById(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    
    if (godownId == null) {
      setNotify({
        isOpen: true,
        message: 'Godown ID is required.',
        type: 'error'
      })
      return;
    }
    if (productId == null) {
      setNotify({
        isOpen: true,
        message: 'Product ID is required.',
        type: 'error'
      })
      return;
    }

    if (deliveredTo == null || deliveredTo == "" ) {
      setNotify({
        isOpen: true,
        message: 'Delivered To is required.',
        type: 'error'
      })
      return;
    }

    if (purpose == null) {
      setNotify({
        isOpen: true,
        message: 'Purpose is required.',
        type: 'error'
      })
      return;
    }

    if (supplyDate == null) {
      setNotify({
        isOpen: true,
        message: 'Supply Date is required.',
        type: 'error'
      })
      return;
    }

    if (deliveryDate == null) {
      setNotify({
        isOpen: true,
        message: 'Delivery Date is required.',
        type: 'error'
      })
      return;
    }

    if (invoiceId == null) {
      setNotify({
        isOpen: true,
        message: 'Invoice No is required.',
        type: 'error'
      })
      return;
    }


    if (receiptNo == null || receiptNo == "") {
      setNotify({
        isOpen: true,
        message: 'Receipt No is required.',
        type: 'error'
      })
      return;
    }


    let formData = {};
    formData["godown"] = {
      id: godownId,
    };
    formData["product"] = {
      id: productId,
    };
    formData["deliveredTo"] = deliveredTo;
    formData["purpose"] = purpose;

    const supplyDateObj = new Date(supplyDate);
    const formattedSupplyDate = moment(supplyDateObj).format("DD/MM/YYYY");
    formData["supplyDate"] = formattedSupplyDate;

    const deliveryDateObj = new Date(deliveryDate);
    const formattedDeliveryDate = moment(deliveryDateObj).format("DD/MM/YYYY");
    formData["deliveryDate"] = formattedDeliveryDate;

    formData["invoice"] = {
      id: invoiceId,
    };
    formData["receiptNo"] = receiptNo;
    // formData["invoice"] = {
    //   quantity: quantity,
    //   billValue: billValue,
    //   billCheckedBy: {
    //     id: billCheckedById,
    //   },
    // };

    console.log(formData);

    axios
      .post("http://localhost:8080/api/outwards", formData)
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

    setGodownId("");
    setProductId("");
    setDeliveredTo("");
    setPurpose("");
    setSupplyDate("");
    setDeliveryDate("");
    setInvoiceNo("");
    setInvoiceId("");
    setReceiptNo("");
    // setQuantity("");
    // setBillValue("");
    // setBillCheckedById("");
    handleAddModalClose();
    setAddModalOpen(false);
  };

  function getData() {
    axios
      .get("http://localhost:8080/api/outwards", {})
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let obj = {
            id: item.id,
            godown: item.godown,
            product: item.product,
            delivered_to: item.deliveredTo,
            purpose: item.purpose,
            supply_date: item.supplyDate,
            delivery_date: item.deliveryDate,
            invoice_id: item.invoice.id,
            receipt_no: item.receiptNo,
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

  function handleCancelAddNewRecord()
  {
    setAddModalOpen(false);
    setGodownId(null);
    setProductId(null);
    setDeliveredTo(null);
    setPurpose(null);
    setSupplyDate(null);
    setDeliveryDate(null);
    setInvoiceId(null);
    // setSupplierId(null);
    setSupplyDate(null);
    setReceiptNo(null);
  }

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <TextField
            label="Search Outwards"
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
                <TableCell>{item.product.name}</TableCell>
                <TableCell>
                  {item.delivered_to}
                </TableCell>
                <TableCell>{item.purpose}</TableCell>
                <TableCell>{item.supply_date}</TableCell>
                <TableCell>{item.delivery_date}</TableCell>
                <TableCell>{item.invoice_id}</TableCell>
                <TableCell>{item.receipt_no}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    onClick={() => { handleEditModalOpen(item) }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
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
                    gridTemplateColumns: "auto auto",
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
                  <TextField
                    id="deliveredTo"
                    label="Delivered to"
                    type="text"
                    variant="outlined"
                    value={deliveredTo}
                    onChange={handleDeliveredToChange}
                  />
                  <FormControl>
                    <InputLabel id="purposeIdLabel">Purpose</InputLabel>
                    <Select
                      labelId="purposeIdLabel"
                      id="productId"
                      value={purpose}
                      label="Purpose"
                      onChange={handlePurposeChange}
                    >
                      <MenuItem value="sales">Sales</MenuItem>
                      <MenuItem value="service">Service</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    id="supplyDate"
                    label="Supply date"
                    type="date"
                    variant="outlined"
                    value={supplyDate}
                    onChange={handleSupplyDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="deliveryDate"
                    label="Delivery date"
                    type="date"
                    variant="outlined"
                    value={deliveryDate}
                    onChange={handleDeliveryDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormControl>
                    <InputLabel id="invoiceIdLabel">Invoice number</InputLabel>
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
                    id="receiptNo"
                    label="Receipt number"
                    type="number"
                    variant="outlined"
                    value={receiptNo}
                    onChange={handleReceiptNoChange}
                  />
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
                    </Select>
                  </FormControl> */}
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

      <UpdateOutwards outwards={editModalItem} godowns={godowns} products={products} invoices={invoices} handleClose={handleEditModalClose} />
    </>
  );
}
