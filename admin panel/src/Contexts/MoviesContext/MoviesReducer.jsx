
const MoviesReducer = (state ,Action) => {
    switch (Action.type) {
        case "start":
          return  {
                Loading : true,
                error : null,
              Movies:null
            }
           

        case "success":
           return {
                Loading : false,
                error : null,
                Movies:Action.payload
            }
           
        case "failure":
           return {
                Loading : false,
                error : Action.payload,
               Movies:null
            }
    
        default: return {...state}
          
    }
 
}

export default MoviesReducer