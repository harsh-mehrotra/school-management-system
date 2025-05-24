import React from "react";

const CustomFormInput = ({
  name = "",
  placeholder,
  required,
  type = "text",
  value,
  onChange,
  error,
  label,
}) => {
  return (
    <>
      <div className="flex items-center gap-4 ">
        {label && (
          <label className="w-1/2  text-gray-700 text-left font-semibold">
            {label}
            {required ? "*" : ""}:
          </label>
        )}
        <div className="w-full flex flex-col">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-400 rounded-lg"
            required={required ? required : false}
          />
            {error &&  (
              <span className="error-message  text-red-700">{error}</span>
            )} 
        </div>
      </div>
    </>
  );
};

export default CustomFormInput;
