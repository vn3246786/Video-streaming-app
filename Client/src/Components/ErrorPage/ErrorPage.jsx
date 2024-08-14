import { NetworkCheck } from '@mui/icons-material'
import React from 'react'
import "./errorPage.scss"
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
    const navigate =useNavigate()
  return (
    <div className='errorPage'>
        <div className="refresh-container">
        <NetworkCheck sx={{color:"white",fontSize:"3rem"}}/>
       <button className='btn'onClick={()=>navigate(0)}>Refresh</button>
        </div>
    </div>
  )
}

export default ErrorPage
