// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';

// const Analytics = () => {
//   const [employees, setEmployees] = useState([]);
//   const [employeeRoles, setEmployeeRoles] = useState([]);
//   const [chartData, setChartData] = useState({});

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const { data } = await axios.get('http://localhost:8080/api/employees');
//         setEmployees(data);
//       } catch (error) {
//         console.error('Error fetching employees:', error);
//       }
//     };

//     const fetchEmployeeRoles = async () => {
//       try {
//         const { data } = await axios.get('http://localhost:8080/api/employeeRoles');
//         setEmployeeRoles(data);
//       } catch (error) {
//         console.error('Error fetching employee roles:', error);
//       }
//     };

//     const intervalId = setInterval(() => {
//       fetchEmployees();
//     }, 5000);

//     fetchEmployees();
//     fetchEmployeeRoles();

//     return () => clearInterval(intervalId);
//   }, []);

  // useEffect(() => {
  //   if (employees.length === 0 || !employeeRoles) {
  //     return;
  //   }

//     const roleCount = employeeRoles.reduce((acc, role) => {
//       const count = employees.filter((employee) => employee.role.role === role.role).length;
//       acc[role.role] = count;
//       return acc;
//     }, {});

//     const chartData = {
//       labels: employeeRoles.map((role) => role.role),
//       datasets: [
//         {
//           label: 'Employee Count',
//           data: employeeRoles.map((role) => roleCount[role.role] || 0),
//         },
//       ],
//     };

//     setChartData(chartData);
//   }, [employees, employeeRoles]);

//   return (
//     <div>
//       <h1>Employee Analytics</h1>
//       {employees.length === 0 || !employeeRoles ? (
//         <p>Loading...</p>
//       ) : (
//         <Bar data={chartData} />
//       )}
//     </div>
//   );
// };

// export default Analytics;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function Analytics() {
//   const [employeeData, setEmployeeData] = useState([]);
//   const [employeeRolesData, setEmployeeRolesData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       const employeeDataResponse = await axios.get(
//         "http://localhost:8080/api/employees"
//       );
//       const employeeRolesDataResponse = await axios.get(
//         "http://localhost:8080/api/employeeRoles"
//       );
//       setEmployeeData(employeeDataResponse.data);
//       setEmployeeRolesData(employeeRolesDataResponse.data);
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   const getEmployeeCountsByRole = () => {
//     const employeeCounts = {};
//     employeeData.forEach((employee) => {
//       const role = employee.role.role;
//       if (!employeeCounts[role]) {
//         employeeCounts[role] = 1;
//       } else {
//         employeeCounts[role]++;
//       }
//     });
//     const employeeCountsByRole = [];
//     employeeRolesData.forEach((role) => {
//       employeeCountsByRole.push({
//         role: role.role,
//         count: employeeCounts[role.role] || 0,
//       });
//     });
//     return employeeCountsByRole;
//   };

//   const renderBarChart = () => {
//     const employeeCountsByRole = getEmployeeCountsByRole();
//     const chartData = employeeCountsByRole.map((role) => {
//       return {
//         name: role.role,
//         value: role.count,
//       };
//     });
//     const maxCount = Math.max(...chartData.map((item) => item.value));
//     return (
//       <div style={{ marginTop: "20px", display: "flex" }}>
//         <div style={{ display: "flex", flexDirection: "column-reverse" }}>
//           {chartData.map((item, index) => (
//             <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
//               <div style={{ width: "160px" }}>
//                 {item.name}
//               </div>
//               <div style={{ width: `${item.value / maxCount * 400}px`, height: "20px", backgroundColor: "#0074D9", marginLeft: "10px" }} />
//               <div style={{ marginLeft: "10px" }}>
//                 {item.value}
//               </div>
//             </div>
//           ))}
//         </div>
//         <div style={{ marginLeft: "20px", borderLeft: "1px solid #ccc", paddingLeft: "20px" }}>
//           <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
//             <div style={{ width: "60px" }}>
//               Number of Employees
//             </div>
//             <div style={{ width: "400px", textAlign: "right" }}>
//               {maxCount}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   } else {
//     return (
//       <div>
//         <h3>Employees</h3>
//         {renderBarChart()}
//       </div>
//     );
//   }
// }

// import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { Bar } from "react-chartjs-2";
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );
// const options = {
//   indexAxis: "y",
//   elements: {
//     bar: {
//       borderWidth: 2,
      
//     },
//   },
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "right",
//     },
//     title: {
//       display: true,
//       text: "godown (Capacity Vs. Location)",
//     },
//   },
// };

// const Analytics = () => {
//   const [data, setData] = useState({
//     datasets: [
//       {
//         label: "Dataset 1",
//         data: [],
//         borderColor: "rgb(255, 99, 132)",
//         backgroundColor: "rgba(25, 90, 13, 0.5)",
//       },
//       {
//         label: "Dataset 2",
//         data: [],
//         borderColor: "rgb(53, 162, 235)",
//         backgroundColor: "rgba(53, 162, 235, 0.5)",
//       },
//     ],
//   });
//   // const [employeeData, setEmployeeData] = useState([]);
// const [employees, setEmployees] = useState([]);
// const [employeeRoles, setEmployeeRoles] = useState([]);
// const [chartData, setChartData] = useState({});

