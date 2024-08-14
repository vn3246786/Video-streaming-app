import axios from "axios"
import { findError } from "../../ErrorFinder"


export const getMoviesByGenre = async(setMovies,genre,isSeries,accesstoken)=>{
    setMovies({
        loading:true,
        data:null,
        error:null
      })
        try {
           const res = await axios.get("/api/movies/genre/"+genre+`?isSeries=${isSeries}` ,{headers:{
            token :"bearer "+ accesstoken}})
            if(findError(res.data)){
                setMovies({
                    loading:false,
                    data:null,
                    error:res.data
                  })
             }else  {
                setMovies({
                loading:false,
                data:res.data,
                error:null
              })}
        } catch (error) {
            setMovies({
                loading:false,
                data:null,
                error:"network error"
              })
        }
    
    }