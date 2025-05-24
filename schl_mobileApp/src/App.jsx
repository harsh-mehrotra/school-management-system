import React from 'react'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import Test from './pages/login/Test'
import ConfirmationPage from './pages/Confirmation/ConfirmationPage'
import Test2 from '../src/pages/home/Test2'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Loader from './components/Loader'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast';

const App = () => {

  const loading = useSelector((state) => state.loading.loader);
  return (
    <BrowserRouter> {loading ? <Loader /> : ""}
      <Toaster position="top-right"/>
      <Routes >
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path='/phone' element={<Test />} />
        <Route path='/waitingPage' element={<ConfirmationPage />} />
        <Route path='/test' element={<Test2 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App