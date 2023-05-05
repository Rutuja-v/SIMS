// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@material-ui/core';

// function App() {
//   const [employees, setEmployees] = useState([]);
//   const [employeeName, setEmployeeName] = useState('');
//   const [employeeAge, setEmployeeAge] = useState('');
//   const [employeeSalary, setEmployeeSalary] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:3000/employees')
//       .then(response => setEmployees(response.data))
//       .catch(error => console.log(error));
//   }, []);

//   const handleAddEmployee = (event) => {
//     event.preventDefault();
//     const newEmployee = { name: employeeName, age: employeeAge, salary: employeeSalary };
//     axios.post('http://localhost:3000/employees', newEmployee)
//       .then(response => {
//         setEmployees([...employees, response.data]);
//         setEmployeeName('');
//         setEmployeeAge('');
//         setEmployeeSalary('');
//       })
//       .catch(error => console.log(error));
//   };

//   const handleEditEmployee = (id) => {
//     const updatedEmployee = employees.find(employee => employee.id === id);
//     axios.put(`http://localhost:5000/employees/${id}`, updatedEmployee)
//       .then(response => {
//         const index = employees.findIndex(employee => employee.id === id);
//         const updatedEmployees = [...employees];
//         updatedEmployees[index] = response.data;
//         setEmployees(updatedEmployees);
//       })
//       .catch(error => console.log(error));
//   };

//   const handleDeleteEmployee = (id) => {
//     axios.delete(`http://localhost:5000/employees/${id}`)
//       .then(() => {
//         const updatedEmployees = employees.filter(employee => employee.id !== id);
//         setEmployees(updatedEmployees);
//       })
//       .catch(error => console.log(error));
//   };

//   return (
//     <div>
//       <h1>Employee Management System</h1>
//       <form onSubmit={handleAddEmployee}>
//         <TextField label="Name" value={employeeName} onChange={(event) => setEmployeeName(event.target.value)} />
//         <TextField label="Age" value={employeeAge} onChange={(event) => setEmployeeAge(event.target.value)} />
//         <TextField label="Salary" value={employeeSalary} onChange={(event) => setEmployeeSalary(event.target.value)} />
//         <Button type="submit" variant="contained" color="primary">Add Employee</Button>
//       </form>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Age</TableCell>
//               <TableCell>Salary</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {employees.map(employee => (
//               <TableRow key={employee.id}>
//                 <TableCell>{employee.name}</TableCell>
//                 <TableCell>{employee.age}</TableCell>
//                 <TableCell>{employee.salary}</TableCell>
//                 <TableCell>
//                   <Button variant="contained" color="primary" onClick={() => handleEditEmployee(employee.id)}>Edit</Button>
//                   <Button variant="contained" color="secondary" onClick={() => handleDeleteEmployee(employee.id)}>Delete</Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// }

// export default App;
