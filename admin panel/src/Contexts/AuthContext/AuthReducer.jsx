import useLocalstorage from "../../Hooks/useLocalstorage"

const AuthReducer = (state ,Action) => {
    switch (Action.type) {
        case "start":
          return  {
                Loading : true,
                error : null,
                User : null,
            }
       
           
        case "success":
           return {
                Loading : false,
                error : null,
                User : useLocalstorage("User",Action.payload),
            }
           
        case "failure":
           return {
               Loading : false,
                error : Action.payload,
                User : null,
            }
        case "logout":
           return {
                Loading : false,
                error : false,
                User : null,
            }
      
    
        default: return {...state}
          
    }
 
}

export default AuthReducer