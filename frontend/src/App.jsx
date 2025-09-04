import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import './App.css'
import './index.css'
import Login from './components/Login'
import Signup from './components/Signup'
import Verifyemail from './components/VerifyEmail'
import Header from "./components/common/Header"
import Home from './components/Home'
function App() {
  return (
    <>
  
    <Router>
      <Header/>
      <Routes>
          
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/verify/:token' element={<Verifyemail/>}/>
      </Routes>
      </Router>
    </>
  )
}

export default App
