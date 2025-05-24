import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { baseUrl } from '../../KeyConfig';
import { getAuth, signOut } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux';
import { setStudentArray, updateStudentStatus } from '../../Redux/slices/slice';
import { setLoading } from '../../Redux/slices/loaderSlice';

const Home = () => {
    // Redux Hooks
    const dispatch = useDispatch();
    const students = useSelector((state) => state.students.p_students);
    const navigate = useNavigate();
    const { state } = useLocation();
    const phoneNumber = state?.phoneNumber;

    // Local States
    const [studentIds, setStudentIds] = useState([]); // UI selection ke liye
    const [filteredIds, setFilteredIds] = useState([]); // API request ke liye
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showPickupButton, setShowPickupButton] = useState(false);
    let flag = 0;
    const auth = getAuth();


    // Fetching Data 
    const dataFetch = () => {
        if (!phoneNumber) { return }
        dispatch(setLoading(true));
        axios.get(`${baseUrl}api/student/getStudentDataByMobileNo/${phoneNumber}`)
            .then((result) => {
                dispatch(setLoading(false));
                dispatch(setStudentArray(result.data));
            }).catch((err) => {
                dispatch(setLoading(false));
                console.log(err);
            });
    };

    // UseEffect Hook
    useEffect(() => {
        dataFetch();
    }, []);

    // Setting Background Color for status Boxes
    const statusBackground = (status) => {
        switch (status) {
            case "In Class": return 'bg-[#62F9FF]';
            case "Parent Arrived": return 'bg-[#EEE1A9]';
            case "Parent pickedup": return 'bg-[#58D590]';
            case "Student Absent": return "bg-[#2C2C2C]";
            default: return 'bg-red-300';
        }
    };

    // Child KPI's
    const Child = () => {
        // check all the statuses and implementing logics here
        const statusCheck = (studentId, stts) => {

            if ((stts === "In Class" || stts === "Released" || stts === "Parent Arrived" || stts === "Parent not came yet") && !showLogoutPopup) {

                // UI selection ke liye
                setStudentIds((prevState) => {
                    if (prevState.includes(studentId)) {
                        if (prevState.length > 1) {
                            return prevState.filter(id => id !== studentId);
                        } else {
                            return prevState.filter(id => id !== studentId);
                        }
                    } else {
                        return [...prevState, studentId];
                    }
                });

                // API request ke liye sirf non-Released IDs
                setFilteredIds((prevFiltered) => {
                    if (stts !== "Released") {
                        return [...prevFiltered, studentId]; // Non-Released status wale add honge
                    } else {
                        return prevFiltered.filter(id => id !== studentId); // Agar Released hai to remove
                    }
                });
            } else {
                console.log("Status is :" + stts);
            }
        };
        // child KPI return
        return (
            students?.map((child, key) => (

                <div className={`flex flex-col bg-transparent justify-center items-center`} key={key} >

                    {/* Child KPI */}
                    <button className={`flex flex-col backdrop-blur-sm cursor-pointer items-center justify-center border-1 rounded-3xl p-1 py-5 w-full h-full  ${studentIds.includes(child._id) ? 'gradientRounded' : ''}`}
                        onClick={() => { statusCheck(child._id, child.studentStatus.status) }}>
                        <p className="text-xl text-gray-800 font-semibold">{child.name}</p>
                        <div className="flex gap-1 ">
                            <h1 className="text-xl font-semibold text-gray-800">Class :</h1>
                            <p className="text-xl text-gray-700">{child.className}</p>
                            <p className="text-xl text-gray-700">{child.section}</p>
                        </div>
                        <div className="flex gap-[2px] ">
                            <h1 className="text-xl font-semibold text-gray-800">Roll No :</h1>
                            <p className="text-xl text-gray-700 overflow-none">{child.rollNumber}</p>
                        </div>

                    </button>

                    {/* Child Status */}
                    <div className={`mt-2 items-center px-2 w-auto min-w-[140px] text-center rounded-full ${statusBackground(child.studentStatus.status)}`} >
                        {child.studentStatus.status}
                    </div>
                </div >
            ))
        );
    };

    // Sending IDs to Server for Status Change
    const sendReq = (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        console.log("fid--", studentIds);

        if (filteredIds.length === 0) {
            dispatch(setLoading(false));
            navigate(`/waitingPage?selected=${studentIds}`, { state: { phoneNumber } });
        }
        axios.patch(`${baseUrl}api/student/status/pickupStudent`, { studentIds: filteredIds }) // filteredIds use ho raha hai
            .then((result) => {
                dispatch(setLoading(false));
                console.log(result);
                navigate(`/waitingPage?selected=${studentIds}`, { state: { phoneNumber } });
                dispatch(updateStudentStatus({ studentIds: filteredIds, newStatus: "Parents Arrived" }));
            }).catch((err) => {
                dispatch(setLoading(false));
                console.log(filteredIds);
                console.log(err);
            });
    };

    // LogOut Icon
    const logoutIcon = () => (
        <div className="relative inline-block right-[1%] top-2">
            <div className="w-10 h-10 flex items-center justify-center cursor-pointer p-2 hover:bg-gray-50 hover:rounded-3xl active:rounded-[50%] active:bg-gray-200" onClick={handleLogoutIconClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5zm16 7l-4-4v3H9v2h8v3z" /></svg>
            </div>
        </div>
    );

    // pickup button show/hide logic
    useEffect(() => {
        const allPickedOrAbsent = students?.every(child =>  // every function checks if all the students are picked or absent
            child.studentStatus.status === 'Parent pickedup' || child.studentStatus.status === 'Student Absent'
        );

        setShowPickupButton(allPickedOrAbsent);
    }, [students]);

    // Logout PopUp Handlers
    const handleLogoutIconClick = () => setShowLogoutPopup(true);

    //handling Logout
    const handleLogout = () => {
        setShowLogoutPopup(false);
        signOut(auth).then(() => navigate('/')).catch((error) => console.error("Error signing out:", error));
    };

    // handle logout popup
    const handleClosePopup = () => setShowLogoutPopup(false);

    // Main return
    if (!phoneNumber) {
        return (
            <div className='flex flex-col items-center gap-1'>
                <h1 className='font-bold text-xl font-mono text-center '>Login First to Continue With App</h1>
                <button className='text-blue-700 cursor-pointer rounded-3xl px-2 active:bg-[#3a25a3] active:text-white underline text-lg text-center' onClick={() => navigate("/", { replace: true })}>Go To Login Page</button>

            </div>

        )
    } else
        return (

            <div className='w-full h-screen overflow-y-auto bg-transparent'>

                {/* Header */}
                <div className='sticky top-0 w-full z-10 pt-5 flex justify-between bg-white'>
                    <div className='bg-white'>
                        <h1 className='text-5xl max-[350px]:text-3xl mb-2 font-bold text-[#614AD3] font-[poppins]'>Hey !</h1>
                        <h1 className='text-[20px] font-[poppins] font-[700]'>Choose to Pickup Children</h1>
                    </div>
                    {logoutIcon()}
                </div>

                {/* Child KPI's */}
                <div className='grid grid-cols-2 min-[550px]:grid min-[550px]:grid-cols-3 p-2 gap-2 mt-2 w-full'>
                    {Child()}
                </div>

                {/* LogOut PopUp */}
                {showLogoutPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
                        <div className="backdrop-blur-[77px] p-6 rounded shadow-lg text-center">
                            <p className="mb-2 font-semibold">Are you sure you want to logout?</p>
                            <button className="bg-[#614AD3] text-white py-2 px-4 cursor-pointer rounded mr-2" onClick={handleLogout}>Yes, Logout</button>
                            <button className="bg-[#58D590] text-white py-2 px-4 cursor-pointer rounded" onClick={handleClosePopup}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Pickup Button */}
                <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer'>
                    <button
                        disabled={studentIds.length === 0}
                        className={`px-8 min-w-[180px] py-2 font-bold border rounded-4xl ${(studentIds.length) === 0 ? 'bg-gray-300' : 'btn'} ${showPickupButton ? 'hidden' : ''}`}
                        onClick={sendReq}>
                        Pickup
                    </button>
                </div>


            </div>
        );
};

export default Home;