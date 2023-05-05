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
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import Box from "@material-ui/core/Box";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  CardMedia,
  Typography,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import moment from "moment";
import UpdateProduct from "./UpdateProduct";

export const initialValues = {
  name: "",
  price: "",
  stock: "",
};

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  price: Yup.number().required("Price is required"),
  stock: Yup.number()
    .required("Stock  is required")
    .positive("Stock  must be positive"),
});
const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
  successButton: {
    borderRadius: "24px",
    padding: "12px 24px",
    backgroundColor: "	#4169e1",
    color: "#fff",

    "&:hover": {
      backgroundColor: " #198754",
    },
  },
}));

// function formatDate(date) {
//   // Extract the year, month, and day values from the Date object
//   const year = date.getFullYear();
//   let month = date.getMonth() + 1;
//   let day = date.getDate();

//   // Convert the month and day to double digits if necessary
//   month = month.toString().padStart(2, "0");
//   day = day.toString().padStart(2, "0");

// Format the date string
//   const formattedDate = `${day}/${month}/${year}`;

//   return formattedDate;
// }

function Products({}) {
  //   const [godownData, setGodownData] = useState([]);
  //   const classes = useStyles();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(null);
  //   const [id, setId] = useState("");
  //   const [location, setLocation] = useState("");
  //   const [capacity, setCapacity] = useState("");
  //   const [managerId, setmanagerId] = useState(" ");
  //   const [date, setDate] = useState("");

  const [products, setProducts] = useState([]);
  //   const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState(" ");
  const [price, setPrice] = useState(" ");
  const [stock, setStock] = useState(" ");

  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleClickAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleClickEditModalOpen = (product) => {
    setEditModalOpen(product);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(null);
    getData();
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        console.log(response);
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // const handleDelete = async (id) => {

  //       try {

  //         // Delete godown from server

  //         await fetch(`http://localhost:8080/api/godowns/91/${id}`, {

  //           method: 'DELETE',

  //         });

  //         // Delete godown from local state

  //           setUsers(users.filter((user) => user.id !== id));

  //       } catch (error) {

  //         console.error('Error deleting godown:', error);

  //       }

  //     };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleStockChange = (event) => {
    setStock(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = {};

    formData["name"] = name;
    formData["stock"] = stock;

    formData["price"] = price;

    axios
      .post("http://localhost:8080/api/products", formData)
      .then((response) => {
        console.log(response);
        getData();
      })
      .catch((error) => {
        console.error(error);
      });

    setName("");
    setPrice("");
    setStock("");
    handleAddModalClose();
  };

  return (
    <div className="App">
      <Box display="flex" mb={2} justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickAddModalOpen}
        >
          Add Product
        </Button>
      </Box>

      <Dialog
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Add New Product
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
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
                  <Button
                    variant="outlined"
                    onClick={() => setAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
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

      <Grid container spacing={6}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                style={{ height: "180px" }}
                component="img"
                image="https://www.cassidybros.ie/wp-content/uploads/2020/11/product-placeholder.jpg"
                title="product image"
              />
              <CardContent
                style={{
                  padding: "16px 24px",
                }}
              >
                <Typography
                  gutterBottom
                  style={{ fontWeight: "bold" }}
                  variant="h6"
                  component="h4"
                >
                  {product.name}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      {"Stock:"}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {product.stock}
                    </Typography>
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      {"Price:"}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {product.price}
                    </Typography>
                  </div>
                </div>
              </CardContent>
              <CardActions
                style={{
                  padding: "16px 24px",
                }}
              >
                <IconButton
                  color="success"
                  aria-label="edit"
                  onClick={() => handleClickEditModalOpen(product)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  aria-label="delete"
                  onClick={() => handleDelete(product.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <UpdateProduct
        product={editModalOpen}
        handleClose={handleEditModalClose}
      />
    </div>
  );
}

export default Products;
