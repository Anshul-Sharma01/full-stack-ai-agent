import express, { Router } from "express";
import { getUsers, signupUser, updateUser } from "../controllers/user.controllers";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", login);
router.pose("/logout", logout);


router.use(authenticateUser);
router.post("/update-user", updateUser);
router.get("/users", getUsers);


export default router;

