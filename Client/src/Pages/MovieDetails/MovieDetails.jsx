import React, { useContext, useState } from 'react'
import "./movieDetails.scss"
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowBackIos, Close, FormatUnderlined } from '@mui/icons-material'
import { CircularProgress, Rating } from '@mui/material'
import {UserContext} from '../../Contexts/UserContext/UserContext'
import {AccessTokenContext} from '../../Contexts/AccessTokenContext/AccessTokenContext'
import { checkTokenExpiry } from '../../RefreshToken'
import { getRatings, rateMovie } from './apiCalls'

const MovieDetails = () => {

const {User}=useContext(UserContext)
const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
const [response,setResponse]=useState({
  loading:false,
  data:null,
  error:null
})

const [previousRating,setPreviousRating]=useState({
  loading:false,
  data:null,
  error:null
})
    const {state}=useLocation()
const navigate = useNavigate()
const [rating,setRating]=useState(0)
const [value,setValue]=useState(state.ratings.totalRatings/state.ratings.totalUsers)
const [ratingModal,setRatingModal]=useState(false)

function formatNumber(num){
   return num.toLocaleString('en-US')
}

function getRatingDetails(){
const ApiCalls = [
 {
   func:getRatings,
   params:[
    setPreviousRating,
    setRating,
    state
   ]
 }
]
checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
  setRatingModal(true)
}

function addRating(){
  const ApiCalls = [
    {
      func:rateMovie,
      params:[
       setResponse,
       state._id,
       rating,
       setValue,
       setRatingModal 
      ]
    }
   ]
   checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}
  return (
    <div className='movieDetails'>
     {(previousRating.loading||response.loading)&& <CircularProgress className='spinner' size={70}/>}
    {ratingModal && previousRating.data && <div className="rating-modal">
            <Close className='icon-close' onClick={()=>setRatingModal(false)}/>
        <div className="choose">choose number of stars</div>
      <Rating
      sx={{"& .MuiRating-iconEmpty":{color:'black'}}}
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
      <button className='rate-btn'onClick={()=>addRating()}>{previousRating.data?.hasOwnProperty(state._id)?"Edit Rating":"Rate"}</button>
      </div> }
      <ArrowBackIos className='back-icon'onClick={()=>navigate(-1)}/>
      <div className="info-container">
      <div className="title-image">
      <img src={state.image} className='image' alt="" />
      </div>
      <div className="title">{state.title}</div>
      <div className="discription">{state.discription}</div>
      <div className="rating-container">
      <Rating  value={value} readOnly  sx={{"& .MuiRating-iconEmpty":{color:'white'}}}  />
      <div className="total-reviews">{`(${formatNumber(response.data?response.data.totalUsers:state.ratings.totalUsers)})`}</div>
      </div>
      <button className='btn play' onClick={()=>navigate('/play',{state:state})}>play</button>
      <button className='btn Rate-movie' onClick={()=>getRatingDetails()}>Rate movie</button>
      </div>
        
    </div>
  )
}

export default MovieDetails
