import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect,useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
const verifyEmail = () => {
     const {token}=useParams()
     const [message,setMessage]=useState("Verifying email...")
     const navigate=useNavigate()
     useEffect(() => {
      let called=false
      if(called) return
      called=true
        const verifyemail=async ()=>{
            try{
            const res=await api.get(`/auth/verify/${token}`)
            setMessage(res.data.message || "Email verified Succesfully")
            setTimeout(()=>{
              navigate("/login")
            },2000)
            }catch(err){
        setMessage(err.response.data.message || "Invalid or expired token")
      }
        }
      
      verifyemail()
     },[token])
     
  return (
    <div className='flex items-center justify-center'>
     <h1 className='text-xl font-bold'>{message}</h1>
    </div>
  )
}

export default verifyEmail
