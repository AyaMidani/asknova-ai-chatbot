import Chat from "../models/Chat.js"
import User from "../models/User.js"
import openai from "../configs/openai.js"
import imagekit from "../configs/imageKit.js"
import axios from "axios"


// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
    try {
        const { chatId, prompt } = req.body
        const userId = req.user._id
        if(req.user.credits < 1){
            return res.status(403).json({ success: false, message: "You don't have enough credits to send a message" })
        }
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
            model: "gemini-2.5-flash",
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
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to process message" })
    }
}
//Image Generation Controller Message Controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if(req.user.credits < 2){
            return res.status(403).json({ success: false, message: "You don't have enough credits for image generation" })
        }
        const { prompt, chatId, isPublished } = req.body
         if (!chatId || !prompt) {
            return res.status(400).json({ success: false, message: "Chat ID and prompt are required" })
        }
        const chat = await Chat.findOne({ _id: chatId, userId })
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" })
        }
        chat.messages.push({ role: "user", content: prompt ,timestamp: Date.now(),isImage: false})
        
        // Encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        //construct the image generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/asknova/${Date.now()}.png?tr=w-800,h-800`;

        //Trigger genration by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl,{ responseType: 'arraybuffer'})

        //convert to base64
        const base64Image =  `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

        //upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "asknova",
        });
        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }
        res.status(200).json({ success: true, reply })
        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to process image generation" })
    }
}