const router = require('express').Router()
const User = require('../Models/User')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const verify = require('../VerifyToken')
const OTP = require('../Models/OTP')
const mail = require('../nodemailer')
const Session = require('../Models/Session')
const multer  = require('multer')
const  {firebaseUpload}  = require('../upload')

const storage = multer.memoryStorage()
 const upload = multer({ storage: storage })




router.post('/create-session' ,async(req,res)=>{
  try {
    const user = await User.findOne({email:req.body.email},{watchlist:0})
   if ( !user ) {
     res.json('password is incorrect')}
   else{
     const Bytes = crypto.AES.decrypt(user.password , process.env.CRYPTO_SECRETE_KEY)
    const OriginalPassword = Bytes.toString(crypto.enc.Utf8)
    if(OriginalPassword == req.body.password)
    { 
      const session =await new Session({
        email:req.body.email
    }).save()
  
    res.json(session._id)
    }else {
      res.json('password is incorrect')
    } 

   } 
  } catch (error) {
    res.status(500).json("server error")
    
  }
})



router.post('/register',upload.single("profilePic"), async (req, res) => {

if(req.file){
  firebaseUpload(req, res, User) 
}else{
  const newUser = new User({
    profilePic:req.body.profilePic,
    username : req.body.username,
    email : req.body.email,
    password : crypto.AES.encrypt(req.body.password,process.env.CRYPTO_SECRETE_KEY).toString(),
  
   })
   try {
    const currenttime = new Date
       const user = await newUser.save()
       const {payment_status,password,subscription_details,...rest}=user._doc
       const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY,{expiresIn:"15m"} )
       const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY)
       res.cookie("refreshToken",refreshToken,{httpOnly:true})
       res.json({...rest,accessToken})
   } catch (error) {
    if(error.code===11000){
      if(error.keyPattern.username){
res.json("username already exists")
      }else res.json("email already exists")
    }else 
    res.json("server error")
   }
}
}
)



router.post('/login',async (req, res) => {
  console.log("a=")
  try {
    const user = await User.findOne({email:req.body.email},{watchlist:0})
   if ( !user ) {
     res.json('username or password is incorrect')}
   else{
     const Bytes = crypto.AES.decrypt(user.password , process.env.CRYPTO_SECRETE_KEY)
    const OriginalPassword = Bytes.toString(crypto.enc.Utf8)
    if(OriginalPassword == req.body.password)
    {const currenttime = new Date
      const {password,payment_status,subscription_details, ...info} = user._doc
      const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY ,{expiresIn:'15m'})
      const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY)
      res.cookie("refreshToken",refreshToken,{httpOnly:true})
      res.status(200).json({...info , accessToken})
    }else {
      res.json('username or password is incorrect')
    } 

   }
  
  } catch (error) {
    res.status(500).json("server error")
    
  }
} )


router.post('/admin-login',async (req, res) => {
  try {
    const user = await User.findOne({email:req.body.email},{watchlist:0})
   if ( !user ) {
     res.json('username or password is incorrect')}
   else{
     const Bytes = crypto.AES.decrypt(user.password , process.env.CRYPTO_SECRETE_KEY)
    const OriginalPassword = Bytes.toString(crypto.enc.Utf8)
    if(OriginalPassword == req.body.password)
      {
        if(user.isAdmin){
          const currenttime = new Date
          const {password,payment_status,subscription_details, ...info} = user._doc
          const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY ,{expiresIn:'15m'})
          const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY)
          res.cookie("refreshToken",refreshToken,{httpOnly:true})
          res.status(200).json({...info , accessToken})
        }else res.json("you are not an admin")
       
    }else {
      res.json('username or password is incorrect')
    } 
   }
  
  } catch (error) {
    res.status(500).json("server error")
    
  }
} )


router.get('/get-accesstoken',async(req,res)=>{
  if(req.cookies.refreshToken){
  jwt.verify(req.cookies.refreshToken,process.env.REFRESH_TOKEN_SECRET_KEY,(err,details)=>{
    if(err){
      res.json("invalid token") 

  }else{
    const {iat,...user}=details
    const currenttime = new Date
    const accessToken = jwt.sign({...user,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY ,{expiresIn:'15m'})
    const refreshToken =jwt.sign({...user,generatedAt:currenttime.getTime()},process.env.REFRESH_TOKEN_SECRET_KEY)
    res.cookie("refreshToken",refreshToken,{httpOnly:true})
    res.json(accessToken)
  }
  } )
  }else{
     res.json("accesstoken not found")}
})


router.get("/subscription-succesfull/:id",verify,async(req,res)=>{
  if(req.params.id===req.user.id){
try {
  const currenttime = new Date
  const user = await User.findById(req.params.id)
  const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY,{expiresIn:"15m"} )
 const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY)
 res.cookie("refreshToken",refreshToken,{httpOnly:true})
  res.json(accessToken)
} catch (error) {
  console.log(error)
  res.json("server error")
}
  }else res.json("you are not authorized")
} )


router.post('/create-OTP',async(req,res)=>{
  const getopt =()=>{
     const num = Math.floor((Math.random()+1)*9999)
     if(num===0){
      getopt()
     }else return num
  } 
  const randomNumber = getopt()
  try {
    const otp = new OTP({
      email:req.body.email,
      OTP:randomNumber
    })
    await otp.save()
await mail(req.body.email,"OTP",randomNumber.toString())
res.json(otp._id)
  } catch (error) {
    res.json('server error')
  }
}
)


router.post('/verify-OTP/:id', async(req,res)=>{
  try {
const otp =await OTP.findById(req.params.id)
if(otp.OTP===parseFloat(req.body.OTP)){
  const session =await new Session({
    email:otp.email
  }).save()

  res.json(session._id)
  }else res.json("Wrong otp")
  } catch (error) {
    console.log(error)
    res.json('server error')
  }

})


router.put('/change-password/:id',async (req, res) => {
  const session =await Session.findById(req.params.id)
  if(session){
    try {
      const currenttime = new Date
      const user = await User.findOneAndUpdate({email:session.email},
        { password : crypto.AES.encrypt(req.body.password,process.env.CRYPTO_SECRETE_KEY).toString()})
        const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY,{expiresIn:"15m"} )
        const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY )
        res.cookie("refreshToken",refreshToken)
        res.json({...user,accessToken})
        console.log('success')
    } catch (error) {
      res.status(500).json("server error")  
      console.log(error)
    }
  }else res.json('unauthorized access denied')
 
} )



module.exports = router;


