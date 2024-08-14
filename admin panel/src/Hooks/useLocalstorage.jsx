import React from 'react'

const useLocalstorage = (type,value) => {
    if(value){
        sessionStorage.setItem(type, JSON.stringify(value)) 
        const data = JSON.parse(sessionStorage.getItem(type))
       return data
    }else
    { 
        const data = JSON.parse(sessionStorage.getItem(type))||null

    return data
}
  
}

export default useLocalstorage
