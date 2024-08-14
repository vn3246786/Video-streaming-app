import React, { useContext, useState } from 'react'
import "./sidebar.scss"
import SidebarMenu from '../SidebarMenu/SidebarMenu'
import { RiMovie2Fill} from "react-icons/ri"
import { IoMdAdd } from "react-icons/io"
import { TbLogout2 } from "react-icons/tb"
import { MdLocalMovies } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { Cottage, People, Subscriptions } from '@mui/icons-material'
import { FaList } from 'react-icons/fa'
import {AuthContext} from '../../Contexts/AuthContext/AuthContext'
import { useNavigate } from 'react-router-dom'


const Sidebar = ({current,dropdown}) => {
const navigate = useNavigate()
    const {AuthDispatch} =useContext(AuthContext)
 
    function logOut(){
        navigate("/")
        sessionStorage.removeItem("User")
        sessionStorage.removeItem("accesstoken")
        AuthDispatch({type:"logout"})
        navigate(0)
      }

    const [SidebarData, setSidebarData] = useState([{
        name : "Home",
        icon : <Cottage className='icons' style={{color:current=='Home'?'white':'#bccdcf'}}/>,
        to : "/",
        selected:current=='Home'?true:false
    },
   {
        name : "Users",
        icon : <People className='icons' style={{color:current=='Users'?'white':'#bccdcf'}}/>,
        to : "/Users",
        selected:current=='Users'?true:false
    },
    {
        name : "Products",
       icon : <RiMovie2Fill className='icons' />,
       dropdown : dropdown=='products'?true:false,
       subInfo : [
        {   
            name : "All Products",
            to : "/Products",
            icon : <MdLocalMovies className='icons' style={{color:current=='All Products'?'white':'#bccdcf'}}/>,
            selected:current=='All products'?true:false
        },
        {
            name: "Add Products",
            to : "/Products/add",
            icon : <IoMdAdd className='icons' style={{color:current=='Add Products'?'white':'#bccdcf'}}/>,
            selected:current=='Add products'?true:false
        }
    ]
    },
    {
       name : "Lists",
       icon :<FaList className='icons'/>,
       dropdown : dropdown=='Lists'?true:false,
       subInfo : [
        {   
            name : "All Lists",
            to : "/Lists",
            icon : <CiViewList className='icons' style={{color:current=='All Lists'?'white':'#bccdcf'}}/>,
            selected:current=='All Lists'?true:false
        },
        {
            name: "Add Lists",
            to : "/Lists/add",
            icon : <IoMdAdd className='icons' style={{color:current=='Add Lists'?'white':'#bccdcf'}}/>,
            selected:current=='Add Lists'?true:false
        }
    ]
       

    },
    {
        name : "Plans",
        icon :<Subscriptions className='icons'/>,
        dropdown : dropdown=='Plans'?true:false,
        subInfo : [
         {   
             name : "All Plans",
             to : "/Plans",
             icon : <CiViewList className='icons' style={{color:current=='All Plans'?'white':'#bccdcf'}}/>,
             selected:current=='All Plans'?true:false
         },
         {
             name: "Add Plans",
             to : "/Plans/add",
             icon : <IoMdAdd className='icons' style={{color:current=='Add Plans'?'white':'#bccdcf'}}/>,
             selected:current=='Add Plans'?true:false
         }
     ]
        
 
     },
    {
       name : "Log Out",
       icon :<TbLogout2 className='icons'/>,
    }
    
    
    ])

    function ToggleDropdown(id,dropdown){
    
        setSidebarData((previousdata)=>{
         return  previousdata.map((data,i)=>{
            if (id===i){
                return {...data,dropdown}
            }
                else return data
            })
        })
       }


  return (
    <div className='sidebar'>
    {
    SidebarData.map((data , i)=>{
       
     return  <SidebarMenu data = {data} key={i} id = {i}  ToggleDropdown = {()=>ToggleDropdown(i,!data.dropdown)} logOut={logOut} />
    })   
}
</div>
  )
}

export default Sidebar
