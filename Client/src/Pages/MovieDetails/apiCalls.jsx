import axios from "axios"
import { findError } from "../../ErrorFinder"
import { toast } from "react-toastify"



export async function rateMovie(setState,id,rating,setValue,setRatingModal,accesstoken){
setState({
    loading:true,
    data:null,
    error:null
})
try {
    const res =await axios.put(`${import.meta.env.VITE_API_URL}/api/movies/rate/${id}`,{rating:rating},{headers:{
        token:'bearer '+accesstoken
    }})
    if(findError(res.data)){
        setState({
            loading:false,
            data:null,
            error:res.data
        })
        toast.error(res.data)
    }else {
        setState({
            loading:false,
            data:res.data,
            error:null
        })
        toast.success("rating added")
        setValue(res.data.totalRatings/res.data.totalUsers)
        setRatingModal(false)
    }
} catch (error) {
    setState({
        loading:false,
        data:null,
        error:"network error"
    })
    toast.error("network error")
}
}


export async function getRatings(setState,setRating,state,accesstoken){
setState({
    loading:true,
    data:null,
    error:null
})
try {
    const res =await axios.get(`${import.meta.env.VITE_API_URL}/api/users/get-ratings`,{headers:{
        token:'bearer '+accesstoken
    }})
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
        setRating(res.data?.hasOwnProperty(state._id)?res.data[state._id]:0)
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


