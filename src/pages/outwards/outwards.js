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

  const [godownId, setGodownId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deliveredTo, setDeliveredTo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [supplyDate, setSupplyDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [billCheckedById, setBillCheckedById] = useState("");

  const [godowns, setGodowns] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalItem, setEditModalItem] = useState(null);

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
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
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
  const handleReceiptNoChange = (event) => {
    setReceiptNo(event.target.value);
  };
  const handleBillValueCheckedByIdChange = (event) => {
    setBillCheckedById(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = {};
    formData["godown"] = {
      id: godownId,
    };
    formData["product"] = {
      id: productId,
    };
    formData["quantity"] = quantity;
    formData["deliveredTo"] = deliveredTo;
    formData["purpose"] = purpose;

    const supplyDateObj = new Date(supplyDate);
    const formattedSupplyDate = moment(supplyDateObj).format("DD/MM/YYYY");
    formData["supplyDate"] = formattedSupplyDate;

    const deliveryDateObj = new Date(deliveryDate);
    const formattedDeliveryDate = moment(deliveryDateObj).format("DD/MM/YYYY");
    formData["deliveryDate"] = formattedDeliveryDate;

    formData["receiptNo"] = receiptNo;
    formData["invoice"] = {
      billCheckedBy: {
        id: billCheckedById,
      },
    };

    console.log(formData);

    axios
      .post("http://localhost:8080/api/outwards", formData)
      .then((response) => {
        getData();
      })
      .catch((error) => {
        console.error(error);
      });

    setGodownId("");
    setProductId("");
    setQuantity("");
    setDeliveredTo("");
    setPurpose("");
    setSupplyDate("");
    setDeliveryDate("");
    setReceiptNo("");
    setBillCheckedById("");
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
            quantity: item.quantity,
            delivered_to: item.deliveredTo,
            purpose: item.purpose,
            supply_date: item.supplyDate,
            delivery_date: item.deliveryDate,
            invoice: item.invoice,
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
            label="Search by customer (delivered to)"
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
                <TableCell>
                  {item.product.name}
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    component="p"
                  >
                    {"Price: " + item.product.price}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    component="p"
                  >
                    {"Quantity: " + item.quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  {item.delivered_to}
                </TableCell>
                <TableCell>{item.purpose}</TableCell>
                <TableCell>{item.supply_date}</TableCell>
                <TableCell>{item.delivery_date}</TableCell>
                <TableCell>
                  {item.invoice.invoiceNo}
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    component="p"
                  >
                    {"Bill value: " + item.invoice.billValue}
                  </Typography>
                </TableCell>
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
                    id="quantity"
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
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
                  <TextField
                    id="receiptNo"
                    label="Receipt number"
                    type="number"
                    variant="outlined"
                    value={receiptNo}
                    onChange={handleReceiptNoChange}
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

      <UpdateOutwards outwards={editModalItem} godowns={godowns} products={products} employees={employees} handleClose={handleEditModalClose} />
    </>
  );
}
