import React, { useRef, useState } from 'react'
import './sliderWithTooltip.scss'

const SliderWithTooltip = ({loaded,thumbRef,slideBarRef,videoRef,timeStampRef,getTime,url}) => {
  
  const barPosition=useRef()
  const windowRef=useRef()
  const videoTimerRef=useRef()

function handleEvent(e){
  const value = ((e.clientX-slideBarRef.current.getClientRects()[0].x)/barPosition.current.getClientRects()[0].width)*100
  value>=0 && value<=100 && (slideBarRef.current.style.width=`${value}%`)
value>=0 && value<=100 && (thumbRef.current.style.left=`${value}%`)
value>=0 && value<=100 && (videoRef.current.currentTime=videoRef.current.duration*(value/100))
}
 
 
function timelinePosition(position){
  if(position<=7){
    position>=0 && position<=100 &&(windowRef.current.style.left=`${0}%`)
  }else if(position>=93){
    position>=0 && position<=100&& (windowRef.current.style.left=`${86}%`)
  }else
  position>=0 && position<=100&&( windowRef.current.style.left=`${position-7}%`)
}

  function handleMouseMove(e){
const value = ((e.clientX-slideBarRef.current.getClientRects()[0].x)/barPosition.current.getClientRects()[0].width)*100
value>=0 && value<=100 && (timeStampRef.current.innerHTML=getTime('current',(videoRef.current.duration*(value/100))))
timelinePosition(value)
value>=0 && value<=100 && (videoTimerRef.current.currentTime=(videoTimerRef.current.duration*(value/100)))
}
    
    return (
         <div className='sliderWithTooltip' ref={barPosition}> 
         <div className="bar"onMouseMove={(e)=>{handleMouseMove(e)}}  onClick={(e)=>handleEvent(e)}>
         <div className="bar-loaded" style={{width:`${loaded}%`}} ></div>
         <div className="bar-completed"  ref={slideBarRef} ></div>
         <div className='thumb' ref={thumbRef}></div> 
        <div className="video-container" ref={windowRef}>
        <video className='window'ref={videoTimerRef} src={url}></video>
        <div className="timestamp" ref={timeStampRef}>0</div>
          </div>
         </div> 
        </div>   
         
      );
    }


export default SliderWithTooltip
