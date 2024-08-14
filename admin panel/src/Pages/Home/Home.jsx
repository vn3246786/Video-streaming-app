import React, { useContext, useEffect, useRef, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Linechart from '../../components/Charts/LineChart/Linechart'
import './home.scss'
import DataTable from '../../components/DataTable/DataTable'
import Navbar from '../../components/Navbar/Navbar'
import { years } from '../../Variables'
import { AuthContext } from '../../Contexts/AuthContext/AuthContext'
import { UserContext } from '../../Contexts/UserContext/UserContext'
import { AccessTokenContext } from '../../Contexts/AccessTokenContext/AccessTokenContext'
import { checkTokenExpiry } from '../../RefreshToken'
import { getstats } from './apicalls'

const Home = () => {
 const {User}=useContext(AuthContext)
 const {UserList,UserDispatch}=useContext(UserContext)
 const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)


 const[NewYear,setNewYear]=useState(new Date().getFullYear())

function handleChange(e){
  setNewYear(e.target.value)

}

const[stats,setstats]=useState({
  loading:false,
  error:null,
  data:null
})

 useEffect(()=>{
  const ApiCalls=[
    {
      func:getstats,
      params:[
        setstats,NewYear
      ]
    }
  ]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
 },[NewYear])


  return (
    <div  className='home'>
      <Navbar/>
      <div className="container-all">
      <Sidebar current="Home"/>
        <div className="container-analytics">
          <select name="" id="" onChange={(e)=>handleChange(e)} >
{years.map((year,i)=>{
  return <option key={i}  value={year}>{year}</option>
})}
          </select>
      <Linechart data = {stats.data}/>
    <DataTable  type="latestUsers"  dispatch={UserDispatch}
    data={UserList} height='350px'/>
        </div>
      </div>
    </div>
  )

};

export default Home
