import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import  jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncError(async(req,res,next)=>{
const {name,email,password}=req.body;
if(!name || !email || !password) 
    return next(new Error("Please enter all fields"))
let user =await User.findOne({email});
if(user) return next(new Error("User already exist"));

const hashedPassword = await bcrypt.hash(password, 10);

user = await User.create({
    name,email,password:hashedPassword,avatar:{public_id:"tempid",url:"tempurl"},
})
sendToken(res,user,"Registered Successfully",201)
});

export const login = catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password) 
        return next(new Error("Please enter all fields"))
    if (!email || !password) 
        return next(new Error("Please enter all fields"));

    // Find user by email
    let user = await User.findOne({ email }).select("+password");;
    if (!user) {
        return next(new Error("User not found"));
    }
console.log(user);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new Error("Incorrect password"));
    }

    // Generate JWT token (assuming JWT_SECRET is your secret key)
    const token = jwt.sign({ id: user._id,username:user.name,email:user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        success: true,
        message: "Login Successful",
        token,  // Send token back to the frontend
    });
    });