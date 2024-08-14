import React from 'react'
import "./featured.scss"
import { Info, PlayArrow } from '@mui/icons-material'
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader'
import { useNavigate } from 'react-router-dom'
import { Rating } from '@mui/material'

const Featured = ({Movie}) => {

const navigate = useNavigate()

function formatNumber(num){
  return num.toLocaleString('en-US')
}

  return (
 <div className="featured">
 <div className="movie" onClick={()=>navigate('/movieDetails',{state:Movie})}>
        <img  src={Movie.image} alt="" />
        <div className="content">
          <span className="title">{Movie.title}</span>
          <span className="discription">{Movie.discription}</span>
          <Rating  value={Movie.ratings.totalRatings/Movie.ratings.totalUsers} readOnly  sx={{"& .MuiRating-iconEmpty":{color:'white'}}}  />
          <div className="total-reviews">{`(${formatNumber(Movie.ratings.totalUsers)})`}</div>
        </div>
  </div>
        </div>
  )
}

export default Featured
