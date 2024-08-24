import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Featured from '../../Components/Featured/Featured'
import List from '../../Components/List/List'
import "./home.scss"
import { UserContext } from '../../Contexts/UserContext/UserContext'
import { getLists,getRandomMovie, getRecommendations } from './apiCalls'
import SkeletonLoader from '../../Components/SkeletonLoader/SkeletonLoader'
import { WatchListContext } from '../../Contexts/WatchListContext/WatchListContext'
import { getWatchList } from '../../Contexts/WatchListContext/apiCalls'
import PayToWatch from '../../Components/PayToWatch/PayToWatch'
import {AccessTokenContext}from "../../Contexts/AccessTokenContext/AccessTokenContext"
import {checkTokenExpiry} from "../../RefreshToken"
import ErrorPage from '../../Components/ErrorPage/ErrorPage'
import RecommendedList from '../../Components/RecommendedList/RecommendedList'
import { CircularProgress } from '@mui/material'

const Home = () => {
 const [Series , setSeries]=useState(false)
 const[randomMovie,setRandomMovie]=useState({loading:false,
  data:null,
  error:null
 })

 const[lists,setLists]=useState({loading:false,
  data:null,
  error:null
 })

 const[recommendations,setRecommendations]=useState({loading:false,
  data:null,
  error:null
 })

const{User,UserDispatch}=useContext(UserContext)

const {accesstoken,accesstokenDispatch,accesstokenError}=useContext(AccessTokenContext)


const {WatchListDispatch}=useContext(WatchListContext)

function logOut(){
    sessionStorage.removeItem("User")
    sessionStorage.removeItem("accesstoken")
  UserDispatch({type:"logout"})
  }

useEffect(()=>{

  const ApiCalls = [
    {
      func:getRandomMovie,
      params:[
        setRandomMovie,
        Series
      ]
       
    },
    {
      func:getLists,
      params:[
        setLists,
        Series
      ]
    },
    {
      func:getWatchList,
      params:[
        WatchListDispatch,
        User._id,      
      ]
    },
    {
      func:getRecommendations,
      params:[
        setRecommendations,
      ]
    },
  
  ]

 
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)

},[Series])


  return (
    <div className='home'>
 {randomMovie.error===!"user is not subscribed"&& <Navbar setSeries = {setSeries} series={Series} logOut={()=>logOut()}/>}
 {randomMovie.loading && <CircularProgress className='spinner' size={70}/>}
     {randomMovie.error==="user is not subscribed"&& <PayToWatch logOut={logOut}/>}
   {randomMovie.error && randomMovie.error==!"user is not subscribed" && <ErrorPage/>}
   {randomMovie.data&& <div className='home'>
   {randomMovie.data&&<Featured Movie ={randomMovie.data} />}
   {recommendations.loading && <SkeletonLoader  type="list"/>}
   {recommendations.data&&<RecommendedList list={recommendations.data}/>}
 {lists.loading && <SkeletonLoader  type="list"/>}
   {lists.data && lists.data.map((list,i)=>{
   return <List key={i} list={list}  />
   })} 
    </div>}
    </div>

  )
}

export default Home
