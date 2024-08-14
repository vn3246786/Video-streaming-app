import React, { useRef, useState } from 'react'
import "./changePassword.scss"
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { findError } from '../../ErrorFinder'
import { CircularProgress } from '@mui/material'

const ChangePassword = () => {
  const navigate = useNavigate()
const {state}= useLocation()
const passwordRef = useRef()
  const[sessionId,setSessionId]=useState({
    loading:false,
    data:null,
    error:null
  })

async function handleSubmit(e){
e.preventDefault()
setSessionId({
  loading:true,
  data:null,
  error:null
})
try {
  const res = await axios.post('/api/auth/create-session' ,{email:state,password:passwordRef.current.value})
  if(findError(res.data)){
    setSessionId({
      loading:false,
      data:null,
      error:res.data
    })
  }else {
    setSessionId({
      loading:false,
      data:res.data,
      error:null
    })
 navigate('/otp',{state:res.data})
  }
} catch (error) {
  console.log(error)
  setSessionId({
    loading:false,
    data:null,
    error:"network error"
  })
}

}


  return (
    <div className='changePassword'>
      <form onSubmit={handleSubmit} className="container">
      {sessionId.loading&&<CircularProgress className='spinner'/>}
        <h1 className='title'>ENTER PASSWORD</h1>
        <input type="password" ref={passwordRef} required={true} className='input' />
        <div onClick={()=>navigate('/otp')}>forgot password?</div>
        <button type='submit' className='btn'>proceed</button>
      </form>
    </div>
  )
}

export default ChangePassword
