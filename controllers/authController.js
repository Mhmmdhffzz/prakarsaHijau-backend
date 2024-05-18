const { createUser, findUserByEmail } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Name, email, and password are required"
    });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already in use"
      });
    }

    const newUser = {
      name,
      email,
      password,
      avatar: avatar || 'https://default-avatar-url.jpg',
      createdAt: new Date().toISOString()
    };

    const result = await createUser(newUser);

    const accessToken = jwt.sign({ id: result.insertedId, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      status: "success",
      message: "User registered",
      data: {
        user: {
          id: result.insertedId,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          createdAt: newUser.createdAt
        },
        token: accessToken
      }
    });
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "An error occurred while registering the user",
      error: error.message
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Email and password are required"
    });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email or password"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email or password"
      });
    }

    const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: "success",
      message: "User logged in",
      data: {
        token: accessToken
      }
    });
  } catch (error) {
    console.error(`Error logging in user: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in the user",
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
};
