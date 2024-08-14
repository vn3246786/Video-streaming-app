import React, { useContext, useEffect, useRef, useState } from 'react'
import "./list.scss"
import ListItem from '../ListItem/ListItem'
import { ArrowBackIos, ArrowForwardIos,  } from '@mui/icons-material'


const List = ({list}) => {

 const listitemsref = useRef()
const[ movedNumber , setmovedNumber] = useState(0)
const[ MoviesList , setMoviesList] = useState(getListArray())
 
function getListArray(){

 return list.movies.map((v,i)=>{
    return {data:v,nextToHovered:false}
  })
 
}


 function moveContainer(direction){
   const position = listitemsref.current.getBoundingClientRect().x - 30
  if(direction === 'back' && movedNumber > 0)
   {
   
   listitemsref.current.style.transform = `translateX(${position + 275}px)`
   setmovedNumber(previouNumber => {
    return previouNumber - 1
   })
  }
  if(direction === 'forward' && movedNumber <= MoviesList.length-((window.innerWidth-30)/275) )
  {
  listitemsref.current.style.transform = `translateX(${position - 275}px)`
  setmovedNumber(previouNumber => {
   return previouNumber + 1
  })
 }
}

function handleMouseEvent(index,type){

  if(type==="hover"){
    setMoviesList((p)=>{
       return p.map((v,i)=>{
            if(index===i){
                return {...v,nextToHovered:false}
            }else if(index+1===i){
                return {...v,nextToHovered:true}
            }else  return {...v,nextToHovered:false}

        })
      })
}else{
  setMoviesList((p)=>{
     return  p.map((v,i)=>{
      if(index===i){
        return {...v,nextToHovered:false}
      } else  return {...v,nextToHovered:false}
       })  
})
}
}
  return (
    <div className='list'>
      <div className="title">{list.title}</div>
      <div className="listItemNavigator">
      <ArrowBackIos className='slider back' onClick = {()=> {moveContainer('back')}}/>
      
      <div className="listitems" ref={listitemsref}>
{MoviesList.map((movie,i)=>{
 return <ListItem key={i} id={movie.data.id} nextToHovered={movie.nextToHovered} i={i} onHovered={()=>handleMouseEvent(i,'hover')} onLeave={()=>handleMouseEvent(i,'leave')}  />

})}
      </div>
      <ArrowForwardIos className='slider forward' onClick = {()=> {moveContainer('forward')}}/>
      </div>

    </div>
  )
}

export default List
