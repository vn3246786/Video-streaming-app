import React, { useEffect,useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import {ListsContext} from "../../Contexts/ListsContexts/ListsContext"
import {AuthContext} from "../../Contexts/AuthContext/AuthContext"
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { useContext } from 'react'
import"./lists.scss"
import CustomSearchFliter from '../../components/CustomSearchFliter/CustomSearchFliter'
import { searchLists } from '../../Contexts/ListsContexts/apiCalls'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { checkTokenExpiry } from '../../RefreshToken'
import { useLocation } from 'react-router-dom'

const Lists = () => {
  const {state}=useLocation()

const {ListsDispatch,ListsLoading,Lists} = useContext(ListsContext)
const { User } = useContext(AuthContext)
const { accesstoken,accesstokenDispatch } = useContext(AccessTokenContext)



const [sort, setSort] = useState(state?state.sort:1)
const [rowSize, setRowSize] = useState(state?state.rowSize:3)
const [lastRowId, setLastRowId] = useState(state?state.lastRowId:null)
const [navigation, setNavigation] = useState(state?state.navigation:null)
const [page, setPage] = useState(state?state.page:1)
const [series, setSeries] = useState(state?state.series:null)
const[genre,setGenre]=useState(state?state.genre:null)
const[searchKeyword,setSearchKeyWord]=useState(null)
const [autoComplete,setAutoComplete]=useState({
  loading:false,
  data:null,
  error:null
})
const[searchterm,setSearchTerm]=useState(null)

const totalPages =Lists&& Math.ceil(Lists[1]/ rowSize)


function handleClick(keyword){
setSearchTerm(keyword)
setLastRowId(null)
setAutoComplete({
  loading:false,
  data:null,
  error:null
})
}


function clearSearch(){
  setSearchTerm(null)
}

function handleChange(e){
  e.preventDefault()
  setSearchKeyWord(e.target.value)
    }

useEffect(()=>{
 function getsSuggestions(){
const ApiCalls = [
  {
    func:searchLists,
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
    case "series-true":
      setSeries("true")
      setLastRowId(null)
      setNavigation(null)
      setPage(1)
      break;
    case "series-false":
      setSeries("false")
      setLastRowId(null)
      setNavigation(null)
      setPage(1)
      break;
    case "series-All":
      setSeries(null)
      setLastRowId(null)
      setNavigation(null)
      setPage(1)
      break;
    default:
      setGenre(type)
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
          setLastRowId(Lists[0][Lists[0].length - 1]._id)
        }
        break;
      case "back":
        if (page === 1) {
          return
        } else {
          setPage(page - 1)
          setNavigation("back")
          setLastRowId(Lists[0][0]._id)
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
    <div className='lists'>
      <Navbar/>
      <div className="flex-container">
      <Sidebar current='All Lists' dropdown='Lists'/>
      <div className="table-container">
      <CustomSearchFliter handleChange={handleChange} autoComplete={autoComplete} handleClick={handleClick} clearSearch={clearSearch}/>
      <DataTable type="lists" setFilters={setFilters} navigatePage={navigatePage} setRowSize={setRowSize}
       page={page} data={Lists} dispatch={ListsDispatch} User={User}
      sort={sort} rowSize={rowSize} lastRowId={lastRowId} navigation={navigation} 
      loading={ListsLoading} searchterm={searchterm} genre={genre} series={series} height='79vh'/>
      </div>
      </div>
    </div>
  )
}

export default Lists 
