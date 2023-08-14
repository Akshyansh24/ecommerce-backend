import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // Validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!phone) {
      return res.send({ message: "Mobile Number is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }

    // Existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered. Please Login",
      });
    }

    // Register User
    const hashedPassword = await hashPassword(password);

    // Save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successful",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};


// POST LOGIN
export const loginController = async (req,res) =>{

    try {
        const { email, password } = req.body;

        if(!email || !password){
            res.status(404).send({
                success: false,
                message: "Invalid Email & Password",
              });
        }


        // check user
        const user  = await userModel.findOne({email});
        console.log(user);
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Email Not Register",
              });
        }

        // compare passwrod and request userpassword
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
              });
        }

        // Token Generate
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})
        res.status(201).send({
            success: true,
            message: "Login Successful",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token,
          });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in registration",
            error,
          });
    }
};

// Forget Password Controller

export const forgetPasswordController = async (req, res) =>{
  try {
    const {email, answer, newpassword} = req.body;
    if(!email){
      res.status(400).send({
        message:"Email is Required"
      })
    }
    if(!answer){
      res.status(400).send({
        message:"Answer is Required"
      })
    }
    if(!newpassword){
      res.status(400).send({
        message:"New Password is Required"
      })
    }

    // check email and asnwer
    const user = await userModel.findOne({email, answer})

    // Validation
    if(!user){
      res.status(404).send({
        success:false,
        message:"wrong Email or answer"
      })
    }

    // password hash
    const hashed = await hashPassword(newpassword)
    await userModel.findByIdAndUpdate(user._id,{password:hashed})
    res.status(200).send({
      success:true,
      message:"Password Reset Successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Something Went Wrong"
    })
  }
}



// test controller
export const testController = (req, res) =>{
        res.send("Protected");
}

// Update controller

export const updateProfileController = async(req, res) => {
  try {
    const {name, email , address, phone} = req.body;
    const user = await  userModel.findById(req.user._id);

    const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
      name:name || user.name,
      password:user.password,
      phone: phone || user.phone,
      address: address || user.address,
      email: email || user.email
    },{new:true});
    res.status(200).send({
      success:true,
      message:"Profile Update Successfull",
      updatedUser
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Something Went While Updating",
      error,
    })
  }
}