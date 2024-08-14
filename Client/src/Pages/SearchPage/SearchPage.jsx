import React, { useContext, useEffect, useRef, useState } from 'react'
import "./searchpage.scss"
import { ArrowBack, Search } from '@mui/icons-material'
import SearchedMovie from '../../Components/SearchedMovie/SearchedMovie'
import { Link } from 'react-router-dom'
import { getSearchedMovie, getSuggestion } from './apiCalls'
import { CircularProgress } from '@mui/material'
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { checkTokenExpiry } from '../../RefreshToken'
import ErrorPage from "../../Components/ErrorPage/ErrorPage"



const SearchPage = () => {
  const { accesstoken,accesstokenDispatch } = useContext(AccessTokenContext)
  const SearchBarref = useRef()
  const [autocomplete, setautocomplete] = useState(null)
  const [suggestions, setsuggestions] = useState(null)
  const [SearchedMovies, setSearchedMovies] = useState({
    loading:false,
   data:null,
   error:null
  })



  useEffect(() => {
    const ApiCalls=[
      {
        func:getSuggestion,
        params:[
          setsuggestions,
          autocomplete
        ]
      }
    ]
    autocomplete && checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
  }, [autocomplete])

  function handleClickSearch(e) {
    e.preventDefault()
    const ApiCalls=[
      {
        func:getSearchedMovie,
        params:[
          SearchBarref.current.value,
          setSearchedMovies
        ]
      }
    ]
    checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
    setsuggestions(null)
  }

  function handleClickSuggestion(title) {
    const ApiCalls=[
      {
        func:getSearchedMovie,
        params:[
          title,
          setSearchedMovies
        ]
      }
    ]
    checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
    setsuggestions(null)
  }

  return (
    <div className='searchpage'>
      <div className="searchbar" >
        <Link to={'/'}>
          <ArrowBack className='arrowback' />
        </Link>

        <input type="text" onChange={(e) => setautocomplete(e.target.value)} className='input' placeholder='Search' ref={SearchBarref} />

        <div className="search" onClick={(e) => handleClickSearch(e)}>
          <Search className='searchicon' />
        </div>
      </div>
      {SearchedMovies.error&&<ErrorPage/>}
      <div className="suggestions">
        {suggestions && suggestions.map((suggestion, i) => {

          return <div key={i} onClick={() => handleClickSuggestion(suggestion.title)} className="autocomplete">{suggestion.title}</div>
        })
        }
      </div>
      {SearchedMovies.loading && <div className="spinner">
        <CircularProgress />
      </div>}
      {SearchedMovies.data && SearchedMovies.data.map((movie, i) => {
        return <div key={i} className="searchedMovies">
          <SearchedMovie movie={movie} key={i} />
        </div>
      })}

    </div>
  )
}

export default SearchPage
