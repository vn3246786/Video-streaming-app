import { deleteAndUpdateLists, getAllLists } from "../../Contexts/ListsContexts/apiCalls"
import { deleteAndUpdateMovies, getAllMovies } from "../../Contexts/MoviesContext/apiCalls"
import { deleteUser, getAllUsers, getLatesUsers, toggleAdminStatus } from "../../Contexts/UserContext/apiCalls"
import { checkTokenExpiry } from "../../RefreshToken"


export function LatesUsers(dispatch,accesstoken,accesstokenDispatch){
   const ApiCalls=[
    {
     func:getLatesUsers,
     params:[
        dispatch,
       ]
    }
   ]
   checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}


export function AllUsers(dispatch, sort, rowSize, admin, lastRowId, navigation,searchterm,accesstoken,accesstokenDispatch){
    const ApiCalls=[
        {
         func:getAllUsers,
         params:[
            dispatch,sort, rowSize, admin, lastRowId, navigation,searchterm
           ]
        }
       ]
       checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}


export function AllMovies(dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,accesstoken,accesstokenDispatch){
    const ApiCalls=[
        {
         func:getAllMovies,
         params:[
            dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm
           ]
        }
       ]
       checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}


export function AllLists(dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,accesstoken,accesstokenDispatch){
    const ApiCalls=[
        {
         func:getAllLists,
         params:[
            dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm
           ]
        }
       ]
       checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}


export function deleteMovie(dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,id,files,data,accesstoken,accesstokenDispatch){
    const ApiCalls=[
        {
         func:deleteAndUpdateMovies,
         params:[
            dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,id,files,data
           ]
        }
       ]
       checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}


export function deleteList(dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,id,data,accesstoken,accesstokenDispatch){
    const ApiCalls=[
        {
         func:deleteAndUpdateLists,
         params:[
            dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,id,data
           ]
        }
       ]
       checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}


export function adminStatus( dispatch, sort, rowSize,admin, lastRowId, navigation,searchterm,isAdmin,id,type,accesstoken,accesstokenDispatch){
    const ApiCalls=[
        {
         func:toggleAdminStatus,
         params:[
            dispatch, sort, rowSize,admin, lastRowId, navigation,searchterm,isAdmin,id,type
           ]
        }
       ]
       checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}


export function removeUser( dispatch, sort, rowSize,admin, lastRowId, navigation,searchterm,id,type,profilePic,accesstoken,accesstokenDispatch){
    const ApiCalls=[
        {
         func:deleteUser,
         params:[
            dispatch, sort, rowSize,admin, lastRowId, navigation,searchterm,id,type,profilePic
           ]
        }
       ]
       checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}

