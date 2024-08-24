import React from 'react'
import "./payToWatch.scss"
import { ArrowBackIos } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import backgroundImage from "../../assets/best-fall-movies.jpg"

const PayToWatch = ({logOut}) => {
  return (
    <div className='payToWatch'>
      <ArrowBackIos className='icon' onClick={logOut}/>
      <div className="subscibe-container">
      <Link className='link' to={"/subscription"}>
        <button className='subscribe'>Subscribe to continue</button>
      </Link>
      </div>
      <img className='bg-image' src={backgroundImage} alt="" />
    </div>
  )
}

export default PayToWatch
