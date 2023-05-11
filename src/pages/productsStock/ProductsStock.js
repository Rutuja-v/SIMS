import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Grid, CardMedia, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import productImage from "../../Components/assets/product.jpg";

function ProductsStock({ godown }) {
  const { state } = useLocation();
  const [currentCapacity, setCurrentCapacity] = useState(null);

  if (godown === undefined || godown === null) {
    godown = state;
  }

  const [productsStock, setProductsStock] = useState(null);

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

    axios
      .get(`http://localhost:8080/api/godowns/${godown?.id}/currentCapacity`)
      .then((response) => {
        setCurrentCapacity(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  let children;

  if (godown === undefined || godown === null) {
    children = <Grid item>Oops! You are not mapped to a godown yet.</Grid>;
  } else if (productsStock !== null && productsStock.length === 0) {
    children = <Grid item>Oops! No products are in stock in this godown!</Grid>;
  } else {
    children =
      productsStock &&
      productsStock.map((productsStock) => (
        <Grid item xs={12} sm={6} md={4} key={productsStock.product.id}>
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
      ));
  }

  return (
    <div>
      {(godown !== undefined || godown !== null) && (
        <div style={{ textAlign: "end", marginBottom: "8px" }}>
          <Typography color="textSecondary">
            {"Current capacity/Total capacity: "}
          </Typography>
          <Typography>
            {(currentCapacity !== null ? currentCapacity : "---") +
              "/" +
              (godown ? godown.capacityInQuintals : "---")}
          </Typography>
          {currentCapacity !== null && (
            <Typography color="textSecondary">
              {"The godown is " +
                (godown
                  ? parseFloat(
                      (
                        (currentCapacity / godown.capacityInQuintals) *
                        100
                      ).toFixed(2)
                    )
                  : "--") +
                "% full"}
            </Typography>
          )}
        </div>
      )}
      <Grid container spacing={6}>
        {children}
      </Grid>
    </div>
  );
}

export default ProductsStock;