//   // useEffect(() => {
//   //   axios.get('https://example.com/employee-data')
//   //     .then(response => {
//   //       setEmployeeData(response.data);
//   //     })
//   //     .catch(error => {
//   //       console.error(error);
//   //     });
//   // }, []);
//   useEffect(() => {
//         const fetchEmployees = async () => {
//           try {
//             const { data } = await axios.get('http://localhost:8080/api/employees');
//             setEmployees(data);
//           } catch (error) {
//             console.error('Error fetching employees:', error);
//           }
//         };
    
//         const fetchEmployeeRoles = async () => {
//           try {
//             const { data } = await axios.get('http://localhost:8080/api/employeeRoles');
//             setEmployeeRoles(data);
//           } catch (error) {
//             console.error('Error fetching employee roles:', error);
//           }
//         };
    
//         const intervalId = setInterval(() => {
//           fetchEmployees();
//         }, 5000);
    
//         fetchEmployees();
//         fetchEmployeeRoles();
    
//         return () => clearInterval(intervalId);
//       }, []);
    
//       useEffect(() => {
//         if (employees.length === 0 || !employeeRoles) {
//           return;
//         }
    
//         const roleCount = employeeRoles.reduce((acc, role) => {
//           const count = employees.filter((employee) => employee.role.role === role.role).length;
//           acc[role.role] = count;
//           return acc;
//         }, {});
//         const chartData = {
//                labels: employeeRoles.map((role) => role.role),
//                 datasets: [
//                   {
//                     label: 'Employee Count',
//                     data: employeeRoles.map((role) => roleCount[role.role] || 0),
//                   },
//                 ],
//               };
          
//               setChartData(chartData);
//             }, [employees, employeeRoles]);
//   useEffect(() => {
//     const fetchData = async () => {
//       const outwards = "http://localhost:8080/api/outwards";
//       const inwards = "http://localhost:8080/api/inwards";
//       const labelSet = [];
//       const dataSet1 = [];
//       const dataSet2 = [];
//       await fetch(outwards)
//         .then((data) => {
//           console.log("Api data", data);
//           const res = data.json();
//           return res;
//         })
//         .then((res) => {
//           console.log("ressss", res);
//           for (const val of res) {
//             labelSet.push(val.godown.location);
//             dataSet1.push(val.godown.capacityInQuintals);
//             dataSet2.push(val.godown.capacityInQuintals);
//             // labelSet.push(val.name)
//           }
//           setData({
//             labels: labelSet,
//             datasets: [
//               {
//                 label: "Inwards",
//                 data: dataSet1,
//                 borderColor: "#495057",
//                 backgroundColor:"#6c757d;",
//               },
//               {
//                 label: "Outwards",
//                 data: dataSet2,
//                 borderColor: "#495057",
//                 backgroundColor: "#ced4da"
//               },
//             ],
//           });
//           console.log("arrData", dataSet1, dataSet2);
//         })
//         .catch((e) => {
//           console.log("error", e);
//         });
//     };

//     fetchData();
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "500%" }}>
//       <Bar data={data} options={options} />
//       <h1>Employee Analytics</h1>
//       {employees.length === 0 || !employeeRoles ? (
//         <p>Loading...</p>
//       ) : (
//         <Bar data={chartData} />
//      )}
//     </div>

    
 
   
//   );
// };
// export default Analytics;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
      
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "godown (Capacity Vs. Location)",
    },
  },
};

const Analytics = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [data, setData] = useState({
        datasets: [
          {
            label: "Dataset 1",
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(25, 90, 13, 0.5)",
          },
          {
            label: "Dataset 2",
            data: [],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });
      useEffect(() => {
            const fetchData = async () => {
              const outwards = "http://localhost:8080/api/outwards";
              const inwards = "http://localhost:8080/api/inwards";
              const labelSet = [];
              const dataSet1 = [];
              const dataSet2 = [];
              await fetch(outwards)
                .then((data) => {
                  console.log("Api data", data);
                  const res = data.json();
                  return res;
                })
                .then((res) => {
                  console.log("ressss", res);
                  for (const val of res) {
                    labelSet.push(val.godown.location);
                    dataSet1.push(val.godown.capacityInQuintals);
                    dataSet2.push(val.godown.capacityInQuintals);
                    // labelSet.push(val.name)
                  }
                  setData({
                    labels: labelSet,
                    datasets: [
                      {
                        label: "Inwards",
                        data: dataSet1,
                        borderColor: "#495057",
                        backgroundColor:"#6c757d;",
                      },
                      {
                        label: "Outwards",
                        data: dataSet2,
                        borderColor: "#495057",
                        backgroundColor: "#ced4da"
                      },
                    ],
                  });
                  console.log("arrData", dataSet1, dataSet2);
                })
                .catch((e) => {
                  console.log("error", e);
                });
            };
        
            fetchData();
          }, []);
        
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
    
    <div style={{ width: "100%", height: "500%" }}>
      <Bar data={data} options={options} />
      {chartData ? (
        <Bar
          data={chartData}
          options={{ 
            indexAxis: 'y',
            scales: {
              y: {
                stepSize: 2
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
export default Analytics;