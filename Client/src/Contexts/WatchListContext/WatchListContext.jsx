import React, { useReducer } from 'react'
import { createContext } from 'react'
import WatchListReducer from './WatchListReducer'

const initialState={
    loading:false,
    data:null,
    error:null
}

export const WatchListContext = createContext()


const WatchListContextProvider = ({children}) => {

const [state,dispatch]=useReducer(WatchListReducer,initialState)
  return (
    <WatchListContext.Provider
    value={{
        WatchListDispatch:dispatch,
        WatchListLoading:state.loading,
        WatchList:state.data,
        WatchListError:state.error,
    }}>
    {children}  
    </WatchListContext.Provider>
  )
}

export default WatchListContextProvider
