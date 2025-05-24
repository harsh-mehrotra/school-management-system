import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import CustomFormInput from "../../components/CustomFormInput";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { baseURL } from "../../../utils/urlConfig";
import { MdOutlineCloudUpload } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

const AddTeacher = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({mobileNo:"+91"});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [showUpdateButtons, setShowUpdateButtons] = useState(false);

  const clrImgref = useRef(null);
  const handleClick = () => {
    clrImgref.current.click();
  };
 
  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.startsWith("91")) {
      value = value.slice(2); // Remove duplicate "91" if present
    }
    if (value.length > 10) {
      value = value.slice(0, 10); // Limit to 10 digits
    }
    setFormData((prev) => ({ ...prev, mobileNo:`+91${value}`}));
  };

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
    if (!data.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email address";
    }
    if (!data.teacherId?.trim()) {
      errors.teacherId = "Teacher ID is required";
    }
    if (!data.mobileNo?.trim() || data.mobileNo.length !== 13) {
      errors.mobileNo = "Number must be 10 digits after +91";
    }
    if (!data.designation?.trim()) {
      errors.designation = "Designation is required";
    } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(data.designation)) {
      errors.designation = "Designation must contain only letters and spaces";
    }
    if (!data.section?.trim()) {
      errors.section = "Section is required";
    } else if (!/^[A-Z]$/.test(data.section)) {
      errors.section = "Section must be a single uppercase letter (A-Z)";
    }
    if (!data.registrationNo?.trim()) {
      errors.registrationNo = "Registration Number is required";
    } else if (!/^[a-zA-Z0-9]{2,10}$/.test(data.registrationNo)) {
      errors.registrationNo = "Registration Number must be 2 to 10 alphanumeric characters";
    }
    
    if (!data.password?.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 4) {
      errors.password = "Password must be atleast 4 characters long";
    }
    // if (!data.teacherPhoto) {
    //   errors.teacherPhoto = "Image upload is required";
    // }
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await axios.post(`${baseURL}/api/teacher/addTeacher`, formData1, {
        withCredentials: true,
      });
      toast.success("Teacher added successfully!");
      setTimeout(() => {
        navigate("/dashboard/manage-teacher");
      }, 2000);
    } catch (error) {
      console.error("Error adding teacher:", error);
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        toast.error("Failed to add teacher. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 rounded-lg max-w-4xl w-full text-[15px] max-[740px]:overflow-auto ">  
      <div className="flex items-center gap-3">
        <GoArrowLeft
          className="text-2xl mb-4 cursor-pointer text-gray-700 hover:text-black"
          onClick={() => navigate("/dashboard/manage-teacher")}
        />
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Add Teacher
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 flex gap-9 w-full">
        <div className="flex flex-col w-full">
          <div className="flex w-full max-[740px]:flex  max-[740px]:flex-col ">
            {/* Left Column */}
            <div className=" w-full sm:w-1/2 space-y-6 text-[15px] mr-10">
              <CustomFormInput
                label="Full Name"
                type="text"
                name="name"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
                error={errors?.name}
                required
              />
              <CustomFormInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors?.email}
                required
              />
              <CustomFormInput
                label={"Teacher Id"}
                type="text"
                name="teacherId"
                placeholder="Enter Id"
                value={formData.teacherId}
                onChange={handleChange}
                error={errors?.teacherId}
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
                  className="w-full p-2 border border-gray-400 rounded-lg"
                  value={formData.doj}
                  onChange={handleChange}
                  required
                />
              </div>
              <CustomFormInput
                label={"Designation"}
                type="text"
                name="designation"
                placeholder="Enter Designation"
                value={formData.designation}
                onChange={handleChange}
                error={errors?.designation}
                required
              />
              <div className="flex items-center gap-4">
                <label className=" w-1/2 text-gray-700 font-semibold text-left">
                  Class*:
                </label>
                <select
                  name="className"
                  className="w-full p-2 border border-gray-400 rounded-lg overflow-auto"
                  style={{ maxHeight: "100px" }} // Limit height and allow scrolling
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
                value={formData.section}
                onChange={handleChange}
                error={errors?.section}
                required
              />
            </div>
            {/* Right Column */}
            <div className="w-full sm:w-1/2 space-y-4 text-[15px]  mt-2 md:mt-0 xl:ml-10">
              <CustomFormInput
                label={"Mobile Number"}
                type="tel"
                name="mobileNo"
                placeholder="Enter Mobile Number"
                value={formData.mobileNo}
                onChange={handleMobileChange}
                error={errors?.mobileNo}
                required
              />
              <div className="flex items-center gap-4">
                <label className="w-1/2 text-gray-700 font-semibold text-left">
                  Gender*:
                </label>
                <select
                  name="gender"
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
                label={"Registration Number"}
                type="text"
                name="registrationNo"
                placeholder="Enter Registration Number"
                value={formData.registrationNo}
                onChange={handleChange}
                error={errors?.registrationNo}
                required
              />
              <CustomFormInput
                label={"Address"}
                type="text"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <div className="flex items-center gap-4">
                <label className="w-1/2 text-gray-700 font-semibold text-left">
                  Password*:
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="w-full p-2 border border-gray-400 rounded-lg pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors?.password}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
                  >
                    {showPassword ? (
                      <IoEyeOutline size={20} />
                    ) : (
                      <IoEyeOffOutline size={20} />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center relative gap-4">
                <label className=" w-1/3 md:w-40 text-gray-700 font-semibold text-left ">
                  Image*:
                </label>
                <div className="flex flex-col h-auto items-start w-full ml-6 justify-center">
                  <div
                    onClick={handleClick}
                    // onDrop={handleDrop}
                    // onDragOver={handleDragOver}
                    className="w-full   p-2 border flex items-center justify-center hover:cursor-pointer text-start border-gray-500 rounded-lg border-dashed "
                  >
                    <MdOutlineCloudUpload className="size-5 mr-2" />
                    <span className="text-blue-600  text-sm">Select image</span>
                    {/* <span className="text-black text-sm">
                      &nbsp;or Drag & Drop
                    </span> */}
                    {/* {image && image.name ? image.name : "Click to select image"} */}
                  </div>
                  <input
                    ref={clrImgref}
                    id="teacherPhoto"
                    type="file"
                    name="teacherPhoto"
                    accept="image/*"
                    onChange={handleChange}
                    className="p-2 border  border-gray-400  rounded-lg hidden"
                  />
                  {/* Render the image preview */}
                  {image ? (
                    <div className="relative flex flex-col items-center mt-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                        className=" h-25 w-20 object-cover rounded-lg border"
                      />
                      <span>{image.name}</span>

                      {showUpdateButtons && (
                        <div className="flex flex-row  mt-2 -right-12 ">
                          {/* <button
                            onClick={handleClick}
                            className="bg-green-600 text-white px-4 py-1 text-sm rounded-lg hover:bg-green-700"
                          >
                            Update
                          </button> */}
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
          <div className="flex  flex-wrap items-center justify-center mt-2">
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
export default AddTeacher;
