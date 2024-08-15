const router = require('express').Router()
const verify = require('../VerifyToken')
const List = require('../Models/List')
const subscriptionVerification = require('../SubscriptionVerification')



router.post("/" ,verify, async (req,res) => {
    
    if(req.user.isAdmin){
        const newList = new List(req.body)
        try {
          const List = await newList.save()
          res.status(200).json(List)
        } catch (error) {
            console.log(error)
          res.status(500).json("server error")
        }  
    }else{
        res.status(404).json("you are not authorized")
    }
  })


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
  const total = await List.aggregate(getFilters(true))
  const lists =total && await List.aggregate(getFilters(false,total))

function getTotal(){
    if(total.length===0||total===undefined){
        return 0
    }else return total[0].total
}

   function getMoviesOrder(){
    if(sort===1&&navigation==="back"){
        return lists.reverse()
    }else if(sort===-1&&navigation==="back"){
          return lists.reverse()
    }else if (navigation==="last"){
        return lists.reverse()
    }else return lists
}
 
   res.json([getMoviesOrder(),getTotal()])
    } catch (error) {
        res.status(500).json("server error")
    }}
    else{
        res.json("you are not authorized")
    }
})



router.get("/search",verify, async (req,res) => {
    if(req.user.isAdmin===true){
        try {
          
            const lists = await List.aggregate([
               {
                    $search: {
                      index: "searchlists",
                      autocomplete: {
                        query:req.query.search,
                        path:"title"
                      }
                    }
                  }
            ])
    
            res.status(200).json(lists)  
          
        } catch (error) {
            res.status(404).json("server error")
       
        
        }

    }else res.json("you are not authorized")
}
)


router.get("/random" , verify,subscriptionVerification, async (req,res)=> {

    if(req.query.isSeries){
        try {
            const list = await List.aggregate([
               {$match : {isSeries : true}},
               {$sample : {size : 5}} 
            ])
            console.log(list)
            res.status(200).json(list)
         
        } catch (error) {
            res.status(500).json("server error")
     
        }
    }else{

        try {
            const list = await List.aggregate([
               {$match : {isSeries : false}},
               {$sample : {size : 5}} 
            ])
            res.status(200).json(list)
           
        } catch (error) {
            res.status(500).json("server error")
            
        }

    }

})




router.delete("/delete/:id" ,verify, async (req , res) => {

if( req.user.isAdmin ) {
    try {
        await List.findByIdAndDelete(req.params.id)
        res.json("list successfully deleted")
    } catch (error) {
        res.status(500).json("server error")
    }
}else{
    res.status(400).json("you are not authorized")
}
})

router.put("/update/:id" , verify ,async (req, res) => {
    if(req.user.isAdmin === true ){
try{
const list = await List.findByIdAndUpdate(
    req.params.id, 
      req.body, 
    {new : true})
   
res.status(200).json(list)
}catch(error){
res.status(500).json("server error")

}
  }else{
res.status().json("you are not authorized")
    }
})


router.get("/:id",verify,subscriptionVerification, async (req,res) => { 
    try {
        const list = await List.find({_id : req.params.id})
        res.status(200).json(list)  
    } catch (error) {
        res.status(404).json("server error")

    
    }
}
)



module.exports = router