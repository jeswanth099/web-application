const express = require('express')
const router=express.Router()
const path = require('path')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','pages','user.html'));})


router.post('/register', async (req, res) => {
    // With express.json(), req.body now contains the JSON payload
    const { name, email, age } = req.body;
    try {
      // Create and save a new user document in MongoDB
      const newUser = new User({ name, email, age });
      await newUser.save();
      console.log('New user saved:', newUser);
      // Respond with a JSON message confirming registration
      res.json({ message: `User Registered: ${name} (${email}, ${age} years old)`, user: newUser });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'Error saving user' });
    }
  });


router.get('/user', async (req, res) => {
    const users = await User.find();
    res.json(users);
});



module.exports = router