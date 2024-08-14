import axios from "axios"
import{ findError} from "../../ErrorFinder/"
import { toast } from "react-toastify";


export const registerUser = async (user ,UserDispatch,accesstokenDispatch )=>{
    UserDispatch({type:"start"});
    try {
        const res = await axios.post("/api/auth/register", user)
        console.log(res.data)
     if(findError(res.data)){
        UserDispatch({type:"failure" ,payload:res.data})
        toast.error(res.data)
     }else {
        const {accessToken,...rest}=res.data
        accesstokenDispatch({type:"success",payload:res.data.accessToken})
        UserDispatch({type:"success", payload:rest})
        toast.success("successfully registered")
    }
    } catch (error) {
        toast.error("network error")
        UserDispatch({type:"failure" ,payload:"network error"})
       
    }

}

export const loginUser = async (user ,UserDispatch,accesstokenDispatch)=>{
    UserDispatch({type:"start"});
    try { 
        const res = await axios.post("/api/auth/login", user,{withCredentials:true})
        if(findError(res.data)){
            UserDispatch({type:"failure" ,payload:res.data})
            toast.error(res.data)
         }else {
            const{accessToken,...rest}=res.data
            accesstokenDispatch({type:"success",payload:res.data.accessToken})
            UserDispatch({type:"success", payload:rest})
            toast.success("login successfull")
         } 
            
    } catch (error) {
        console.log(error)
        toast.error("network error")
        UserDispatch({type:"failure", payload:"network error"})
        
    }

}

export async function  updateUser (UserDispatch,id,userdetails,accesstokenDispatch,accesstoken){
    UserDispatch({type:"start"});
    try {
        const res = await axios.put(`/api/users/update/${id}`, userdetails,{headers:{
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