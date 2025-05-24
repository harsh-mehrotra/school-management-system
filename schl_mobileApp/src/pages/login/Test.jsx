import React, { useEffect, useRef, useState, createContext} from 'react'
import './login.css'
import './OtpBoxes'
import { useNavigate } from 'react-router-dom';
import { auth } from "./firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OtpInput from 'react-otp-input';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

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

    // Generate Captcha and set up ph   one authentication
    const generateCaptcha = () => {
        try {
            if (auth) {
                // Check if auth is available
                // Initialize reCAPTCHA only once
                if (!window.recaptchaVerifier && captchaRef.current) {
                    console.log("inside the captcha");
                    window.recaptchaVerifier = new RecaptchaVerifier(
                        auth,
                        captchaRef.current,
                        {
                            size: "normal",
                            callback: (response) => {
                                console.log("response--->", response);
                                // reCAPTCHA solved, allow signInWithPhoneNumber.
                                // ...
                            },
                            "expired-callback": () => {
                                console.log("it is expired");
                                // Response expired. Ask user to solve reCAPTCHA again.
                                // ...
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
                }
            } else {
                console.log("Firebase Auth is not yet initialized.");
                // Optionally, you could retry after a short delay to wait for auth initialization
                setTimeout(generateCaptcha, 1000); // Retry after 1 second if auth is not yet available
            }
        } catch (error) {
            console.error("Error in generateCaptcha:", error);
            // Handle error if necessary, like showing an alert or retry logic
        }
    };

    // Handle the phone authentication request
    const handlePhoneAuth = async () => {
        if (!phoneNumber) return;

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
            setbuttonName("Verify Code");
            setPageName(!pageName);
        } catch (error) {
            console.error("Error during phone authentication: ", error.message);
            alert(`Error during phone authentication: ${error.message}`);
        }
    };

    // Handle verification code submission
    const verifyCode = async () => {
        if (!verificationCode || !confirmationResult) return;

        try {
            const result = await confirmationResult.confirm(verificationCode);
            console.log("result==>", result)
            console.log("Phone authentication successful!");
            navigate('/Home', { state: { phoneNumber } });   // sending a phone Number On next state
        } catch (error) {
            console.error("Error during code verification: ", error.message);
            alert(`Error during code verification: ${error.message}`);
        }
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
                console.log(
                    "appVerificationDisabledForTesting set to true for testing."
                );
            }
            generateCaptcha();

            // generateCaptcha();
        } else {
            console.error("Firebase Auth is not correctly initialized.");
        }
    }, []);

    // handling the click on a send OTP Button
    const handleClick = () => {
        if (buttonName == "Send OTP") {
            handlePhoneAuth();
        }
    }

    // Handling a click on a Submit OTP Button
    const handleOtpClick = () => {
        verifyCode();
    }



    return (
        <PhoneNumberContext.Provider value={phoneNumber}>
            <div className=" flex flex-col justify-center items-center w-full h-full">

                <div className="bg-zinc-100 rounded-2xl w-[90%] h-[40%] flex justify-center flex-col  p-1 relative gap-0.5">

                    <h1 className=' ml-2 text-5xl max-[350px]:text-3xl font-bold mb-1 text-[#614AD3]'>Hey !</h1>
                    <h1 className='ml-2 text-lg max-[350px]:text-sm text-black'>please log in to continue using our app</h1>

                    {/* Form */}

                    <div className="flex flex-col justify-center items-center">

                        <form className="flex flex-col justify-center items-center h-full w-full" onSubmit={(e) => e.preventDefault()}>

                            {
                                pageName ? (
                                    <div className='w-[100%]'>

                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            value={value}
                                            defaultCountry='IN'
                                            onChange={setPhoneNumber}
                                            className="mb-3 h-[60px] p-2 rounded-lg shadow appearance-none border w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline" // Combined styles
                                        />



                                        <button className='h-[60px] py-2 w-full text-xl bg-[#614AD3] border rounded-lg border-gray-500 focus:border-[#614AD3] text-white font-bold' onClick={handleClick} type='button' >
                                            {buttonName}
                                        </button>

                                    </div>) : (
                                    <div className='w-full h-full flex flex-col'>
                                        <h1 className='text-lg p-2'>Enter OTP :</h1>
                                        <div className="flex flex-col items-center w-full justify-center mb-3 p-2">

                                            <OtpInput

                                                value={verificationCode}
                                                isInputNum={true}
                                                separator={<span style={{ width: "8px" }}></span>}
                                                shouldAutoFocus={true}
                                                inputStyle={{
                                                    border: "1px solid black",
                                                    margin: "2px",
                                                    borderRadius: "8px",
                                                    width: "50px",
                                                    height: "50px",
                                                    fontSize: "18px",
                                                    color: "#000",
                                                    fontWeight: "500",
                                                    caretColor: "blue"
                                                }}
                                                focusStyle={{
                                                    border: "2px solid red",
                                                    outline: "none"
                                                }}
                                                onChange={setVerificationCode}
                                                numInputs={6}
                                                inputType='number'
                                                renderSeparator={<span></span>}
                                                renderInput={(props) => <input {...props} />}
                                            />
                                        </div>

                                        <button className='h-[60px] py-2 w-full text-xl bg-[#614AD3] border rounded-lg border-gray-500 focus:border-[#614AD3] text-white font-bold' onClick={handleOtpClick} type='button' >
                                            {buttonName}
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
