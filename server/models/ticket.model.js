import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema({
    title : String,
    description : String,
    status : {
        type : String,
        default : "TODO",
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    },
    priority : String,
    deadline : Date,
    helpfulNotes : String,
    relatedSkills : [String],

    
}, {
    timestamps : true
})

export default mongoose.model("Ticket", ticketSchema);