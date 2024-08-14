import React, { useContext, useEffect, useState } from 'react'
import './movieList.scss'
import axios from 'axios'
import { Info, LibraryAdd, LibraryAddCheck, PlayArrow } from '@mui/icons-material'
import {WatchListContext} from '../../Contexts/WatchListContext/WatchListContext'
import {updateWatchList} from '../../Contexts/WatchListContext/apiCalls'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import { checkTokenExpiry } from '../../RefreshToken'
import BackDrop from '../BackDrop/BackDrop'
import { CircularProgress, Rating } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const MovieList = ({id,accesstoken,accesstokenDispatch}) => {

    const[updateWatchListLoading,setUpdateWatchListLoading]=useState(false)
const{WatchList,WatchListDispatch,WatchListLoading}=useContext(WatchListContext)
  const{User}=useContext(UserContext)
  const navigate = useNavigate()

const [movie,setMovie]=useState({
    loading:false,
    data:null,
    error:null
})

  
function formatNumber(num){
  return num.toLocaleString('en-US')
}

useEffect(()=>{
   async function getMovies(id,accesstoken){setMovie({
        loading:true,
        data:null,
        error:null
    })
try {
    const res =await axios.get(`/api/movies/find/${id}`,{headers:{
token:'bearer '+accesstoken
    }})
    if(res.data==="server error"||res.data==="accesstoken not found"||res.data==="invalid token"||res.data==="you are not authorized")
        {
            setMovie({
                loading:false,
                data:null,
                error:res.data
            })
        }else   setMovie({
            loading:false,
            data:res.data,
            error:null
        })
} catch (error) {
    setMovie({
        loading:false,
        data:null,
        error:'server error'
    })
    
}}
const ApiCalls = [{
    func:getMovies,
    params:[
        id
    ]
}]
id&& checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls) 
},[])

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
   movie.data&&<div className='movieList'>
    {updateWatchListLoading&&<BackDrop/>}
        <img className="image" src={movie.data.image} alt="" />
        {WatchList && WatchList.includes(movie.data._id)? <LibraryAddCheck className='icons' onClick={()=>remove(movie.data._id)} />: <LibraryAdd className='icons' onClick={()=>Add(movie.data._id)}/>}
        <div className="container">
            <h1>{movie.data.title}</h1>
            <p>{movie.data.discription}</p>
            <div className="rating">
            <Rating  value={movie.data.ratings.totalRatings/movie.data.ratings.totalUsers} readOnly  sx={{"& .MuiRating-iconEmpty":{color:'white'}}}  />
            <div className="total-reviews">{`(${formatNumber(movie.data.ratings.totalUsers)})`}</div>
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

export default MovieList
