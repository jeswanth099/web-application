const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, './public')));

// Import and use routes
const rootRoutes = require("./routes/root");
const userRoutes = require("./routes/users");

app.use("/", rootRoutes);
app.use("/users", userRoutes); // Proper user routes should be defined

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

const userSchema = new mongoose.Schema({
  name: {type:String,required:true},
  email: {type:String,required:true},
  age: {type :Number,required:true},
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
