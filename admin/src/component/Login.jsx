import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { backendUrl } from "../config";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email: email.trim(),
        password: password.trim(),
      });

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Admin login successful");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Backend server is not running. Start backend on port 4000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex justify-center mb-6">
          <img
            src={assets.logo3}
            alt="website logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter admin email"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 disabled:bg-gray-500 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
