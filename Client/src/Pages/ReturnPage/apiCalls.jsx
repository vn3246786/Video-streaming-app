import axios from "axios"
import { findError } from "../../ErrorFinder"




export async function getNewAccessToken(id,accesstokenDispatch,navigate,accesstoken){

    accesstokenDispatch({type:"start"})
  try {
    const res =await axios.get(`${import.meta.env.API_URL}/api/auth/subscription-succesfull/${id}`,{headers:{
      token:"bearer "+accesstoken
    }})
    if(findError(res.data)){
      accesstokenDispatch({type:"failure",payload:res.data})
    }else {
       accesstokenDispatch({type:"success",payload:res.data})
      navigate('/')
      }
  } catch (error) {
    console.log(error)
    accesstokenDispatch({type:"failure",payload:"network error"})
  }
   }