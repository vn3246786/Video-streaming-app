import React, { createContext, useReducer } from 'react'
import accesstokenReducer from './AccesstokenReducer'
import useLocalstorage from '../../Hooks/useLocalstorage'

 const InitialState = {
    Loading : false,
    error : null,
    accesstoken :useLocalstorage("accesstoken",null),
   
 }

 
export const AccessTokenContext = createContext()
 
 const AccessTokenContextProvider =({children})=>{
     
const[state,dispatch] = useReducer(accesstokenReducer,InitialState)

    
return <AccessTokenContext.Provider 
value={{
 accesstokenDispatch: dispatch,
 accesstokenLoading : state.Loading,
 accesstoken: state.accesstoken,
 accesstokenError:state.error
}}>
{children}
</AccessTokenContext.Provider>
}

export default AccessTokenContextProvider