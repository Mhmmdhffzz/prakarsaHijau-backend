const { findUserById, updateUserById } = require('../models/userModel');

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    const sanitizedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar
    };

    res.json({
      status: "success",
      message: "ok",
      data: {
        user: sanitizedUser
      }
    });
  } catch (error) {
    console.error(`Error retrieving user data: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving user data",
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, avatar } = req.body;

    if (!name && !email && !avatar) {
      return res.status(400).json({
        status: "fail",
        message: "At least one of name, email, or avatar must be provided"
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) {
      const existingUser = await findUserByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          status: "fail",
          message: "Email already in use by another user"
        });
      }
      updateFields.email = email;
    }
    if (avatar) updateFields.avatar = avatar;

    const result = await updateUserById(userId, updateFields);

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    const updatedUser = await findUserById(userId);
    const sanitizedUser = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar
    };

    res.json({
      status: "success",
      message: "User profile updated",
      data: {
        user: sanitizedUser
      }
    });
  } catch (error) {
    console.error(`Error updating user profile: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the user profile",
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await findUserById(userId);

    if (user) {
      res.json({
        status: "success",
        message: "User retrieved",
        data: {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt
          }
        }
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }
  } catch (error) {
    console.error(`Error retrieving user with ID ${userId}: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the user",
      error: error.message
    });
  }
};

module.exports = {
  getCurrentUser,
  updateProfile,
  getUserById,
};
