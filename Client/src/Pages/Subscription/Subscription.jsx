import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './subscription.scss'
import {AccessTokenContext}from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { getPlans } from './apiCalls'
import {checkTokenExpiry} from "../../RefreshToken"

const Subscription = () => {
    const[plans,setPlans]=useState({loading:false,
        data:null,
        error:null
    })
const navigate = useNavigate()
const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)

useEffect(()=>{
  const ApiCalls=[{
    func:getPlans,
    params:[
        setPlans
    ]
  }]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
},[])


  return (
    <div className='subscription'>
    <div className="title-container">
    <ArrowBackIos onClick={()=>navigate(-1)} className='icon'/>
    <div className="title">Plans</div>
    </div>
    <div className="flex-container">
  {plans.data && plans.data.map((plan,i)=>{
return <div key={i} className="plan-container">
<div className="name">{plan.name}</div>
<div className="image-container">
  <img className='image' src={plan.image}alt="" />
</div>
<div className="discription">{plan.discription}</div>
<Link className='link' state={plan._id} to={"/checkout"}>
<button className='btn'>Subscribe for {plan.price/100}{plan.currency}</button>
</Link>
</div>
  })}
    
    </div>
  
</div>
  )
}

export default Subscription
