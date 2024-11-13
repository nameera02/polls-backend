export const catchAsyncError=(passFunc)=>{
    return (req,res,next)=>{
        Promise.resolve(passFunc(req,res,next)).catch(next);
    }
}