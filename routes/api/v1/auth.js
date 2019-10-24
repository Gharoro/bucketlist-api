/* eslint-disable eol-last */
const express = require('express');

const router = express.Router();

const authController = require('../../../controllers/authController');

// @route   POST /signup
// @desc    Registers a new user
// @access  Public
router.post('/signup', authController.signup_user);


// @route   POST /login
// @desc    Logs a user in
// @access  Public
router.post('/login', authController.login_user);

// @route   GET /logout
// @desc    Logs a user in
// @access  Private
router.get('/logout', authController.logout_user);

module.exports = router;