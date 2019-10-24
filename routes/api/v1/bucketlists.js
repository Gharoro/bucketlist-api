/* eslint-disable eol-last */
const express = require('express');

const router = express.Router();

// @route   GET /bucketlists
// @desc    List all the created bucket lists
// @access  Private
router.get('/', (req, res) => {
  res.send('view all bucketlists route');
});

module.exports = router;