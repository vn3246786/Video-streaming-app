import axios from "axios"
import { findError } from "../../ErrorFinder"

export async function fetchmovie(setMovie,id,accesstoken){
    setMovie({loading:true,
        data:null,
        error:null})
        try {
          const res = await axios.get(`/api/movies/find/${id}`, {headers:{
            token :"bearer "+ accesstoken}})
            if(findError(res.data)){
              setMovie({loading:false,
                data:null,
                error:res.data})
            }else
          setMovie({loading:false,
            data:res.data,
            error:null})
        } catch (error) {
          setMovie({loading:false,
            data:null,
            error:"network error"})
        }
}