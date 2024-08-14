import axios from "axios"
import { findError } from "../../ErrorFinder"



export async function getSuggestion(setsuggestions,autocomplete,accesstoken) {
    try {
      const res = await axios.get("/api/movies/search-autocomplete?search=" + autocomplete, {
        headers: {
          token: "bearer " + accesstoken
        }
      })
      setsuggestions(res.data)
    } catch (error) {
    }
  }


export const getSearchedMovie = async(SearchedMovie,setSearchedMovies,accesstoken)=>{
    setSearchedMovies({
        loading:true,
        data:null,
        error:null
          })
try {
    const res = await axios.get("/api/movies/search?search="+SearchedMovie,{headers:{
        token :"bearer "+ accesstoken}})
        if(findError(res.data)){
            setSearchedMovies({
                loading:false,
                data:null,
                error:res.data
                  })
         }else {
            setSearchedMovies({
                loading:false,
                data:res.data,
                error:null
                  })
         }
} catch (error) {
    setSearchedMovies({
        loading:false,
        data:null,
        error:"network error"
          })
}
 }  