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

function UpdateReturns({ returns, godowns, products, employees, handleClose }) {
  const classes = useStyles();

  const [godownId, setGodownId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [returnedBy, setReturnedBy] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [reason, setReason] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [billCheckedById, setBillCheckedById] = useState("");

  useEffect(() => {
    setGodownId(returns?.godown.id);
    setProductId(returns?.product.id);
    setQuantity(returns?.quantity);
    setReturnedBy(returns?.returned_by);

    const formattedDeliveryDate = moment(
      returns?.delivery_date,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD");
    setDeliveryDate(formattedDeliveryDate);

    const formattedReturnDate = moment(
      returns?.return_date,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD");
    setReturnDate(formattedReturnDate);

    setInvoiceId(returns?.invoice.id);
    setReceiptNo(returns?.receipt_no);
    setReason(returns?.reason);
  }, [returns]);

  const handleGodownIdChange = (event) => {
    setGodownId(event.target.value);
  };
  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
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
  const handleInvoiceIdChange = (event) => {
    setInvoiceId(event.target.value);
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
    formData["returnedBy"] = returnedBy;
    formData["reason"] = reason;

    const deliveryDateObj = new Date(deliveryDate);
    const formattedDeliveryDate = moment(deliveryDateObj).format("DD/MM/YYYY");
    formData["deliveryDate"] = formattedDeliveryDate;

    const returnDateObj = new Date(returnDate);
    const formattedReturnDate = moment(returnDateObj).format("DD/MM/YYYY");
    formData["returnDate"] = formattedReturnDate;

    formData["receiptNo"] = receiptNo;
    if (invoiceId == -1) {
      formData["invoice"] = {
        invoiceNo: invoiceNo,
        billCheckedBy: {
          id: billCheckedById,
        },
      };
    } else {
      formData["invoice"] = {
        id: invoiceId,
      };
    }

    console.log(formData);

    await axios
      .put(`http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/returns/${returns?.id}`, formData)
      .then((response) => { })
      .catch((error) => {
        console.error(error);
      });

    setGodownId("");
    setProductId("");
    setQuantity("");
    setReturnedBy("");
    setReason("");
    setDeliveryDate("");
    setReturnDate("");
    setReceiptNo("");
    setInvoiceId("");
    setInvoiceNo("");
    setBillCheckedById("");
    handleClose();
  };

  return (
    <Dialog
      open={returns != null}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className={classes.customTitle}>
        Edit returns
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
                    defaultValue={returns?.godown.id}
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
                    defaultValue={returns?.product.id}
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
                  id="returnedBy"
                  label="Returned by"
                  type="text"
                  variant="outlined"
                  value={returnedBy}
                  onChange={handleReturnedByChange}
                />
                <FormControl>
                  <InputLabel id="reasonIdLabel">Reason</InputLabel>
                  <Select
                    labelId="reasonIdLabel"
                    id="reasonId"
                    defaultValue={returns?.reason}
                    value={reason}
                    label="Reason"
                    onChange={handleReasonChange}
                  >
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="damaged">Damaged</MenuItem>
                  </Select>
                </FormControl>
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
                  id="returnDate"
                  label="Return date"
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
                    defaultValue={returns?.invoice.id}
                    value={invoiceId}
                    label="Invoice"
                    onChange={handleInvoiceIdChange}
                  >
                    <MenuItem value={-1}>Add new invoice</MenuItem>
                    <MenuItem value={returns?.invoice.id}>
                      {returns?.invoice.invoiceNo}
                    </MenuItem>
                  </Select>
                </FormControl>
                {invoiceId === -1 && (
                  <>
                    <TextField
                      id="invoiceNo"
                      label="Invoice number"
                      type="text"
                      variant="outlined"
                      value={invoiceNo}
                      onChange={handleInvoiceNoChange}
                      inputProps={{ maxLength: 12 }}
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
                        onChange={handleBillCheckedByIdChange}
                      >
                        {employees.map((employee, index) => (
                          <MenuItem key={index} value={employee.id}>
                            {employee.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
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
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateReturns;
