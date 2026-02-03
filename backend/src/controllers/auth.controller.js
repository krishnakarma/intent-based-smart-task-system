import bcrypt from "bcryptjs"
import User from "../models/user.model.js"

export const signup = async(req , res , next)=>{
    try {
        const {name , email , password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({
                message: "User already exists."
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        res.status(201).json({
            message: "User created successfully",
            userId: user._id,
        })
    } catch (error) {
        next(error)
    }
}
