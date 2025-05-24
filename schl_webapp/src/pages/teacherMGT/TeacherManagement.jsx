import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import EditTeacher from "../teacherMGT/EditTeacher";
import { baseURL } from "../../../utils/urlConfig";
import { TbEditCircle } from "react-icons/tb";
import { UserDataContext } from "../../context/UserDataProvider";

const TeacherManagement = () => {
  const { selectedClass } = useContext(UserDataContext);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseURL}/api/student/getAll?userType=teacher&className=${selectedClass}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setTeachers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchData();
    }
  }, [selectedClass]);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleToggleTeacherCard = (teacherId) => {
    if (selectedTeacher === teacherId) {
      setSelectedTeacher(null);
    } else {
      setSelectedTeacher(teacherId);
    }
  };


  const handleGoToEditTeacher = (teacherId) => {
    navigate(`/dashboard/manage-teacher/edit-teacher/${teacherId}`);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-6  flex flex-col h-full w-full mt-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">

            <div className="relative w-full sm:w-2/3 lg:w-1/2">
              <IoIosSearch className="absolute left-3 top-3 text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Search for teachers..."
                className="w-full flex p-2 pl-10 border border-gray-300 rounded-lg bg-white-20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Link
              to="add-teacher"
              className="bg-blue-900 bg-opacity-100 text-white px-4 py-2 rounded-lg "
            >
              + Add Teacher
            </Link>
          </div>
          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  xl:grid-cols-4  2xl:grid-cols-4 gap-6 p-2 overflow-auto ">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => {
                if (selectedTeacher === teacher._id) {
                  return (
                    <div
                      key={teacher._id}
                      className="p-2  grdntbdr rounded-lg bg-white text-[12px] text-left"
                      onClick={() => handleToggleTeacherCard(teacher._id)}
                    >
                      <h3 className="text-[15px] font-semibold text-center">
                        {teacher.name.toUpperCase()}
                      </h3>
                      <p>
                        <strong>Teacher I'D :</strong> {teacher.teacherId}
                      </p>
                      <p>
                        <strong>Date of Joining :</strong>{" "}
                        {new Date(teacher.doj).toLocaleDateString("en-GB")}
                      </p>
                      <p>
                        <strong>Class :</strong> {teacher.className} '
                        {teacher.section}'
                      </p>

                      <p>
                        <strong>Mobile No :</strong> {teacher.mobileNo}
                      </p>
                      <div className="mt-2 text-center flex justify-center">
                        <button
                          className="bg-blue-900 text-white px-3 py-1 rounded-lg hover:bg-blue-900 flex flex-row  items-center"
                          onClick={() => handleGoToEditTeacher(teacher._id)}
                        >
                          <h1 className="text-md">Update</h1>
                          <TbEditCircle className="size-4.5" />
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={teacher._id}
                      className={`p-2 grdntbdr rounded-lg cursor-pointer`}
                      onClick={() => handleToggleTeacherCard(teacher._id)}
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={teacher?.teacherPhoto?.url}
                          alt={teacher.name}
                          className="w-26 h-26 object-contain rounded-lg border-1"
                        />
                        <h1 className="text-center font-semibold text-[17px]">
                          {teacher.name.toUpperCase()}
                        </h1>
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <div className="text-center text-gray-800 text-2xl  font-sembold col-span-4 flex items-center justify-center">
                No teacher's were found!
              </div>
            )}
          </div>

          <Outlet />
        </div>
      )}
      
    </>
  );
};
export default TeacherManagement;
