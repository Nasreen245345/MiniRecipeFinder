import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import './App.css'
import './index.css'
import Login from './components/Login'
import Signup from './components/Signup'
import Verifyemail from './components/VerifyEmail'
import Header from "./components/common/Header"
import Home from './components/Home'
import Favourites from "./components/Favourite"
import Recipepage from './components/Recipepage'
function App() {
  return (
    <>
  
    <Router>
      <Header/>
      <Routes>
          
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/favourites" element={<Favourites/>}/>
        <Route path='/verify/:token' element={<Verifyemail/>}/>
        <Route path="/recipeview" element={<Recipepage/>}/>
      </Routes>
      </Router>
    </>
  )
}

export default App
