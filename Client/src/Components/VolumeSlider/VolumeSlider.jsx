import React, { useRef } from 'react'
import './volumeSlider.scss'

import { VolumeDown, VolumeOff,  VolumeUp } from '@mui/icons-material';

const VolumeSlider = ({value,setValue,videoRef}) => {

  const sliderRef=useRef()
  const thumbRef=useRef()
  const sliderContainer=useRef()

function handleEvent(e){
  const value = ((e.clientX-sliderRef.current.getClientRects()[0].x)/sliderContainer.current.getClientRects()[0].width)*100
value>=0 && value<=100 && (thumbRef.current.style.left=`${value}%`)
value>=0 && value<=100 && (sliderRef.current.style.width=`${value}%`)
value>=0 && value<=100 &&  ( videoRef.current.volume=Math.floor(value)*0.01)
 setValue(value)

}

  return (
    <div className="volume-slider">
      {value>50 && <div className="icon"><VolumeUp sx={{color:'white'}}/></div>}
       {value<50 && value>0 && <div className="icon"><VolumeDown sx={{color:'white'}}/></div>}
       {value<=0 &&<div className="icon"><VolumeOff sx={{color:'white'}}/></div>}
       <div className="slider-container" ref={sliderContainer} onClick={(e)=>handleEvent(e)} onDrag={(e)=>handleEvent(e)}>
        <div className="slider" ref={sliderRef}></div>
        <div className="thumb" ref={thumbRef}></div>
       </div>
    </div>
       
  );
}


export default VolumeSlider
