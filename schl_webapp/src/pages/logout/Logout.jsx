import React, { useState } from "react";
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { baseURL } from "../../../utils/urlConfig";
import { UserDataContext } from "../../context/UserDataProvider";
import { useContext } from "react";

const Logout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserDataContext);
  const handleLogout = () => {
    setIsOpen(true);
  };

  const handleConfirmation = async (confirm) => {
    setIsOpen(false);
    if (confirm) {
      try {
        const res = await axios.post(
          `${baseURL}/api/teacher/logout`,
          {},
          { withCredentials: true }
        );
        if (res.status === 200) {
          // setUserAuth(null);
          setUserAuth({ isAuthenticated: false, user: null });

          navigate("/login");
        }
      } catch (error) {
        console.log("Errror in logout");
      }
    }
  };

  return (
    <>
      {/* Logout Button */}
      <div
        className="h-9 flex items-center gap-2 p-2 cursor-pointer rounded-md hover:bg-black hover:text-white"
        onClick={handleLogout}
      >
        <MdOutlineLogout />
        <button className="w-full text-left cursor-pointer">Logout</button>
      </div>

      {/* Headless UI Dialog (Modal) */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="fixed inset-0 bg-opacity-30 border"></div>
        <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full relative z-50">
          <Dialog.Title className="text-lg font-semibold text-center">
            Confirm Logout
          </Dialog.Title>
          <p className="text-gray-700 text-sm text-center mt-2">
            Are you sure you want to exit?
          </p>

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => handleConfirmation(true)}
              className="bg-blue-500 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
            >
              Yes
            </button>
            <button
              onClick={() => handleConfirmation(false)}
              className="bg-red-500 text-white px-4 py-2 text-sm rounded hover:bg-red-700"
            >
              No
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Logout;
