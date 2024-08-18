import axios from "axios"
import {jwtDecode} from "jwt-decode"
import { findError } from "./ErrorFinder"



export async function checkTokenExpiry(accesstoken,dispatch,functionsArray){
   
   const token =jwtDecode(accesstoken)
const currentTime = new Date
if(token.exp*1000-60<currentTime.getTime()){
dispatch({type:"start"})
try {
    const res =await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/get-accesstoken`)
    if(findError(res.data)){
        dispatch({type:"failure",payload:res.data})
    }else {
        dispatch({type:"success",payload:res.data})
functionsArray.forEach((value) => {
    value.func(...value.params,res.data)
});
    }
} catch (error) {
    console.log(error)
    dispatch({type:"failure",payload:"network error"})
}
}else {
    functionsArray.forEach((value) => {
        value.func(...value.params,accesstoken)
    })}
}