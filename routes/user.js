const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const router = express.Router();

// List all users
router.get("/list", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Registration (only username, email, password required)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username OR email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with same username or email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.json({ message: '✅ Registration successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Incorrect username' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.json({ message: '✅ Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const authMiddleware = require('../middleware/authMiddleware');

router.post('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { name, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // JWT se id mil rahi hai
      { name, address },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: '✅ Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
