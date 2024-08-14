import React, { useContext, useEffect, useRef, useState } from 'react'
import './video.scss'
import { CheckCircle, Forward10, Pause, PlayArrow, RadioButtonUnchecked, Replay, Replay10, SettingsApplications } from '@mui/icons-material'
import VolumeSlider from '../../Components/VolumeSlider/VolumeSlider'
import SliderWithTooltip from '../../Components/SliderWithTooltip/SliderWithTooltip'
import { useLocation } from 'react-router-dom'
import { updateRecommandations } from './apiCalls'
import { checkTokenExpiry } from '../../RefreshToken'
import { AccessTokenContext } from '../../Contexts/AccessTokenContext/AccessTokenContext'



const Video = () => {
  const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)
  const{state}=useLocation()
  const [VolumesliderValue,setVolumesliderValue]=useState(0)
  const [loaded,setLoaded]=useState(false)
  const [VideoLoaded,setVideoLoaded]=useState(false)
  const [videoQuality,setvideoQuality]=useState(0)
  const[playing,setplayng]=useState(false)
  const[replay,setReplay]=useState(false)
  const[currentTime,setCurrentTime]=useState(0)
  const[showSettings,setshowSettings]=useState(false)
  const [sliderValue,setSliderValue]=useState(0)
  const [duration,setDuration]=useState(0)
  const videoRef=useRef()
  const slideBarRef = useRef()
  const thumbRef = useRef()
  const timeStampRef=useRef()
  const timeRef=useRef()


useEffect(()=>{
const ApiCalls=[
  {
    func:updateRecommandations,
    params:[
      state.genre
    ]
  }
  
]
checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
},[])


  const [settingsOptions,setSettingsOptions]=useState([
    {name:"HQ",
      checked:false,
      number:1
    },
    {name:"LQ",
      checked:false,
      number:0
    }
  ])


function handleOnload(){
  setVideoLoaded(true)
videoRef.current.currentTime=currentTime
  playing && videoRef.current.play()
  setSettingsOptions((p)=>{
    return p.map((v)=>{
      if (v.number===videoQuality){
        return {...v,checked:true}
      }else return {...v,checked:false}
    })
  })
}

function toggleVideo(type){
switch (type) {
  case "play":
    videoRef.current.play()
    setplayng(true)
    break;
  case "pause":
    videoRef.current.pause()
    setplayng(false)
    break;
  case "replay":
    videoRef.current.play()
    setReplay(false)
    break;
}
}


function getQualtity(){
 if (videoQuality===1) {
   return state.video.HQ
     
  }else return state.video.LQ
}


function setSlidebarValues(){
  setLoaded((videoRef.current.buffered.end(0)/videoRef.current.duration)*100)
}
const numberFormater =  Intl.NumberFormat(undefined,{minimumIntegerDigits:2})


function getTime(type,barValue){
  if(barValue){
    const seconds = numberFormater.format(Math.floor(barValue)%60)
    const minutes = numberFormater.format(Math.floor(barValue/60)%60)
    const hours = numberFormater.format(Math.floor(barValue/3600))
    if(hours===`00`){
      return `${minutes}:${seconds}`
    } else{
  return `${hours}:${minutes}:${seconds}`
    }
  }else
 { const time = type==='current'?videoRef.current.currentTime:videoRef.current.duration
  const seconds = numberFormater.format(Math.floor(time)%60)
  const minutes = numberFormater.format(Math.floor(time/60)%60)
  const hours = numberFormater.format(Math.floor(time/3600))
  if(hours===`00`){
    return `${minutes}:${seconds}`
  } else{
return `${hours}:${minutes}:${seconds}`
  }}
   
}

function moveSlider(){
  const value = (videoRef.current.currentTime/videoRef.current.duration)*100
   slideBarRef.current.style.width=`${value}%`
   thumbRef.current.style.left=`${value}%`
   timeRef.current.innerHTML=`${getTime('current')}/${getTime('total')}`
   
}

function replayfunc(){
setReplay(true)
}

function toggleOptions(){
  setshowSettings(!showSettings)
}


function toggleQualitySettings(index,number){
  console.log(number)
  setCurrentTime(videoRef.current.currentTime)
setSettingsOptions((p)=>{
 return p.map((v,i)=>{
    if(i===index){
      setvideoQuality(number)
      return {...v,checked:true}
    }else return {...v,checked:false}
  })
})
}

function handleSkip(type){
 type==='forward'&&( videoRef.current.currentTime=videoRef.current.currentTime+10)
 type==='backward' && (videoRef.current.currentTime=videoRef.current.currentTime-10)
}

  return (
  <div className="video">
    <video className='player'onEnded={()=>replayfunc()} onLoadedData={()=>handleOnload()} onTimeUpdate={()=>moveSlider()} onProgress={()=>{setSlidebarValues()}} ref={videoRef}  src={getQualtity()}></video>
<div className="icons-wrapper">
  {VideoLoaded&&<SliderWithTooltip loaded={loaded} videoRef={videoRef} timeStampRef={timeStampRef} slideBarRef={slideBarRef} thumbRef={thumbRef} url={state.video.LQ} getTime={getTime} />}
      <div className="side left">
    {replay && <div className='icon-container' onClick={()=>toggleVideo("replay")}><Replay className='icon' /></div>}
    {!replay && !playing&&<div className='icon-container' onClick={()=>toggleVideo("play")}><PlayArrow className='icon'/></div>}
    {!replay && playing&&<div className='icon-container' onClick={()=>toggleVideo("pause")}><Pause className='icon'/></div>}
 {VideoLoaded&& <div ref={timeRef} className="time">00:00/00:00</div>}
    <VolumeSlider value={VolumesliderValue} setValue={setVolumesliderValue} videoRef={videoRef}/>
      </div>
      <div className="side right">
    <Replay10 className='icon'onClick={()=>handleSkip('backward')}/>
    <Forward10 className='icon'onClick={()=>handleSkip('forward')}/>
    <div className="settings-container" >
    <div className="settings">
{showSettings&&<div className="options">
  {settingsOptions.map((v,i)=>{

 return <div key={i} className="option" onClick={()=>toggleQualitySettings(i,v.number)}>
   {v.checked?<CheckCircle className='icon'/>:<RadioButtonUnchecked  className='icon'/>} 
    <div className='name'>{v.name}</div>
  </div>
  })}
</div>}
    <SettingsApplications className='icon' onClick={()=>toggleOptions()} />
      </div>
    </div>
      </div>
    </div>
  </div>
  )
}

export default Video
