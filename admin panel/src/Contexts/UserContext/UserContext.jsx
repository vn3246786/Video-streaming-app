import React, { createContext,useReducer } from 'react'
import UserReducer from './UserReducer'

 const InitialState = {
    UserListLoading : false,
    UserListError : null,
    UserList :null,
   
 }


 
export const UserContext = createContext(InitialState)
 
 const UserContextProvider =({children})=>{
     
const[state,dispatch] = useReducer(UserReducer,InitialState)

    
return <UserContext.Provider 
value={{
UserDispatch: dispatch,
UserListLoading : state.UserListLoading,
UserList: state.UserList,
UserListError:state.UserListError
}}>
{children}
</UserContext.Provider>
}

export default UserContextProvider