import React, { useContext, useRef, useState } from 'react'
import './updateProducts.scss'
import { ArrowBack, ArrowDropDown, ArrowDropUp, CheckCircle, FileUpload, RadioButtonUnchecked } from '@mui/icons-material'
import CircularProgressWithLabel from '../../components/CircularProgressWithLabel'
import { storage } from '../../Firebase'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { AuthContext } from '../../Contexts/AuthContext/AuthContext'
import { AccessTokenContext } from '../../Contexts/AccessTokenContext/AccessTokenContext'
import { useLocation, useNavigate } from 'react-router-dom'
import useGenreOptions from '../../Hooks/useGenreOptions'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { updateMovie } from './apiCalls'
import { checkTokenExpiry } from '../../RefreshToken'
import CircularProgress from '@mui/material/CircularProgress';
import { uploadToFirebase } from '../../../upload'
import { toast } from 'react-toastify'


const UpdateMovies = () => {
const {state}=useLocation()
const navigate = useNavigate()


const [response,setResponse]=useState({
  loading:false,
  data:null,
  error:null
})

const[genre,setGenre]=useState(useGenreOptions(state.value.genre))

const [Image,setImage]=useState(state.value.image)
  const[expand,setExpand]=useState(false)
  const[UploadImageStatus,setUploadImageStatus]=useState(0)
  const[UploadVideoHQStatus,setUploadVideoHQStatus]=useState(0)
  const[UploadVideoLQStatus,setUploadVideoLQStatus]=useState(0)

  const typeRef = useRef()
  const ImageRef = useRef()
  const [VideoHQ,setVideoHQ] = useState(state.value.video.HQ)
  const [VideoLQ,setVideoLQ] = useState(state.value.video.LQ)


const {User}=useContext(AuthContext)
const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)

const [Product,setProduct]=useState({
  title:state.value.title,
  discription:state.value.discription,
 year:state.value.year,
 type:state.value.isSeries,
  genre:[...state.value.genre],
  image:state.value.image,
  video:{LQ:state.value.video.LQ, HQ:state.value.video.HQ
}})
 

function handleSelect(index,value,checked){
  
if(checked){
setProduct((p)=>{
  return {...p,genre:[...p.genre.filter((v)=>{
    return v!==value
  })]}
})
 }else setProduct((p)=>{
  return {...p,genre:[...p.genre,value]}
 })

setGenre((p)=>{
  return p.map((data,i)=>{
    if(index===i){
      return {...data,checked:!checked}
    }else return data
    })
}
)
}


function selectFiles(type,value){
if(type==='image'){
  setImage(value)
  setUploadImageStatus(0)
}else if(type==='videoHQ'){
 
  setVideoHQ(value)
  setUploadVideoHQStatus(0)
}else{
setVideoLQ(value)
setUploadVideoLQStatus(0)
}
}

