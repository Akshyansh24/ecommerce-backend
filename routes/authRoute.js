import express from "express";
import { registerController, loginController, forgetPasswordController, testController, updateProfileController } from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";
const router = express.Router();


router.post('/register', registerController);

// LOGIN || POST
router.post('/login', loginController);

// Forget Password
router.post('/forget-password', forgetPasswordController);

// test routes
router.get('/test', requireSignIn , isAdmin , testController)


// Protected Route auth
router.get('/userauth', requireSignIn ,(req, res)=>{
    try {
        res.status(200).send({ok:true});
    } catch (error) {
        console.log(error);
    }
})

// Protected Route For Admin
router.get('/adminauth', requireSignIn , isAdmin, (req, res)=>{
    try {
        res.status(200).send({ok:true});
    } catch (error) {
        console.log(error);
    }
})

// Update Profile
router.put('/update-profile', requireSignIn, updateProfileController )
export default router