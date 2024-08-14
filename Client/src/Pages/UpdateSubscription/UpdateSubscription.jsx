import React, { useContext, useEffect, useState } from 'react'
import "./updateSubscription.scss"
import { UserContext } from '../../Contexts/UserContext/UserContext'
import { AccessTokenContext } from '../../Contexts/AccessTokenContext/AccessTokenContext'
import { ArrowBackIos } from '@mui/icons-material'
import { getPlans, updatePlan } from './apiCalls'
import { checkTokenExpiry } from '../../RefreshToken'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import ErrorPage from "../../Components/ErrorPage/ErrorPage"

const UpdateSubscription = () => {
const navigate = useNavigate()
const {state} = useLocation()
    const[plans,setPlans]=useState({loading:false,
        data:null,
        error:null
    })

    const[updateState,setUpdateState]=useState({loading:false,
        error:null
    })

const{User}=useContext(UserContext)
const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)

useEffect(()=>{
     const ApiCalls= [
        {
            func:getPlans,
            params:[
                setPlans
            ]
        }
     ]
     checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
},[])


function update(planId){
  const ApiCalls=[
    {
      func:updatePlan,
      params:[
        setUpdateState,
        planId,
        state,
        User._id,
        navigate
      ]
    }
  ]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}
  return (
    <div className='updateSubscription'>
      {updateState.error==="network error"&&<ErrorPage/>}
     {updateState.loading&& <CircularProgress className='spinner' size={70}/>}
        <div className="title-container">
        <ArrowBackIos className='icon'/>
        <div className="title">Plans</div>
        </div>
        <div className="flex-container">
        {updateState.error!=="network error"&&plans.data && plans.data.map((plan,i)=>{
return <div key={i} className="plan-container">
<div className="name">{plan.name}</div>
<div className="image-container">
  <img className='image' src={plan.image}alt="" />
</div>
<div className="discription">{plan.discription}</div>
<button className='btn' onClick={()=>update(plan._id)}>Update plan</button>
</div>
  })}
        </div>
    </div>
  )
}

export default UpdateSubscription