function handleChange(e){
  setProduct((v)=>{
      return {...v,[`${e.target.name}`]:e.target.value}
    })
  }
  function update(e){
const ApiCalls = [
  {
    func:updateMovie,
    params:[
      setResponse,state.value._id,Product
    ]
  }
]  
if(!Product.title){
  toast.warning("title is required")
    }else if(!Product.discription){
      toast.warning("discription is required")
    }else if(Product.isSeries===null){
      toast.warning("type is required")
    }else if(Product.genre.length<1){
      toast.warning("genre is required")
    }else if(!Product.video.LQ){
      toast.warning("lq video is required")
    }else if(!Product.video.HQ){
      toast.warning("hq video is required")
    }else if(!Product.year){
      toast.warning("year is required")
    }else if(!Product.image){
      toast.warning("image is required")
    }else{
 checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
    }
  }


  function uploadFiles(e){
    e.preventDefault()
  let fileArray = []
  Image && (fileArray=[...fileArray,{name:"image",file:Image}])
  VideoLQ && (fileArray=[...fileArray,{name:"video",type:'LQ',file:VideoLQ}])
  VideoHQ && (fileArray=[...fileArray,{name:"video",type:'HQ',file:VideoHQ}])
  const foldername = (typeRef.current.value===true?'Series':'Movie')
  fileArray.forEach((value)=>{
    if(value.name==="image"){
      const deleteRef = ref(storage, `${response.data?response.data.image:state.value.image}`);
      deleteObject(deleteRef).then(() => {
        uploadToFirebase(foldername,value,setUploadImageStatus,setUploadVideoHQStatus,setUploadVideoLQStatus,setProduct)
      }).catch((error) => {
      console.log(error)
      })
    }else{
      const deleteRef = ref(storage, `${response.data?response.data.video[value.type]:state.value.video[value.type]}`);
      deleteObject(deleteRef).then(() => {
        uploadToFirebase(foldername,value,setUploadImageStatus,setUploadVideoHQStatus,setUploadVideoLQStatus,setProduct)
      }).catch((error) => {
        console.log(error)
      })
    }
  })
  } 

  return (
    <div className='updateProducts'> 
    {response.loading&&<CircularProgress className='spinner' size={70}/>}
    <Navbar/>
    <div className="flex-container">
    <Sidebar/>
    <div className="form-container">
    <ArrowBack style={{color:'white'}} onClick={()=>navigate('/Products',{state:state})}/>
    <form action="" className='form'>
      <div className="input-container">
        <div className="header">Title</div>
        <input type="text" value={Product.title} className='input'onChange={(e)=>handleChange(e)} name="title" placeholder='Title'/>
      </div>
      <div className="input-container">
        <div className="header">Discription</div>
        <textarea className='input discription' value={Product.discription}  onChange={(e)=>handleChange(e)} name="discription"  placeholder='Discription'/>
      </div>
      <div className="input-container">
        <div className="header">Year</div>
        <input type="text" name="year" value={Product.year} className='input'onChange={(e)=>handleChange(e)} placeholder='Year'/>
      </div>
      <div className="input-container">
        <div className="header">Type</div>
        <select type="text" value={Product.type?"true":"false"} ref={typeRef} name="isSeries"onChange={(e)=>handleChange(e)} className='input' id="">
          <option value="">choose type</option>
          <option label='Series' value={"true"}>Series</option>
          <option  label='Movie' value={"false"}>Movie</option>
        </select>
      </div>
      <div className="input-container genre">
        <div className="header">Genre</div>
        <div className="select-wrapper"onClick={()=>setExpand(!expand)}>
        <div className="select">select genre</div>
{!expand?<ArrowDropDown/>:<ArrowDropUp/>}
        </div>
{expand&& genre.map((data,i)=>{
return <div key={i} className="genre-wrapper"onClick={()=>handleSelect(i,data.value,data.checked)}>
  <div  className="option">{data.value}</div>
 {!data.checked? <RadioButtonUnchecked className='icon'/>:<CheckCircle  className='icon'/>}
</div>
})}
      </div>
      <div className="input-container">
        <div className="header">Image</div>
        <div className="input-progress">
        <input type="file" ref={ImageRef} className='input'onChange={(e)=> selectFiles('image',e.target.files[0])} name="image" />
<CircularProgressWithLabel value={UploadImageStatus}/>
        </div>
      </div>
      <div className="input-container">
        <div className="header">Video</div>
        <div className="input-progress">
          <label className='label HQ'>LQ</label>
        <input type="file" className='input'onChange={(e)=>selectFiles('videoLQ',e.target.files[0])} name="video" />
        <CircularProgressWithLabel value={UploadVideoLQStatus}/>
        </div>
        <div className="input-progress">
        <label className='label LQ'>HQ</label>
        <input type="file" className='input'onChange={(e)=>selectFiles('videoHQ',e.target.files[0])} name="video" />
        <CircularProgressWithLabel value={UploadVideoHQStatus}/>
        </div>
      </div>
    </form>
   <div className="btns">
   <button className='button Upload' onClick={(e)=>uploadFiles(e)}>
      <FileUpload/>
      Upload
      </button>
    <button  className='button Add' onClick={(e)=>update(e)}>update</button>
    </div> 
    </div>
    </div>
  </div>
  )
}

export default UpdateMovies
