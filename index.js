const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { connectToDatabase } = require('./config/database');

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectToDatabase();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tipRoutes = require('./routes/tipRoutes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tips', tipRoutes);

app.get('/', (req, res) => {
  res.send('Hello Asandy!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
