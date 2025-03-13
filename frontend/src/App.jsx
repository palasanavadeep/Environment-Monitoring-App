import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Headder from './components/Headder'
import Footer from './components/Footer'

// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Headder />
    <div className=' bg-gradient-to-r from-[#D8F3DC] via-[#B7E4C7] via-[#A3D9C6] via-[#BFDCE5] to-[#D6E6F2] min-h-screen'>
    <Outlet />
    </div>
    <Footer />
    </>
  )
}

export default App
