import axios from "axios"
import { findError } from "../../ErrorFinder";
import { toast } from "react-toastify";


export const registerUser = async (user ,dispatch,accesstokenDispatch )=>{
    dispatch({type:"start"});
   
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, user)
     if(findError(res.data)){
        dispatch({type:"failure" ,payload:res.data})
     }else {
        const {accessToken,...rest}=res.data
        accesstokenDispatch({type:"success",payload:accessToken})
        dispatch({type:"success", payload:rest})}  
        toast.success('successfully logged in') 
    } catch (error) {
        dispatch({type:"failure" ,payload:"network error"})
        toast.error("network error")
    }

}

export const loginUser = async (user ,dispatch,accesstokenDispatch )=>{
    dispatch({type:"start"});
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/admin-login`, user)
        if(findError(res.data)){
            dispatch({type:"failure" ,payload:res.data})
            toast.error(res.data)
         }else {
            const {accessToken,...rest}=res.data
            accesstokenDispatch({type:"success",payload:accessToken})
            dispatch({type:"success", payload:rest})
            toast.success("successfully logged in")
        }      
    } catch (error) {
        console.log(error)
        dispatch({type:"failure", payload:"network error"})
        toast.error("network error")
    }

}

export async function  updateUser (UserDispatch,id,userdetails,accesstokenDispatch,accesstoken){
    UserDispatch({type:"start"});
    try {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update/${id}`, userdetails,{headers:{
            token:"bearer "+accesstoken
        }})
        if(findError(res.data)){
            UserDispatch({type:"failure" ,payload:res.data})
            toast.error(res.data)
         }else {
            const{accessToken,...rest}=res.data
            accesstokenDispatch({type:"success",payload:res.data.accessToken})
            UserDispatch({type:"success", payload:rest})
            toast.success("successfully updated")
         } 
            
    } catch (error) {
        console.log(error)
        toast.error("network error")
        UserDispatch({type:"failure", payload:"network error"})
        
    }

}