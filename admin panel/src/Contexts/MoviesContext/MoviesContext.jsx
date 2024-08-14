import React, { createContext, useReducer } from 'react'
import MoviesReducer from './MoviesReducer'

 const InitialState = {
  Loading : false,
    error : null,
    movies : null,
 }


 
export const MoviesContext = createContext(InitialState)
 
 const MoviesContextProvider =({children})=>{
     
const[state,dispatch] = useReducer(MoviesReducer,InitialState)

    
return <MoviesContext.Provider 
value={{
MoviesDispatch: dispatch,
MoviesLoading : state.Loading,
Movies:state.Movies,
MoviesError:state.Movie,
}}>
{children}
</MoviesContext.Provider>
}

export default MoviesContextProvider