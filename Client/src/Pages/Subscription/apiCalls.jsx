
import axios from 'axios'


export async function getPlans(setPlans,accesstoken){
    setPlans({loading:true,
        data:null,
        error:null
    })
try {
    const res =await axios.get(`${import.meta.env.API_URL}/api/payments/get-plans`,{headers:{
        token : "bearer "+ accesstoken
    }})
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