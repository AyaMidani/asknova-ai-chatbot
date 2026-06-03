import Chat from "../models/Chat.js"
import User from "../models/User.js"
import openai from "../configs/openai.js"

// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
    try {
        const { chatId, prompt } = req.body
        const userId = req.user._id

        // Validate input
        if (!chatId || !prompt) {
            return res.status(400).json({ success: false, message: "Chat ID and prompt are required" })
        }
        const chat = await Chat.findOne({ _id: chatId, userId })

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" })
        }
        chat.messages.push({ role: "user", content: prompt ,timestamp: Date.now(),isImage: false})

        const {choices} = await openai.chat.completions.create({
            model: "gemini-3.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        const reply ={...choices[0].message,timestamp: Date.now(),isImage: false}
        res.status(200).json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: 1 } })

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to process message" })
    }
}