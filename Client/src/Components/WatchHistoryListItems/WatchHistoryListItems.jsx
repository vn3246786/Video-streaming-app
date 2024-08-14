import React, { useContext, useEffect, useState } from 'react'
import { AccessTokenContext } from '../../Contexts/AccessTokenContext/AccessTokenContext'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import { useNavigate } from 'react-router-dom'
import { checkTokenExpiry } from '../../RefreshToken'
import { fetchmovie } from './apiCalls'
import "./watchHistoryListItems.scss"

const WatchHistoryListItems = ({movieid,onHovered,onLeave,nextToHovered,i}) => {
    const navigate = useNavigate()

   const [movie,setMovie]=useState({
    loading:false,
    data:null,
    error:null
   })
   
   const [updateWatchListLoading,setUpdateWatchListLoading]=useState(false)
   
   const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
   const{User}=useContext(UserContext)
   
useEffect(()=>{
    function getmovie(){
        const ApiCalls=[
          {
            func:fetchmovie,
            params:[
              setMovie,
              movieid
            ]
          }
        ]
        checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
      }
},[])
  
   
   


  return (
    <div className='watchHistoryListItems' style={{marginLeft:nextToHovered?'270px':'0px',left:`${(i*270)-29}px`}} onMouseOver={onHovered}  onMouseLeave={onLeave}>  
    { movie.loading && <SkeletonLoader type="movie"/>}     
 {movie.data && <div className="movieContainer"  >
 <img onClick={()=>navigate('/movieDetails',{state:movie.data})} className = "image" src={movie.data.image}  alt="" />
  <div className="discription">{movie.data.discription}</div>
  </div>}   
    </div>
  )
}

export default WatchHistoryListItems
