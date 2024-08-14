import { ArrowBackIos, ArrowForwardIos, ThumbDown, ThumbUp } from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import './returnPage.scss'
import { Link, Navigate, useNavigate } from "react-router-dom";
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import {UserContext} from "../../Contexts/UserContext/UserContext"
import { CircularProgress } from "@mui/material";
import { getNewAccessToken } from "./apiCalls";
import { checkTokenExpiry } from "../../RefreshToken";
import ErrorPage from "../../Components/ErrorPage/ErrorPage"

export default function ReturnPage() {
  const [status, setStatus] = useState(null);

  const navigate =useNavigate()

  const {accesstoken,accesstokenDispatch,accesstokenLoading,accesstokenError}=useContext(AccessTokenContext)
  const {User}=useContext(UserContext)
console.log(status)
  useEffect(() => {
async function getPaymentResuls(){
  const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    const res = await axios(`/api/payments/session_status?session_id=${sessionId}`)
   setStatus(res.data.status)
  }
      getPaymentResuls()
  }, []);

function Access(){
  const ApiCalls=[
    {
      func:getNewAccessToken,
      params:[
        User._id,
        accesstokenDispatch,
        navigate
      ]
    }
  ]
  checkTokenExpiry(JSON.parse(sessionStorage.getItem("accesstoken")),accesstokenDispatch,ApiCalls)
}
    return (
    <div className="returnPage">
      {accesstokenError&&<ErrorPage/>}
      {accesstokenLoading&&<CircularProgress className="spinner" size={70}/>}
      {!accesstokenError&&status==="complete"&&
      <div className="result-container">
        <ThumbUp className="icon success"/>
        <div className="details">Payment successful</div>
        </div>}
      {!accesstokenError&&status==="expired"&&
      <div className="result-container">
        <ThumbDown className="icon failure"/>
        <div className="details">Payment successful</div>
        </div>}
     {status==='open'&& <Navigate to="/checkout" />}
     {!accesstokenError&&status==='complete'&&
      <div className="next-container" onClick={()=>Access()}>
      <div className="next">Next</div>
      <ArrowForwardIos className="arrow"/>
     </div>
    }
    {!accesstokenError&&status==='expired'&& 
      <Link className="link" to={'/subscription'}>
    <div className="next-container">
      <ArrowBackIos className="arrow"/>
      <div className="next">Back</div>
     </div>
      </Link>}
    </div>
    )
}