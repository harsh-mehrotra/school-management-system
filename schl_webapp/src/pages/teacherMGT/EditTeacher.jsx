import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import CustomFormInput from "../../components/CustomFormInput";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import { baseURL } from "../../../utils/urlConfig";
import { MdOutlineCloudUpload } from "react-icons/md";

dayjs().format();

const EditTeacher = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { teacherId } = useParams();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const clrImgref = useRef(null);
  const [showUpdateButtons, setShowUpdateButtons] = useState(false);
  const [loader, setLoader] = useState(false);

  const [errors, setErrors] = useState(null);

  const handleClick = () => {
    clrImgref.current.click();
  };

  const [formData, setFormData] = useState({ mobileNo: "+91" });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoader(true);
        const res = await axios.get(
          `${baseURL}/api/teacher/getTeacherById/${teacherId}`,
          { withCredentials: true }
        );

        const teacherData = res.data;
        setFormData({
          name: teacherData.name || "",
          email: teacherData.email || "",
          teacherId: teacherData.teacherId || "",
          doj: teacherData.doj
            ? dayjs(teacherData.doj).format("YYYY-MM-DD")
            : "",
          designation: teacherData.designation || "",
          className: teacherData.className || "",
          gender: teacherData.gender || "",
          registrationNo: teacherData.registrationNo || "",
          address: teacherData.address || "",
          section: teacherData.section || "",
          mobileNo: teacherData.mobileNo || "",
          // password: teacherData.password || "",
          teacherPhoto: teacherData.teacherPhoto?.url || null,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    };
    fetchTeacherData();
  }, [teacherId]);

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.startsWith("91")) {
      value = value.slice(2); // Remove duplicate "91" if present
    }
    if (value.length > 10) {
      value = value.slice(0, 10); // Limit to 10 digits
    }
    setFormData((prev) => ({ ...prev, mobileNo: `+91${value}` }));
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.name?.trim()) {
      errors.name = "Full Name is required";
    } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(data.name)) {
      errors.name = "Full Name must contain only characters and spaces";
    }

    if (!data.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }

    if (!data.mobileNo?.trim() || data.mobileNo.length !== 13) {
      errors.mobileNo = "Number must be 10 digits after +91";
    }

    // Designation Validation
    if (!data.designation?.trim()) {
      errors.designation = "Designation is required";
    } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(data.designation)) {
      errors.designation = "Designation must contain only letters and spaces";
    }

    // Section Validation (Single uppercase letter)
    if (!data.section?.trim()) {
      errors.section = "Section is required";
    } else if (!/^[A-Z]$/.test(data.section)) {
      errors.section = "Section must be a single uppercase letter (A-Z)";
    }

    // Registration Number Validation
    if (!data.registrationNo?.trim()) {
      errors.registrationNo = "Registration Number is required";
    } else if (!/^[a-zA-Z0-9]{2,10}$/.test(data.registrationNo)) {
      errors.registrationNo =
        "Registration Number must be 2 to 10 alphanumeric characters";
    }
    return errors;
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const selectedImage = e.target.files[0];
      if (selectedImage) {
        setImage(selectedImage);
        setShowUpdateButtons(true);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setShowUpdateButtons(false);
  };

  const handleUpdateImage = async () => {
    if (!teacherId) {
      console.error("Error: Teacher ID is missing.");
      return;
    }
    if (!image) {
      console.error("Error: No image selected.");
      return;
    }

    const formData = new FormData();
    formData.append("teacherPhoto", image);

    try {
      setLoader(true);
      const res = await axios.put(
        `${baseURL}/api/teacher/updateTeacherImage/${teacherId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);

      setFormData((prev) => ({
        ...prev,
        teacherPhoto: res.data.teacherPhoto?.url,
      }));
      setTimeout(() => {
        toast.success("Image updated successfully!");
      }, 2000);

      setShowUpdateButtons(false);
    } catch (error) {
      console.error("Error updating image:", error.response?.data || error);
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }
    if (image) {
      payload.append("teacherPhoto", image);
    }

    try {
      await axios.put(
        `${baseURL}/api/teacher/updateTeacher/${teacherId}`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Teacher updated successfully!");
      setTimeout(() => {
        navigate("/dashboard/manage-teacher");
      }, 2000);
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error("Failed to update teacher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loader ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-6 rounded-lg max-w-4xl w-full text-[15px] max-[740px]:overflow-auto ">
          <div className="flex items-center gap-3">
            <GoArrowLeft
              className="text-2xl mb-4 cursor-pointer text-gray-700 hover:text-black"
              onClick={() => navigate("/dashboard/manage-teacher")}
            />
            <h2
              className="text-2xl mb-4 text-left"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Edit Teacher
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex gap-9 max-[425px]:w-70"
          >
            <div className="flex flex-col w-full ">
              <div className="flex w-full max-[740px]:flex  max-[740px]:flex-col     ">
                <div className=" w-full sm:w-1/2 space-y-6 text-[15px] mr-10">
                  <CustomFormInput
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="Enter Full Name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    error={errors?.name}
                    required
                  />
                  <CustomFormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter Email ID"
                    value={formData.email || ""}
                    onChange={handleChange}
                    error={errors?.email}
                    required
                  />
                  <CustomFormInput
                    label="Teacher Id"
                    type="text"
                    name="teacherId"
                    placeholder="Enter Id"
                    value={formData.teacherId || ""}
                    onChange={handleChange}
                    required
                  />

                  <div className="flex items-center gap-4">
                    <label className="w-1/2 text-gray-700 font-semibold text-left">
                      Date of Joining*:
                    </label>
                    <input
                      type="date"
                      name="doj"
                      placeholder="Enter date of joining"
                      value={formData.doj || ""}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-400 rounded-lg"
                      required
                    />
                  </div>

                  <CustomFormInput
                    label="Designation"
                    type="text"
                    name="designation"
                    placeholder="Enter Designation"
                    value={formData.designation || ""}
                    onChange={handleChange}
                    error={errors?.designation}
                    required
                  />
                  <CustomFormInput
                    label="Mobile Number"
                    type="tel"
                    name="mobileNo"
                    placeholder="Enter Mobile Number"
                    value={formData.mobileNo || ""}
                    onChange={handleMobileChange}
                    error={errors?.mobileNo}
                    required
                  />
                </div>

                <div className="w-full sm:w-1/2 space-y-4 text-[15px]  mt-2 md:mt-0 xl:ml-10">
                  <div className="flex items-center gap-4 ">
                    <label className="w-1/2  text-gray-700  font-semibold text-left">
                      Class*:
                    </label>
                    <select
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="w-full  p-2  border border-gray-400 rounded-lg"
                      required
                    >
                      <option value="">Select Class</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={`${i + 1}`}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <CustomFormInput
                    label="Section"
                    type="text"
                    name="section"
                    placeholder="Enter Section"
                    value={formData.section || ""}
                    onChange={handleChange}
                    error={errors?.section}
                    required
                  />

                  <div className="flex items-center gap-4">
                    <label className="w-1/2 text-gray-700 font-semibold text-left">
                      Gender*:
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-400 rounded-lg"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <CustomFormInput
                    label="Registration No"
                    type="text"
                    name="registrationNo"
                    placeholder="Enter Registration Number"
                    value={formData.registrationNo || ""}
                    onChange={handleChange}
                    error={errors?.registrationNo}
                    required
                  />
                  <CustomFormInput
                    label="Address"
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    required
                  />

                  {/* Image Upload Section */}
                  <div className="flex  items-center  gap-4">
                    <label className=" w-10 md:w-30 text-gray-700 font-semibold">
                      Image*
                    </label>

                    <div className="flex flex-col w-full  ml-12  h-auto items-start  justify-center relative">
                      <div
                        // onDrop={handleDrop}
                        // onDragOver={handleDragOver}
                        onClick={handleClick}
                        className="border-1 w-full h-10 rounded-lg hover:cursor-pointer border-dashed border-black p-2 flex  items-center justify-center "
                      >
                        {/* <icon className="rounded-full transition-all ease-in-out ml-2 border-transparent duration-300 hover:bg-gray-400 hover:border-gray-600 hover:border h-7 w-7 flex justify-center items-center"> */}
                        <MdOutlineCloudUpload className="size-5 mb-1 " />
                        <span
                          // onClick={handleClick}
                          className=" text-blue-600 text-xs "
                        >
                          &nbsp; Select file
                        </span>
                        {/* <span
                          className="text-black text-xs"
                           onDrop={handleDrop}
                           onDragOver={handleDragOver}
                        >
                          &nbsp;or Drag and Drop
                        </span> */}
                      </div>
                      <input
                        ref={clrImgref}
                        type="file"
                        name="teacherPhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />

                      <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-3 gap-4">
                        {image ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={URL.createObjectURL(image)}
                              alt="Selected"
                              className="mt-1 h-25 w-20 rounded-lg object-cover border"
                            />
                            <p className="text-sm text-center mt-1">
                              {image.name}
                            </p>
                          </div>
                        ) : formData?.teacherPhoto ? (
                          <img
                            src={formData?.teacherPhoto}
                            alt="Teacher"
                            className="mt-1 h-25 object-cover border rounded-lg"
                          />
                        ) : null}

                        {/* Show buttons if an image is selected */}
                        {showUpdateButtons && (
                          <div className="flex gap-2 sm:justify-end  flex-col">
                            <button
                              onClick={() => {
                                // handleUpdateImage();
                                if (
                                  clrImgref.current &&
                                  clrImgref.current.files[0]
                                ) {
                                  handleUpdateImage({
                                    target: {
                                      files: [clrImgref.current.files[0]],
                                    },
                                  });
                                }
                              }}
                              className="bg-green-600 text-white text-sm px-4 py-1 rounded-lg  hover:bg-green-700"
                            >
                              Update
                            </button>
                            <button
                              onClick={handleCancelImage}
                              className="bg-red-600 text-white px-4  py-1 text-sm  rounded-lg hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {message && <span className="text-red-700">{message}</span>}
              <div className="flex items-center justify-center mt-6 ">
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-6 py-2  rounded-lg hover:bg-blue-950  "
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent  rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </form>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default EditTeacher;
