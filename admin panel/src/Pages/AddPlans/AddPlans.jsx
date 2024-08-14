import React, { useContext, useRef, useState } from 'react'
import "./addPlans.scss"
import Navbar from "../../components/Navbar/Navbar"
import Sidebar from "../../components/Sidebar/Sidebar"
import { FileUpload } from '@mui/icons-material'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../Firebase'
import CircularProgressWithLabel from '../../components/CircularProgressWithLabel'
import {AuthContext} from "../../Contexts/AuthContext/AuthContext"
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { addPlan } from './apiCalls'
import {checkTokenExpiry} from '../../RefreshToken'
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify'

const AddPlans = () => {

const option =[
    {name:"Day",
        value:"day"
    },
    {name:"Month",
        value:"month"
    },
    {name:"Year",
        value:"year"
    },
    {name:"Week",
        value:"week"
    },
]



const[plan,setPlan]=useState({
})

const[status,setStatus]=useState({loding:false,
  data:null,
  error:null
})
const[image,setImage]=useState(null)
const[UploadImageStatus,setUploadImageStatus]=useState(0)
const {User}=useContext(AuthContext)
const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)


function uploadFiles(){
   if(image===null){
return
   }
  const storageRef = ref(storage, `plan-image/${image.name}` );
  const uploadTask = uploadBytesResumable(storageRef,image);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadImageStatus(progress)
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
       setPlan((p)=>{
        return {...p,image:downloadURL}
       })
      });
    }
  );
  } 


function handleclick(event){
setPlan((p)=>{
  return {...p,[event.target.name]:event.target.value}
})
}

function add(){
  const ApiCalls = [
    {func:addPlan,
      params:[
        setStatus,
        plan
      ]
    }
  ]
  if(!plan.name){
toast.warning("name is required")
  }else if(!plan.discription){
    toast.warning("discription is required")
  }else if(!plan.price){
    toast.warning("price is required")
  }else if(!plan.currency){
    toast.warning("currency is required")
  }else if(!plan.interval){
    toast.warning("interval is required")
  }else if(!plan.image){
    toast.warning("image is required")
  }else{
    checkTokenExpiry(accesstoken,accesstokenDispatch,ApiCalls)
  }
}


  return (
    <div className='addPlans'>
      {status.loding&&<CircularProgress className='spinner' size={70}/>}
        <Navbar/>
        <div className="flex-container">
            <Sidebar current='Add Plans' dropdown='Plans'/>
            <div className="update-container">
            <div className="input-container">
                <div className="title">Name</div>
                <input className='input'name='name' type="text" onChange={(e)=>handleclick(e)} placeholder='Name'/>
            </div>
            <div className="input-container">
                <div className="title">Discription</div>
                <textarea className='input' name='discription' onChange={(e)=>handleclick(e)} type="text" placeholder='Discription'/>
            </div>
            <div className="input-container">
                <div className="title">Price</div>
                <input className='input' name='price' type="text" onChange={(e)=>handleclick(e)} placeholder='Price'/>
            </div>
            <div className="input-container">
                <div className="title">Currency</div>
                <input className='input' name='currency' type="text" onChange={(e)=>handleclick(e)} placeholder='Currency'/>
            </div>
            <div className="input-container">
                <div className="title">Interval</div>
                <select name="interval" id=""  onChange={(e)=>handleclick(e)} >
                    {option.map((data,i)=>{
                        return  <option key={i} value={data.value} >{data.name}</option>
                    })}
                </select>
            </div>
            <div className="input-container-image">
                <label className='image-label' htmlFor="input">choose Image</label>
                <input className='input-image' id='input' type="file" onChange={(e)=>setImage(e.target.files[0])}/>
           {image&& <img src={image?URL.createObjectURL(image):""} className='image' alt="" />}
            </div>
            <div className="btn-container">
            <button className='button-Upload' onClick={(e)=>uploadFiles(e)}>
        <FileUpload/>
        Upload
        </button>
        <CircularProgressWithLabel value={UploadImageStatus}/>
            </div>
            <button className='add' onClick={()=>add()}>Add Plan</button>
        </div>
        </div> 
    </div>
  )
}

export default AddPlans
