import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { async } from "rxjs";


// Protected Routes token base

export const requireSignIn = async(req, res, next)=>{
    try {
        const decode  = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        // res.status(201).send("Token Verify Successfull");
        next();
        
    } catch (error) {
        console.log(error);
        // res.status(404).send("Token NOt Verify");
    }
}

// admin access

export const isAdmin = async (req, res, next)=>{
    try {
        const user  = await userModel.findById(req.user._id);
        if(user.role !== 1){
           return res.status(401).send({
                success: false,
                message: "Unauthorized Access",
              });
        }else{
            next();
        }
        
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error in admin Middleware",
            user,
          });
    }
} 
