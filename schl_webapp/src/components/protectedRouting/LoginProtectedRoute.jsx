import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserDataContext } from "../../context/UserDataProvider";

const LoginProtectedRoute = ({ children }) => {
  const { userAuth } = useContext(UserDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (userAuth.isAuthenticated !== undefined) {
      setIsLoading(false);
      if (userAuth.isAuthenticated) {
        navigate(`/?redirect=${location.pathname}`);
      }
    }
  }, [userAuth, navigate]);
  if (isLoading) return <div>Loading...</div>; // Prevents redirect flicker
  return children;
};

export default LoginProtectedRoute;
