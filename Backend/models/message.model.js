import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    },
    message: {
        type: String,
        default: null
    },
    mediaUrl: {
        type: String,
        default: null
    },
    mediaType: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export const Message = mongoose.model('Message', messageSchema);
