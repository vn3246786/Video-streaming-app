import axios from "axios"
import{ findError} from "../../ErrorFinder/"


export async function getWatchList(dispatch,id,accesstoken){
    
dispatch({type:'start'})
try {
    const res =await axios.get(`${process.env.API_URL}/api/users/watchlist/${id}`,{headers:{
        token:'bearer '+accesstoken
    }})
    if(findError(res.data)){
        dispatch({type:"failure" ,payload:res.data})
     }else dispatch({type:"success", payload:res.data})
} catch (error) {
    dispatch({type:'failure',payload:'network error'})
}
}

export async function updateWatchList(dispatch,id,setUpdateWatchListLoading,NewWatchList,accesstoken){
    setUpdateWatchListLoading(true)
dispatch({type:'start'})
try {
    const res =  await axios.put(`${process.env.API_URL}/api/users/watchlist/${id}`,NewWatchList,{headers:{
        token:'bearer '+accesstoken
    }})
    if(findError(res.data)){
        dispatch({type:"failure" ,payload:res.data})
        setUpdateWatchListLoading(false)
     }else {
        dispatch({type:"success", payload:res.data})
        setUpdateWatchListLoading(false)
    }
} catch (error) {
    dispatch({type:'failure',payload:'network error'})
    setUpdateWatchListLoading(false)
}
}