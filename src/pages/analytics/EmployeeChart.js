import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const EmployeeChart = () => {
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get("http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/employees");
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const { data } = await axios.get("http://ec2-13-232-253-161.ap-south-1.compute.amazonaws.com:8080/api/godowns");
        setLocations(data.filter(Boolean).map((godown) => godown.location));
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchEmployees();
    }, 5000);

    fetchEmployees();
    fetchLocations();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (employees.length === 0 || locations.length === 0) {
      return;
    }

    const employeeCounts = locations.map((location) => {
      const count = employees.filter(
        (employee) => employee.godown && employee.godown.location === location
      ).length;
      return count;
    });

    const chartData = {
      labels: locations,
      datasets: [
        {
          label: "Employee Count",
          data: employeeCounts,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          barThickness: 30,
          maxBarThickness: 50,
        },
      ],
    };

    setChartData(chartData);
  }, [employees, locations]);

  return (
    <div>

      <strong>
        <h7 style={{ marginLeft: "320px" }}>Employees by Location</h7>
      </strong>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            indexAxis: "x",
            scales: {
              y: {
                type: "linear",
                ticks: {
                  precision: 0,
                },
                stepSize: 10,
              },
            },
            plugins: {
              legend: {
                position: "right",
              },
            },
          }}
          height={"100px"}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EmployeeChart;
