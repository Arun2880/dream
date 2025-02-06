const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

exports.register = async (username, email, password) => {
  const user = new User({ username, email, password });
  await user.save();
  return user;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};
