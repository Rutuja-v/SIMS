import React from "react";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/products/Products";
import Employees from "./pages/employees/Employees";
import ContextProvider, { Context } from "./context/ContextProvider";
import DashboardLayout from "./pages/DashboardLayout";
import Godowns from "./pages/dashboard/godowns/Godowns";
import Analytics from "./pages/analytics/Analytics";
import Inwards from "./pages/inwards/inwards";
import Outwards from "./pages/outwards/outwards";
import Returns from "./pages/returns/Returns";
import ForgotPassword from "./Components/ForgotPassword";
import ProductsStock from "./pages/productsStock/ProductsStock";
import Register from "./Components/Register";
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
                  {user && user.role === "superadmin" && (
                    <>
                      <Route index element={<Godowns />} />
                      <Route path="employees" element={<Employees />} />
                    </>
                  )}
                  {user &&
                    (user.role === "superadmin" ? (
                      <Route
                        path="godown/:id/stock"
                        element={<ProductsStock />}
                      />
                    ) : (
                      <Route
                        index
                        element={<ProductsStock godown={user.godown} />}
                      />
                    ))}
                  <Route path="inwards" element={<Inwards />} />
                  <Route path="outwards" element={<Outwards />} />
                  <Route path="products" element={<Products />} />
                  <Route path="returns" element={<Returns />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
                <Route
                  path="/login"
                  element={
                    user === null ? <Login /> : <Navigate to="/" replace />
                  }
                />
                <Route
                  path="/reset-password"
                  element={<ForgotPassword />}
                ></Route>
                        <Route path="/register" exact element={<Register />}></Route>
              </Routes>
            </BrowserRouter>
          </div>
        )}
      </Context.Consumer>
    </ContextProvider>
  );
}

export default App;
