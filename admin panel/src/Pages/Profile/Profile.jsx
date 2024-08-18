import React, { useContext, useEffect, useState } from 'react'
import "./profile.scss"
import { ArrowBackIos, Edit, Send, Try } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Contexts/AuthContext/AuthContext'
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { CircularProgress } from '@mui/material'
import { checkTokenExpiry } from '../../RefreshToken'
import { updateUser } from '../../Contexts/AuthContext/apiCalls'
import defaultImage from "../../assets/default-profile.png"

const Profile = () => {
  const navigate=useNavigate()
const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
const User = JSON.parse(sessionStorage.getItem("User"))
const{AuthLoading,AuthDispatch}=useContext(AuthContext)
const[username,setUsername]=useState({
  editable:false,
  data:User.username
})
const[email,setEmail]=useState({
  editable:false,
  data:User.email
})
const[profilePic,setProfilePic]=useState(null)



function updateProfile(){
  let userdetails={}
  username.data!==User.username && (userdetails = {...userdetails,username:username.data})
  email.data!==User.username && (userdetails = {...userdetails,email:email.data})
  const ApiCalls=[
    {
      func:updateUser,
      params:[
        AuthDispatch,
        User._id,
        userdetails,
        accesstokenDispatch
      ]
    }
  ]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}


  return (
    <div className='profile'>
        <div className="header">
      <ArrowBackIos className='icon' onClick={()=>navigate(-1)}/>
<div className="title">Profile</div>
 </div>
 {<div className="User-details">
  {AuthLoading&&<CircularProgress className='spinner'/>}
  <div className="wrapper profile-pic">
    <img className='image'src={User.profilePic?User.profilePic:defaultImage} alt="" />
    <input type="file" id='file' className='file' onChange={()=>setProfilePic(e.target.files[0])}/>
    <label htmlFor="file" className='edit' >
    <Edit />
    </label>
  </div>
  <div className="wrapper username">
    <div className="label">Username :</div>
    {username.editable&&<input type="text" id='username' className='input' value={username.data} onChange={(e)=>setUsername((p)=>{
      return {...p,data:e.target.value}
    })}/>}
    {!username.editable&&<div className="value">{User.username}</div>}
    <label htmlFor="username" className='edit' onClick={()=>setUsername((p)=>{
      return {data:User.username,editable:!p.editable}
    })} >
    <Edit />
    </label>
  </div>
  <div className="wrapper email">
  <div className="label">Email :</div>
{email.editable&&  <input type="text" id='email' className='input' value={email.data} onChange={(e)=>setEmail((p)=>{
      return {...p,data:e.target.value}
    })}/>}
   {!email.editable&&<div className="value">{User.email}</div>}
   <label htmlFor="email" className='edit' onClick={()=>setEmail((p)=>{
      return {data:User.email,editable:!p.editable}
    })} >
    <Edit />
    </label>
  </div>
  {(profilePic||username.data!==User.username||email.data!==User.email) &&<button className='btn' onClick={()=>updateProfile()}>update</button>}
<button className="btn" onClick={()=>navigate("/changepassword",{state:User.email})}>Change password</button>
</div>
}
    </div>
  )
}

export default Profile
