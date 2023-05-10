import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Grid,
  CardMedia,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

function ProductsStock({ godown }) {
  const { state } = useLocation();

  if (godown === undefined || godown === null) {
    godown = state;
  }

  const [productsStock, setProductsStock] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (godown === undefined || godown === null) {
      return;
    }

    axios
      .get(`http://localhost:8080/api/godowns/${godown?.id}/stock`)
      .then((response) => {
        setProductsStock(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <Grid container spacing={6}>
        {(godown === undefined || godown === null) ?
          <Grid item>Oops! No products are in stock in this godown!</Grid>
          : productsStock.map((productsStock) => (
            <Grid item xs={12} sm={6} md={4} key={productsStock.product.id}>
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
                    {productsStock.product.name}
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
                        {productsStock.product.price}
                      </Typography>
                    </div>

                    <div>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="p"
                      >
                        {"Stock:"}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {productsStock.stock}
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
                        {productsStock.product.weight}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </div>
  );
}

export default ProductsStock;
