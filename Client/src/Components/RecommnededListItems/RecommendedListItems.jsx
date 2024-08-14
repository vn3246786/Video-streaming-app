import React, { useContext, useState } from 'react'
import "./recommendedListItems.scss"
import { useNavigate } from 'react-router-dom'
import { WatchListContext } from '../../Contexts/WatchListContext/WatchListContext'
import { AccessTokenContext } from '../../Contexts/AccessTokenContext/AccessTokenContext'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import { updateWatchList } from '../../Contexts/WatchListContext/apiCalls'
import { checkTokenExpiry } from '../../RefreshToken'
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader'
import { LibraryAdd, LibraryAddCheck } from '@mui/icons-material'

const RecommendedListItems = ({movie,onHovered,onLeave,nextToHovered,i}) => {

    const navigate = useNavigate()

   
   
   const [updateWatchListLoading,setUpdateWatchListLoading]=useState(false)
   
   const{WatchList,WatchListDispatch}=useContext(WatchListContext)
   const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
   const{User}=useContext(UserContext)
   

   function Add(id){
     const ApiCalls=[
       {
         func:updateWatchList,
         params:[
           WatchListDispatch,
           User._id,
           setUpdateWatchListLoading,
           {type:'add',movie:id}
         ]
       }
     ]
     checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
   }
   
   function remove(id){
     const ApiCalls=[
       {
         func:updateWatchList,
         params:[
           WatchListDispatch,
           User._id,
           setUpdateWatchListLoading,
           {type:'remove',movie:id}
         ]
       }
     ]
     checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
   }


  return (
    <div className='recommendedListItems' style={{marginLeft:nextToHovered?'270px':'0px',left:`${(i*270)-29}px`}} onMouseOver={onHovered}  onMouseLeave={onLeave}>       
 {updateWatchListLoading&& <BackDrop/>}
 {movie && <div className="movieContainer"  >
 {WatchList && WatchList.includes(movie._id)? <LibraryAddCheck className='icons' onClick={()=>remove(movie._id)} />: <LibraryAdd className='icons' onClick={()=>Add(movie._id)}/>}
 <img onClick={()=>navigate('/movieDetails',{state:movie})} className = "image" src={movie.image}  alt="" />
  <div className="discription">{movie.discription}</div>
  </div>}   
    </div>
  )
}

export default RecommendedListItems
