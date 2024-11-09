const router = require('express').Router()
const verify = require('../VerifyToken')
const User = require('../Models/User')
const crypto = require("crypto-js")
const MONTHS = require("../Variables")
const jwt = require('jsonwebtoken')
const multer  = require('multer')
const  {updateFirebaseStorage}  = require('../upload')
const firebaseStorage = require('../firebase')
const { ref,deleteObject } = require('firebase/storage')

const storage = multer.memoryStorage()
 const upload = multer({ storage: storage })

router.get("/search",verify,async(req,res)=>{
    if( req.user.isAdmin===true){
        try {
              
              const users = await User.aggregate([
          {
  $search: {
        index:"searchuser",
    autocomplete: {
      query: req.query.search,
      path: "username" 
    }
  }
}  ])        
        res.json(users)
       
        } catch (error) {
            res.json(error)
      
        }    
    }else res.json("you are not authorised")
})


router.get("/watchlist/:id",verify,async (req,res)=>{
    if(req.user.id===req.params.id){
        try {
            const data = await User.findById(req.params.id,{watchlist:1})
            const {watchlist}=data
           res.json(watchlist)
        } catch (error) {
            res.json('server error')
            
        }
    }else  res.json('you are not authorized')
})


router.get('/get-ratings',verify,async(req,res)=>{
    try {
        const user = await User.findById(req.user.id)
        const {ratings,...rest}=user
        res.json(ratings)
    } catch (error) {
        res.json('server error')
    }
})


router.put("/watchlist/:id/",verify,async (req,res)=>{
    if(req.user.id===req.params.id){
        if(req.body.type==='add'){
            try {
                const data = await User.findByIdAndUpdate(req.params.id,{$push:{watchlist:req.body.movie}},{new:true})
                const {watchlist}=data._doc
               res.json(watchlist)
            } catch (error) {
                res.json('server error')
                
            }
        }else{
        try {
            const data = await User.findByIdAndUpdate(req.params.id,{$pull:{watchlist:req.body.movie}},{new:true})
            const {watchlist}=data._doc
           res.json(watchlist)
        } catch (error) {
            res.json('server error')
            
        }}
    }else  res.json('you are not authorized')
})



router.get("/",verify, async (req,res) => {
    if (req.user.isAdmin === true)
  {  const newUsers = req.query.latest?true:false
    const rowSize = parseInt(req.query.rowSize)
 const sort = parseInt(req.query.sort)
 const lastRowId = req.query.lastRowId
 const navigation = req.query.navigation
 const search = req.query.search
   const admin = req.query.admin


   function getUsersList(count,total){
    function getSort(){
        if(sort===1&&navigation==="back"){
            return-1
        }else if(sort===-1&&navigation==="back"){
            return 1
        }else if(navigation==="last") {
            return sort===-1?1:-1
        }else return sort 
    }
    let Filters =[{$sort:{"_id":getSort()}}]

    let match =null
    function pageNavigation(){
        if(sort===1){
    (navigation==="next"?(match = {...match,$expr:{$gt:["$_id",{$toObjectId:lastRowId}]}}):
    (match = {...match,$expr:{$lt:["$_id",{$toObjectId:lastRowId}]}}))
        }else{
            (navigation==="next"?(match = {...match,$expr:{$lt:["$_id",{$toObjectId:lastRowId}]}}):
    (match = {...match,$expr:{$gt:["$_id",{$toObjectId:lastRowId}]}}))
        }
    }
     admin && (match = {...match,isAdmin:admin==="true"?true:false})
     search &&(match = {...match,username:search})
   
     let lastpageLimit
     !count &&  (lastpageLimit = total[0].total%rowSize)

  !count &&  lastRowId && pageNavigation()
    match && Filters.unshift({$match:match})
    !count && Filters.push({$limit:navigation==='last'?lastpageLimit===0?rowSize:lastpageLimit:rowSize})
count && Filters.push({$count:"total"})
    return Filters
      
    }

    try {
        const total =(newUsers===true|| search)?[{total:5}]:await User.aggregate(getUsersList(true))
    const user =  newUsers ? await User.find({},{password:0}).sort({createdAt : -1}).limit(5)
     :total&& await User.aggregate(getUsersList(false,total)) 

     function getTotal(){
        if(total.length===0||total===undefined){
            return 0
        }else return total[0].total
    }

function getUserOrder(){
    if(sort===1&&navigation==="back"){
        return user.reverse()
    }else if(sort===-1&&navigation==="back"){
          return user.reverse()
    }else if (navigation==="last"){
        return user.reverse()
    }else return user
}

    res.json([ getUserOrder(),getTotal()])
    } catch (error) {
        res.status(500).json("server error")
        console.log(error)
    }}
    else{
        console.log("a")
        res.json("you are not authorized")
    }
})



