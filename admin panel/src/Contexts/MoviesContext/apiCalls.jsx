import axios from "axios"
import { findError } from "../../ErrorFinder"
import { toast } from "react-toastify"



export async function getAllMovies(dispatch,sort,rowSize,series,genre,lastRowId,navigation,search,accesstoken){
    dispatch({type:"start"})

function getQuery(){
   let arr =[`${import.meta.env.VITE_API_URL}/api/movies?sort=${sort}&rowSize=${rowSize}`]
   series && (arr=[...arr,`&series=${series}`])
genre && (arr=[...arr,`&genre=${genre}`])
search && (arr=[...arr,`&search=${search}`])
lastRowId && (arr=[...arr,`&lastRowId=${lastRowId}`])
navigation && (arr=[...arr,`&navigation=${navigation}`])
return arr.join('')
}

try {
    const res = await axios.get( getQuery(),{headers:{
        token:"bearer "+accesstoken
    }})
    if(findError(res.data))
        {
            dispatch({type:"failure", payload:res.data})
        }else dispatch({type:"success",payload:res.data})
} catch (error) {
    dispatch({type:"failure", payload:"network error"})
}
}


export async function searchMovies(searchTerm,setAutoComplete,accesstoken){
    setAutoComplete({
        loading:true,
        data:null,
        error:null
      })
    try {
        const res =searchTerm&& await axios.get(`${import.meta.env.VITE_API_URL}/api/movies/search?search=`+searchTerm,{headers:{
            token:"bearer "+accesstoken
        }})
    if(findError(res.data)){
        setAutoComplete({
            loading:false,
            data:null,
            error:res.data
          })
    }else{
        setAutoComplete({
            loading:false,
            data:res.data,
            error:null
          })
    }
    } catch (error) {
        setAutoComplete({
            loading:false,
            data:null,
            error:"network error"
          })
    }
}

export async function deleteAndUpdateMovies(dispatch,sort,rowSize,series,genre,lastRowId,navigation,search,id,files,data,accesstoken){
    dispatch({type:'start'})
    try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/movies/delete/${id}`,{headers:{
            token:"bearer "+accesstoken
        },
    data:{files:files}
})                    
       if(findError(res.data)){
        toast.error(res.data)
       }else{
        getAllMovies(dispatch,sort,rowSize,series,genre,lastRowId,navigation,search,accesstoken)
        toast.success('deleted successfully')}
    } catch (error) {
        console.log(error)
        toast.error('network error')
    }
}

