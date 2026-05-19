import React, { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";

import { Navigate, Route, Routes } from "react-router";

import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import PageLoader from "./components/PageLoader.jsx";

import { authApi } from "./lib/api.js";

function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // chưa login
        if (!isSignedIn) {
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }

        // check admin
        await authApi.checkAdmin();

        setIsAdmin(true);
      } catch (error) {
        console.log(error);

        alert("Bạn không có quyền truy cập admin");

        await signOut();

        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (isLoaded) {
      verifyAdmin();
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded || checkingAdmin) {
    return <PageLoader />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isSignedIn && isAdmin ? <Navigate to="/dashboard" /> : <LoginPage />
        }
      />

      <Route
        path="/"
        element={
          isSignedIn && isAdmin ? <DashboardLayout /> : <Navigate to="/login" />
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
