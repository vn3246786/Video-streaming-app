import React from 'react'

const WatchListReducer = (state,Action) => {
  switch (Action.type) {
    case "start":
     return {
loading:true,
data:null,
error:false
    }
   case "success":
    return {
        loading:false,
        data:Action.payload,
        error:false
            }
    case "failure":
        return {
            loading:false,
            data:null,
            error:Action.payload
                }
    default:
        return {...state}
  }
}

export default WatchListReducer
