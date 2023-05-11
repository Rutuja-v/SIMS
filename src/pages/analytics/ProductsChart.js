import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

const GodownsChart = () => {
  const [godowns, setGodowns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingCapacity, setRemainingCapacity] = useState({});

  useEffect(() => {
    const fetchGodowns = async () => {
      const response = await axios.get("http://localhost:8080/api/godowns");
      setGodowns(response.data);
      setIsLoading(false);
    };

    fetchGodowns();
  }, []);

  useEffect(() => {
    const fetchRemainingCapacity = async () => {
      const remainingCapacityData = {};
      for (const godown of godowns) {
        const response = await axios.get(
          `http://localhost:8080/api/godowns/${godown.id}/stock`
        );
        const usedCapacity = response.data.reduce(
          (total, item) => total + item.stock * item.product.weight,
          0
        );
        const remainingCapacity = godown.capacityInQuintals - usedCapacity;
        remainingCapacityData[godown.id] = remainingCapacity;
      }
      setRemainingCapacity(remainingCapacityData);
    };

    fetchRemainingCapacity();
  }, [godowns]);

  const categoryData = godowns.reduce((acc, curr) => {
    const capacity = curr.capacityInQuintals || 0;
    const location = curr.location || "Unknown";
    if (acc[location]) {
      acc[location].capacity += capacity;
      acc[location].remainingCapacity += remainingCapacity[curr.id] || 0;
    } else {
      acc[location] = {
        capacity,
        remainingCapacity: remainingCapacity[curr.id] || 0,
      };
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Capacity",
        data: Object.values(categoryData).map((item) => item.capacity),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#E7E9ED",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#808080",
        ],
      },
      {
        label: "Remaining Capacity",
        data: Object.values(categoryData).map((item) => item.remainingCapacity),
        backgroundColor: [
          "#FF8A80",
          "#80D8FF",
          "#FFFF8D",
          "#F5F5F5",
          "#A7FFEB",
          "#D7AEFB",
          "#FFD180",
          "#9E9E9E",
        ],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: true,
    radius: "80%", // set radius to 50% of chart area
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const location = data.labels[tooltipItem.index];
          const capacity = data.datasets[0].data[tooltipItem.index];
          const remainingCapacity = categoryData[location].remainingCapacity;
          return `${location}: ${capacity}Q (${remainingCapacity}Q remaining)`;
        },
      },
    },
  };

  return (
    <div style={{ width: "400px", height: "auto", margin: "0 auto" }}>
      {/* <h6 style={{ textAlign: 'center' }}>Godown Capacity by Location</h6> */}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Pie data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default GodownsChart;
