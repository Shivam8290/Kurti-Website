import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Login from "./component/Login";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  
  const handleSetToken = (adminToken) => {
    setToken(adminToken);
  };

  useEffect(() => {
    if (token !== "") {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);




  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={handleSetToken} />
      ) : (
        <>
          {/* // ----------------this is navbar ----------------- */}
          <Navbar setToken={handleSetToken} />

          {/* // ----------------this is siderbar ----------------- */}
          <div className="flex w-full pt-16">
            <Sidebar />
            <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 py-5 text-base text-gray-600 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Navigate to="/add" replace />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Order token={token} />} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
