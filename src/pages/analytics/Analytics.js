import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import moment from "moment";
import ProductsChart from "./ProductsChart";
import { useContext } from "react";
import { Context } from "../../context/ContextProvider";
import EmployeeChart from "./EmployeeChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

import {
  PieChart,
  Pie,
  Legend,
  Cell,
  ResponsiveContainer,
  Label,
  Tooltip,
} from "recharts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);
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
      text: "Godown (Capacity Vs. Location)",
    },
  },
};

const optionsForProductsData = {
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
      text: "Products Vs Quantity (Inwards & Outwards)",
    },
  },
};

const optionsForSupplierData = {
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
      text: "Supplier Vs Quantity (Inwards)",
    },
  },
};

const COLORS = ["#FF6384", "#36A2EB"];
const COLORS_1 = ["#FFCE56", "#4BC0C0"];

const CustomTooltip = ({ active, payload, label }) => {
  console.log("Pay", payload);

  if (active) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#ffff",
          padding: "5px",
          border: "1px solid #cccc",
        }}
      >
        <label> {`${payload[0].name} : ${payload[0].value}`} </label>
      </div>
    );
  }

  return null;
};

const Analytics = () => {
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

  const [user] = useContext(Context);

  const [productsData, setProductsData] = useState({
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

  const [supplierData, setSupplierData] = useState({
    datasets: [
      {
        label: "Dataset 1",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(25, 90, 13, 0.5)",
      }
    ],
  });

  const [pieDataForReturns, setPieDataForReturns] = useState([
    {
      name: "Cancelled",
      value: 0,
    },
    {
      name: "Damaged",
      value: 0,
    },
  ]);

  const [pieDataForSalesAndService, setPieDataForSalesAndService] = useState([
    {
      name: "Service",
      value: 0,
    },
    {
      name: "Sales",
      value: 0,
    },
  ]);
  

  useEffect(() => {
    const fetchData = async () => {
      let outwards =
        "http://localhost:8080/api/outwards";
      let inwards =
        "http://localhost:8080/api/inwards";
      let returns =
        "http://localhost:8080/api/returns";
      if (user.role !== "superadmin") {
        returns = returns + `?godownId=${user.godown?.id}`;
        inwards = inwards + `?godownId=${user.godown?.id}`;
        outwards = outwards + `?godownId=${user.godown?.id}`;
      }

      const labelSet = [];
      const dataSet1 = [];
      const dataSet2 = [];

      let labelSetForProductsData = [];
      let dataSetForInwardsProducts = [];
      let dataSetForOutwardsProducts = [];

      let labelSetForSupplierData = [];
      let dataSetForInwardsSupplier = [];

      await fetch(outwards)
        .then((data) => {
          console.log("API data", data);
          const res = data.json();
          return res;
        })
        .then((res) => {
          console.log("res", res);
          for (const val of res) {
            labelSet.push(val.godown.location);
            dataSet1.push(val.godown.capacityInQuintals);
            dataSet2.push(val.godown.capacityInQuintals);

            if (labelSetForProductsData.includes(val.product.name)) {
              let idx = labelSetForProductsData.findIndex(
                (item) => item == val.product.name
              );
              dataSetForOutwardsProducts[idx] =
                Number(dataSetForOutwardsProducts[idx]) + Number(val.quantity);
            } else {
              labelSetForProductsData.push(val.product.name);
              dataSetForOutwardsProducts.push(val.quantity);
            }

            if (val.purpose == "service") {
              pieDataForSalesAndService[0].value =
                Number(pieDataForSalesAndService[0].value) + Number(val.quantity);
            } else if (val.purpose == "sales") {
              pieDataForSalesAndService[1].value =
                Number(pieDataForSalesAndService[1].value) + Number(val.quantity);
            }

            setPieDataForSalesAndService(pieDataForSalesAndService);
            // labelSet.push(val.name)
          }
          console.log(
            "arrData",
            dataSet1,
            dataSet2,
            dataSetForOutwardsProducts
          );
        })
        .catch((e) => {
          console.log("error", e);
        });

      await fetch(inwards)
        .then((data) => {
          console.log("API data", data);
          const res = data.json();
          return res;
        })
        .then((res) => {
          console.log("res", res);
          for (let i = 0; i < dataSetForOutwardsProducts.length; i++) {
            dataSetForInwardsProducts.push(0);
          }
          for (const val of res) {
            if (labelSetForProductsData.includes(val.product.name)) {
              let idx = labelSetForProductsData.findIndex(
                (item) => item == val.product.name
              );
              dataSetForInwardsProducts[idx] =
                Number(dataSetForInwardsProducts[idx]) + Number(val.quantity);
            } else {
              labelSetForProductsData.push(val.product.name);
              dataSetForInwardsProducts.push(val.quantity);
            }

            if (labelSetForSupplierData.includes(val.supplier.name)) {
              let idx = labelSetForSupplierData.findIndex(
                (item) => item == val.supplier.name
              );
              dataSetForInwardsSupplier[idx] =
                Number(dataSetForInwardsSupplier[idx]) + Number(val.quantity);
            } else {
              labelSetForSupplierData.push(val.supplier.name);
              dataSetForInwardsSupplier.push(val.quantity);
            }
            // labelSet.push(val.name)
          }

          if (
            dataSetForInwardsProducts.length > dataSetForOutwardsProducts.length
          ) {
            for (
              let i = 0;
              i <
              dataSetForInwardsProducts.length -
              dataSetForOutwardsProducts.length;
              i++
            ) {
              dataSetForOutwardsProducts.push(0);
            }
          }

          console.log(
            "arrData",
            dataSet1,
            dataSet2,
            dataSetForOutwardsProducts
          );
        })
        .catch((e) => {
          console.log("error", e);
        });

      console.log("user", user);

      await fetch(returns)
        .then((data) => {
          console.log("API data", data);
          const res = data.json();
          return res;
        })
        .then((res) => {
          console.log("res", res);

          for (const val of res) {
            if (val.reason == "cancelled") {
              pieDataForReturns[0].value =
                Number(pieDataForReturns[0].value) + Number(val.quantity);
            } else if (val.reason == "damaged") {
              pieDataForReturns[1].value =
                Number(pieDataForReturns[1].value) + Number(val.quantity);
            }
          }

          setPieDataForReturns(pieDataForReturns);
        })
        .catch((e) => {
          console.log("error", e);
        });

      setData({
        labels: labelSet,
        datasets: [
          {
            label: "Inwards",
            data: dataSet1,
            borderColor: "#495057",
            backgroundColor: "#6c757d;",
          },
          {
            label: "Outwards",
            data: dataSet2,
            borderColor: "#495057",
            backgroundColor: "#ced4da",
          },
        ],
      });

      setProductsData({
        labels: labelSetForProductsData,
        datasets: [
          {
            label: "Inwards",
            data: dataSetForInwardsProducts,
            borderColor: "#495057",
            backgroundColor: "#6c757d;",
          },
          {
            label: "Outwards",
            data: dataSetForOutwardsProducts,
            borderColor: "#495057",
            backgroundColor: "#ced4da",
          },
        ],
      });

      setSupplierData({
        labels: labelSetForSupplierData,
        datasets: [
          {
            label: "Inwards",
            data: dataSetForInwardsSupplier,
            borderColor: "#495057",
            backgroundColor: "#6c757d;",
          }
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {user.role === "superadmin" && (
        <>
          <br></br>
          <br></br>
          <div
            style={{
              marginBottom: "40px",
              border: "1px solid gray",
              padding: "20px",
            }}
          >
            <EmployeeChart />
          </div>
        </>
      )}
      <br></br>
      <br></br>
      <div
        style={{
          marginBottom: "40px",
          border: "1px solid gray",
          padding: "20px",
        }}
      >
        <Bar
          height={"80px"}
          data={productsData}
          options={optionsForProductsData}
        />
      </div>
      <br></br>
      <br></br>
      <div
        style={{
          marginBottom: "40px",
          border: "1px solid gray",
          padding: "20px",
        }}
      >
        <Bar
          height={"80px"}
          data={supplierData}
          options={optionsForSupplierData}
        />
      </div>
      <br></br>
      <br></br>
      <div
        style={{
          marginBottom: "40px",
          border: "1px solid gray",
          padding: "20px",
        }}
      >
        <strong>
          <p style={{ marginLeft: "505px", color: '#777777', fontSize : '15px' }}>
            {" "}
            Returns (Cancelled vs Damaged)
          </p>
        </strong>

        <PieChart justify-content="center" width={1250} height={350}>
          <Pie
            data={pieDataForReturns}
            color="#000000"
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
          >
            {pieDataForReturns.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </div>
      <>{/*  */}</>
      <div
        style={{
          marginBottom: "40px",
          border: "1px solid gray",
          padding: "20px",
          justifyContent : 'center'
        }}
      >
        <strong>
          <p style={{ marginLeft: "520px", color: '#777777', fontSize : '15px' }}>
            {" "}
            Sales vs Service (Outwards)
          </p>
        </strong>

        <PieChart width={1250} height={350} fill="#8884d8">
          <Pie
            data={pieDataForSalesAndService}
            color="#000000"
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
          >
            {pieDataForSalesAndService.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS_1[index % COLORS_1.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </div>
      {user.role === "superadmin" && (
        <>
          <div
            style={{
              marginBottom: "40px",
              border: "1px solid gray",
              padding: "20px",
            }}
          >
            <strong>
              <p style={{ marginLeft: "525px", color: '#777777', fontSize : '15px' }}> Products Stock by Godown</p>
            </strong>
            <ProductsChart godownId={3} />
          </div>
        </>
      )}
    </div>
  );
};
export default Analytics;
