import React, {useState} from 'react'
import Sidebar from './components/Sidebar'
import Chatbox from './components/Chatbox'
import Login from './pages/Login'
import Community from './pages/Community'
import Credits from './pages/Credits'
import Loading from './pages/Loading'
import { Routes, Route, useLocation } from 'react-router-dom'
import { assets } from './assets/assets'
import './assets/prism.css'
import { useAppContext } from './context/AppContext'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} = useLocation()
  const {user} = useAppContext()
  if(pathname === '/loading'){
    return <Loading />
  } 
  return (
    <>
    { !isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' onClick={() => setIsMenuOpen(true)} alt='Menu' /> }
    {user ? (
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<Chatbox />} />
            <Route path="/login" element={<Login />} />
            <Route path="/community" element={<Community />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/loading" element={<Loading />} />
          </Routes>
        </div>
      </div>
    ): (
      <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
        <Login />
      </div>
    )}
      
    </>
  )
}

export default App