import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./sidebarMenu.scss"

const SidebarMenu = ({data , ToggleDropdown,logOut}) => {
  
  const navigate = useNavigate()

function handleClick(name){
if(name==="Log Out"){
  logOut()
navigate('/')
}else return
}

    return ( <div className="sidebarMenu"> { !data.subInfo?
<Link to={data.to} >
  <div className="wrapper" style={{backgroundColor:data.selected&&'#1b1932'}} onClick={()=>handleClick(data.name)} >
      {data.icon}
     <div className="name" style={{color:data.selected?'white':'#bccdcf'}}>{data.name}</div>
  </div>
    </Link>
     : 
     <div className="container">
      <div className="wrapper" onClick = {ToggleDropdown}>
     {data.icon}
    <div className="name" >{data.name} </div>
      </div>
    {data.dropdown&& data.subInfo.map((info,i)=>{
        return  <Link to={info.to} key={i} >
          <div  className="subWrapper"  style={{backgroundColor:info.selected&&'#1b1932'}} >
          {info.icon}
          <div className="subName" style={{color:info.selected?'white':'#bccdcf'}}>{info.name}</div>
          </div>
        </Link>  
    
})}
</div>
}
</div>)
}

export default SidebarMenu
