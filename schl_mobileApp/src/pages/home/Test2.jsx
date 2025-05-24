import React, { useState } from 'react';

const UserProfile = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleUserIconClick = () => {
    setShowLogoutPopup(true);
  };

  const handleLogout = () => {
    // Perform logout logic here
    console.log('User logged out');
    setShowLogoutPopup(false);
  };

  const handleClosePopup = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className="relative inline-block"> {/* Relative for absolute positioning */}
      <div
        className="user-icon w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 cursor-pointer"
        onClick={handleUserIconClick}
      >
        <span className="user-initials font-bold text-lg">JD</span>
      </div>

      {showLogoutPopup && (
        <div className="logout-popup absolute top-12 right-0 bg-white border border-gray-300 rounded shadow-md p-4 z-10">
          <p className="mb-2">Are you sure you want to logout?</p>
          <div className="flex justify-end"> {/* Align buttons to the right */}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleLogout}
            >
              Yes, Logout
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClosePopup}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;