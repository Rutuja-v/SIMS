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


export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  stock: Yup.number()
    .required("Stock is required")
    .positive("Stock must be positive"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
});

const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

function UpdateProduct({ product, handleClose }) {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setName(product?.name);
    setStock(product?.stock);
    setPrice(product?.price);
  }, [product]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleStockChange = (event) => {
    setStock(event.target.value);
  };
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formData = {};
    formData["name"] = name;
    formData["stock"] = stock;
    formData["price"] = price;

    console.log(formData);

    await axios
      .put(`http://localhost:8080/api/products/${product?.id}`, formData)
      .then((response) => {

      })
      .catch((error) => {
        console.error(error);
      });

    setName("");
    setStock("");
    setPrice("");
    handleClose();
  };

  return (
    <Dialog
      open={product != null}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className={classes.customTitle}>
        Edit product
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
                  value={name}
                  onChange={handleNameChange}
                />
                <TextField
                  id="stock"
                  label="Stock"
                  type="number"
                  variant="outlined"
                  value={stock}
                  onChange={handleStockChange}
                />
                <TextField
                  id="price"
                  label="Price"
                  type="number"
                  variant="outlined"
                  value={price}
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

export default UpdateProduct;
