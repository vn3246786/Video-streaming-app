import axios from "axios"
import { findError } from "../../ErrorFinder"



export async function getstats (setstats,NewYear,acceesstoken){
 
    setstats({loading:true,
        error:null,
      data:null
     })
        try {
            const res = await axios.get("/api/users/stats/"+NewYear, {headers:
                {token : "bearer " +  acceesstoken}
              })
             
              if(findError(res.data)){
                setstats({loading:false,
                    error:res.data,
                  data:null
                 })
              }else {
                setstats({loading:false,
                    error:null,
                  data:res.data
                 })
              }   
        } catch (error) {
            setstats({loading:false,
                error:null,
              data:"network error"
             })
        }
         
        }