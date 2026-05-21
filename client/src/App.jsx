import React from 'react'
import Sidebar from './components/Sidebar'
import Chatbox from './components/Chatbox'
import Login from './pages/Login'
import Community from './pages/Community'
import Credits from './pages/Credits'
import Loading from './pages/Loading'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <div className='dark:bg-gardient-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Chatbox />} />
            <Route path="/login" element={<Login />} />
            <Route path="/community" element={<Community />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/loading" element={<Loading />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App