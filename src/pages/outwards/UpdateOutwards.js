import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";
import * as Yup from "yup";

import { Formik, Form } from "formik";

const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

function UpdateOutwards({ outwards, handleClose }) {
  const classes = useStyles();

  const [godownId, setGodownId] = useState("");
  const [productId, setProductId] = useState("");
  const [deliveredTo, setDeliveredTo] = useState("");
  const [supplyDate, setSupplyDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [receiptNo, setReceiptNo] = useState("");

  useEffect(() => {
    setGodownId(outwards?.godown.id);
    setProductId(outwards?.product.id);
    setDeliveredTo(outwards?.deliveredTo);
    setSupplyDate(outwards?.deliveredTo);
    setDeliveryDate(outwards?.deliveryDate);
    setInvoiceNo(outwards?.invoiceNo);
    setReceiptNo(outwards?.receiptNo);
  }, [outwards]);

  const handleGodownIdChange = (event) => {
    setGodownId(event.target.value);
  };

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };
  const handleDeliveredToChange = (event) => {
    setDeliveredTo(event.target.value);
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
  const handleReceiptNoChange = (event) => {
    setReceiptNo(event.target.value);
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
    formData["deliveredTo"] = deliveredTo;
    formData["supplyDate"] = supplyDate;
    formData["deliveryDate"] = deliveryDate;
    formData["invoiceNo"] = {
      id: invoiceNo,
    };
    formData["receiptNo"] = receiptNo;

    console.log(formData);

    await axios
      .put(`http://localhost:8080/api/outwards/${outwards?.id}`, formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    setGodownId("");
    setProductId("");
    setDeliveredTo("");
    setSupplyDate("");
    setDeliveryDate("");
    setInvoiceNo("");
    setReceiptNo("");
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
                <TextField
                  autoFocus
                  id="name"
                  label="Name"
                  type="text"
                  variant="outlined"
                  value={godownId}
                  onChange={handleNameChange}
                />
                <TextField
                  id="stock"
                  label="Stock"
                  type="number"
                  variant="outlined"
                  value={productId}
                  onChange={handleStockChange}
                />
                <TextField
                  id="price"
                  label="Price"
                  type="number"
                  variant="outlined"
                  value={deliveredTo}
                  onChange={handlePriceChange}
                />
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
    </Dialog>
  );
}

export default UpdateOutwards;
