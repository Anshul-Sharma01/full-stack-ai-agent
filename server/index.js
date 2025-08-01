import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/onSignup.js";
import { onTicketCreated } from "./inngest/functions/onTicketCreate.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


import useRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

app.use("/api/auth", useRoutes);
app.use("/api/ticket", ticketRoutes);

app.use("/api/inngest", serve({
    client : inngest,
    functions : [onUserSignup, onTicketCreated]
}))

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })



