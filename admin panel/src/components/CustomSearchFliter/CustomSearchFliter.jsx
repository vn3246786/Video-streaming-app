import { Search } from '@mui/icons-material'
import React, { useEffect, useState,useContext, useRef } from 'react'
import './customSearchFilter.scss'

const CustomSearchFliter = ({handleChange,autoComplete,handleClick,clearSearch}) => { 
const inputref = useRef()
          return (
          <div className="customSearchFliter">
            <div className="searchbar-wrapper">
              <div className="searchbar">
             <div className="searchicon" onClick={()=>handleClick(inputref.current.value)}>
             <Search className='search'/></div> 
            <input placeholder=""
            className='searcharea' ref={inputref} onChange={(e)=> handleChange(e)} type="text" /> 
            <button className="clear-search" onClick={()=>clearSearch()}>clear</button>
              </div>
              <div className="suggestion-wrapper">
           {autoComplete.data &&  autoComplete.data.map((value,i)=>{
             return <div key={i} onClick={()=>handleClick(value.username?value.username:value.title)} className="suggestions">{value.username?value.username:value.title}</div>
           }) }
            </div>
            </div>
            </div>)
        
}

export default CustomSearchFliter
