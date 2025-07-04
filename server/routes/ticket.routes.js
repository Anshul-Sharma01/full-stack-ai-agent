import express, { Router } from "express";
import { createTicket, getTicket, getTickets } from "../controllers/ticket.controllers";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { } from "../controllers/ticket.controllers.js";

const router = Router();

router.use(authenticateUser);

router.get("/", getTickets);
router.get("/:id", getTicket);
router.post("/", createTicket);

export default router;

