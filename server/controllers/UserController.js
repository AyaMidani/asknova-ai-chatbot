import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import Chat from '../models/Chat.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2d' });
};

// API to register a new user

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const user = new User({ name, email, password });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ success: true, message: 'User registered successfully', token });
    } catch (err) {
    console.error(err); // add this
    res.status(500).json({ success: false, message: err.message }); // return real error
}
};

// API to login a user

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.status(200).json({ success: true, message: 'User logged in successfully', token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// API to get user data

export const getUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//API to get published images
export const getPublishedImages = async (req, res) => {
    try {
        const publishedImageMessages = await Chat.aggregate([
            { $unwind: "$messages" },
            { $match: {"messages.isImage": true, "messages.isPublished": true } },
            { $project: { _id: 0, imageUrl: "$messages.content", userName: "$messages.userName" } }
        ]);
        res.status(200).json({ success: true, images: publishedImageMessages.reverse() });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
