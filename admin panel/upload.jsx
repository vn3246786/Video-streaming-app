import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./src/Firebase";



export function uploadToFirebase(foldername,value,setUploadImageStatus,setUploadVideoHQStatus,setUploadVideoLQStatus,setProduct){
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
          if(value.name==='image'){
            setProduct((v)=>{
              return {...v,[value.name]:downloadURL}
            })
          }else setProduct((v)=>{
            return {...v,video:{...v.video,[value.type]:downloadURL}}
          })
        });
      }
    );
    
}
