import mongoose from "mongoose";
import validator from "validator";

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[6,"Password must be at least 6 characters"],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    
    ResetPasswordToken:String,
    ResetPasswordExpire:String,
});

// schema.methods.getJWTToken=function (){
//     return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
//         expiresIn:"15d"
//     })
// }

export const User=mongoose.model("User",schema);