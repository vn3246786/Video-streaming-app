import React, { useEffect,useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import {UserContext} from "../../Contexts/UserContext/UserContext"
import {AuthContext} from "../../Contexts/AuthContext/AuthContext"
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { searchUsers } from '../../Contexts/UserContext/apiCalls'
import { useContext } from 'react'
import"./users.scss"
import CustomSearchFliter from '../../components/CustomSearchFliter/CustomSearchFliter'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { checkTokenExpiry } from '../../RefreshToken'


const Users = () => {

const { UserDispatch, UserList,UserListLoading } = useContext(UserContext)
const { User } = useContext(AuthContext)
const { accesstoken,accesstokenDispatch } = useContext(AccessTokenContext)

const [sort, setSort] = useState(1)
const [rowSize, setRowSize] = useState(3)
const [lastRowId, setLastRowId] = useState(null)
const [navigation, setNavigation] = useState(null)
const [page, setPage] = useState(1)
const [admin, setAdmin] = useState("")
const[searchKeyword,setSearchKeyWord]=useState(null)
const [autoComplete,setAutoComplete]=useState({loading:false,
  data:null,
  error:null
})
const[searchterm,setSearchTerm]=useState(null)

const totalPages = UserList && Math.ceil(UserList[1] / rowSize)

function handleClick(keyword){
setSearchTerm(keyword)
setLastRowId(null)
setAutoComplete({loading:false,
  data:null,
  error:null
})
}

function clearSearch(){
  setSearchTerm(null)
  setAutoComplete({loading:false,
    data:null,
    error:null
  })
}

function handleChange(e){
  e.preventDefault()
  setSearchKeyWord(e.target.value)
    }

useEffect(()=>{
 function getsSuggestions(){
  const ApiCalls = [
    {
      func:searchUsers,
      params:[
        searchKeyword,setAutoComplete
      ]
    }
  ]
  checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
}
 
searchKeyword && getsSuggestions()
},[searchKeyword])


function setFilters(type) {
  
  switch (type) {
    case "latest":
      setSort(-1)
      setLastRowId(null)
      setNavigation(null)
      setPage(1)
      break;
    case "oldest":
      setSort(1)
      setLastRowId(null)
      setNavigation(null)
      setPage(1)
      break;
    case "admin-true":
      setAdmin("true")
      setLastRowId(null)
      setNavigation(null)
      setPage(1)
      break;
    case "admin-false":
      console.log("d")
      setAdmin("false")
      setLastRowId(null)
      setNavigation(null)
      setPage(1)
      break;
    case "admin-none":
      setAdmin(null)
      setLastRowId(null)
      setNavigation(null)
      setPage(1)
      break;


  }
}

  function navigatePage(p) {
    switch (p) {
      case "next":
        if (page === totalPages) {
          return
        } else {
          setPage(page + 1)
          setNavigation("next")
          setLastRowId(UserList[0][UserList[0].length - 1]._id)
        }
        break;
      case "back":
        if (page === 1) {
          return
        } else {
          setPage(page - 1)
          setNavigation("back")
          setLastRowId(UserList[0][0]._id)
        }
        break;
      case "last":
        if (page === totalPages) {
          return
        } else {
          setPage(totalPages)
          setNavigation("last")
          setLastRowId(null)
        }
        break;
      case "first":
        if (page === 1) {
          return
        } else {
          setPage(1)
          setNavigation(null)
          setLastRowId(null)
        }
        break;
    }
  }


  return (
    <div className='users'>
      <Navbar/>
      <div className="flex-container">
      <Sidebar current="Users"/>
      <div className="table-container">
      <CustomSearchFliter handleChange={handleChange} autoComplete={autoComplete} handleClick={handleClick} clearSearch={clearSearch}/>
      <DataTable type="usersList" setFilters={setFilters} navigatePage={navigatePage} setRowSize={setRowSize}
     page={page} data={UserList} dispatch={UserDispatch} User={User}
      sort={sort} rowSize={rowSize} lastRowId={lastRowId} navigation={navigation} admin={admin} 
      loading={UserListLoading} searchterm={searchterm} height='79vh'/>
      </div>
      </div>   
    </div>
  )
}

export default Users 
