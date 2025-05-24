import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, redirect } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import { baseURL } from "../../../utils/urlConfig";
import { UserDataContext } from "../../context/UserDataProvider";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUserAuth, userAuth, pageLoading } = useContext(UserDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectPath =
    searchParams.get("redirect") || "/dashboard/pickup-screen";

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    // Validate Email
    if (!email) {
      setEmailError("Please enter email!");
      setTimeout(() => setEmailError(""), 2000);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format!");
      setTimeout(() => setEmailError(""), 2000);

      return;
    }

    // Validate Password
    if (!password) {
      setPasswordError("Please enter the password!");
      setTimeout(() => setPasswordError(""), 2000);

      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUserAuth({ ...userAuth, isAuthenticated: true });
        toast.success("Login Successful!");
        setTimeout(() => navigate(redirectPath), 1000);
      }
    } catch (error) {
      setPasswordError("Invalid Credentials! Please try again.");
      setTimeout(() => setPasswordError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        Loading ...
        {/* <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}
      </div>
    );
  } else {
    return (
      <div className="bg-transparent flex justify-center items-center mt-50">
        <div className="bg-[rgba(249, 249, 249, 0.8)] p-8 backdrop-blur-2xl rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">
            Login
          </h2>
          <form onSubmit={handleFormSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {emailError && (
                <p className="text-red-600 text-sm text-left mt-1">
                  {emailError}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div className="mb-4 relative">
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1.5 right-2 cursor-pointer hover:bg-gray-300 transition-all border-1 border-transparent hover:border-gray-400 duration-300 ease-in-out rounded-full p-1"
              >
                {showPassword ? (
                  <IoEyeOutline className="text-[20px]" />
                ) : (
                  <IoEyeOffOutline className="text-[20px]" />
                )}
              </span>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-1 text-left">
                  {passwordError}
                </p>
              )}
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-950 transition duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  }
};

export default Login;
