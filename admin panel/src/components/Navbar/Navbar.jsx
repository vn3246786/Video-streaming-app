import React, { useState,} from 'react'
import "./navbar.scss"
import { AccountCircle, Search } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate =useNavigate()
  const[searchterm,setSearchtrem]=useState(null)

const searchSuggestions =[
  {name:'Home',
    to:'/'
  },
  {name:'Users',
    to:'/Users'
  },
  {name:'All products',
    to:'/Products'
  },
  {name:'Add products',
    to:'/Products/add'
  },
  {name:'All lists',
    to:'/Lists'
  },
  {name:'Add lists',
    to:'/lists/add'
  },
  { name : "All Plans",
    to : "/Plans"
  },
  {  name: "Add Plans",
      to : "/Plans/add"
  }
]

function handleChange(term){
setSearchtrem(term)
}

  return (
    <div className='navbar'>
      <div className="leftside">
<div className="userlogo" onClick={()=>navigate('/profile')}>
<Tooltip title="profile" arrow>
<AccountCircle/>
</Tooltip>
</div>
      </div>
      <div className="rightside"> 
        <div className="searchbar">
        <input className='input' onChange={(e)=>handleChange(e.target.value)} type="text" />
        <Search/>
       </div>
       <div className="suggestions">
       {searchterm&&searchSuggestions.map((value,i)=>{
        if(value.name.toLocaleLowerCase().includes(searchterm.toLocaleLowerCase())){
       return <Link className='link' to={value.to} key={i}>
       <div className="options">{value.name}</div>
       </Link>
        }else return
       })}
       </div>
      </div>
    </div>
  )
}

export default Navbar
