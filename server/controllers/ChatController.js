import Chat from "../models/Chat.js";

//API Controller for Creating a new Chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id
        const chatData = {
            userId,
            messages: [],
            name : "New Chat",
            userName : req.user.name
        }
        await Chat.create(chatData)
        res.status(200).json({ success: true, message: "Chat created successfully" })
    } catch (error) {
        console.error("Error creating chat:", error)
        res.status(500).json({ success: false, message: "Failed to create chat" })
    }
}

//API Controller for Fetching all Chats of a User
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 })
        res.status(200).json({ success: true, chats })
    } catch (error) {
        console.error("Error fetching chats:", error)
        res.status(500).json({ success: false, message: "Failed to fetch chats" })
    }
}

//API Controller for Deleting a Chat
export const deleteChat = async (req, res) => {
    try {
        const {chatId} = req.body
        const userId = req.user._id
        await Chat.findOneAndDelete({ _id: chatId, userId })
        res.status(200).json({ success: true, message: "Chat deleted successfully" })
    } catch (error) {
        console.error("Error deleting chat:", error)
        res.status(500).json({ success: false, message: "Failed to delete chat" })
    }
}
