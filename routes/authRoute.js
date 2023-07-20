import express from "express";
import { registerController, loginController, testController } from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";
const router = express.Router();


router.post('/register', registerController);

// LOGIN || POST
router.post('/login', loginController);

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

export default router