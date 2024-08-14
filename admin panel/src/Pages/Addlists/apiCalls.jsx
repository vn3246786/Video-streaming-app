import { toast } from "react-toastify"
import { findError } from "../../ErrorFinder"
import axios from "axios"



export async function addList(setResponse,list,accesstoken){
    setResponse({
        loading:true,
        data:null,
        error:null
    })
    try {
        const res = await axios.post("/api/lists",list,{headers:{
            token:"bearer "+accesstoken
        }})
        console.log(res.data)
       if(findError(res.data)){
        setResponse({
            loading:false,
            data:null,
            error:res.data
        })
        toast.error(res.data)
       }else {
        setResponse({
            loading:false,
            data:res.data,
            error:null
        })
        toast.success("successfully added")
       }
    } catch (error) {
        console.log(error)
        toast.error("network error")
        setResponse({
            loading:false,
            data:null,
            error:"network error"
        })
    }
}