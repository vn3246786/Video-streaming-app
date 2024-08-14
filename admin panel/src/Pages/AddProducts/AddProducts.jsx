import React, { useContext, useEffect, useRef, useState } from 'react'
import "./addProducts.scss"
import { storage } from '../../Firebase'
import { ArrowBack, ArrowDropDown, ArrowDropUp, CheckCircle, FileUpload,  RadioButtonUnchecked } from '@mui/icons-material'
import { ref,uploadBytesResumable, getDownloadURL  } from 'firebase/storage'
import{AuthContext} from '../../Contexts/AuthContext/AuthContext'
import{AccessTokenContext} from '../../Contexts/AccessTokenContext/AccessTokenContext'
import CircularProgressWithLabel from '../../components/CircularProgressWithLabel'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useNavigate } from 'react-router-dom'
import { addNewMovie } from './apiCalls'
import CircularProgress from '@mui/material/CircularProgress';
import { checkTokenExpiry } from '../../RefreshToken'
import { toast } from 'react-toastify'

const AddProducts = () => {

  const navigate = useNavigate()

  const [Product,setProduct]=useState({
    title:null,
    discription:null,
    isSeries:null,
    year:null,
    image:null,
    video:{LQ:null,HQ:null},
    genre:[]})

  const [Image,setImage]=useState(null)
  const[expand,setExpand]=useState(false)
  const[UploadImageStatus,setUploadImageStatus]=useState(0)
  const[UploadVideoHQStatus,setUploadVideoHQStatus]=useState(0)
  const[UploadVideoLQStatus,setUploadVideoLQStatus]=useState(0)
  const typeRef = useRef()
  const ImageRef = useRef()
  const [VideoHQ,setVideoHQ] = useState(null)
  const [VideoLQ,setVideoLQ] = useState(null)

const {User}=useContext(AuthContext)
const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)

const [response,setResponse]=useState({
  loading:false,
  data:null,
  error:null
})

const [GenreOptions,setGenreOptions]=useState([
  {value:"Action",
   checked:false
  },
  {value:"Adventure",
   checked:false
  },
 {value: "Crime",
 checked:false
 },
 { value:"Comedy",
 checked:false
 },
  {value:"Fantasy",
  checked:false
  },
  {value:"Thriller",
  checked:false
  },
  {value:"Horror",
  checked:false
  },
  {value:"Sci-Fi",
  checked:false
  },
 { value:"Drama",
 checked:false
 },
 { value:"Western",
 checked:false
 }
])

 

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

setGenreOptions((p)=>{
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
 if(e.target.value) { setProduct((v)=>{
      return {...v,[`${e.target.name}`]:e.target.value}
    })}else return
  }

  function addnew(){
  const ApiCalls = [
    {
      func:addNewMovie,
      params:[
        setResponse,Product
      ]
    }
  ]
  if(!Product.title){
toast.warning("title is required")
  }else if(!Product.discription){
    toast.warning("discription is required")
  }else if(!Product.isSeries){
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
    const fileArray = [{name:"image",file:Image},{name:"video", type:'LQ',file:VideoHQ},{name:"video",type:'HQ',file:VideoLQ}]
    // Upload file and metadata to the object 'images/mountains.jpg'
    const foldername = (typeRef.current.value===true?'Series':'Movie')
    let videoArray={}
    fileArray.forEach((value)=>{

  const storageRef = ref(storage, `${foldername} ${value.name}/${value.file.name}` );
  const uploadTask = uploadBytesResumable(storageRef,value.file);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      value.name==="image" && setUploadImageStatus(progress)
      value.name==='video'&& value.type==='HQ'&& setUploadVideoHQStatus(progress)
      value.name==='video'&& value.type==='LQ'&& setUploadVideoLQStatus(progress)
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          console.log(error)
          break;
        case 'storage/canceled':
          // User canceled the upload
          console.log(error)
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          console.log(error)
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log(downloadURL)
        if(value.name==='video'){
          videoArray = {...videoArray,[value.type]:downloadURL}
          setProduct((v)=>{
            return{...v,[value.name]:videoArray}
          })
        }else{ setProduct((v)=>{
          return {...v,[value.name]:downloadURL}
        })}
      });
    }
  );
})

  } 

  return (
    <div className='addProducts'> 
    {response.loading&&<CircularProgress className='spinner' size={70}/>}
    <Navbar/>
    <div className="flex-container">
      <Sidebar current='Add products' dropdown='products'/>
   <div className="form-container">
   <ArrowBack style={{color:'white'}} onClick={()=>navigate(-1)}/>
      <form action="" className='form'>
        <div className="input-container">
          <div className="header">Title</div>
          <input type="text" className='input'onChange={(e)=>handleChange(e)} name="title" placeholder='Title'/>
        </div>
        <div className="input-container">
          <div className="header">Discription</div>
          <textarea className='input discription'onChange={(e)=>handleChange(e)} name="discription"  placeholder='Discription'/>
        </div>
        <div className="input-container">
          <div className="header">Year</div>
          <input type="text" name="year" className='input'onChange={(e)=>handleChange(e)} placeholder='Year'/>
        </div>
        <div className="input-container">
          <div className="header">Type</div>
          <select type="text" ref={typeRef} name="isSeries"onChange={(e)=>handleChange(e)} className='input' id="">
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
{expand&& GenreOptions.map((data,i)=>{
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
      <button  className='button Add' onClick={(e)=>addnew(e)}>Add</button>
      </div> 

   </div>
      </div>
    </div>
  )
}

export default AddProducts
