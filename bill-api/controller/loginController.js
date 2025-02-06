const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};





