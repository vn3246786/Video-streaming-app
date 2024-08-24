import {  EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import {  useContext, useEffect, useState } from "react";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import { AccessTokenContext } from "../../Contexts/AccessTokenContext/AccessTokenContext";
import { useLocation } from "react-router-dom";
import { checkTokenExpiry } from "../../RefreshToken";

export default function CheckoutForm ()  {
const [options,setOptions]=useState(null)
  const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`);
 
  const{User}=useContext(UserContext)
  const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
  const {state} = useLocation()
const plan={
  planId:state
}

 useEffect(()=>{

 async function getCheckoutform(id,plan,accesstoken){
 const res =await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session/${id}`,plan,
  {headers:{
token:"bearer "+accesstoken
 }})
 setOptions({clientSecret:res.data.clientSecret
 })
  }
  const ApiCalls=[
    {
      func:getCheckoutform,
     params:[
  User._id,
  plan
  ]
    }
  ]

  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
 },[])
  
    return (
      <div id="checkout">
    {options&& <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
        >
          <EmbeddedCheckout/>
        </EmbeddedCheckoutProvider>}
      </div>
    )
  }
  