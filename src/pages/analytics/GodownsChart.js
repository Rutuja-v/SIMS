import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const GodownsChart = () => {
  const [godowns, setGodowns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGodowns = async () => {
      const response = await axios.get('http://localhost:8080/api/godowns');
      setGodowns(response.data);
      setIsLoading(false);
    };

    fetchGodowns();
  }, []);

  const categoryData = godowns.reduce((acc, curr) => {
    const capacity = curr.capacityInQuintals || 0;
    const location = curr.location || 'Unknown';
    if (acc[location]) {
      acc[location] += capacity;
    } else {
      acc[location] = capacity;
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
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
      <h6 style={{ textAlign: 'center' }}>Godown Capacitiy by Location</h6>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Pie data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default GodownsChart;
