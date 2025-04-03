const { sign } = require('crypto');
const express = require('express')
const router=express.Router()
const path = require('path')
const { check, validationResult } = require('express-validator');
const User = require('../model/user');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'));})

router.get('/signup', (req, res) => {
      res.sendFile(path.join(__dirname,'..','public','sign-up.html'));})

router.get('/signin', (req, res) => {
        res.sendFile(path.join(__dirname,'..','public','sign-in.html'));})


router.post('/register', async (req, res) => {
  
    const { name, email, age} = req.body;
    try {
      const newUser = new User({ name, email, age });
      await newUser.save();
      console.log('New user saved:', newUser);
      res.json({ message: `User Registered: ${name} (${email}, ${age} years old)`, user: newUser });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'Error saving user' });
    }
  });

  // Sign-Up 
router.post('/signup', [
  check('Firstname', 'Enter firstName').name(),
  check('Lastname', 'Enter lastName').name(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password should be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    
    user = new User({
      email,
      password
    });

    await user.save();

    
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