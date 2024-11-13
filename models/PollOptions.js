import mongoose from "mongoose";

const schema=new mongoose.Schema({
option:{
    type:String,
    required:[true,"Poll option not found"],
    maxLength:[60,"Poll option  can't exceed characters"]
},
p_id:{
    type:String,
    required:[true,"Poll option id not found"],
},
createdAt:{
    type:Date,
    default:Date.now
},
});

export const PollOptions=mongoose.model("PollOptions",schema);