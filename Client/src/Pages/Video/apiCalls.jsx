import axios from "axios";
import { findError } from "../../ErrorFinder";



export async function updateRecommandations (recommendations,accesstoken){
try {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update-recommendations`,{recommendations:recommendations},{headers:{
        token:"bearer "+accesstoken
    }})
} catch (error) {
    console.log(error)
}
}

export async function updateWatchHistory (update,id,timestamp,dispatch,accesstoken){
    console.log("1")
    dispatch({type:"start"})
try {
   const res= await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update-watchhistory${update?"?update=true":""}`,{id:id,timestamp:timestamp},{headers:{
        token:"bearer "+accesstoken
    }})
    if(findError(res.data)){
        dispatch({type:"failure",payload:res.data})
    }else{
        dispatch({type:"success",payload:res.data})
    }
} catch (error) {
    console.log(error)
    dispatch({type:"failure",payload:"network error"})
}
}