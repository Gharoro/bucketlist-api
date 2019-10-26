/* eslint-disable eol-last */
const express = require('express');
const passport = require('passport');
const multer = require('multer');

const router = express.Router();
const data = multer();

const bucketlistController = require('../../../controllers/bucketlistController');

// @route   POST /bucketlists/
// @desc    Create bucketlists
// @access  Private
router.post('/', data.none(), passport.authenticate('jwt', { session: false }), bucketlistController.create_bucketlist);

// @route   GET /bucketlists/
// @desc    List all the created bucket lists
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), bucketlistController.list_all_bucketlists);

// @route   GET /bucketlists/<id>
// @desc    Get single bucket list
// @access  Private
router.get('/:id', passport.authenticate('jwt', { session: false }), bucketlistController.get_bucketlist);

// @route   PUT /bucketlists/<id>
// @desc    Update single bucket list
// @access  Private
router.put('/:id', data.none(), passport.authenticate('jwt', { session: false }), bucketlistController.update_bucketlist);

// @route   DELETE /bucketlists/<id>
// @desc    Delete this single bucket list
// @access  Private
router.delete('/:bucket_id', passport.authenticate('jwt', { session: false }), bucketlistController.delete_bucketlist);

// @route   POST /bucketlists/<id>/items
// @desc    POST Create a new item in bucket list
// @access  Private
router.post('/:id/items', data.none(), passport.authenticate('jwt', { session: false }), bucketlistController.add_bucketlist_item);

// @route   GET /bucketlists/<id>/items
// @desc    List all the created items in a bucket list
// @access  Private
router.get('/:id/items', passport.authenticate('jwt', { session: false }), bucketlistController.list_all_items);

// @route   GET /bucketlists/<id>/items/<item_id>
// @desc    List a single item in a bucket list
// @access  Private
router.get('/:id/items/:item_id', passport.authenticate('jwt', { session: false }), bucketlistController.list_item);

// @route   PUT /bucketlists/<id>/items/<item_id>
// @desc    Update single item in a bucket list
// @access  Private
router.put('/:id/items/:item_id', data.none(), passport.authenticate('jwt', { session: false }), bucketlistController.update_item);

// @route   DELETE /bucketlists/<id>/items/<item_id>
// @desc    Delete a single item in a bucket list
// @access  Private
router.delete('/:bucket_id/items/:item_id', passport.authenticate('jwt', { session: false }), bucketlistController.delete_item);


module.exports = router;