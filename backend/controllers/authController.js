const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ msg: 'Missing fields' });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id , email: user.username  }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ msg: 'User registered', token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ msg: 'Missing fields' });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id,email: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ msg: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.logout = (req, res) => {
  res.json({ msg: 'Logged out' });
};

exports.getHome = (req, res) => {
  res.json({ msg: `Welcome, user ${req.user.id}` });
};
