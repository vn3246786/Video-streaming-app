import React, { createContext, useReducer } from 'react'
import UserReducer from './UserReducer'
import useLocalstorage from '../../Hooks/useLocalstorage'

 const InitialState = {
    Loading : false,
    error : null,
    User :useLocalstorage("User",null),
   
 }


 
export const UserContext = createContext()
 
 const UserContextProvider =({children})=>{
     
const[state,dispatch] = useReducer(UserReducer,InitialState)

    
return <UserContext.Provider 
value={{
UserDispatch: dispatch,
UserLoading : state.Loading,
User: state.User,
UserError:state.error
}}>
{children}
</UserContext.Provider>
}

export default UserContextProvider