import React, { useContext, useState } from 'react'
import "./searchedmovie.scss"
import { Info, LibraryAdd, LibraryAddCheck, PlayArrow } from '@mui/icons-material'
import {WatchListContext} from '../../Contexts/WatchListContext/WatchListContext'
import {updateWatchList} from '../../Contexts/WatchListContext/apiCalls'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import { AccessTokenContext } from '../../Contexts/AccessTokenContext/AccessTokenContext'
import BackDrop from "../BackDrop/BackDrop"
import {checkTokenExpiry} from "../../RefreshToken"
import { Rating } from '@mui/material'
import { useNavigate } from 'react-router-dom'


const SearchedMovie = ({movie}) => {

  const[updateWatchListLoading,setUpdateWatchListLoading]=useState(false)

  const{WatchList,WatchListDispatch}=useContext(WatchListContext)
  const{User}=useContext(UserContext)
  const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
const navigate = useNavigate()
  
function formatNumber(num){
  return num.toLocaleString('en-US')
}
  
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
    <div className='searchedmovie'>
      {updateWatchListLoading&&<BackDrop/>}
      {WatchList && WatchList.includes(movie._id)? <LibraryAddCheck className='icons' onClick={()=>remove(movie._id)}/>: <LibraryAdd className='icons' onClick={()=>Add(movie._id)}/>}
        <img className='image' src={movie.image} alt="" />
        <div className="container">
            <h1>{movie.title}</h1>
            <p>{movie.discription}</p>
            <div className="rating">
            <Rating  value={movie.ratings.totalRatings/movie.ratings.totalUsers} readOnly  sx={{"& .MuiRating-iconEmpty":{color:'white'}}}  />
            <div className="total-reviews">{`(${formatNumber(movie.ratings.totalUsers)})`}</div>
            </div>
           <div className="buttons">
            <button> 
              <PlayArrow onClick={()=>navigate("/movieDetails",{state:movie})}/>
            </button>
           </div>
        </div>
    </div>
  )
}

export default SearchedMovie
