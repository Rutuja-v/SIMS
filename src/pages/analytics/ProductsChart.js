import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { InputLabel, FormControl, MenuItem, Select } from '@mui/material';
const ProductsChart = () => {
  const [products, setProducts] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [selectedGodown, setSelectedGodown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGodowns = async () => {
      const response = await axios.get('http://localhost:8080/api/godowns');
      setGodowns(response.data);
      if (response.data.length > 0) {
        setSelectedGodown(response.data[0].id);
      }
    };

    fetchGodowns();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedGodown) {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/godowns/${selectedGodown}/stock`);
        setProducts(response.data.map((item) => ({ name: item.product.name, stock: item.stock })));
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedGodown]);

  const handleGodownChange = (event) => {
    setSelectedGodown(event.target.value);
  };

  const productData = products.reduce((acc, curr) => {
    const name = curr.name || 'Unknown';
    if (acc[name]) {
      acc[name] += curr.stock;
    } else {
      acc[name] = curr.stock;
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(productData),
    datasets: [
      {
        data: Object.values(productData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#E7E9ED',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#808080',
        ],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: true,
    radius: '80%', // set radius to 50% of chart area
  };

  return (
    <div style={{ width: '400px', height: 'auto', margin: '0 auto' }}>
      <h6 style={{ textAlign: 'center' }}>Products Stock by Godown</h6>
      <div style={{ marginBottom: '20px' }}>
        <FormControl variant="outlined" style={{ minWidth: '150px' }}>
          <InputLabel id="godown-label">Select Godown</InputLabel>
          <Select
            labelId="godown-label"
            id="godown"
            value={selectedGodown || ''}
            onChange={handleGodownChange}
            label="Select Godown"
          >
            {godowns.map((godown) => (
              <MenuItem key={godown.id} value={godown.id}>
                {godown.location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products in the selected godown.</p>
      ) : (
        <Pie data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default ProductsChart;

