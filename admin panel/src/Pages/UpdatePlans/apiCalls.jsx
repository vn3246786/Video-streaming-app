import axios from "axios";
import { findError } from "../../ErrorFinder";
import { toast } from "react-toastify";


export async function updatePlan(setResponse,id,plan,accesstoken){
    setResponse({loading:true,
        data:null,
        error:null
    })
    try {
        const res =await axios.put(`/api/payments/update-plan/${id}`,plan,{headers:{
            token:"bearer "+accesstoken
        }})
        if(findError(res.data)){
            setResponse({loading:false,
                data:null,
                error:res.data
            })
            toast.error(res.data)
        }else{
            setResponse({loading:false,
                data:res.data,
                error:null
            })
            toast.success('updated successfully')
        }
    } catch (error) {
        setResponse({loading:false,
            data:null,
            error:"network error"
        })
    }
}

export async function deletePlan(setResponse,id,image,accesstoken){
    setResponse({loading:true,
        data:null,
        error:null
    })
    try {
        const res =await axios.delete(`/api/payments/delete-plan/${id}`,{data:{image:image},headers:{
            token:"bearer "+accesstoken
        }})
        if(findError(res.data)){
            setResponse({loading:false,
                data:null,
                error:res.data
            })
            toast.error(res.data)
        }else{
            setResponse({loading:false,
                data:res.data,
                error:null
            })
            toast.success('deleted successfully')
        }
    } catch (error) {
        setResponse({loading:false,
            data:null,
            error:"network error"
        })
    }
}