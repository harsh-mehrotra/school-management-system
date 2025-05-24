import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "../../../utils/urlConfig";

const StudentCard = ({ student }) => {
  const [status, setStatus] = useState(student?.studentStatus?.status);

  // Main card background colors
  const statusColors = {
    "Parent Arrived": "bg-[#ffea7d]",
    "Parent pickedup": "bg-green-400",
    "Parent not came yet": "bg-[#ff7d7de8]",
    Absent: "bg-[#939186b5]",
    "In Class": "bg-blue-400",
    Released: "bg-[#e879f9b0]",
  };

  // Gradient shading for the folded triangle
  const gradientShading = {
    "Parent Arrived": "bg-gradient-to-br from-yellow-100 to-yellow-500",
    "Parent pickedup": "bg-gradient-to-br from-green-100 to-green-500",
    "Parent not came yet": "bg-gradient-to-br from-red-300 to-red-600",
    Absent: "bg-gradient-to-br from-gray-300 to-gray-450",
    "In Class": "bg-gradient-to-br from-blue-300 to-blue-600",
    Released: "bg-gradient-to-br from-fuchsia-300 to-fuchsia-600",
  };

  const handleRelease = async (studentId) => {
    console.log(studentId);
    try {
      const res = await axios.patch(
        `${baseURL}/api/student/status/release/${studentId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setStatus(res.data.updatedStatus);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div
      className={`p-4 rounded-tr-[40px] shadow-lg relative min-w-40 max-w-40 h-40 overflow-hidden backdrop-blur-3xl ${statusColors[status]}`}
    >
      {/* Triangle Folded Corner with Gradient */}
      <div
        className={`absolute top-0 right-0 w-[35px] h-[35px] ${gradientShading[status]} clip-triangle`}
      ></div>

      <h3 className="font-bold text-black text-left text-[13px] mb-1 mt-2">
        {student?.name.toUpperCase()}
      </h3>
      <p className="text-sm text-black text-[12px] text-left mb-1">
        Roll No : &nbsp; {student?.rollNumber}
      </p>
      <p className="text-sm text-black text-[12px] mb-1 text-left">
        Clock in : &nbsp; {student?.Clock_in}
      </p>
      <p className="text-sm text-black text-[12px] text-wrap mb-1 text-left">
        Status : &nbsp; {status}
      </p>

      {status === "Parent Arrived" && (
        <button
          onClick={() => {
            handleRelease(student._id);
          }}
          className="absolute bottom-1 left-12 bg-blue-900 text-white px-3 py-1 text-xs rounded shadow-md hover:bg-blue-600"
        >
          Release
        </button>
      )}
    </div>
  );
};

export default StudentCard;
