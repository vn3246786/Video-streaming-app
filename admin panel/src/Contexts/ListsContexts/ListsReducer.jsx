
const ListsReducer = (state ,Action) => {
    switch (Action.type) {
        case "start":
          return  {
                Loading : true,
                error : null,
                Lists : null
            }
           
        case "success":
           return {
               Loading : false,
                error : null,
                Lists : Action.payload
            }
           
        case "failure":
           return {
                Loading : false,
                error :Action.payload,
                Lists : null
            }
          
    
        default: return {...state}
          
    }
 
}

export default ListsReducer
