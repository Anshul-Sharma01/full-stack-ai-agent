import { inngest } from "../client.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";
import sendEmail from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    { id : "on-user-signup", retries : 2 },
    { event : "user/signup" },
    async({event, step}) => {
        try{
            const { email } = event.data;
            const user = await step.run("get-user-email", async() => {
                const userObject = await User.findOne({ email });
                if(!userObject){
                    throw new NonRetriableError("User no longer exists in our database");
                }
                return userObject;
            });
            await step.run("send-welcome-email", async() => {
                const subject = `Welcome to the app`;
                const message = `Hi,
                \n\n
                Thanks for signing up. We're glad to have you onboard !!
                `
                await sendEmail(user.email, subject, message);
            })
            return { success : true }
        }catch(err){
            console.error("❌ Error running step", err.message);
            return { success : false }
        }
    } 
)