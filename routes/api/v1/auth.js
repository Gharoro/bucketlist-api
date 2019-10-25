/* eslint-disable eol-last */
const express = require('express');
const multer = require('multer');
const passport = require('passport');

const router = express.Router();
const auth = multer();

const authController = require('../../../controllers/authController');

// @route   POST /signup
// @desc    Registers a new user
// @access  Public
router.post('/signup', auth.none(), authController.signup_user);


// @route   POST /login
// @desc    Logs a user in
// @access  Public
router.post('/login', auth.none(), authController.login_user);

// @route   GET /logout
// @desc    Logs a user in
// @access  Private
router.get('/logout', passport.authenticate('jwt', { session: false }), authController.logout_user);

module.exports = router;