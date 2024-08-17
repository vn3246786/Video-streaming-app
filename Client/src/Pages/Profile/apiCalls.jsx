import axios from "axios"
import { findError } from "../../ErrorFinder"


export async function getSubscriptionDetails(setsubscriptionDetails,id,accesstoken){
    setsubscriptionDetails({
      loading:true,
      data:null,
      error:null
    })
    try {
      const res = await axios.get(`${process.env.API_URL}/api/users/subscription-details/${id}`,
        {headers:{
          token:"bearer "+accesstoken
        }}
      )
      setsubscriptionDetails({
        loading:false,
        data:res.data,
        error:null
      })
    } catch (error) {
        console.log(error)
      setsubscriptionDetails({
        loading:false,
        data:null,
        error:"network error"
      })
    }
  }

  export async function cancelSubscription(setLoading,id,subscriptionId,accesstoken){
    setLoading(true)
    try {
      const res = await axios.put(`${process.env.API_URL}/api/payments/cancel-subscription/${id}`,{subscriptionId:subscriptionId},{headers:{
        token:'bearer '+accesstoken
      }})
      console.log(res.data)
  if(findError(res.data)){
  setLoading(false)
  }else{
    setLoading(false)
     getSubscriptionDetails()
    }
    } catch (error) {
      setLoading(false)
    }
  }