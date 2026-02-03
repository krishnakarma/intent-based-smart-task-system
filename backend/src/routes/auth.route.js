import { Router } from "express";
import { signup } from "../controllers/auth.controller.js";
const router = Router();

//signUp 
router.post("/signup" , signup);
//login
router.post("/login" ,(req , res)=>{
    res.json({message: "Login route hit"})
})

export default router;