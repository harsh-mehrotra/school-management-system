import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

export default function OtpBoxes(verificationCode,) {
  const [otp, setOtp] = useState('');
  console.log(otp);
  
  return (
    <OtpInput

      value={verificationCode}
      isInputNum={true}
      separator={<span style={{ width: "8px" }}></span>}
      shouldAutoFocus={true}
      inputStyle={{
        border: "1px solid #CFD3DB",
        margin:"2px",
        borderRadius: "8px",
        width: "40px",
        height: "40px",
        fontSize: "18px",
        color: "#000",
        fontWeight: "500",
        caretColor: "blue"
      }}
      focusStyle={{
        border: "1px solid #CFD3DB",
        outline: "none"
      }}
      onChange={setOtp}
      numInputs={6}
      inputType='number'
      renderSeparator={<span></span>}
      renderInput={(props) => <input {...props} />}
    />
  );
}