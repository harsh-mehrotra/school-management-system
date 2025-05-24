import React, { useContext, useEffect, useState } from "react";
import StudentCard from "../studentCrd/StudentCard";
import axios from "axios";
import { baseURL } from "../../../utils/urlConfig";
import { UserDataContext } from "../../context/UserDataProvider";

const PickupScreen = () => {
  const { selectedClass, setSelectedClass } = useContext(UserDataContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseURL}/api/student/getAll?userType=student&className=${selectedClass}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass]);

  return (
    <div className="h-auto overflow-auto max-h-[100%]">
      {loading ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex  overflow-auto box-border mb-2 flex-row flex-wrap gap-10 p-2  justify-center lg:justify-start ">
          {students.map((student, index) => (
            <StudentCard student={student} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PickupScreen;
