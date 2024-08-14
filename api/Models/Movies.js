const mongoose = require('mongoose')

const moviesSchema = new mongoose.Schema({
    title : {type : String} ,
   image : {type : String },
    video : {type : Object},
    year:{type:Number},
    isSeries : {type : Boolean},
    discription : {type : String},
    genre :{type : Array},
    ratings:{type:Object,default:{totalRatings:0,
        totalUsers:0
    }}
},{timestamps : true},

)



module.exports = mongoose.model('movies', moviesSchema)

