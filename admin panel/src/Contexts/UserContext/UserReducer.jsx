
const UserReducer = (state ,Action) => {
    switch (Action.type) {
        case "start":
          return  {
            UserListLoading : true,
            UserListError : null,
            UserList :null,
            }
           
       
           
        case "success":
           return {
            UserListLoading : false,
            UserListError : null,
            UserList :Action.payload,
            }
           
        case "failure":
           return {
            UserListLoading : false,
            UserListError : Action.payload,
            UserList :null,
            }
       
    
        default: return {...state}
          
    }
 
}

export default UserReducer