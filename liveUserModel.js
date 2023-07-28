const mongoose =require('mongoose')

const liveUserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    gender:{
        type:String
    }


},{timestamps:true})

module.exports=mongoose.model('liveUser',liveUserSchema)