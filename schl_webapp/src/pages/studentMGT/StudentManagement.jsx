import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { MdAdd } from "react-icons/md";
import { UserDataContext } from "../../context/UserDataProvider";
import { baseURL } from "../../../utils/urlConfig";
import loading from "../../../public/assets/loading.gif";
import downloadLogo from "../../../public/assets/idcardload.gif";
import axios from "axios";
import "./student.css";

const StudentManagement = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [Isloading, setIsloading] = useState(false); //for id card loading

  const [showIdModal, setShowIdModal] = useState(false);
  const [idCardData, setIdCardData] = useState(null);
  const [showIdCard, setShowIdCard] = useState(false);

  const { selectedClass } = useContext(UserDataContext);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const res = await axios.get(
        `${baseURL}/api/student/getAll?userType=student&className=${selectedClass}`,
        { withCredentials: true }
      );
      setStudents(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchData();
    }
  }, [selectedClass]);

  const handleToggleStudentCard = (student_id) => {
    if (selectedStudent?._id === student_id) {
      setSelectedStudent(null);
    } else {
      setSelectedStudent(
        students.find((student) => student._id === student_id)
      );
    }
  };

  const handleStudentCheckboxChange = (_id) => {
    if (selectedStudents.includes(_id)) {
      setSelectedStudents(selectedStudents.filter((r) => r !== _id));
    } else {
      setSelectedStudents([...selectedStudents, _id]);
    }
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const all_id = students.map((student) => student._id);
      setSelectedStudents(all_id);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleDownloadIdCards = async (student = null) => {
    setIsloading(true);
    try {
      const studentsToDownload = student
        ? [student]
        : students.filter((s) => selectedStudents.includes(s.rollNumber));

      if (studentsToDownload.length === 0) {
        toast.info("Select Students to Export ID Card");
        setIsloading(false);
        return;
      }

      for (const s of studentsToDownload) {
        if (s.idCard?.url) {
          const response = await fetch(s.idCard.url);
          const blob = await response.blob();

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `ID_Card_${s.rollNumber || "student"}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      setTimeout(() => {
        setIsloading(false);
        setShowIdModal(true);
        setIdCardData(
          studentsToDownload.length === 1
            ? studentsToDownload[0].idCard.url
            : null
        );
      }, 1000);
    } catch (error) {
      console.error("Error downloading ID card:", error);
      setIsloading(false);
    }
  };

  const handleViewIdCard = (student) => {
    if (idCardData) {
      setShowIdCard(true);
      setShowIdModal(false);
    } else if (student?.idCard?.url) {
      setIdCardData(student.idCard.url);
      setShowIdCard(true);
    } else {
      console.warn("ID Card data is not available yet!");
    }
  };

  const closeModal = () => {
    setShowIdModal(false);
    setIdCardData(null);
  };

  const closeIdModal = () => {
    setShowIdCard(false);
    setIdCardData(null);
  };

  return (
    <>
      {loadingData ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-6 flex flex-col h-full w-full mt-2">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-center mb-4">
            <div className="flex  items-center gap-2 sm:gap-4">
              <div className="flex border border-black rounded-lg p-1.5 bg-white">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={
                    selectedStudents.length === students.length &&
                    students.length > 0
                  }
                  onChange={handleSelectAllChange}
                  className="text-gray-700 font-semibold mr-2 bg-white"
                />
                <label
                  htmlFor="selectAll"
                  className="font-semibold text-gray-800 bg-white"
                >
                  Select All
                </label>
              </div>

              <Link
                onClick={(e) => {
                  if (selectedStudents.length === 0) {
                    e.preventDefault();
                    toast.info("Select Students to Export ID Card");
                  } else {
                    handleDownloadIdCards();
                  }
                }}
                className={`flex  bg-blue-900 text-white px-1 py-2 rounded-lg ${
                  selectedStudents.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <IoMdDownload className=" flex mt-1.5 mr-1.5 " />
                <h1>Export ID Cards</h1>
              </Link>
            </div>
            <Link
              to="add-student"
              className=" flex bg-blue-900 text-white px-2 py-2 rounded-lg"
            >
              <MdAdd className="mt-1.5 mr-1.5" />
              <h1>Add Student</h1>
            </Link>
          </div>

          {/* Student Grid */}
          <div className="grid  grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  xl:grid-cols-4  2xl:grid-cols-4 gap-6 p-2 overflow-auto ">
            {students.map((student) => (
              <div
                key={student._id}
                className={` grdntbdr p-2  bg-white text-[12px] cursor-pointer gap-3  ${
                  selectedStudent?._id === student._id
                    ? "border-2 border-blue-500"
                    : ""
                }`}
                onClick={() => handleToggleStudentCard(student._id)}
              >
                <div className="flex justify-between">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() =>
                      handleStudentCheckboxChange(student._id)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {selectedStudent?._id === student._id? (
                  <div className="rounded-lg text-left ">
                    <h3 className="text-[16px] font-semibold text-center">
                      {student.name.toUpperCase()}
                    </h3>
                    <p>
                      <strong>Roll No :</strong> {selectedStudent.rollNumber}
                    </p>
                    <p>
                      <strong>Class :</strong> {selectedStudent.className} '
                      {selectedStudent.section}'
                    </p>
                    <p>
                      <strong>Parents Name :</strong>{" "}
                      {selectedStudent.parentName}
                    </p>
                    <p>
                      <strong>Parent's Mobile No :</strong>{" "}
                      {selectedStudent.parentMobileNo}
                    </p>
                    <div className="text-center mt-2 flex items-center justify-center">
                      <button
                        className="flex bg-blue-900 text-white text-[10.5px] px-2 py-1 rounded-md hover:bg-blue-900 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadIdCards(selectedStudent);
                        }}
                      >
                        <h1>Download ID Card </h1>
                        {/* <IoMdDownload className="mt-5 " /> */}
                      </button>

                      <button
                        className="flex bg-blue-900 text-white text-[10.5px] px-2 py-1  rounded-md hover:bg-blue-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIdCard(selectedStudent);
                        }}
                      >
                        <h1> View ID Card</h1>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center ">
                    <img
                      src={student.studentPhoto?.url}
                      alt="Error fetching image"
                      className="w-26 h-26 object-cover rounded-full border-3 border-black"
                    />
                    <h1 className=" font-semibold text-[18px] text-center">
                      {student.name.toUpperCase()}
                    </h1>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Outlet />
          <ToastContainer />
        </div>
      )}

      {/* Loader Modal for Download Action */}
      {/* Loading Spinner */}
      {Isloading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-4/5 sm:w-2/5 md:w-2/7 flex flex-col items-center">
            <img src={loading} alt="Downloading..." className="w-32 h-32" />
            <p className="mt-4 text-blue-900 font-bold text-xl sm:text-2xl">
              It may take some time to download ID card...
            </p>
          </div>
        </div>
      )}

      {/* Modal for Downloaded ID Card */}
      {showIdModal && !Isloading && idCardData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-4/5 sm:w-2/5 md:w-2/7 flex flex-col items-center">
            <button
              onClick={closeModal}
              className="text-blue-900 font-bold self-end mb-4"
            >
              X
            </button>
            <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">
              ID Card is Downloaded
            </h2>
            {idCardData ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <img
                  src={downloadLogo}
                  alt="Downloaded Logo"
                  className="w-32 h-32"
                />
                <div className="text-center">
                  <button
                    onClick={handleViewIdCard}
                    className="bg-blue-900 text-white px-6 py-3 rounded-lg"
                  >
                    Tap to View ID Card
                  </button>
                </div>
              </div>
            ) : (
              <p>No ID Card available</p>
            )}
          </div>
        </div>
      )}

      {/* Modal for Viewing the Full ID Card */}
      {showIdCard && idCardData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/3 flex flex-col items-center">
            <div className="flex justify-between w-full mb-4">
              <h2 className="text-xl font-bold">ID Card</h2>
              <button onClick={closeIdModal} className="text-red-500 font-bold">
                X
              </button>
            </div>
            <img
              src={idCardData}
              alt="Student ID Card"
              className="max-w-full h-auto rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentManagement;
