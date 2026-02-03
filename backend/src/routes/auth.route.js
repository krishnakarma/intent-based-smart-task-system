import { Router } from "express";
import { login , signup } from "../controllers/auth.controller.js";
const router = Router();

//signUp 
router.post("/signup" , signup);
router.post("/login" , login);
//login
router.post("/login" ,(req , res)=>{
    res.json({message: "Login route hit"})
})

export default router;