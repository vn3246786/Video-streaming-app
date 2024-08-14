import React, { useContext, useEffect, useState } from 'react'
import "./profile.scss"
import { ArrowBackIos, Edit, Send, Try } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { CircularProgress } from '@mui/material'
import { checkTokenExpiry } from '../../RefreshToken'
import { cancelSubscription, getSubscriptionDetails } from './apiCalls'
import { updateUser } from '../../Contexts/UserContext/apiCalls'
import imageCompression from 'browser-image-compression';

const Profile = () => {
  const navigate=useNavigate()
const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
const User = JSON.parse(sessionStorage.getItem("User"))
const{UserLoading,UserDispatch}=useContext(UserContext)
const[loading,setLoading]=useState(false)
const[username,setUsername]=useState({
  editable:false,
  data:User.username
})
const[email,setEmail]=useState({
  editable:false,
  data:User.email
})
const[profilePic,setProfilePic]=useState(null)

const[subscriptionDetails,setsubscriptionDetails]=useState({
  loading:false,
  data:null,
  error:null
})

async function reduceImageSize(file){
  const imageFile = file;
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 720,
    useWebWorker: true,
  }
  try {
    const compressedFile = await imageCompression(imageFile, options);
return compressedFile
  } catch (error) {
    console.log(error);
  }
}

function updateProfile(){
  let formData=new FormData
  username.data!==User.username && formData.append("username",username.data)
  email.data!==User.email && formData.append("email",email.data)
 if(profilePic){
  reduceImageSize(profilePic).then((value)=>{
    formData.append('profilePic',value)
    const ApiCalls=[
      {
        func:updateUser,
        params:[
          UserDispatch,
          User._id,
          formData,
          accesstokenDispatch
        ]
      }
    ]
    checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
  })
 }else
 {
  const ApiCalls=[
    {
      func:updateUser,
      params:[
        UserDispatch,
        User._id,
        formData,
        accesstokenDispatch
      ]
    }
  ]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}
}

useEffect(()=>{
  const ApiCalls=[
    {
      func:getSubscriptionDetails,
      params:[
        setsubscriptionDetails,
        User._id
      ]
    }
  ]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
},[])

function cancel(){
  const ApiCalls=[
    {
      func:cancelSubscription,
      params:[
        setLoading,
        User._id,
        subscriptionDetails.data.subscriptionId
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
  {(subscriptionDetails.loading||loading||UserLoading)&&<CircularProgress className='spinner'/>}
  <div className="wrapper profile-pic">
    <img className='image'src={profilePic?URL.createObjectURL(profilePic):User.profilePic?User.profilePic:""} alt="" />
    <input type="file" id='file' className='file' onChange={(e)=>setProfilePic(e.target.files[0])}/>
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
<div className="title-subscription">Subscription Details</div>
{subscriptionDetails.data&&<div className="subscription-details">
<div className="subscription-info">
<div className="label">plan :</div>
<div className="info">{subscriptionDetails.data.plan}</div>
</div>
<div className="subscription-info">
<div className="label">subscriptionId :</div>
<div className="info">{subscriptionDetails.data.subscriptionId}</div>
</div>
<div className="subscription-info">
<div className="label">invoice :</div>
<div className="info">{subscriptionDetails.data.invoice}</div>
</div>
<div className="subscription-info">
<div className="label">startDate :</div>
<div className="info">{subscriptionDetails.data.startDate}</div>
</div>
<div className="subscription-info">
<div className="label">endDate :</div>
<div className="info">{subscriptionDetails.data.endDate}</div>
</div>
<div className="subscription-info">
<div className="label">amount :</div>
<div className="info">{subscriptionDetails.data.amount}$</div>
</div>
<div className="buttons">
    <button className='btn update' onClick={()=>navigate('/Updatesubscription',{state:subscriptionDetails.data.subscriptionId})}>update subscription</button>
    <button className='btn cancel' onClick={()=>cancel()}>cancel subscription</button>
</div>
</div>}

    </div>
  )
}

export default Profile
