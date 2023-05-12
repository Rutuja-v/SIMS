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

function UpdateInwards({
  inwards,
  godowns,
  products,
  suppliers,
  invoices,
  employees,
  handleClose,
}) {
  const classes = useStyles();

  const [godownId, setGodownId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplyDate, setSupplyDate] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [billCheckedById, setBillCheckedById] = useState("");

  useEffect(() => {
    setGodownId(inwards?.godown.id);
    setProductId(inwards?.product.id);
    setQuantity(inwards?.quantity);
    setSupplierId(inwards?.supplier.id);

    const formattedSupplyDate = moment(
      inwards?.supply_date,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD");
    setSupplyDate(formattedSupplyDate);

    setInvoiceId(inwards?.invoice.id);
    setReceiptNo(inwards?.receipt_no);
  }, [inwards]);

  const handleGodownIdChange = (event) => {
    setGodownId(event.target.value);
  };
  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };
  const handleSupplierIdChange = (event) => {
    setSupplierId(event.target.value);
  };
  const handleSupplyDateChange = (event) => {
    setSupplyDate(event.target.value);
  };
  const handleReceiptNoChange = (event) => {
    setReceiptNo(event.target.value);
  };
  const handleInvoiceIdChange = (event) => {
    setInvoiceId(event.target.value);
  };
  const handleInvoiceNoChange = (event) => {
    setInvoiceNo(event.target.value);
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
    formData["supplier"] = {
      id: supplierId,
    };

    const supplyDateObj = new Date(supplyDate);
    const formattedSupplyDate = moment(supplyDateObj).format("DD/MM/YYYY");
    formData["supplyDate"] = formattedSupplyDate;

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
      .put(`http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/inwards/${inwards?.id}`, formData)
      .then((response) => { })
      .catch((error) => {
        console.error(error);
      });

    setGodownId("");
    setProductId("");
    setQuantity("");
    setSupplierId("");
    setSupplyDate("");
    setReceiptNo("");
    setInvoiceId("");
    setInvoiceNo("");
    setBillCheckedById("");
    handleClose();
  };

  return (
    <Dialog
      open={inwards != null}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className={classes.customTitle}>
        Edit inwards
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
                    defaultValue={inwards?.godown.id}
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
                    defaultValue={inwards?.product.id}
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
                <FormControl>
                  <InputLabel id="supplierIdLabel">Supplier</InputLabel>
                  <Select
                    labelId="supplierIdLabel"
                    id="supplierId"
                    defaultValue={inwards?.supplier.id}
                    value={supplierId}
                    label="Supplier"
                    onChange={handleSupplierIdChange}
                  >
                    {suppliers.map((supplier, index) => (
                      <MenuItem key={index} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    defaultValue={inwards?.invoice.id}
                    value={invoiceId}
                    label="Invoice"
                    onChange={handleInvoiceIdChange}
                  >
                    <MenuItem value={-1}>Add new invoice</MenuItem>
                    <MenuItem value={inwards?.invoice.id}>
                      {inwards?.invoice.invoiceNo}
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

export default UpdateInwards;
