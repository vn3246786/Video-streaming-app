import axios from "axios"
import { findError } from "../../ErrorFinder"
import { toast } from "react-toastify"

export async function getLatesUsers(dispatch,accesstoken){
dispatch({type:"start"})
try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users?latest=true`,{headers:{
        token:"bearer "+accesstoken
    }})
    if(findError(res.data))
        {
          dispatch({type:"failure", payload:res.data})
        }else dispatch({type:"success",payload:res.data})
} catch (error) {
    dispatch({type:"failure", payload:"network error"})
}
}


export async function getAllUsers(dispatch,sort,rowSize,admin,lastRowId,navigation,searchterm,accesstoken){
    dispatch({type:"start"})

function getQuery(){
   let arr =[`${import.meta.env.VITE_API_URL}/api/users?sort=${sort}&rowSize=${rowSize}`]
  admin && (arr=[...arr,`&admin=${admin}`])
  searchterm&&(arr= [...arr,`&search=${searchterm}`])
lastRowId && (arr=[...arr,`&lastRowId=${lastRowId}`])
navigation && (arr=[...arr,`&navigation=${navigation}`])

return arr.join('')
}

try {
    const res = await axios.get( getQuery(),{headers:{
        token:"bearer "+accesstoken
    }})
    if(findError(res.data))
        {
            dispatch({type:"failure", payload:res.data})
        }else dispatch({type:"success",payload:res.data})
} catch (error) {
    dispatch({type:"failure", payload:"network error"})
}
}


export async function searchUsers(searchTerm,setAutoComplete,accesstoken){
    setAutoComplete({loading:true,
        data:null,
        error:null
      })
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search?search=`+searchTerm,{headers:{
            token:"bearer "+accesstoken
        }})
       if(findError(res.data)){
        setAutoComplete({loading:false,
            data:null,
            error:res.data
          })
       }else{
        setAutoComplete({loading:false,
            data:res.data,
            error:null
          })
       }
    } catch (error) {
        setAutoComplete({loading:false,
            data:null,
            error:"network error"
          })
    }
}

export async function toggleAdminStatus(dispatch,sort,rowSize,admin,lastRowId,navigation,searchterm,isAdmin,id,type,accesstoken){
    try {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update/${id}`,{isAdmin:isAdmin},{headers:{
            token:"bearer "+accesstoken
        }})
        if(findError(res.data)){     
            toast.error(res.data)
        }else {
            ( type==='latestUsers'? getLatesUsers(dispatch,accesstoken):getAllUsers(dispatch,sort,rowSize,admin,lastRowId,navigation,searchterm,accesstoken ))
            toast.success('user successfully updated')
        }
    } catch (error) {
        console.log(error)
        toast.error('could not update user')
    }
}

export async function deleteUser(dispatch,sort,rowSize,admin,lastRowId,navigation,searchterm,id,type,profilePic,accesstoken){
    try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/delete/${id}`,{data:{profilePic:profilePic},headers:{
            token:"bearer "+accesstoken
        }})
        if(findError(res.data)){
            toast.error(res.data)
        }else {
            ( type==='latestUsers'? getLatesUsers(dispatch,accesstoken):getAllUsers(dispatch,sort,rowSize,admin,lastRowId,navigation,searchterm,accesstoken ))
            toast.success('user successfully deleted')}
    } catch (error) {
        console.log(error)
        toast.error('could not delete user')
    }
}

