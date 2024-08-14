import React, { useContext, useEffect } from 'react'
import './watchListPage.scss'
import { ArrowBack } from '@mui/icons-material'
import { WatchListContext } from '../../Contexts/WatchListContext/WatchListContext'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import MovieList from '../../Components/MovieList/MovieList'
import { getWatchList } from '../../Contexts/WatchListContext/apiCalls'
import {AccessTokenContext}from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { checkTokenExpiry } from '../../RefreshToken'
import { CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const WatchListPage = () => {

  const navigate = useNavigate()
const {User}=useContext(UserContext)
const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
 const {WatchList,WatchListDispatch,WatchListLoading}=useContext(WatchListContext)

useEffect(()=>{
  const ApiCalls =[ {
    func:getWatchList,
    params:[
      WatchListDispatch,
      User._id,      
    ]
  }]

 !WatchList&& checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
},[])


  return (
    <div className='watchListPage'>
        <div className="header">
     <ArrowBack className='icon' onClick={()=>navigate(-1)}/>
      <div className="title">Watchlist</div>
        </div>
        {WatchListLoading&&<CircularProgress className='spinner'/>}
        {WatchList&&WatchList.map((id,i)=>{
       return <MovieList key={i} id={id} accesstoken={accesstoken} accesstokenDispatch={accesstokenDispatch}/>
        })}
    </div>
  )
}

export default WatchListPage
