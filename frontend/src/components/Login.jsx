import React, { useState } from 'react'
import api from "../services/api"
import {useAuth} from '../Context/auth.jsx'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const navigate=useNavigate()
  const {login}=useAuth()
  const [formData,setFormData]=useState({email:'',password:''})
  const handleSubmit=async (e)=>{
    e.preventDefault()
    try{
      const res=await api.post("/auth/login",formData,{ headers: { "Content-Type": "application/json" }})
      
      if(res.status===200){
        alert("Login succesful")
        login(res.data.user,res.data.token)
      }
     
    }catch(err){
      console.log(err)
      if (err.response) {
        const message=err.response.data.message
        if(message==="Please verify your email first"){
          alert("Please verify your eamil.Check your inbox")
        }
        else{
          alert(err.response.data.message || "Login failed");
        }
      
    } else {
      alert("Something went wrong");
    }
      
    }

  }
  const handleChange=(e)=>{
    setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    console.log(formData)
  }
  return (
    <div className='w-full min-h-screen bg-gray-100 flex items-center justify-center '>
      <div className='w-full bg-[#ffffff] flex flex-col gap-2 p-6 m-20 rounded-lg sm:w-3/4 md:w-1/2 lg:w-1/4'>
      <h1 className='text-center font-bold text-2xl sm:text-3xl md:text-4xl '>Login</h1>
      <div className='text-center mb-3 text-ml font-normal'>Welcome backe to receipe</div>
      <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
        <label className='font-normal '>Email</label>
        <input
        name="email" 
        required
        value={formData.email}
        placeholder='Enter email'
        onChange={handleChange}
        className='rounded-md px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none'
        />
        <label className='font-normal '>password</label>
        <input
        name="password"
        required
        value={formData.password}
        placeholder='Enter password'
        onChange={handleChange}
        className=' border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none'
        />
        <button className='text-center bg-orange-500 rounded-md mt-3 py-2 font-semibold text-sm sm:text-xl' type="submit">
        Submit
      </button>
      </form>
      <div className='text-center mt-2'>
        Dont have an account?
        <button className='text-orange-500 font-semibold ' onClick={()=>navigate("/signup")}>Signup</button>
      </div>


      </div>
    </div>
  )
}

export default Login
