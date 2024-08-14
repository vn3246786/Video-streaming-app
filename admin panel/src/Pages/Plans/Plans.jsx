import React, { useContext, useEffect, useState } from 'react'
import "./plans.scss"
import Sidebar from "../../components/Sidebar/Sidebar"
import Navbar from "../../components/Navbar/Navbar"
import {AuthContext} from "../../Contexts/AuthContext/AuthContext"
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { getPlans } from './apiCalls'
import { ArrowBackIos } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { checkTokenExpiry } from '../../RefreshToken'
import { deletePlan } from '../UpdatePlans/apiCalls'
import CircularProgress from '@mui/material/CircularProgress';

const Plans = () => { 
const navigate = useNavigate()

const [plans,setPlans]=useState({loading:false,
  data:null,
  error:null
})

  const { User } = useContext(AuthContext)
  const { accesstoken,accesstokenDispatch } = useContext(AccessTokenContext)

useEffect(()=>{
  const ApiCalls = [
    {
      func:getPlans,
      params:[setPlans]
    }
  ]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
},[])


function removePlan(id,image){
const ApiCalls=[
  {
    func:deletePlan,
    params:[
      setPlans,id,image,
    ]
  }
]
checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}

  return (
    <div className='plans'>
     {plans.loading&& <CircularProgress className='spinner' size={70}/>}
      <Navbar/>
      <div className="flex-container">
      <Sidebar current="All Plans" dropdown="Plans"/>
      <div className="main-container">
      <div className="title-container">
        <ArrowBackIos className='icon'/>
     <div className="title">Plans
      </div>
      </div>
{plans.data&& plans.data.map((data,i)=>{
return(<div key={i} className="Plans-container">
<div className="Option">Name : {data.name}</div>
<div className="Option">Price: {data.price}{data.currency}</div>
<div className="Option">discription: {data.discription}</div>
<div className="btns">
<button className='btn' onClick={()=>navigate('/Plans/update',{state:data})}>update</button>
  <button className='btn' onClick={()=>removePlan(data._id,data.image)}>delete</button>
</div>
</div>)
})}
      </div>
      </div>
    </div>
  )
}

export default Plans
