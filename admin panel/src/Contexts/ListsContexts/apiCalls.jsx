
import axios from "axios"
import { findError } from "../../ErrorFinder"
import { toast } from "react-toastify"


export async function getAllLists(dispatch,sort,rowSize,series,genre,lastRowId,navigation,search,accesstoken){
    dispatch({type:"start"})

function getQuery(){
   let arr =[`${import.meta.env.VITE_API_URL}/api/lists?sort=${sort}&rowSize=${rowSize}`]
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
    if(res.data==="server error"||res.data==="accesstoken not found"||res.data==="invalid token"||res.data==="you are not authorized")
        {
            dispatch({type:"failure", payload:res.data})
        }else dispatch({type:"success",payload:res.data})
} catch (error) {
    dispatch({type:"failure", payload:"network error"})
}
}


export async function searchLists(searchTerm,setAutoComplete,accesstoken){
    setAutoComplete({
        loading:true,
        data:null,
        error:null
      })
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/lists/search?search=`+searchTerm,{headers:{
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


export async function deleteAndUpdateLists(dispatch,sort,rowSize,series,genre,lastRowId,navigation,search,id,data,accesstoken){
    dispatch({type:'start'})
    try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/lists/delete/${id}`,{headers:{
            token:"bearer "+accesstoken
        }})
       if(findError(res.data)){
           toast.error(res.data)
    }else {
        toast.success('list successfully deleted')
        getAllLists(dispatch,sort,rowSize,series,genre,lastRowId,navigation,search,accesstoken)
       }   
    } catch (error) {
        console.log(error)
        toast.error('network error')
    }
}




