const User = require('../models/User');

// Registers a new user.
exports.signup_user = (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Successfully registered. Please login.',
    user: 'user object',
  });
};

// Logs a user in.
exports.login_user = (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Login successful',
    token: 'Bearer wertyuidsdcvbnmcx',
  });
};

// Logs a user out.
exports.logout_user = (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'You have been logged out',
  });
};
