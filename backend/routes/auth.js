const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure this path is correct
const router = express.Router();

// Register Route
// Register Route
router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please fill all fields" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already registered" });
      }
  
      // ✅ Fix Hashing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      console.log("Hashed Password on Register:", hashedPassword); // Debugging
  
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ msg: "User registered successfully!" });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ msg: "Server error, please try again" });
    }
  });
  

// ✅ LOGIN Route
// LOGIN Route
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // ✅ 1. Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }
  
      console.log("Stored Hashed Password:", user.password); // Debugging
  
      // ✅ 2. Validate Password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password Match:", isMatch); // Debugging
  
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      // ✅ 3. Generate JWT Token
      const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });
  
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ msg: "Server error, please try again" });
    }
  });
  

module.exports = router;
