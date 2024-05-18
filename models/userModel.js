const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const usersCollection = () => getDatabase().collection('users');

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  return usersCollection().insertOne(user);
};

const findUserByEmail = (email) => {
  return usersCollection().findOne({ email });
};

const findUserById = (id) => {
  return usersCollection().findOne({ _id: new ObjectId(id) });
};

const updateUserById = (id, updateFields) => {
  return usersCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
};
