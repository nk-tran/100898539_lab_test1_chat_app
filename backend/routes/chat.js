const express = require("express");
const router = express.Router();
const GroupMessage = require("../models/GroupMessage");
const PrivateMessage = require("../models/PrivateMessage");

// Get all messages for a specific room
router.get("/room/:room", async (req, res) => {
    try {
        const messages = await GroupMessage.find({ room: req.params.room });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving messages" });
    }
});

// Send a message to a room
router.post("/room", async (req, res) => {
    const { from_user, room, message } = req.body;
    
    try {
        const newMessage = new GroupMessage({ from_user, room, message });
        await newMessage.save();
        res.json({ success: true, message: "Message sent" });
    } catch (err) {
        res.status(500).json({ message: "Error sending message" });
    }
});

// Get private messages between two users
router.get("/private/:from/:to", async (req, res) => {
    try {
        const messages = await PrivateMessage.find({
            $or: [
                { from_user: req.params.from, to_user: req.params.to },
                { from_user: req.params.to, to_user: req.params.from }
            ]
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving private messages" });
    }
});

// Send a private message
router.post("/private", async (req, res) => {
    const { from_user, to_user, message } = req.body;
    
    try {
        const newMessage = new PrivateMessage({ from_user, to_user, message });
        await newMessage.save();
        res.json({ success: true, message: "Private message sent" });
    } catch (err) {
        res.status(500).json({ message: "Error sending private message" });
    }
});

module.exports = router;
