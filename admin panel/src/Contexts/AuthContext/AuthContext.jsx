import React, { createContext,useReducer } from 'react'
import AuthReducer from './AuthReducer'
import useLocalstorage from '../../Hooks/useLocalstorage'

 const InitialState = {
    Loading : false,
    error : null,
    User :useLocalstorage("User",null),
 }


 
export const AuthContext = createContext(InitialState)
 
 const AuthContextProvider =({children})=>{
     
const[state,dispatch] = useReducer(AuthReducer,InitialState)

    
return <AuthContext.Provider 
value={{
AuthDispatch: dispatch,
AuthLoading : state.Loading,
User: state.User,
AuthError:state.error
}}>
{children}
</AuthContext.Provider>
}

export default AuthContextProvider