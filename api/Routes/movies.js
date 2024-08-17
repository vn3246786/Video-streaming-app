const router = require('express').Router()
const verify = require('../VerifyToken')
const Movies = require('../Models/Movies')
const subscriptionVerification = require('../SubscriptionVerification')
const { ref, deleteObject } = require('firebase/storage')
const firebaseStorage = require('../firebase')
const User = require('../Models/User')


router.post("/" ,verify, async (req,res) => {
    
    if(req.user.isAdmin){
        const newMovie = new Movies(req.body)
        try {
          const movie = await newMovie.save()
          res.status(200).json(movie)
        } catch (error) {
            console.log(error)
          res.status(500).json("server error")
        }  
    }else{
        res.status(404).json("you are not authorized")
    }
  })

router.get("/random" , verify,subscriptionVerification, async (req,res)=> {
    if(req.query.isSeries){
        try {
            const data = await Movies.aggregate([
               {$match : {isSeries : true}},
               {$sample : {size : 1}} 
            ])
            const movie = data[0]
            res.status(200).json(movie)
        } catch (error) {
            res.status(500).json("server error")
        }
    }else{

        try {
            const data = await Movies.aggregate([
               {$match : {isSeries : false}},
               {$sample : {size : 1}} 
            ])
            const movie = data[0]
            res.status(200).json(movie)
          
        } catch (error) {
            res.status(500).json("server error")
            
        }

    }

})

router.get("/genre/:genre",verify,subscriptionVerification, async (req,res) => {
const series = req.query.isSeries==='true'?true:false
 if (series){
    const genre = req.params.genre
    try {
        const movies = await Movies.aggregate([
            {$unwind : "$genre"},
            {$match :  {genre : genre , isSeries : true}},
            {$sample : {size : 10}} 
           
        ])
        res.json(movies)
        
    } catch (error) {
        res.json("server error")
        
    }
 }else{
    const genre = req.params.genre
    try {
        const movies = await Movies.aggregate([
            {$unwind : "$genre"},
            {$match :  {genre : genre , isSeries : false}},
            {$sample : {size : 10}} 
        ])
       res.json(movies)
     
    } catch (error) {
        res.json("server error")
    }
 }
 
})


router.get('/recommended-movies',verify,subscriptionVerification,async(req,res)=>{
    
    try {
        const user = await User.findById(req.user.id)
        if(user.recommendations&&user.recommendations.length>0){
            const movies = await Movies.find({genre:{$all:user.recommendations.toString().split(',')}}).limit(10)
            res.json(movies)
        }else res.json("no recommendations")
    } catch (error) {
        console.log(error)
    }
})

router.delete("/delete/:id" ,verify, async (req , res) => {

if( req.user.isAdmin === true) {
    const arr = [...req.body.files]
    arr.map((file,i)=>{
      const imageRef = ref(firebaseStorage,file)
      deleteObject(imageRef).then( async () => {
        console.log('file deleted')
  if(i===2){
    console.log("deleted")
      try {
          await Movies.findByIdAndDelete(req.params.id)
          res.json("movie successfully deleted")
      } catch (error) {
          res.status(500).json("server error")
          console.log(error)
      }
  }else return
      }).catch(error=>{
          console.log(error)
          res.status(500).json("server error")
      })
  })
    
}
else{
    res.status(400).json("you are not authorized")
}
})


router.put("/update/:id" , verify ,async (req, res) => {
    if(req.user.isAdmin){
try{
const movie = await Movies.findByIdAndUpdate(
    req.params.id, 
      req.body, 
    {new : true})
   
res.status(200).json(movie)
}catch(error){
res.status(500).json("server error")

}
    }else{
res.status().json("you are not authorized")
    }
})


router.put('/rate/:id',verify,async(req,res)=>{
    const ID = req.user.id
    try {
        const user = await User.findById(ID)
        if(user.ratings.hasOwnProperty(req.params.id)){
         await User.findByIdAndUpdate(ID,
            {$set:{
                [`ratings.${req.params.id}`]:req.body.rating
            }},
            {new:true}
         )
         const newrating=req.body.rating-user.ratings[req.params.id]
        const movie = await Movies.findByIdAndUpdate(req.params.id,{$inc:{"ratings.totalRatings":newrating}},{new:true})
        const {ratings,...rest}=movie
           res.json(ratings)
        }else {
            await User.findByIdAndUpdate(ID,
                {$set:{
                    [`ratings.${req.params.id}`]:req.body.rating
                }},
                {new:true}
             )
           const movie= await Movies.findByIdAndUpdate(req.params.id,{$inc:{"ratings.totalRatings":req.body.rating,"ratings.totalUsers":1}},{new:true})
           const {ratings,...rest}=movie
           res.json(ratings)
        }
        
    } catch (error) {
        console.log(error)
    }
})


router.get("/find/:id",verify,subscriptionVerification, async (req,res) => {
   
    try {
        const movie = await Movies.findById(req.params.id)

        res.status(200).json(movie)  
    } catch (error) {
        res.status(404).json("server error")
        console.log(error)
      
    
    }
}
)

router.get("/search-autocomplete",verify, async (req,res) => {
    try {
        const movies = await Movies.aggregate([
           {
                $search: {
                  index: "searchmovies",
                  autocomplete: {
                    query:req.query.search,
                    path:"title"
                  }
                }
              },
              {
                 $project : { _id : 1 , title : 1  } 
              }
        ])
        res.status(200).json(movies)  
      
    } catch (error) {
        res.status(404).json("server error")

    }
}
)


router.get("/search",verify,subscriptionVerification, async (req,res) => {
    try {
        const movies = await Movies.aggregate([
           {
                $search: {
                  index: "searchmovies",
                  autocomplete: {
                    query:req.query.search,
                    path:"title"
                  }
                }
              },
              
        ])
        res.status(200).json(movies)  
      
    } catch (error) {
        res.status(404).json("server error")

    }
}
)



router.get("/",verify, async (req,res) => {
    if (req.user.isAdmin === true)
  { 
  const rowSize = parseInt(req.query.rowSize)
  const sort = parseInt(req.query.sort)
  const lastRowId = req.query.lastRowId
  const genre = req.query.genre
  const series = req.query.series
  const navigation=req.query.navigation
  const search = req.query.search

function getFilters(count,total){
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
let lastpageLimit
!count &&  (lastpageLimit = total[0].total%rowSize)

 series && (match = {...match,isSeries:series==="true"?true:false})
 genre &&  (match = {...match,genre:genre})
 search && (match={...match,title:search})
!count&& lastRowId && pageNavigation()
match && Filters.unshift({$match:match})
genre && Filters.unshift({$unwind:"$genre"})
!count && Filters.push({$limit:navigation==='last'?lastpageLimit===0?rowSize:lastpageLimit:rowSize})
count && Filters.push({$count:"total"})
return Filters
}
    try {
    const total = await Movies.aggregate(getFilters(true))
   const movies =total&& await Movies.aggregate(getFilters(false,total))
   function getTotal(){
    if(total.length===0||total===undefined){
        return 0
    }else return total[0].total
}

   function getMoviesOrder(){
    if(sort===1&&navigation==="back"){
        return movies.reverse()
    }else if(sort===-1&&navigation==="back"){
          return movies.reverse()
    }else if (navigation==="last"){
        return movies.reverse()
    }else return movies
}
   res.json([getMoviesOrder(),getTotal()])
    } catch (error) {
        res.status(500).json("server error")
        console.log(error)
    }}
    else{
        res.json("you are not authorized")
    }
})



module.exports = router