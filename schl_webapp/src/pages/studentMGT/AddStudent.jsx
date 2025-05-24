import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { baseURL } from "../../../utils/urlConfig";
import CustomFormInput from "../../components/CustomFormInput";
import { MdOutlineCloudUpload } from "react-icons/md";

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ parentMobileNo: "+91" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const clrImgref = useRef(null);
  const [showUpdateButtons, setShowUpdateButtons] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setImage(files[0]);
      setShowUpdateButtons(true);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.startsWith("91")) {
      value = value.slice(2); // Remove duplicate "91" if present
    }
    if (value.length > 10) {
      value = value.slice(0, 10); // Limit to 10 digits
    }
    setFormData((prev) => ({ ...prev, parentMobileNo: `+91${value}` }));
  };

  const handleClick = () => {
    clrImgref.current.click();
  };

  const handleCancelImage = () => {
    setImage(null);
    setFormData((prev) => ({ ...prev, teacherPhoto: null }));
    setShowUpdateButtons(false);
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) {
      errors.name = "Full Name is required";
    } else if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(data.name)) {
      errors.name = "Full Name must contain only characters";
    }
    if (!data.parentMobileNo?.trim() || data.parentMobileNo.length !== 13) {
      errors.parentMobileNo = "Number must be 10 digits after +91";
    }
    if (!data.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.rollNumber?.trim()) {
      errors.rollNumber = "Roll Number is required";
    } else if (!/^\d+$/.test(data.rollNumber)) {
      errors.rollNumber = "Roll Number must be an integer";
    }
    if (!data.section?.trim()) {
      errors.section = "Section is required";
    } else if (!/^[A-Z]$/.test(data.section)) {
      errors.section = "Section must be a single uppercase letter (A-Z)";
    }
    if (!data.parentName?.trim()) {
      errors.parentName = "Parent's Name is required";
    } else if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(data.parentName)) {
      errors.parentName = "Parent's Name must contain only characters";
    }

    if (!data.gender?.trim()) {
      errors.gender = "Gender is required";
    }
    if (!data.registrationNo?.trim()) {
      errors.registrationNo = "Registration Number is required";
    } else if (!/^[a-zA-Z0-9]{2,10}$/.test(data.registrationNo)) {
      errors.registrationNo =
        "Registration Number must be 2 to 10 alphanumeric characters";
    }

    if (!data.address?.trim()) {
      errors.address = "Address is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate first
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors, failed to add student", newErrors);
      return;
    }

    const formData1 = new FormData(e.target);
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${baseURL}/api/student/addStudent`,
        formData1,
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success("Student added successfully!");
      setTimeout(() => {
        navigate("/dashboard/manage-student");
      }, 2000);
    } catch (error) {
      console.error("Error adding student:", error);
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        toast.error("Failed to add student. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg max-w-4xl w-full text-[15px] max-[740px]:overflow-auto  ">
      <div className="flex items-center gap-3 ">
        <GoArrowLeft
          className="text-2xl mb-4 cursor-pointer text-gray-700 hover:text-black"
          onClick={() => navigate("/dashboard/manage-student")}
        />
        <h2
          className="text-2xl mb-4 text-left"
          style={{ fontFamily: "Poppins,sans-serif" }}
        >
          Add Student
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 flex  gap-9  w-full ">
        <div className="flex  flex-col w-full">
          <div className="flex w-full max-[740px]:flex  max-[740px]:flex-col ">
            {/* Left Column */}
            <div className=" w-full sm:w-1/2 space-y-6 text-[15px] mr-10">
              <CustomFormInput
                label={"Full Name"}
                type="text"
                name="name"
                placeholder="Enter Full Name"
                value={formData.name || ""}
                onChange={handleChange}
                error={errors?.name || ""}
                required
              />
              <CustomFormInput
                label={"Email Address"}
                type="email"
                name="email"
                placeholder="Enter Email ID"
                value={formData.email || ""}
                onChange={handleChange}
                required
                error={errors?.email || ""}
              />
              <CustomFormInput
                label={"Roll Number"}
                type="text"
                name="rollNumber"
                placeholder="Enter Roll Number"
                value={formData.rollNumber || ""}
                onChange={handleChange}
                required
                error={errors?.rollNumber || ""}
              />
              <div className="flex items-center gap-4">
                <label className="w-1/2 text-gray-700 font-semibold text-left">
                  Class*:
                </label>
                <select
                  name="className"
                  value={formData.className || ""}
                  onChange={handleChange}
                  className="flex w-full  p-2 border border-gray-400 rounded-lg"
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
                label={"Section"}
                type="text"
                name="section"
                placeholder="Enter Section"
                value={formData.section || ""}
                onChange={handleChange}
                required
                error={errors?.section || ""}
              />
              <CustomFormInput
                label={"Parent's Name"}
                type="text"
                name="parentName"
                placeholder="Enter Parent's Name"
                value={formData.parentName || ""}
                onChange={handleChange}
                required
                error={errors?.parentName || ""}
              />
            </div>
            {/* Right Column */}
            <div className="w-full sm:w-1/2 space-y-4 text-[15px]  mt-2 md:mt-0 xl:ml-10">
              <CustomFormInput
                label={"Parent's Mobile No"}
                type="text"
                name="parentMobileNo"
                placeholder="Enter Parent's Mobile Number"
                value={formData.parentMobileNo || ""}
                onChange={handleMobileChange}
                required
                error={errors?.parentMobileNo || ""}
              />
              <div className="flex items-center gap-4">
                <label className="w-1/2 text-left text-gray-700 font-semibold">
                  Gender*:
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-400 rounded-lg"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors?.gender && (
                  <span className="text-red-500 text-xs">{errors.gender}</span>
                )}
              </div>
              <CustomFormInput
                label={"Registration Number"}
                type="text"
                name="registrationNo"
                placeholder="Enter Registration Number"
                value={formData.registrationNo || ""}
                onChange={handleChange}
                required
                error={errors?.registrationNo || ""}
              />
              <CustomFormInput
                label={"Address"}
                type="text"
                name="address"
                placeholder="Enter Address"
                value={formData.address || ""}
                onChange={handleChange}
                required
                error={errors?.address || ""}
              />

              <div className="flex items-center relative gap-4 ">
                <label className=" w-1/3 md:w-1/3 text-gray-700 font-semibold text-left">
                  Image*:
                </label>
                <div className="flex flex-col h-auto items-start w-full ml-6 justify-center">
                  <div
                    onClick={handleClick}
                    // onDrop={handleDrop}

                    className="w-full   p-2 border  flex items-center justify-center cursor-pointer text-start border-gray-500 border-dashed rounded-lg "
                  >
                    <MdOutlineCloudUpload className="size-5 mr-2" />

                    <span className="text-blue-600 text-sm">Select image</span>
                    {/* <span className="text-black text-sm ">
                      &nbsp;or Drag & Drop
                    </span> */}
                  </div>

                  <input
                    ref={clrImgref}
                    id="studentPhoto"
                    type="file"
                    name="studentPhoto"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full  p-2 border border-gray-400 rounded-lg hidden"
                  />
                  {image ? (
                    <div className="relative flex flex-col items-center mt-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                        className="mt-1 h-25 object-cover rounded-lg border w-25 "
                      />

                      <span className="text-center ml-6">
                        {image && image.name ? image.name : ""}
                      </span>

                      {showUpdateButtons && (
                        <div className="flex flex-row   mt-2 -right-12 ">
                          <button
                            onClick={handleCancelImage}
                            className="bg-red-600 text-white px-4 py-1 text-sm rounded-lg hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {message && <span className="text-red-700">{message}</span>}
          <div className="text-center mt-6 w-full bottom-0 ">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-900"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddStudent;
