import React,{useContext,createContext,useState,useEffect} from 'react'
import api from '../services/api'
//create context
const AuthContext=createContext()
//Provider
export const AuthProvider=({children})=>{
const [user,setUser]=useState(null)
const [token,setToken]=useState(null)
useEffect(() => {
  const savedUser=localStorage.getItem("user")
  const savedToken=localStorage.getItem("token")
  if(savedUser && savedToken){
    setUser(savedUser)
    setToken(savedToken)
  }
}, [])
const login=(userData,userToken)=>{
setUser(userData)
setToken(userToken)
localStorage.setItem("token",userToken)
localStorage.setItem("user",userData)
}
const logout=()=>{
setUser(null)
setToken(null)    
localStorage.removeItem("token")
localStorage.removeItem("user")
}
return (
<AuthContext.Provider value={{user,token,login,logout}}>
    {children}
    </AuthContext.Provider>
);
}
//custom hook to use context
export const useAuth=()=>{
const context=useContext(AuthContext)
if(!context){
    throw new Error("useAuth must be within AuthProvider")
}
return context;
}