import React, { useEffect, useRef, useState } from 'react'
import "./otpPage.scss"
import axios from 'axios'
import { CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { findError } from '../../ErrorFinder'
import ErrorPage from '../../components/ErrorPage/ErrorPage'

const OtpPage = () => {
  const {state} = useLocation()
  const navigate = useNavigate()
const emailRef=useRef()
const otpRef=useRef()
const newPasswordRef=useRef()
const confirmNewPasswordRef=useRef()

    const[minutes,setMinutes]=useState("03")
    const[seconds,setSeconds]=useState("00")
    const[sessionId,setSessionId]=useState({
      loading:false,
      data:state?state:null,
      error:null
    })

    const[otpId,setOtpId]=useState({
      loading:false,
      data:null,
      error:null
    })

    const[newPassword,setNewPassword]=useState({
      loading:false,
      error:null
    })

useEffect(()=>{
otpId.data&& (Number(seconds)>0||Number(minutes)>0) &&  setTimeout(()=>{
        if(Number(seconds)===0){
            setMinutes((p)=>{
                const num = Number(p) -1
              return  ('0' + num).slice(-2)
             })
             setSeconds('59')
        }else{
            setSeconds((p)=>{
                const num = Number(p) -1
              return  ('0' + num).slice(-2)
             })
        }       
    },1000)

})

async function getOTP(){
  setOtpId({
    loading:true,
    data:null,
    error:null
  })
try {
  const res =await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/create-OTP/`,{email:emailRef.current.value})
  if(findError(res.data)){
    setOtpId({
      loading:false,
      data:null,
      error:res.data
    })
  }else {
    setOtpId({
      loading:false,
      data:res.data,
      error:null
    })
  }
  
} catch (error) {
  console.log(error)
  setOtpId({
    loading:false,
    data:null,
    error:'network error'
  })
}
}


async function sendOTP(){
  setSessionId({
    loading:true,
    data:null,
    error:null
  })
try {
  const res =await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-OTP/${otpId.data}`,{OTP:otpRef.current.value})
  if(findError(res.data)){
    setSessionId({
      loading:false,
      data:null,
      error:res.data,
    })
  }else{
    setOtpId({
      loading:false,
      data:null,
      error:null
    })
    setSessionId({
      loading:false,
      data:res.data,
      error:null
    })
  }

} catch (error) {
  setSessionId({
    loading:false,
    data:null,
    error:'network error'
  })
}
}

async function createNewPassword(){
  if(newPasswordRef.current.value===confirmNewPasswordRef.current.value){
    setNewPassword({
      loading:true,
      error:null
    })
  try {
    const res =await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/change-password/${sessionId.data}`,{password:newPasswordRef.current.value})
    if(findError(res.data)){
      setNewPassword({
        loading:false,
        error:res.data
      })
    }else{
      setNewPassword({
        loading:false,
        error:null
      })
      navigate('/Login')
    }
  } catch (error) {
    setNewPassword({
    loading:false,
    error:'password do not match'
  })
  }

  }else  {
     setNewPassword({
    loading:false,
    error:'network error'
  })}
}

  return (
    <div className='otpPage'>
      {(otpId.loading||sessionId.loading||newPassword.loading)&&<CircularProgress className='spinner'/>}
      {(otpId.error||sessionId.error||newPassword.error)&&<ErrorPage/>}
    {!otpId.data&&!sessionId.data&& <div className="container">
            <div className="title">ENTER EMAIL</div>
            <input type="text" className='input' placeholder='ENTER EMAIL' ref={emailRef} />
            <button className='btn-confirm' onClick={()=>getOTP()}>Get OTP</button>
        </div>}
       {sessionId.data&& <div className="container">
            <div className="title">ENTER NEW PASSWORD</div>
            <input type="password" className='input' placeholder='ENTER NEW PASSWORD' ref={newPasswordRef} />
            <input type="password" className='input'  placeholder='CONFIRM NEW PASSWORD' ref={confirmNewPasswordRef} />
            <button className='btn-confirm' onClick={()=>createNewPassword()}>Create new password</button>
        </div>}
       {otpId.data&&<div className="container">
        <div className="title">ENTER OTP</div>
      <input type="password" className='input' placeholder='ENTER OTP' ref={otpRef}/>
      <button className='btn-confirm' onClick={()=>sendOTP()}>Send OTP</button>
      <div className="time">{minutes}:{seconds}</div>
        </div> }  
    </div>
  )
}

export default OtpPage
