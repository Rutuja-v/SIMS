import React, { useContext } from "react";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/products/Products";
import { makeStyles } from "@material-ui/core";
import Dashboard from "./pages/dashboard/Dashboard";
import Employees from "./pages/employees/Employees";
import Home from "./pages/Home";
import ContextProvider, { Context } from "./context/ContextProvider";
import DashboardLayout from "./pages/DashboardLayout";
import Godowns from "./pages/dashboard/godowns/Godowns";

import Inwards from "./pages/inwards/inwards";
import Outwards from "./pages/outwards/outwards";
import Returns from "./pages/returns/Returns";

function App() {
  return (
    <ContextProvider>
      <Context.Consumer>
        {([user]) => (
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    user !== null ? (
                      <DashboardLayout />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                >
                  <Route index element={<Godowns />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="inwards" element={<Inwards />} />
                  <Route path="outwards" element={<Outwards />} />
                  {/* <Route path="maincontent" element={<MainContent />} /> */}
                  <Route path="products" element={<Products />} />
                  <Route path="returns" element={<Returns />} />
                </Route>
                <Route
                  path="/login"
                  element={
                    user === null ? <Login /> : <Navigate to="/" replace />
                  }
                />
              </Routes>
            </BrowserRouter>
          </div>
        )}
      </Context.Consumer>
    </ContextProvider>
  );
}

export default App;