router.get("/stats/:year",verify, async (req,res) => {
    if (req.user.isAdmin)
  { 

    const year = parseInt(req.params.year) 
   
    try {
    const data = await User.aggregate([
        { $project :{ year : {$year : "$createdAt"}, month : {$month : "$createdAt"}} },
        {$match : {year : year}},
        {$group : {_id : "$month" , total : {$sum : 1}}},
        {$sort : { "_id" : 1}}     
    ])
   
function GetStats (){
    return data.map((user)=>{
return {Month :MONTHS[user._id] ,Total:user.total}
})}
const userStats = GetStats()


res.json(userStats)

    } catch (error) {
        res.status(500).json("server error")
       
    }

    }

    else{
        res.json("you are not authorized")
    }
})


router.delete("/delete/:id" ,verify, async (req , res) => {

if(req.user.id === req.params.id || req.user.isAdmin === true) {
    const user = await User.findById(req.params.id)
    if(user.profilePic){
        const imageRef = ref(firebaseStorage,req.body.profilePic)
        deleteObject(imageRef).then( async () => {
            try {
                await User.findByIdAndDelete(req.params.id)
                res.json("user successfully deleted")
            } catch (error) {
                res.status(500).json("server error")
            }
        }).catch(error=>{
            console.log(error)
            res.status(500).json("server error")
        })
        
    }else{
        try {
            await User.findByIdAndDelete(req.params.id)
            res.json("user successfully deleted")
        } catch (error) {
            res.status(500).json("server error")
        }
    }
  
}else{
    res.status(400).json("you are not authorized")
}
})



router.put("/update/:id" , verify ,upload.single("profilePic"),async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){  
        if(req.file){
            console.log(req.file)
updateFirebaseStorage(req,res,User)
        }else{
            try{
                const currenttime = new Date
                const {subscription_details,payment_status,...rest}=req.body 
            const user = await User.findByIdAndUpdate(
                req.params.id, 
                rest, 
                {new : true})
                const { password , ...info} = user._doc
                const accessToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status,generatedAt:currenttime.getTime()}, process.env.JWT_ACCESSTOKEN_KEY,{expiresIn:"300s"} )
                   const refreshToken = jwt.sign({id : user._id , isAdmin : user.isAdmin,payment_status:user.payment_status}, process.env.REFRESH_TOKEN_SECRET_KEY)
                   res.cookie("refreshToken",refreshToken,{httpOnly:true ,sameSite:"none",secure:true})
            res.status(200).json(req.user.id === req.params.id?{...info,accessToken}:"user updated successfully")
            }catch(error){
                if(error.code===11000){
                    if(error.keyPattern.username){
              res.json("username already exists")
                    }else res.json("email already exists")
                  }else 
                  console.log(error)
                  res.json("server error")
            }
        }
    }else{
res.status().json("you are not authorized")
    }
})


router.get('/subscription-details/:id' ,verify, async(req,res)=>{
    try {
        const user = await User.findById(req.params.id,{password:0})
const {subscription_details,...rest}=user._doc
res.json(subscription_details)
    } catch (error) {
        console.log(error)
        res.json("server error")
    }
})


router.put('/update-recommendations',verify,async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.user.id,{
            recommendations:req.body.recommendations
        },{new:true})
        res.end()
    } catch (error) {
        console.log(error)
        res.end()
    }
})



module.exports = router