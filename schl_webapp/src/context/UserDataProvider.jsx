import axios from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { baseURL } from "../../utils/urlConfig";
import { useNavigate } from "react-router-dom";

export const UserDataContext = createContext();

const MyContext = (props) => {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [userAuth, setUserAuth] = useState({
    isAuthenticated: false,
  });

  const [allClasses, setAllClasses] = useState([]);

  const fetchAllClasses = useCallback(async () => {
    try {
      const res = await axios.get(`${baseURL}/api/student/getClasses`, {
        withCredentials: true,
      });
      console.log(res.data);
      setAllClasses(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const authenticate = useCallback(async () => {
    try {
      const res = await axios.get(`${baseURL}/api/auth/check-auth`, {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data.isAuthenticated) {
        setUserAuth({ isAuthenticated: true, user: res.data.user });
        setPageLoading(false);
        navigate(-1);
      } else {
        setUserAuth({ isAuthenticated: false, user: null });
        setPageLoading(false);
        navigate("/", { replace: true });
      }
    } catch (error) {
       setPageLoading(false);
      console.log(error);
    }
  }, []);
  console.log("classes=>", allClasses);
  useEffect(() => {
    authenticate();
    fetchAllClasses();
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        selectedClass,
        setSelectedClass,
        allClasses,
        userAuth,
        setUserAuth,
        pageLoading,
        setPageLoading,
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
};
export default MyContext;
