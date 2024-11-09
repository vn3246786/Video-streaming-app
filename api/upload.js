const multer  = require('multer')
const firebaseStorage = require('./firebase')
const { ref, uploadBytesResumable, getDownloadURL, deleteObject } = require('firebase/storage')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')


 function firebaseUpload(req, res, User,type) {
  
    const storageRef = ref(firebaseStorage, `profile-image/${req.file.originalname}+${req.params.id}` );
    const metadata = {
        contentType:req.file.mimetype
    }
   const uploadTask = uploadBytesResumable(storageRef,req.file.buffer,metadata);
   
   uploadTask.on('state_changed',
     (snapshot) => {
       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
   
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
       res.json("server error")
       switch (error.code) {
         case 'storage/unauthorized':
           console.log(error)
           break;
         case 'storage/canceled':
           console.log(error)
           break;
   
   
         case 'storage/unknown':
           console.log(error)
           break;
       }
     }, 
     () => {
       getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        const newUser = new User({
          profilePic:downloadURL,
          username : req.body.username,
          email : req.body.email,
          password : crypto.AES.encrypt(req.body.password,process.env.CRYPTO_SECRETE_KEY).toString(),
        
         })
         try {
          const currenttime = new Date
             const user = await newUser.save()
             const {payment_status,password,subscription_details,...rest}=user._doc
             const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY,{expiresIn:"300s"} )
             const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY)
             res.cookie("refreshToken",refreshToken,{httpOnly:true ,sameSite:"none",secure:true})
            type==="admin"?res.json("user successfully registered"):res.json({...rest,accessToken})
         } catch (error) {
          if(error.code===11000){
            if(error.keyPattern.username){
      res.json("username already exists")
            }else res.json("email already exists")
          }else 
          res.json("server error")
         }
       });
     }
   );
  }


 async function updateFirebaseStorage(req, res, User){
    try {
      const user =await User.findById(req.params.id)
      if(user.profilePic){
        const imageRef = ref(firebaseStorage,user.profilePic)
        deleteObject(imageRef).then( () => {
          console.log("deleted")
          const storageRef = ref(firebaseStorage, `profile-image/${req.file.originalname}+${req.params.id}` );
          const metadata = {
              contentType:req.file.mimetype
          }
         const uploadTask = uploadBytesResumable(storageRef,req.file.buffer,metadata);
         
         uploadTask.on('state_changed',
           (snapshot) => {
             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         
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
             res.json("server error")
             switch (error.code) {
               case 'storage/unauthorized':
                 console.log(error)
                 break;
               case 'storage/canceled':
                 console.log(error)
                 break;
               case 'storage/unknown':
                 console.log(error)
                 break;
             }
           }, 
           () => {
             getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              try{
                const currenttime = new Date
        const {subscription_details,payment_status,...rest}=req.body 
            const user = await User.findByIdAndUpdate(
                req.params.id, 
                  {...rest,profilePic:downloadURL}, 
                {new : true})
                const { password , ...info} = user._doc
                const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY,{expiresIn:"300s"} )
                   const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY)
                   res.cookie("refreshToken",refreshToken,{httpOnly:true ,sameSite:"none",secure:true})
            res.status(200).json({...info,accessToken})
            }catch(error){
              if(error.code===11000){
                if(error.keyPattern.username){
          res.json("username already exists")
                }else res.json("email already exists")
              }else 
              res.json("server error")
            }
             });
           }
         );
        }).catch((error) => {
          console.log(error)
        res.json('server error')
        });
      }else{
        const storageRef = ref(firebaseStorage, `profile-image/${req.file.originalname}+${req.params.id}` );
        const metadata = {
            contentType:req.file.mimetype
        }
       const uploadTask = uploadBytesResumable(storageRef,req.file.buffer,metadata);
       
       uploadTask.on('state_changed',
         (snapshot) => {
           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       
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
           res.json("server error")
           switch (error.code) {
             case 'storage/unauthorized':
               console.log(error)
               break;
             case 'storage/canceled':
               console.log(error)
               break;
       
       
             case 'storage/unknown':
               console.log(error)
               break;
           }
         }, 
         () => {
           getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            try{
              const currenttime = new Date
              const {subscription_details,payment_status,...rest}=req.body 
          const user = await User.findByIdAndUpdate(
              req.params.id, 
                {...rest,profilePic:downloadURL}, 
              {new : true})
              const { password , ...info} = user._doc
              const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY,{expiresIn:"300s"} )
                 const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY)
                 res.cookie("refreshToken",refreshToken,{httpOnly:true ,sameSite:"none",secure:true})
          res.status(200).json({...info,accessToken})
          }catch(error){
            if(error.code===11000){
              if(error.keyPattern.username){
        res.json("username already exists")
              }else res.json("email already exists")
            }else 
            res.json("server error")
          }
           });
         }
       );
      } 
    } catch (error) {
      console.log(error)
      res.json('server error')
    }
  }
  



  module.exports ={updateFirebaseStorage, firebaseUpload}

