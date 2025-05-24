import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PiStudent } from "react-icons/pi";
import { BsGrid } from "react-icons/bs";
import MyContext, { UserDataContext } from "../../../context/UserDataProvider";
import Logout from "../../logout/Logout";
import { MdOutlineLogout } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";

const SidebarMenu = ({setIsSidebarOpen}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedClass, setSelectedClass, allClasses } =
    useContext(UserDataContext);
  console.log(selectedClass);

  useEffect(() => {
    if (location.pathname === "/dashboard/pickup-screen") {
      navigate("/dashboard/pickup-screen");
    }
  }, [location.pathname, navigate]);

  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);

    }
  };

  return (
    <div className="w-full  h-[100%]  p-4 ml-2  flex flex-col justify-between  content-between">
      <div className="w-full  relative">
        <GiTeacher className="absolute text-white mt-4 ml-2" />

        <select
          className="w-full p-3 bg-black text-white rounded-lg pl-7 "
          onChange={(e) => setSelectedClass(e.target.value)}
          value={selectedClass}
        >
          <option value="all">All Classes</option>

          {allClasses?.map((cls, index) => {
            let suffix = "th"; // Default suffix

            if (cls === "1") suffix = "st";
            else if (cls === "2") suffix = "nd";
            else if (cls === "3") suffix = "rd";

            return (
              <option key={index} value={cls} className="relative">
                {`Class ${cls}${suffix}`}
              </option>
            );
          })}
        </select>
      </div>

      {isActive("/dashboard/pickup-screen") && (
        <div className="w-full p-4 mt-4   bg-transparent  backdrop-blur-3xl  border-3 border-black rounded-lg shadow-md">
          <h3 className="text-xl font-semibold ml-3 mb-2 flex items-center">
            <PiStudent />
            <span>Status</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-black text-white rounded-md">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              Parents arrived
            </div>
            <div className="flex items-center gap-2 p-2 bg-black text-white rounded-md">
              <div className="w-4 h-4 bg-green-500 rounded"></div> Parents
              picked up
            </div>
            <div className="flex items-center gap-2 p-2 bg-black text-white rounded-md">
              <div className="w-4 h-4 bg-red-500 rounded"></div> Parents not
              came yet
            </div>
            <div className="flex items-center gap-2 p-2 bg-black text-white rounded-md">
              <div className="w-4 h-4 bg-gray-500 rounded"></div> Student absent
            </div>
            <div className="flex items-center gap-2 p-2 bg-black text-white rounded-md">
              <div className="w-4 h-4 bg-blue-500 rounded"></div> In class
            </div>
            <div className="flex items-center gap-2 p-2 bg-black text-white rounded-md">
              <div className="w-4 h-4 bg-fuchsia-400 rounded"></div> Released
            </div>
          </div>
        </div>
      )}

      <div className="  w-full  p-2   bottom-0 border-3 border-black bg-transparent backdrop-blur-2xl flex flex-col gap-1  rounded-lg shadow-md  ">
        <Link
          to="/dashboard/pickup-screen"
          onClick={handleLinkClick}
          className={`flex items-center gap-2 p-2 cursor-pointer rounded-md ${
            isActive("/dashboard/pickup-screen")
              ? "text-white bg-black"
              : "text-black bg-transparent"
          } hover:bg-black hover:text-white`}
        >
          <BsGrid />
          Pickup Screen
        </Link>

        <Link
          to={`/dashboard/manage-student`}
          onClick={handleLinkClick}
          className={`flex items-center gap-2 p-2 cursor-pointer rounded-md ${
            isActive("/dashboard/manage-student")
              ? "text-white bg-black"
              : "text-black bg-transparent"
          } hover:bg-black hover:text-white`}
        >
          <PiStudent />
          Student Management
        </Link>

        <Link
          to={`/dashboard/manage-teacher`}
          onClick={handleLinkClick}
          className={`flex items-center gap-2 p-2 cursor-pointer rounded-md ${
            isActive("/dashboard/manage-teacher")
              ? "text-white bg-black"
              : "text-black bg-transparent"
          } hover:bg-black hover:text-white`}
        >
          <GiTeacher />
          Teacher Management
        </Link>

        <Logout />
        {/* </div> */}
      </div>
    </div>
  );
};

export default SidebarMenu;