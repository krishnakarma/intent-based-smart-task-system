import { Router } from "express";
const router = Router();

//signUp 
router.post("/signup" ,(req,res)=>{
    res.json({message: "SignUp route hit"})
})

//login
router.post("/login" ,(req , res)=>{
    res.json({message: "Login route hit"})
})

export default router;