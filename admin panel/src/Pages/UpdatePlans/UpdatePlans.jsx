import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import "./updatePlans.scss"
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { FileUpload } from '@mui/icons-material'
import CircularProgressWithLabel from '../../components/CircularProgressWithLabel'
import {AccessTokenContext} from "../../Contexts/AccessTokenContext/AccessTokenContext"
import { updatePlan } from './apiCalls'
import CircularProgress from '@mui/material/CircularProgress';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../Firebase'
import { checkTokenExpiry } from '../../RefreshToken'
import { toast } from 'react-toastify'

const UpdatePlans = () => {
    const {state} = useLocation()

const {accesstoken,accesstokenDispatch}=useContext(AccessTokenContext)

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

const [response,setResponse]=useState({loading:false,
    data:null,
    error:null
})
const[plan,setPlan]=useState({
  name:state.name,
  discription:state.discription,
  currency:state.currency,
  price:state.price,
  interval:state.interval,
  image:state.image
})

const[image,setImage]=useState(null)
const[UploadImageStatus,setUploadImageStatus]=useState(0)



function uploadFiles(){
    if(image===null){
 return
    }else{
      const url = ref(storage,`${state.image}`)
deleteObject(url).then(() => {
  console.log("deleted")
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
}).catch((error) => {
  console.log(error)
})
    }
   
   } 


   function handleChange(event){
    setPlan((p)=>{
      return {...p,[event.target.name]:event.target.value}
    })
  
    }


function update(){
    const ApiCalls =[
        {
            func:updatePlan,
            params:[
                setResponse,state._id,plan
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
    <div className='updatePlans'>
     {response.loading&& <CircularProgress className='spinner' size={70}/>}
    <Navbar/>
    <div className="flex-container">
        <Sidebar current='All Plans' dropdown='Plans'/>
        <div className="update-container">
        <div className="input-container">
            <div className="title">Name</div>
            <input className='input'name='name'value={plan.name} type="text" onChange={(e)=>handleChange(e)} placeholder='Name'/>
        </div>
        <div className="input-container">
            <div className="title">Discription</div>
            <textarea className='input' name='discription' value={plan.discription} onChange={(e)=>handleChange(e)} type="text" placeholder='Discription'/>
        </div>
        <div className="input-container">
            <div className="title">Price</div>
            <input className='input' name='price'value={plan.price} type="text" onChange={(e)=>handleChange(e)} placeholder='Price'/>
        </div>
        <div className="input-container">
            <div className="title">Currency</div>
            <input className='input' name='currency'value={plan.currency} type="text" onChange={(e)=>handleChange(e)} placeholder='Currency'/>
        </div>
        <div className="input-container">
            <div className="title">Interval</div>
            <select name="interval" id="" value={plan.interval} onChange={(e)=>handleChange(e)} >
                {option.map((data,i)=>{
                    return  <option key={i} value={data.value} >{data.name}</option>
                })}
            </select>
        </div>
        <div className="input-container-image">
            <label className='image-label' htmlFor="input">choose Image</label>
            <input className='input-image' id='input' type="file" onChange={(e)=>setImage(e.target.files[0])}/>
       <img src={image?URL.createObjectURL(image):state.image} className='image' alt="" />
        </div>
        <div className="btn-container">
        <button className='button-Upload' onClick={(e)=>uploadFiles(e)}>
    <FileUpload/>
    Upload
    </button>
    <CircularProgressWithLabel value={UploadImageStatus}/>
        </div>
        <button className='add' onClick={()=>update()}>Update</button>
    </div>
    </div> 
</div>
  )
}

export default UpdatePlans
