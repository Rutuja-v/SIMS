import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

const EmployeeChart = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/employees');
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchEmployeeRoles = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/employeeRoles');
        setEmployeeRoles(data);
      } catch (error) {
        console.error('Error fetching employee roles:', error);
      }
    };

    const intervalId = setInterval(() => {
      fetchEmployees();
    }, 5000);

    fetchEmployees();
    fetchEmployeeRoles();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (employees.length === 0 || !employeeRoles) {
      return;
    }

    const roleCount = employeeRoles.reduce((acc, role) => {
      const count = employees.filter((employee) => employee.role.role === role.role).length;
      acc[role.role] = count;
      return acc;
    }, {});

    const chartData = {
      labels: employeeRoles.map((role) => role.role),
      datasets: [
        {
          label: 'Employee Count',
          data: employeeRoles.map((role) => roleCount[role.role] || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    setChartData(chartData);
  }, [employees, employeeRoles]);

  return (
    <div>
      <h6 style={{ textAlign: 'center' }}>Employees</h6>

      {chartData ? (
        <Bar
          data={chartData}
          options={{ 
            indexAxis: 'y',
            scales: {
              x: {
                stepSize:5,min:0,max:10
              }
            }
          }}
          width={200}
          height={50}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default EmployeeChart;