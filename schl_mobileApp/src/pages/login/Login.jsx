
import React, { useEffect, useRef, useState, createContext } from 'react'
import './login.css'
import './OtpBoxes'
import { useNavigate } from 'react-router-dom';
import { auth } from "./firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OtpInput from 'react-otp-input';
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from 'react-hot-toast'

const PhoneNumberContext = createContext();


const Login = () => {

    const navigate = useNavigate();
    const [buttonName, setbuttonName] = useState('Send OTP');
    const [pageName, setPageName] = useState(true);
    const captchaRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [value, setValue] = useState()
    const [phoneerror, setPhoneError] = useState("");
    const [otperror, setOtpError] = useState("");
    const [otpResendTimer, setOtpResendTimer] = useState(5); // Initial timer value in seconds
    const [resendButtonDisabled, setResendButtonDisabled] = useState(true);

    // Generate Captcha and set up ph   one authentication
    const generateCaptcha = () => {
        try {
            if (auth) { // Check if auth is available
                // Reset the reCAPTCHA if it already exists
                if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = null;
                }

                if (!window.recaptchaVerifier && captchaRef.current) {
                    console.log("inside the captcha");
                    window.recaptchaVerifier = new RecaptchaVerifier(
                        auth,
                        captchaRef.current,
                        {
                            size: "normal",
                            callback: (response) => {
                                console.log("response--->", response);
                            },
                            "expired-callback": () => {
                                console.log("it is expired");
                            },
                        }
                    );

                    window.recaptchaVerifier
                        .render()
                        .then((widgetId) => {
                            window.recaptchaWidgetId = widgetId;
                            console.log("working");
                        })
                        .catch((error) => {
                            console.log("error==>", error);
                        });
                } else {
                    console.log("captcha already generated");
                }
            } else {
                console.log("Firebase Auth is not yet initialized.");
                setTimeout(generateCaptcha, 1000); // Retry after 1 second if auth is not yet available
            }
        } catch (error) {
            console.error("Error in generateCaptcha:", error);
        }
    };

    // Handle the phone authentication request
    const handlePhoneAuth = async () => {

        if (!phoneNumber) {
            console.log("No Number");
            return;
        }

        const appVerifier = window.recaptchaVerifier;
        console.log("appVerifier==>", appVerifier)
        try {
            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                appVerifier
            );
            setConfirmationResult(confirmationResult);
            console.log("SMS sent, now enter the verification code.");
            setbuttonName("Verify Code"); // changing the name of a Button
            setPageName(!pageName); // disabling page Name changes

            // OTP Resend Buttton Handling
            generateCaptcha();
            setOtpResendTimer(5); // Reset timer
            setResendButtonDisabled(true); // Disable the button initially
            startResendTimer();

        } catch (error) {
            console.error("Error during phone authentication: ", error.message);
            setPhoneError(`Error during phone authentication: ${error.message}`);
            generateCaptcha(); // Reset reCAPTCHA if any error occurs
        }
    };

    // Resend OTP
    const startResendTimer = () => {
        let timer = 6;
        const interval = setInterval(() => {
            timer--;
            setOtpResendTimer(timer);
            if (timer === 0) {
                clearInterval(interval);
                setResendButtonDisabled(false); // Enable the button
            }
        }, 1000); // Update every second
    };


    // Handle verification code submission
    const verifyCode = async () => {
        if (!verificationCode || !confirmationResult) return;

        try {
            const result = await confirmationResult.confirm(verificationCode);
            console.log("result==>", result)
            toast.success('Verification Successful', {
                position: "bottom-center", // Override global position
            });
            console.log("Phone authentication successful!");
            // navigate('/Home', { state: { phoneNumber }});   // sending a phone Number On next state
            navigate('/Home', { replace: true, state: { phoneNumber: phoneNumber } });
        } catch (error) {
            console.error("Error during code verification: ", error.message);
            setOtpError(`Error during OTP verification`);
            toast.error('Invalid OTP', {position: "top-right"});   
        }
    };

    // Handling resend OTP 
    const handleResendOtp = () => {
        // Resend OTP by calling handlePhoneAuth again
        startResendTimer();
        setResendButtonDisabled(true);
        toast.success('OTP Resent Successfully');
        generateCaptcha(); 
    };

    // Set up recaptcha and phone authentication on component mount
    useEffect(() => {

        if (auth) {
            // Directly set the appVerificationDisabledForTesting flag to true for testing
            if (!auth.settings) {
                auth.settings = {}; // Ensure settings object exists if not present
            }
            auth.settings.appVerificationDisabledForTesting = true;
            if (auth.settings.appVerificationDisabledForTesting) {
                console.log("appVerificationDisabledForTesting set to true for testing.");
            }
            generateCaptcha();

        } else {
            console.error("Firebase Auth is not correctly initialized.");
        }
    }, []);

    // handling the click on a send OTP Button
    const handlePhoneClick = () => {
        if(phoneNumber.length<3){
            setPhoneError("Enter Number First");
        }
        if (buttonName == "Send OTP") {
            handlePhoneAuth();
        }
    }

    // Handling a click on a Submit OTP Button
    const handleOtpClick = () => {
        verifyCode();
    }

    const handlePhoneChange = (value, country) => {

        if (value && !value.startsWith("+")) {
            value = `+${value}`;
        }
        setPhoneNumber(value);

        // Basic Validation: Ensure number is 10+ digits after country code
        if (value.length < country.dialCode.length + 11) {
            setPhoneError("Please enter a valid phone number.");
        } else {
            setPhoneError("");
        }
    };

    const handleOtpChange = (value) => {
        setVerificationCode(value);
        if ((value.length) < 6) {
            setOtpError("Please enter a valid OTP.")
        }
        else {
            setOtpError("");
        }
    }

    return (
        <PhoneNumberContext.Provider value={phoneNumber}>
            <div className=" flex flex-col justify-center items-center w-full h-full min-[500px]:w-[75%] bg-transparent ">

                {/* Login Box */}
                <div className="backdrop-blur-lg border-2 border-[#5d57797e] rounded-2xl w-[95%] h-[45%] px-2 flex justify-center flex-col  p-1 relative gap-0.5">

                    <h1 className=' mx-2 text-5xl max-[350px]:text-3xl font-bold mb-1 text-[#614AD3]'>Hey !</h1>
                    <h1 className='ml-2 text-lg max-[350px]:text-sm text-black'>Please Log in to Continue Using Our App</h1>

                    {/* Form */}

                    <div className="flex mx-2 flex-col justify-center items-center">

                        <form className="flex flex-col justify-center items-center h-full w-full p-2" onSubmit={(e) => e.preventDefault()} name='loginForm'>

                            {
                                pageName ? (//phone Input and Send
                                    <div className='w-[100%]'>
                                        <h1 className='font-semibold text-sm'>Enter Phone No :</h1>
                                        <div className='mt-3'>
                                            <PhoneInput
                                                country={"in"}
                                                value={phoneNumber}
                                                onChange={(value, country) => handlePhoneChange(value, country)}
                                                inputStyle={{
                                                    width: "100%",
                                                    height: "55px",
                                                    fontSize: "20px",
                                                    fontWeight: "500",
                                                    borderRadius: "10px",
                                                    border: "1px solid #ccc",
                                                    paddingLeft: "50px",
                                                    marginBottom: "10px",
                                                }}
                                                containerStyle={{ width: "100%" }}
                                                buttonStyle={{ borderRadius: "8px 0 0 8px" }}
                                                dropdownStyle={{ borderRadius: "8px", width: "300px" }}
                                                autoFormat={true}
                                                enableSearch={true}
                                            />
                                        </div>
                                        {/* Show Error Message */}
                                        {phoneerror && <p className="text-red-500 text-sm mt-2">{phoneerror}</p>}

                                        <button className='h-[55px] mt-3 py-2 w-full text-xl bg-[#614AD3] border rounded-lg border-gray-500 focus:border-[#614AD3] text-white font-bold' onClick={handlePhoneClick} disabled={phoneerror.length >= 1} type='submit'>
                                            {buttonName}
                                        </button>

                                    </div>) : ( // OTP input and send
                                    <div className='w-full h-full flex flex-col'>
                                        <h1 className='mx-2 font-semibold text-lg'>Enter OTP :</h1>
                                        <div className="flex h-full flex-col items-center w-full justify-center mb-2 p-1">

                                            <OtpInput
                                                value={verificationCode}
                                                isInputNum={true}
                                                separator={<span style={{ width: "8px" }}></span>}
                                                shouldAutoFocus={true}
                                                inputStyle={{
                                                    border: "1px solid black",
                                                    margin: "1px",
                                                    borderRadius: "8px",
                                                    width: "45px",
                                                    height: "45px",
                                                    fontSize: "18px",
                                                    color: "#000",
                                                    fontWeight: "500",
                                                    caretColor: "blue"
                                                }}
                                                focusStyle={{
                                                    border: "2px solid red",
                                                    outline: "none"
                                                }}
                                                onChange={(value) => { handleOtpChange(value) }}
                                                numInputs={6}
                                                inputType='number'
                                                renderSeparator={<span></span>}
                                                renderInput={(props) => <input {...props} />}
                                            />

                                        </div>
                                        {/* Show Error Message */}
                                        {otperror && <p className="text-red-500 text-sm mt-2">{otperror}</p>}

                                        <button className='h-[50px] py-1 w-full text-xl bg-[#614AD3] border rounded-lg border-gray-500 focus:border-[#614AD3] text-white font-bold' onClick={handleOtpClick} type='submit' >
                                            {buttonName}
                                        </button>


                                        <button
                                            className="h-[30px] py-1 w-full mt-1 text-base bg-gray-300 border rounded-lg border-gray-500 text-gray-700 font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            onClick={handleResendOtp}
                                            disabled={resendButtonDisabled}
                                            type='submit'
                                        >
                                            Resend OTP {otpResendTimer > 0 ? `${otpResendTimer}s` : ''}
                                        </button>
                                    </div>

                                )
                            }
                        </form>

                        <div ref={captchaRef} id="recaptcha-container"></div>

                    </div>

                </div>


            </div>
        </PhoneNumberContext.Provider>
    )
}



export default Login