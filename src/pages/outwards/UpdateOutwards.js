import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import axios from "axios";
import * as Yup from "yup";

import { Formik, Form } from "formik";

export const validationSchema = Yup.object().shape({});

const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

function UpdateOutwards({ outwards, godowns, products, employees, handleClose }) {
  const classes = useStyles();

  const [godownId, setGodownId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deliveredTo, setDeliveredTo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [supplyDate, setSupplyDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [billCheckedById, setBillCheckedById] = useState("");

  useEffect(() => {
    setGodownId(outwards?.godown.id);
    setProductId(outwards?.product.id);
    setQuantity(outwards?.quantity);
    setDeliveredTo(outwards?.delivered_to);
    setPurpose(outwards?.purpose);

    const formattedSupplyDate = moment(outwards?.supply_date, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    setSupplyDate(formattedSupplyDate);

    const formattedDeliveryDate = moment(outwards?.delivery_date, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    setDeliveryDate(formattedDeliveryDate);

    setInvoiceId(outwards?.invoice.id);
    setReceiptNo(outwards?.receipt_no);

    if ((outwards?.product !== undefined && outwards?.product !== null) && !products.find(product => product.id == outwards?.product.id)) {
      products.push(outwards?.product);
    }
  }, [outwards]);

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
  const handleInvoiceIdChange = (event) => {
    setInvoiceId(event.target.value);
  };
  const handleBillCheckedByIdChange = (event) => {
    setBillCheckedById(event.target.value);
  };

  const handleSubmit = async (event) => {
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
    if (invoiceId == -1) {
      formData["invoice"] = {
        billCheckedBy: {
          id: billCheckedById,
        },
      };
    }
    else {
      formData["invoice"] = {
        id: invoiceId
      }
    }

    console.log(formData);

    await axios
      .put(`http://localhost:8080/api/outwards/${outwards?.id}`, formData)
      .then((response) => {

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
    setInvoiceId("");
    setBillCheckedById("");
    handleClose();
  };

  return (
    <Dialog
      open={outwards != null}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className={classes.customTitle}>
        Edit outwards
      </DialogTitle>
      <DialogContent>
        <Formik validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                    defaultValue={outwards?.godown.id}
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
                    defaultValue={outwards?.product.id}
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
                  inputProps={{ min: 1 }}
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
                    defaultValue={outwards?.purpose}
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
                  inputProps={{ min: 1 }}
                  variant="outlined"
                  value={receiptNo}
                  onChange={handleReceiptNoChange}
                />
                <FormControl>
                  <InputLabel id="invoiceIdLabel">Invoice</InputLabel>
                  <Select
                    labelId="invoiceIdLabel"
                    id="invoiceId"
                    defaultValue={outwards?.invoice.id}
                    value={invoiceId}
                    label="Invoice"
                    onChange={handleInvoiceIdChange}
                  >
                    <MenuItem value={-1}>
                      Add new invoice
                    </MenuItem>
                    <MenuItem value={outwards?.invoice.id}>
                      {outwards?.invoice.invoiceNo}
                    </MenuItem>
                  </Select>
                </FormControl>
                {invoiceId === -1 && (
                  <FormControl>
                    <InputLabel id="billCheckedByIdLabel">
                      Bill checked by
                    </InputLabel>
                    <Select
                      labelId="billCheckedByIdLabel"
                      id="billCheckedById"
                      value={billCheckedById}
                      label="Bill checked by"
                      onChange={handleBillCheckedByIdChange}
                    >
                      {employees.map((employee, index) => (
                        <MenuItem key={index} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>

              <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Edit
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog >
  );
}

export default UpdateOutwards;
