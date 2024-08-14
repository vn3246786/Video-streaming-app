import React, { useContext, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Contexts/AuthContext/AuthContext'
import { AccessTokenContext } from '../../Contexts/AccessTokenContext/AccessTokenContext'
import { useState } from 'react'
import { searchMovies } from '../../Contexts/MoviesContext/apiCalls'
import { ArrowBack, ArrowDropDown, ArrowDropUp, CheckCircle, Clear, RadioButtonUnchecked } from '@mui/icons-material'
import useGenreOptions from '../../Hooks/useGenreOptions'
import './updateLists.scss'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { updateList } from './apiCalls'
import { checkTokenExpiry } from '../../RefreshToken'
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify'

const UpdateLists = () => {
    const {state}=useLocation()
const navigate =useNavigate()
const [response,setResponse]=useState({
  loading:false,
  data:null,
  error:null
})

    const{User}=useContext(AuthContext)
    const{accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
  
    const [GenreOptions,setGenreOptions]=useState(useGenreOptions(response.data?response.data.genre:state.value.genre))

    const [List,setList]=useState({
      title:state.value.title,
      type:state.value.isSeries,
      movies:[...state.value.movies],
      genre:[...state.value.genre]})

    const[suggestions,setSuggestions]=useState({
      loading:false,
      data:null,
      error:null
    })
    const[moviesArray,setMoviesArray]=useState(response.data?[...response.data.movies]:[...state.value.movies])
    const[expand,setExpand]=useState(false)
  
    
    function handleSelect(index,value,checked){  
    setGenreOptions((p)=>{
      return p.map((data,i)=>{
        if(index===i){
          return {...data,checked:!checked}
        }else return data
        })
    }
    )
  
    if(checked){
      setList((p)=>{
        return {...p,genre:[...p.genre.filter((v)=>{
          return value!==v
        })]}
      })
    }else setList((p)=>{
      return {...p,genre:[...p.genre,value]}
    })
    }
  
    function handelSearch(term){
      const ApiCalls=[
        {
          func:searchMovies,
          params:[
            term,setSuggestions
          ]
        }
      ]
      checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
    }
  
  
  function checkMovie(id){
  return moviesArray.map((v)=>{
    return v.id
  }).includes(id)  
  }
  
  
  function handleClick(title, id){
  if(checkMovie(id)){
   alert('this movies exists')
  }else {
    setMoviesArray((p)=>{
      return [...p,{title,id}]
    })
    setList((p=>{
      return {...p,movies:[...p.movies,{title,id}]}
    }))
  }}
  
  function removeMovie(id){
  setMoviesArray((p)=>{
   return p.filter((v)=>{
      return v.id!==id
    })
  })
  setList((p=>{
    return {...p,movies:[...p.movies.filter((value)=>{
      return value.id!==id
    })]}
  }))
  }
  
  
  function handleChange(e){
    e.target.name==='title'&& setTitle(e.target.value)
    e.target.name==='type'&& setType(e.target.value)
    if(e.target.value) { setList((v)=>{
         return {...v,[`${e.target.name}`]:e.target.value}
       })}else return
     }
   
     function update(e){
      e.preventDefault()
   const ApiCalls = [
    {
      func:updateList,
      params:[
        setResponse,List,state.value._id
      ]
    }
   ]
   if(!List.title){
    toast.warning("title is required")
      }else if(List.isSeries===null){
        toast.warning("Type is required")
      }else if(List.movies.length<1){
        toast.warning("movies are reqired")
      }else if(List.genre.length<1){
        toast.warning("genre are reqired")
      }else{

        checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
      }
     }
  

    return  (
      <div className='updateLists'> 
      {response.loading&&<CircularProgress className='spinner' size={70}/>}
       <Navbar/>
       <div className="flex-container">
       <Sidebar/>
       <div className="form-container">
       <ArrowBack style={{color:'white'}} onClick={()=>navigate("/Lists",{state:state})}/>
        <form action="" className='form'>
          <div className="input-container">
            <div className="header">Title</div>
            <input type="text" value={List.title} className='input'onChange={(e)=>handleChange(e)} name="title" placeholder='Title'/>
          </div>
          <div className="input-container">
            <div className="header">Type</div>
            <select type="text" value={List.type}  name="isSeries"onChange={(e)=>handleChange(e)} className='input' id="">
              <option value="">choose type</option>
              <option label='Series' value={"true"}>Series</option>
              <option  label='Movie' value={"false"}>Movie</option>
            </select>
          </div>
          <div className="input-container">
            <div className="header">Movies</div>
            <input type="text" className='input' onChange={(e)=>handelSearch(e.target.value)}/>
            <div className="suggestions-container" >
          {suggestions.data && suggestions.data.map((v,i)=>{
            return <div key={i} onClick={()=>(handleClick(v.title,v._id))} className="suggestion">{v.title}</div>
             })}
            </div>
          </div>
          <div className="input-container genre">
            <div className="header">Genre</div>
            <div className="select-wrapper"onClick={()=>setExpand(!expand)}>
            <div className="select">select genre</div>
          {!expand?<ArrowDropDown/>:<ArrowDropUp/>}
            </div>
          {expand&& GenreOptions.map((data,i)=>{
            return <div key={i} className="genre-wrapper"onClick={()=>handleSelect(i,data.value,data.checked)}>
            <div  className="option">{data.value}</div>
           {!data.checked? <RadioButtonUnchecked className='icon'/>:<CheckCircle  className='icon'/>}
           </div>
            })}
          </div>
        <button className='add' onClick={(e)=>update(e)}>Add</button>
        </form>
        <div className="added-movies">
          {moviesArray&&moviesArray.map((v,i)=>{
  return <div key={i} className="movie-container">
    <Clear onClick={()=>{
      removeMovie(v.id)
    }}/>
    <div className="movie-title">{v.title}</div>
  </div>
          })}
        </div>
       </div>
       </div>
      </div>
    )
}

export default UpdateLists
