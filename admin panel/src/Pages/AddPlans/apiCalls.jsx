import axios from "axios"
import { findError } from '../../ErrorFinder'
import { toast } from "react-toastify"


export async function addPlan(setStatus,plan,accesstoken){
    setStatus({loding:true,
      data:null,
      error:null
    })
    try {
      const res =await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-plan`,plan,{headers:
        {token:'bearer '+accesstoken}
      })
  if(findError(res.data)){
    setStatus({loding:false,
      data:null,
      error:res.data
    })
    toast.error(res.data)
  }else{
    setStatus({loding:false,
      data:res.data,
      error:null
    })
    toast.success('plan added successfully')
  }
    } catch (error) {
      setStatus({loding:false,
        data:null,
        error:"network error"
      })
      toast.error("network error")
    }
  }