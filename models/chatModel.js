import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true // Admin ID or Customer ID
    },
    message: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

let Chat;
try {
    Chat = mongoose.model("Chat");
} catch (error) {
    Chat = mongoose.model("Chat", chatSchema);
}

export default Chat;
