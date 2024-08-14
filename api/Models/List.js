const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    title : {type : String },
    isSeries : {type : Boolean},
    genre : {type:Array},
    movies :{type : Array},
},{timestamps : true}
)

module.exports = mongoose.model('list',listSchema)

