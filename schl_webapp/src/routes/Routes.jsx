import React, { useContext } from "react";
import { useRoutes, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/login/Login";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import TeacherManagement from "../pages/teacherMGT/TeacherManagement";

import AddStudent from "../pages/studentMGT/AddStudent";
import PickupScreen from "../pages/pickup-screen/PickupScreen";
import StudentManagement from "../pages/studentMGT/StudentManagement";
import AddTeacher from "../pages/teacherMGT/AddTeacher";
import EditTeacher from "../pages/teacherMGT/EditTeacher";
import ProtectedRouting from "../components/protectedRouting/ProtectedRouting";
import { UserDataContext } from "../context/UserDataProvider";
import LoginProtectedRoute from "../components/protectedRouting/LoginProtectedRoute";

const CustomRoutes = () => {
  const { userAuth, pageLoading } = useContext(UserDataContext);

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate to={"/dashboard"} />,
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          path: "manage-student",
          element: (
            <ProtectedRouting>
              <StudentManagement />
            </ProtectedRouting>
          ),
        },
        {
          path: "manage-student/add-student",
          element: <AddStudent />,
        },
        {
          index: true,
          element: <Navigate to={"/dashboard/pickup-screen"} />,
        },

        {
          path: "pickup-screen",
          element: (
            <ProtectedRouting>
              <PickupScreen />
            </ProtectedRouting>
          ),
        },

        {
          path: "manage-teacher",
          element: (
            <ProtectedRouting>
              <TeacherManagement />
            </ProtectedRouting>
          ),
        },

        {
          path: "manage-teacher/add-teacher",
          element: (
            <ProtectedRouting>
              <AddTeacher />
            </ProtectedRouting>
          ),
        },
        {
          path: "manage-teacher/edit-teacher/:teacherId",
          element: (
            <ProtectedRouting>
              <EditTeacher />
            </ProtectedRouting>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <LoginProtectedRoute>
          <Login />
        </LoginProtectedRoute>
      ),
    },
  ]);
  if (pageLoading) {
    return (
      <div className="flex justify-center flex-col items-center w-full h-screen">
        Loading ...
        {/* <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}
      </div>
    );
  } else return routes;
};
export default CustomRoutes;
