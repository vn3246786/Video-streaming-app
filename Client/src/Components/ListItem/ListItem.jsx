import React, { useContext, useEffect, useState } from 'react'
import "./listItem.scss"
import axios from 'axios'
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader'
import { LibraryAdd, LibraryAddCheck } from '@mui/icons-material'
import {WatchListContext} from '../../Contexts/WatchListContext/WatchListContext'
import {AccessTokenContext} from '../../Contexts/AccessTokenContext/AccessTokenContext'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import {updateWatchList} from '../../Contexts/WatchListContext/apiCalls'
import { checkTokenExpiry } from '../../RefreshToken'
import BackDrop from '../BackDrop/BackDrop'
import { useNavigate } from 'react-router-dom'
import { findError } from '../../ErrorFinder'

const ListItem = ({id,onHovered,onLeave,nextToHovered,i}) => {

  const navigate = useNavigate()

 const[NewMovie , setMovie] = useState({loading:false,
error:null,
movie:null})

const [updateWatchListLoading,setUpdateWatchListLoading]=useState(false)

const{WatchList,WatchListDispatch}=useContext(WatchListContext)
const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
const{User}=useContext(UserContext)

 useEffect(()=>{
 async function fetch (){
  setMovie({loading:true,
    error:false,
    movie:null})
    try {
      const res = await axios.get(`/api/movies/find/${id}`, {headers:{
        token :"bearer "+ accesstoken}})
        if(findError(res.data)){
          setMovie({loading:false,
            error:res.data,
            movie:null})
        }else
      setMovie({loading:false,
        error:false,
        movie:res.data})
    } catch (error) {
      setMovie({loading:false,
        error:"Network error",
        movie:null})
    }
  }fetch()

},[])

const Movie = NewMovie.movie && NewMovie.movie
const Error = NewMovie.error
const Loading = NewMovie.loading


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
   
 <div className='listItem' style={{marginLeft:nextToHovered?'270px':'0px',left:`${(i*270)-29}px`}} onMouseOver={onHovered}  onMouseLeave={onLeave}>
  { Loading && <SkeletonLoader type="movie"/>}
 {updateWatchListLoading&& <BackDrop/>}
 {Movie && <div className="movieContainer"  >
 {WatchList && WatchList.includes(Movie._id)? <LibraryAddCheck className='icons' onClick={()=>remove(Movie._id)} />: <LibraryAdd className='icons' onClick={()=>Add(Movie._id)}/>}
 <img onClick={()=>navigate('/movieDetails',{state:Movie})} className = "image" src={Movie.image}  alt="" />
  <div className="discription">{Movie.discription}</div>
  </div>}
       </div>
 
  )
}

export default ListItem
