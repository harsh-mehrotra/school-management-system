import React, { useEffect, useState } from 'react';
import '../home/Home.css';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { baseUrl } from '../../KeyConfig';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../Redux/slices/loaderSlice';

const ConfirmationPage = () => {

  const studentsArray = useSelector((state) => state.students.p_students)
  const dispatch = useDispatch();
  const { state } = useLocation();
  const phoneNumber = state?.phoneNumber;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selected = searchParams.get('selected');
  const studentIds = selected.split(",");

  useEffect(() => {
    Child();
  }, [studentIds]);

  // Background Status
  const statusBackground = (status) => {
    switch (status) {
      case "In Class": return 'bg-[#62F9FF]';
      case "Parent Arrived": return 'bg-[#EEE1A9]';
      case "Parents Arrived": return 'bg-[#EEE1A9]';
      default: return 'bg-red-300';
    }
  };

  // Child KPIs
  const Child = () => {
    if (!studentsArray || studentsArray.length === 0) {
      return (
        <div className='mx-20 min-[450px]:mx-120'>
          <div className='absolute top-[50%] left-[0%] right-[0%] flex flex-col justify-center items-center w-full'>
            <h1 className='text-center'>You Refreshed a Page.</h1>
            <h1>Go back and Select Again</h1>
            <button className='text-blue-500 cursor-pointer rounded-3xl px-2 active:bg-[#3a25a3] active:text-white underline text-lg text-center' onClick={() => navigate("/Home", { state: { phoneNumber } }, { replace: true })}>Go Back</button>
          </div>
        </div>
      )
    }

    return (
      studentsArray?.map((child, key) => {
        if (studentIds.includes(child._id)) {
          return (
            <div className="flex flex-col justify-center items-center" key={key}>
              <button className={`flex flex-col items-center justify-center border-1 rounded-3xl px-1 py-5 w-full h-full bg-zinc-200 gradientRounded`}>

                <p className="text-xl text-gray-800 font-semibold">{child.name}</p>
                <div className="flex gap-1">
                  <h1 className="text-xl font-semibold text-gray-800">Class :</h1>
                  <p className="text-xl text-gray-700">{child.className}</p>
                  <p className="text-xl text-gray-700">{child.section}</p>
                </div>
                <div className="flex">
                  <h1 className="text-xl font-semibold text-gray-800">Roll No : </h1>
                  <p className="text-xl text-gray-700 overflow-none">{child.rollNumber}</p>
                </div>

              </button>
              <div className={`mt-2 items-center h-[35px] w-[154px] text-center rounded-full ${statusBackground((child.studentStatus).status)}`}>
                {(child.studentStatus).status}
              </div>
            </div>
          );
        }
      })
    );
  };

  // Request to Server
  const sendReq = () => {
    dispatch(setLoading(true));
    axios.patch(`${baseUrl}api/student/status/confirm`, { studentIds })
      .then(() => {
        dispatch(setLoading(false));
        navigate("/Home", { state: { phoneNumber } }, { replace: true }); // Replaces history
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
      });
  };

  // Main Return
  return (
    // <div className='w-full h-screen overflow-y-auto bg-transparent'>
    <div className='w-full min-h-screen overflow-x-hidden bg-transparent'>

      {/* Header */}
      <div className='sticky top-0 bg-white pt-5'>

        <div className='flex justify-between pr-3'>
          <h1 className='text-5xl max-[350px]:text-3xl mb-2 font-bold text-[#614AD3] font-[poppins]'>Hey !</h1>
          {(studentsArray?.length) > 0 ? <button className='text-blue-500 active:text-blue-900 active:font-semibold cursor-pointer underline text-lg text-center' onClick={() => navigate("/Home", { state: { phoneNumber } }, { replace: true })}>Go Back</button> : ''}
        </div>
        <h1 className='text-[24px] font-[poppins] font-[700]'>Choose to Pickup Children</h1>
      </div>

      {/* Child KPIs */}
      <div className='grid grid-cols-2 gap-2 min-[450px]:grid min-[450px]:grid-cols-3 mt-1 p-2'>
        {Child()}
      </div>

      {/* Confirm Button */}
      <div className='sticky inset-y-15 top-[80%] right-0 left-0 px-3 py-2 flex items-center justify-center'>
        <button disabled={studentsArray.length === 0} className={`px-8 min-w-[180px] py-2 font-bold border rounded-4xl ${studentsArray.length === 0 ? 'bg-gray-300' : 'btn'}`} onClick={sendReq}>
          Confirm
        </button>
      </div>

    </div>
  );
};

export default ConfirmationPage;