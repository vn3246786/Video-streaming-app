import axios from "axios"
import { findError } from "../../ErrorFinder"
import { toast } from "react-toastify"


export async function getPlans(setPlans,accesstoken){
    setPlans({loading:true,
        data:null,
        error:null
    })
try {
    const res =await axios.get(`${import.meta.env.API_URL}/api/payments/get-plans`,{headers:{
        token : "bearer "+ accesstoken
    }})
    if(findError(res.data)){
        setPlans({loading:true,
            data:null,
            error:res.data
        })
    }else
    setPlans({loading:true,
        data:res.data,
        error:null
    })
} catch (error) {
    setPlans({loading:false,
        data:null,
        error:error
    })
}
 }


export async function updatePlan(setUpdateState,planId,subscriptionId,id,navigate,accesstoken){
    setUpdateState({loading:true,
        error:null
    })
try {
    const res =await axios.put(`${import.meta.env.API_URL}/api/payments/update-subscription/${id}`,{planId:planId,subscriptionId:subscriptionId},{headers:{
        token : "bearer "+ accesstoken
    }})
    if(findError(res.data)){
        toast.error(res.data)
        setUpdateState({loading:false,
            error:res.data
        })
    }else
   { setUpdateState({loading:false,
        error:null
    })
    toast.success(res.data)
    navigate(-1)}
} catch (error) {
    console.log(error)
    toast.error("network error")
    setUpdateState({loading:false,
        error:"network error"
    })
}
 }