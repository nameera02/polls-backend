import mongoose from "mongoose";

const schema=new mongoose.Schema({
user_id:{
    type:String,
    required:[true,"User id not found"]
},
question:{
    type:String,
    required:[true,"question is required"]
},
votes:{
    type:Number,
},
createdAt:{
    type:Date,
    default:Date.now
},
image:{
    type:String,
}
});

export const Polls=mongoose.model("Polls",schema);