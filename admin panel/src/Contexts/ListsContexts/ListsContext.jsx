import React, { createContext, useReducer } from 'react'
import ListsReducer from './ListsReducer'

 const InitialState = {
   Loading : false,
    error : null,
    Lists : null
 }


 
 export const ListsContext = createContext(InitialState)
 
 const ListsContextProvider =({children})=>{
     
const[state,dispatch] = useReducer(ListsReducer,InitialState)

    
return <ListsContext.Provider 
value={{
ListsDispatch: dispatch,
ListsLoading : state.Loading,
ListsError: state.error,
Lists:state.Lists
}}>
{children}
</ListsContext.Provider>
}

export default ListsContextProvider
