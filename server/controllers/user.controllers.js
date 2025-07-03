import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { inngest } from "../inngest/client.js";


export const signupUser = async(req, res) => {
    const { email, password, skills = [] } = req.body;
    try{
        const hashedPassword = bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password : hashedPassword, 
            skills
        })

        // firing inngest event
        await inngest.send({
            name : "user/signup",
            data : {
                email
            }
        })

        const token = jwt.sign(
            {_id : user._id, role : user.role},
            process.env.JWT_SECRET
        )

        res.json({user, token});

    }catch(err){
        res.status(500).json(
            {
                error : "Signup failed",
                details : err.message
            }
        )
    }
}

export const loginUser = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = User.findOne({ email });
        if(!user){
            return res.status(404).json(
                {
                    error : "User not found",
                }
            )
        }

        const isPasswordMatched = bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(400).json(
                {
                    error : "Invalid Credentials"
                }
            )
        }

        const token = jwt.sign(
            {_id : user._id, role : user.role},
            process.env.JWT_SECRET
        );

        res.json({ user, token });

    } catch (err) {
        res.status(500).json(
            {
                error : "Login failed",
                details : err.message
            }
        )
    }
}


export const logoutUser = async(req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({
                error : "Unauthorized request"
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({ error : "Unauthorized request "});
            }
            res.json({message : "User Logged out successfully"});
        });
    }catch(err){

    }
}


export const updateUser = async(req, res) => {
    const { skills = [], role, email } = req.body;
    try{
        if(req.user?.role !== "admin" || req.user?.role !== "moderator"){
            return res.status(401).json({ error : "You are not authorized to execute that action"});
        }
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({error : "USer not found"});

        await User.updateOne(
            {email},
            {skills : skills.length ? skills : user.skills, role}
        )
        return res.json({ message : "User updated successfully" });
    }catch(err){
        res.status(500).json(
            {
                error : "Updation failed",
                details : err.message
            }
        )
    }
}


export const getUsers = async(req, res) => {
    try{
        if(req.user.role !== "admin"){
            return res.status(401).json({message : "Forbidden"});
        }
        const users = await User.find().select("-password");
        res.json(users);

    }catch(err){
        res.status(500).json(
            {
                error : "Fetching failed",
                details : err.message
            }
        )
    }
}


