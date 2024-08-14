import axios from "axios"
import { findError } from "../../ErrorFinder"
import { toast } from "react-toastify"
import useGenreOptions from "../../Hooks/useGenreOptions"






export async function updateMovie(setResponse,id,Product,accesstoken){
    setResponse({
        loading:true,
        data:null,
        error:null
    })
    try {
        const res = await axios.put(`/api/movies/update/${id}`,Product,{headers:{
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
      
        toast.success('successfully updated')
       }
    } catch (error) {
        console.log(error)
        setResponse({
            loading:false,
            data:null,
            error:"network error"
        })
        toast.error('network error')
    }
}
