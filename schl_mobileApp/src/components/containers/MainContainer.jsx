import React from 'react'

const MainContainer = ({ children }) => {
    return (
        <div className=' flex flex-col justify-center items-center ' >
            <div className=' flex flex-col justify-center items-center max-[350px]:w-[320px] max-[376px]:w-[360px] max-[400px]:w-[380px] max-[430px]:w-[410px] max-[500px]:w-[430px] max-[600px]:w-[500px] max-[700px]:w-[600px] max-[730px]:w-[700px]  max-[768px]:w-[760px] min-md:w-[768px] h-[100vh] bg-[url(../../assets/501.png)] bg-cover bg-bottom bg-no-repeat ' >
                {children}
            </div>
        </div>
    )
}

export default MainContainer