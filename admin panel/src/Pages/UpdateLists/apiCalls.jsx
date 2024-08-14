import axios from "axios"
import { findError } from "../../ErrorFinder"
import { toast } from "react-toastify"



export async function updateList(setResponse,list,id,accesstoken){
    setResponse({
        loading:true,
        data:null,
        error:null
    })
    try {
        const res = await axios.put(`/api/lists/update/${id}`,list,{headers:{
            token:"bearer "+accesstoken
        }})
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
        toast.success('updated successfully')
       }
        
    } catch (error) {
        setResponse({
            loading:false,
            data:null,
            error:"network error"
        })
        toast.error('network error')
    }
}
