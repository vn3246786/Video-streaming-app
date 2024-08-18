import {jwtDecode} from "jwt-decode"
import { findError } from './ErrorFinder'

export async function refreshAccessToken(dispatch){
    let currentTime = new Date
    let decodedToken = jwtDecode(accesstoken)
    if(currentTime.getTime()>decodedToken.iat*1000){
        dispatch({type:"start"})
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/get-accesstoken`)
    if(findError(res.data)){
        dispatch({type:"failure",payload:res.data})
    }else dispatch({type:"success",payload:res.data})
  } catch (error) {
    console.log(error)
    dispatch({type:"success",payload:"network error"})
  }
  }
    }