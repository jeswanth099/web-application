const { sign } = require('crypto');
const express = require('express')
const router=express.Router()
const path = require('path')
const { check, validationResult } = require('express-validator');
const User = require('../model/user');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','sign-up.html'));})

router.get('/signup', (req, res) => {
      res.sendFile(path.join(__dirname,'..','public','sign-up.html'));})

router.get('/signin', (req, res) => {
        res.sendFile(path.join(__dirname,'..','public','sign-up.html'));})


router.post('/register', async (req, res) => {
    // With express.json(), req.body now contains the JSON payload
    const { Firstname,Lastname, email, password} = req.body;
    try {
      // Create and save a new user document in MongoDB
      const newUser = new signup({ Firstname,Lastname, email, password });
      await newUser.save();
      console.log('New user saved:', newUser);
      // Respond with a JSON message confirming registration
      res.json({ message: `User Registered: ${Firstname},${Lastname} ,${email}, ${password}})`, signup: newUser });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'Error saving user' });
    }
  });

  // Sign-Up Route
router.post('/signup', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password should be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      password
    });

    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Sign-In Route
router.post('/signin', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



router.get('/user', async (req, res) => {
    const users = await User.find();
    res.json(users);
});



module.exports = router