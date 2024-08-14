import React from 'react'
import "./payToWatch.scss"
import { ArrowBackIos } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const PayToWatch = ({logOut}) => {
  return (
    <div className='payToWatch'>
      <ArrowBackIos className='icon' onClick={logOut}/>
      <div className="subscibe-container">
      <Link className='link' to={"/subscription"}>
        <button className='subscribe'>Subscribe to continue</button>
      </Link>
      </div>
      <img className='bg-image' src="src\Accets\best-fall-movies-1659459329 (2).jpg" alt="" />
    </div>
  )
}

export default PayToWatch
