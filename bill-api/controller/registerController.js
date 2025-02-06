const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await authService.register(username, email, password);
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
