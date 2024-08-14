import useLocalstorage from "../../Hooks/useLocalstorage"

const accesstokenReducer = (state ,Action) => {
    switch (Action.type) {
        case "start":
          return  {
                Loading : true,
                error : null,
                accesstoken : null,
            }
           
           
        case "success":
           return {
                Loading : false,
                error : null,
                accesstoken : useLocalstorage("accesstoken",Action.payload),
            }
           
        case "failure":
           return {
               Loading : false,
                error : Action.payload,
                accesstoken : null,
            }
          
    
        default: return {...state}
          
    }
 
}

export default accesstokenReducer