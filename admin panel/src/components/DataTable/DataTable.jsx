import {  useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import "./DataTable.scss"
import {  CheckCircle, Delete, Edit, FirstPage, LastPage, NavigateBefore, NavigateNext, RadioButtonUnchecked } from '@mui/icons-material';
import { AccessTokenContext} from '../../Contexts/AccessTokenContext/AccessTokenContext';
import { Link } from 'react-router-dom';
import { adminStatus, AllLists, AllMovies, AllUsers, deleteList, deleteMovie, LatesUsers, removeUser } from './apiCalls';
import CircularProgress from '@mui/material/CircularProgress';
import defaultImage from "../../assets/default-profile.png"


function CustumFooter({ page, navigatePage, setRowSize,rowSize }) {

  return (<div className="pagination">
    <div className="rowSelect">
      <label className='label'>rowsize</label>
      <select name="" value={rowSize} onChange={(e) => setRowSize(e.target.value)} className='select' id="">
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="50">50</option>
      </select>
    </div>
    <div className="wrapper">
      <FirstPage onClick={() => navigatePage("first")} className='icons' />
      <NavigateBefore onClick={() => navigatePage("back")} className='icons' />
      <div className="pageNumber">{page}</div>
      <NavigateNext onClick={() => navigatePage("next")} className='icons' />
      <LastPage onClick={() => navigatePage("last")} className='icons' />
    </div>
  </div>)
}


export default function DataTable({ type,navigatePage,setRowSize,setFilters,height,
   page, data, dispatch, sort, rowSize, lastRowId, navigation, admin,series,genre,loading,searchterm}) {

    const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)


    useEffect(() => {
      type === "latestUsers" && LatesUsers(dispatch,accesstoken,accesstokenDispatch)
      type === "usersList" && AllUsers(dispatch, sort, rowSize, admin, lastRowId, navigation,searchterm,accesstoken,accesstokenDispatch)
        type==="movieslist"&& AllMovies(dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,accesstoken,accesstokenDispatch)
        type==="lists"&& AllLists(dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,accesstoken,accesstokenDispatch)
    }, [sort, rowSize, lastRowId, navigation, admin,searchterm,series,genre])

  function getColumns() {
    switch (type) {
      case "movieslist":
        return [{
          field: 'title',
          headerName: 'Title',
          disableColumnMenu: true
        },
        {
          field: 'genre',
          headerName: 'Genre',
        },
        {
          field: 'type',
          headerName: 'Type',
        },
        {
          field: 'createdAt',
          headerName: 'Added on',
        },
        {
          field: 'Edit',
          headerName: 'Edit',
          renderCell:(params)=>{
            return (<Link to={'/Products/update'} className='link' state={{value:params.value,sort,rowSize,series,genre,lastRowId,navigation,searchterm,page}}>
            <Edit/>
            </Link> )
          },
          disableColumnMenu: true
        },
        {
          field: 'Delete',
          headerName: 'Delete',
          renderCell:(params)=>{
            return <Delete onClick={()=>deleteMovie(dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,params.value.id,params.value.files,data,accesstoken,accesstokenDispatch)}/>
          },
          disableColumnMenu: true
        }
        ]
      case "lists":
        return [{
          field: 'title',
          headerName: 'Title',
          disableColumnMenu: true
        },
        {
          field: 'genre',
          headerName: 'Genre',
        },
        {
          field: 'type',
          headerName: 'Type',
        },
        {
          field: 'createdAt',
          headerName: 'Added on',
        },
        {
          field: 'Edit',
          headerName: 'Edit',
          renderCell:(params)=>{
          return (<Link to={'/lists/update'} className='link' state={{value:params.value,sort,rowSize,series,genre,lastRowId,navigation,searchterm,page}}>
          <Edit />
          </Link> )
          },
          disableColumnMenu: true
        },
        {
          field: 'Delete',
          headerName: 'Delete',
          renderCell:(params)=>{
            return <Delete onClick={()=>deleteList(dispatch,sort,rowSize,series,genre,lastRowId,navigation,searchterm,params.id,data,accesstoken,accesstokenDispatch)}/>
            },
            disableColumnMenu: true
        }
        ]

      default: return [
        {
          field: 'Profile',
          headerName: 'Profile',
          sortable: false,
          renderCell:(params)=>{
         return <img style={{marginTop:10 ,width:30,height:30,borderRadius:"50%"}} src={params.value} alt="" />
          },
          disableColumnMenu: type==="latestUsers"?true:false
        },
        {
          field: 'username',
          headerName: 'Username',
          sortable: false,
          disableColumnMenu: true
        },
        {
          field: 'email',
          headerName: 'Email',
          width: 200,
          sortable: false,
          disableColumnMenu: true
        },
        {
          field: 'isAdmin',
          headerName: 'Admin',
          sortable: false,
          renderCell:(params)=>{
         return (params.value?<CheckCircle onClick={()=>adminStatus( dispatch, sort, rowSize,admin, lastRowId, navigation,searchterm,!params.value,params.id,type,accesstoken,accesstokenDispatch)}/>:
         <RadioButtonUnchecked onClick={()=>adminStatus( dispatch, sort, rowSize,admin, lastRowId, navigation,searchterm,!params.value,params.id,type,accesstoken,accesstokenDispatch)}/>)
          },
          disableColumnMenu: type==="latestUsers"?true:false
        },
        {
          field: 'subscription',
          headerName: 'Subscription',
          sortable: false,
          renderCell:(params)=>{
         return <div style={{fontSize:"1.5rem",color:params.value==='Active'?"#00ff00":"red"}}>{params.value}</div>
          },
          disableColumnMenu: type==="latestUsers"?true:false
        },
        {
          field: 'plan',
          headerName: 'Plan',
          sortable: false,
          renderCell:(params)=>{
         return <div >{params.value}</div>
          },
          disableColumnMenu: type==="latestUsers"?true:false
        },
        {
          field: 'createdAt',
          headerName: 'created date',
          sortable: false,
          disableColumnMenu: type==="latestUsers"?true:false

        },
        {
          field: 'delete',
          headerName: 'Delete',
          sortable: false,
          renderCell:(params)=>{
          return <Delete onClick={()=>removeUser( dispatch, sort, rowSize,admin, lastRowId, navigation,searchterm,params.value.id,type,params.value.profilePic,accesstoken,accesstokenDispatch)}/>
          },
          disableColumnMenu: type==="latestUsers"?true:false

        }
      ];

    }
  }
  function getRows() {
    if(type==="movieslist"||type==="lists")
      {
        return  data[0].map((movie, i) => {
          return { id: movie._id, title: movie.title, genre: movie.genre, type: movie.isSeries?"Series":"Movie", createdAt: movie.createdAt,Edit:movie,Delete:type==="movieslist"?{id:movie._id,files:[movie.image,movie.video.LQ,movie.video.HQ]}:movie._id}})
      }else
    return data[0].map((user, i) => {
      return { id: user._id,Profile:user.profilePic?user.profilePic:defaultImage, username: user.username, email: user.email,
         isAdmin: user.isAdmin,subscription:user.payment_status?"Active":"Inactive",
       plan:user.payment_status?user.subscription_details.plan:"none",createdAt: user.createdAt,delete:{id:user._id,profilePic:user.profilePic} }
    })
  }

  function CustomColumnMenu(p) {
if(type==="movieslist"||type==="lists"){
  if (p.colDef.field === "type") {
    return (<div className="CustomColumnMenu" >
      <div className="option" onClick={() => setFilters("series-All")} >All</div>
      <div className="option" onClick={() => setFilters("series-true")}>Series</div>
      <div className="option" onClick={() => setFilters("series-false")}>Movie</div>
    </div>)
  } else if(p.colDef.field === "createdAt") {
    return (<div className="CustomColumnMenu" >
      <div className="option" onClick={() => setFilters("latest")}>lastest</div>
      <div className="option" onClick={() => setFilters("oldest")}>oldest</div>
    </div>)
  }else
   return (<div className="CustomColumnMenu" >
  <div className="option" onClick={() => setFilters(null)}>None</div>
  <div className="option" onClick={() => setFilters("Action")}>Action</div>
      <div className="option" onClick={() => setFilters("Adventure")}>Adventure</div>
      <div className="option" onClick={() => setFilters("Drama")}>Drama</div>
      <div className="option" onClick={() => setFilters("Comedey")}>Comedey</div>
      <div className="option" onClick={() => setFilters("Sci-Fi")}>Sci-Fi</div>
      <div className="option" onClick={() => setFilters("Fantasy")}>Fantasy</div>
      <div className="option" onClick={() => setFilters("Horror")}>Horror</div>
      <div className="option" onClick={() => setFilters("Thriller")}>Thriller</div>
      <div className="option" onClick={() => setFilters("Crime")}>Crime</div>
</div>)
}else{
  if (p.colDef.field === "isAdmin") {
    return (<div className="CustomColumnMenu" >
      <div className="option" onClick={() => setFilters("admin-none")} >None</div>
      <div className="option" onClick={() => setFilters("admin-true")}>True</div>
      <div className="option" onClick={() => setFilters("admin-false")}>False</div>
    </div>)
  } else {
    return (<div className="CustomColumnMenu" >
      <div className="option" onClick={() => setFilters("latest")}>lastest</div>
  <div className="option" onClick={() => setFilters("oldest")}>oldest</div>
    </div>)
  }

}
  }


  return (
    <div className="DataTable">
      {loading&&<CircularProgress sx={{color:"white"}} className='spinner' size={70}/>}
      <Box  sx={{ height: height, width: '100%' }}
      >
       <DataGrid
       disableColumnSorting
          slots={{
            columnMenu: CustomColumnMenu, 
          }}
          
          sx={{'& .MuiDataGrid-columnHeader':{backgroundColor:'#1b1932'},
          '& .MuiDataGrid-sortIcon':{color:'white'},
          '& .MuiDataGrid-menuIconButton':{color:'white'},
          '& .MuiDataGrid-filler':{backgroundColor:'#1b1932'},
          color:'white', backgroundColor: "#1b1932" }}
          rows={data? getRows():[]}
          columns={getColumns()}
          hideFooter

        />
        {(type === "usersList"|| type ==="movieslist"||type==="lists") && <CustumFooter page={page} navigatePage={navigatePage} setRowSize={setRowSize} rowSize={rowSize}/>}
      </Box>
    </div>
  );
}
