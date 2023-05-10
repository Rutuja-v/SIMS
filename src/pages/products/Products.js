import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/ContextProvider";
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
import productImage from "../../Components/assets/product.jpg";
import Notification from "../../Components/Notification";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  CardMedia,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import UpdateProduct from "./UpdateProduct";

const useStyles = makeStyles((theme) => ({
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

function Products() {
  const [user] = useContext(Context);
  const classes = useStyles();

  const [products, setProducts] = useState([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalItem, setEditModalItem] = useState(null);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
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

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (product) => {
    setEditModalItem(product);
  };
  const handleEditModalClose = () => {
    setEditModalItem(null);
    getData();
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
    setNotify({
      isOpen: true,
      message: "Product Deleted Successfully",
      type: "error",
    });
  };

  const formik = useFormik({
    initialValues: {
      name: null,
      price: null,
      weight: null,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be positive"),
      weight: Yup.number()
        .required("Weight is required")
        .positive("Weight must be positive"),
    }),
    onSubmit: (values, { resetForm }) => {
      let formData = {};

      formData["name"] = values.name;
      formData["price"] = values.price;
      formData["weight"] = values.weight;

      console.log(formData);

      axios
        .post("http://localhost:8080/api/products", formData)
        .then((response) => {
          getData();
        })
        .catch((error) => {
          console.error(error);
        });
      resetForm();
      handleAddModalClose();
      setNotify({
        isOpen: true,
        message: "Product Submitted Successfully",
        type: "success",
      });
    },
  });
  function toSentenceCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  useEffect(() => {
    if (!addModalOpen) {
      formik.resetForm();
    }
  }, [addModalOpen]);

  return (
    <div className="App">
      {user.role === "superadmin" && (
        <Box display="flex" mb={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddModalOpen}
          >
            Add new
          </Button>
        </Box>
      )}

      <Dialog
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Add a product
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
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
                // autoFocus
                id="name"
                label="Name"
                type="text"
                variant="outlined"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && formik.errors.name ? true : false}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                id="price"
                label="Price"
                type="number"
                variant="outlined"
                {...formik.getFieldProps("price")}
                error={
                  formik.touched.price && formik.errors.price ? true : false
                }
                helperText={formik.touched.price && formik.errors.price}
              />
              <TextField
                id="weight"
                label="Weight"
                type="number"
                inputProps={{ min: 1 }}
                variant="outlined"
                {...formik.getFieldProps("weight")}
                error={
                  formik.touched.weight && formik.errors.weight ? true : false
                }
                helperText={formik.touched.weight && formik.errors.weight}
              />
            </div>

            <DialogActions>
              <Button variant="outlined" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                    disabled={!formik.isValid || !formik.dirty} type="submit" variant="contained" >
                Add
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Grid container spacing={6}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                style={{ height: "180px" }}
                component="img"
                image={productImage}
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
                      {"Price:"}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {product.price}
                    </Typography>
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      {"Weight (in quintals):"}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {product.weight}
                    </Typography>
                  </div>
                </div>
              </CardContent>
              {user.role === "superadmin" && (
                <CardActions
                  style={{
                    padding: "16px 24px",
                  }}
                >
                  <IconButton
                    color="success"
                    aria-label="edit"
                    onClick={() => handleEditModalOpen(product)}
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
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
      <UpdateProduct
        product={editModalItem}
        handleClose={handleEditModalClose}
      />
    </div>
  );
}

export default Products;
