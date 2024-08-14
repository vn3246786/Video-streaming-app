import React, { useContext, useEffect, useState } from 'react'
import "./genrePage.scss"
import SearchedMovie from '../../Components/SearchedMovie/SearchedMovie'
import { getMoviesByGenre } from './apiCalls'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { GenreValues } from '../../Variables'
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { checkTokenExpiry } from '../../RefreshToken'
import ErrorPage from "../../Components/ErrorPage/ErrorPage"
import { CircularProgress } from '@mui/material'
import { ArrowBackIos } from '@mui/icons-material'

const GenrePage = () => {
  const navigate = useNavigate()
const{state}=useLocation()
const [genre,setgenre]=useState(null)
const [movies,setMovies]=useState({
  loading:false,
  data:null,
  error:null
})

const Genre = genre?genre:state[0]
const series = state[1]

const{User}=useContext(UserContext)
const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)

useEffect(()=>{
  const ApiCalls=[
    {
      func:getMoviesByGenre,
      params:[
        setMovies,
        Genre,
        series
      ]
    }
  ]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
},[Genre])

  return (
    <div className='genrePage'>
      <ArrowBackIos className='icon' onClick={()=>navigate(-1)}/>
      <div className="header">
      <h1>title</h1>  
<div className="Genre" >
  <span>{Genre}</span>
  <div className="wrapper">
{GenreValues.map((data,i)=>{
return  <div  key={i} onClick={()=>setgenre(data.value)} className="option">{data.title}</div> 
})} 
  </div>
</div>
      </div>
      <div className="movies">
        {movies.error&&<ErrorPage/>}
        {movies.loading&&<CircularProgress className='spinner'/>}
    { movies.data&&  movies.data.map((movie,i)=>{
        return  <SearchedMovie key={i} movie={movie}/>
    })  }
      </div>
    </div>
  )
}

export default GenrePage
