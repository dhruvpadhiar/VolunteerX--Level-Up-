import {Conversation} from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import {Message} from "../models/message.model.js"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
// for chatting
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; // Ensure you have user authentication to populate `req.id`.
        const receiverId = req.params.id;

        const { textMessage: message, mediaType } = req.body; // Extract fields from body.
        let mediaUrl = null;
        console.log(message)

        // Check if a file is included in the request.
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            mediaUrl = cloudResponse.secure_url;
        }

        // Find or create a conversation.
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create a new message.
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: message || null, // Support text or media messages.
            mediaUrl: mediaUrl || null,
            mediaType: mediaType || null
        });

        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // Emit the message via Socket.IO if the receiver is online.
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({ success: true, newMessage });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('messages');
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
        
    } catch (error) {
        console.log(error);
    }
}