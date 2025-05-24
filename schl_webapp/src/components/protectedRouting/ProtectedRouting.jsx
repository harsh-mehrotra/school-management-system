// import React, { useContext, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { UserDataContext } from "../../context/UserDataProvider";

// const ProtectedRouting = (props) => {
//   const { userAuth } = useContext(UserDataContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   console.log("userauth-->", userAuth);

//   useEffect(() => {
//     if (!userAuth.isAuthenticated) {
//       navigate(`/?redirect=${location.pathname}`);
//     }
//   }, [userAuth, navigate, location]);

//   return userAuth.isAuthenticated ? props.children : null;
// };

// export default ProtectedRouting;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserDataContext } from "../../context/UserDataProvider";
const ProtectedRouting = ({ children }) => {
  const { userAuth } = useContext(UserDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (userAuth.isAuthenticated !== undefined) {
      setIsLoading(false);
      if (!userAuth.isAuthenticated) {
        // navigate(`/?redirect=${location.pathname}`);
        navigate(`/login`);
      }
    }
  }, []);
  if (isLoading) return <div>Loading...</div>; // Prevents redirect flicker
  return userAuth.isAuthenticated ? children : null;
};
export default ProtectedRouting;
