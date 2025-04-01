// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data from incoming requests
app.use(express.json());

// Optional: Middleware to parse URL-encoded data (if you need to support form submissions too)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder (includes index.html, styles.css, etc.)
app.use('/',express.static(path.join(__dirname, './public')));
app.use('/',require("./routes/root"))

// Connect to MongoDB (ensure MongoDB is running locally or update the connection string)
mongoose.connect('mongodb://localhost/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Define a Mongoose schema and model for User
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model('User', userSchema);

// POST route to handle JSON data for user registration


// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
