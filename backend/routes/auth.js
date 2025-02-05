const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/signup", async (req, res) => {
    const { username, firstname, lastname, password } = req.body;

    try {
        const user = new User({ username, firstname, lastname, password });
        await user.save();
        res.json({ success: true, message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Error signing up" });
    }
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        res.json({ success: true, message: "Login successful", user });
    } catch (err) {
        res.status(400).json({ success: false, message: "Error logging in" });
    }
});

module.exports = router;
