import axios from "axios"
import { findError } from "../../ErrorFinder"

export const getRandomMovie = async (setRandomMovie,isSeries,accesstoken)=>{
    setRandomMovie({
        loading:true,
        data:null,
        error:false
    })
    try {
        if(isSeries){
            const res =await axios.get("/api/movies/random?isSeries=true", {headers:{
                'content-type': 'application/json',
                token :"bearer "+ accesstoken
                
            }} ) 
            if(findError(res.data)){
                setRandomMovie({
                    loading:false,
                    data:null,
                    error:res.data
                })
             }else  {
                 setRandomMovie({
                  loading:false,
                  data:res.data,
                  error:false
              })
             }
        }else{
            const res =await axios.get("/api/movies/random", {headers:{
                'content-type': 'application/json',
                token :"bearer "+accesstoken
            }} )
            if(findError(res.data)){
                setRandomMovie({
                    loading:false,
                    data:null,
                    error:res.data
                })
             }else {
                setRandomMovie({
                    loading:false,
                    data:res.data,
                    error:false
                })
             }
        }
        
    } catch (error) {
        console.log(error)
        setRandomMovie({
            loading:false,
            data:null,
            error:"network error"
        })
    }
}



export const getLists = async(setLists,isSeries,accesstoken)=>{
    setLists({loading:true,
        data:null,
        error:null
       })
    try {
       if(isSeries){
           const res = await axios.get("/api/lists/random?isSeries=true" , {headers:{
            'content-type': 'application/json',
               token:"bearer "+ accesstoken
           }} )
         
           if(findError(res.data)){
            setLists({loading:false,
                data:null,
                error:res.data
               })
         }else {
            setLists({loading:false,
                data:res.data,
                error:null
               })
         }
  }else{
    const res = await axios.get("/api/lists/random" , {headers:{
        'content-type': 'application/json',
        token:"bearer "+ accesstoken
    }} )
    if(findError(res.data)){
        setLists({loading:false,
            data:null,
            error:res.data
           })
     }else {
        setLists({loading:false,
            data:res.data,
            error:null
           })
     }
  }
    } catch (error) {
        console.log(error)
        setLists({loading:false,
            data:null,
            error:"network error"
           })
    }

}

export async function getRecommendations(setState,accesstoken){
    
setState({
    loading:true,
    data:null,
    error:null
})
try {
    const res = await axios.get(`/api/movies/recommended-movies`,{
        headers:{token:"bearer "+accesstoken}
    })
    if(findError(res.data)){
        setState({
            loading:false,
            data:null,
            error:res.data
        })
    }else {
        setState({
            loading:false,
            data:res.data,
            error:null
        })
    }
} catch (error) {
    console.log(error)
    setState({
        loading:false,
        data:null,
        error:"network error"
    })
}
}

