import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SidebarMenu from "./component/SidebarMenu";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full flex">
      {/* Sidebar for Large Screens */}
      <div className="hidden lg:block w-[280px] h-screen fixed left-0 top-0">
        <SidebarMenu />
      </div>

      {/* Sidebar for Small Screens */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] backdrop-blur-3xl top-12 shadow-lg z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
        <SidebarMenu setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[280px] h-screen flex flex-col border-3 rounded-4xl">
        {/* Mobile Sidebar Toggle Button */}
        {/* <div className="lg:hidden fixed top-0 left-0 w-full p-2 bg-gray-500 z-50 flex items-center justify-between">
          <button
            className="bg-black p-2 px-4 rounded text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
        </div> */}
        <div className="lg:hidden fixed top-0 left-0 w-full p-2 bg-gray-500 z-50 flex items-center justify-between">
          <button
            className="bg-black p-2 px-4 rounded text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "X" : "☰"}
          </button>
        </div>
        {/* Breadcrumbs and Scrollable Content */}
        <div className="flex flex-col z-10   relative h-full">

          <Breadcrumbs />
          <div className="flex-1 overflow-y-auto p-2 ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
