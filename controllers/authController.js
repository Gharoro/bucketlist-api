/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Registers a new user.
exports.signup_user = (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (!name || !email || !password || !confirm_password) {
    return res.status(400).json({ status: 400, error: 'Please fill all fields' });
  }
  if (password.length < 6) {
    return res.status(400).json({ status: 400, error: 'Password must be more than 6 characters' });
  }
  if (password !== confirm_password) {
    return res.status(400).json({ status: 400, error: 'Password do not match' });
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ status: 400, error: 'Email already exist, please login' });
    }
    const newUser = new User({
      name,
      email,
      password,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
          .then((user) => res.status(200).json({
            status: 200,
            message: 'Registration successful! Please login',
            user,
          })).catch(() => res.status(500).json({
            status: 500,
            error: 'There was an error processing your request. Please try again later.',
          }));
      });
    });
  });
};

// Logs a user in.
exports.login_user = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 400, error: 'Please enter a valid email and password' });
  }
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ status: 404, error: 'Email does not exist! Please signup' });
    }
    if (user.logged_in) {
      return res.status(400).json({ status: 400, error: 'You are already logged in' });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          date_created: user.date_created,
          logged_in: user.logged_in,
        };
        jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: 21600000 }, (err, token) => {
          User.findOneAndUpdate(
            { email },
            { $set: { logged_in: true } },
          ).then(() => {
            res.status(200).json({
              status: 200,
              message: 'Login successful...',
              token: `Bearer ${token}`,
            });
          }).catch(() => res.status(500).json({ status: 500, error: 'Login unsuccessful' }));
        });
      } else {
        return res.status(400).json({ status: 400, error: 'Incorrect password!' });
      }
    });
  });
};

// Logs a user out.
exports.logout_user = (req, res) => {
  const { logged_in } = req.user;
  if (logged_in) {
    User.findOneAndUpdate(
      { email: req.user.email },
      { $set: { logged_in: false } },
    ).then(() => {
      res.status(200).json({
        status: 200,
        message: 'Log out successful.',
      });
    }).catch(() => res.status(500).json({
      status: 500,
      error: 'An error occured',
    }));
  } else {
    res.status(400).json({
      status: 400,
      error: 'You are not logged in!',
    });
  }
};
