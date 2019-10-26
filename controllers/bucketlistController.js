/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable eol-last */
const mongoose = require('mongoose');

const Bucketlist = require('../models/Bucketlist');
const Item = require('../models/Item');

// Create a new bucket list.
exports.create_bucketlist = (req, res) => {
  const { name } = req.body;
  const created_by = req.user.id;
  if (!name) {
    return res.status(400).json({ status: 400, error: 'Please give a name to your bucketlist' });
  }
  const newBucketlist = new Bucketlist({ name, created_by });
  newBucketlist.save().then((bucketlist) => {
    res.status(200).json({
      status: 200,
      message: 'Bucketlist created',
      bucketlist,
    });
  }).catch(() => res.status(500).json({
    status: 500,
    error: 'Unable to create bucketlist at the moment.',
  }));
};

// List all new bucket list.
exports.list_all_bucketlists = (req, res) => {
  let { q } = req.query;
  q = (q === undefined) ? '' : q;
  let page = parseInt(req.query.page, 10);
  let limit = parseInt(req.query.limit, 10);
  const query = {};
  if (page < 0 || page === 0) {
    return res.status(400).json({ status: 400, error: 'Invalid page number' });
  }
  if (limit > 100) {
    return res.status(400).json({ status: 400, error: 'Maximum result limit is 100' });
  }
  page = (!page) ? 1 : page;
  limit = (!limit) ? 20 : limit;
  query.skip = limit * (page - 1);
  query.limit = limit;
  query.sort = { date_created: -1 };
  if (q) {
    Bucketlist.countDocuments({}, (err, totalCount) => {
      if (err) {
        return res.status(400).json({ status: 400, error: 'An unexpected error occured' });
      }
      const totalPages = Math.ceil(totalCount / limit);
      Bucketlist.find(
        { $text: { $search: q } },
        { __v: 0 },
        query,
      ).then((bucketlist) => {
        if (bucketlist.length > 0) {
          res.status(200).json({
            status: 200,
            message: `Bucketlists with ${q} in their name`,
            pagination: {
              result: bucketlist.length,
              page_num: page,
              total_pages: totalPages,
            },
            buckelists: bucketlist,
          });
        } else {
          res.status(404).json({
            status: 404,
            error: 'No bucket list match',
          });
        }
      }).catch(() => res.status(500).json({
        status: 500,
        error: 'Unable to process request',
      }));
    }).catch(() => res.status(400).json({ status: 400, error: 'An error occured' }));
  } else {
    Bucketlist.countDocuments({}, (err, totalCount) => {
      if (err) {
        return res.status(400).json({ status: 400, error: 'An unexpected error occured' });
      }
      Bucketlist.find({}, { __v: 0 }, query).then((bucketlist) => {
        const totalPages = Math.ceil(totalCount / limit);
        if (bucketlist.length > 0) {
          res.status(200).json({
            status: 200,
            message: 'Success',
            pagination: {
              result: bucketlist.length,
              page_num: page,
              total_pages: totalPages,
            },
            data: bucketlist,
          });
        } else {
          res.status(404).json({
            status: 404,
            error: 'No bucket list found',
          });
        }
      }).catch(() => res.status(500).json({
        status: 500,
        error: 'Unable to process request',
      }));
    }).catch(() => res.status(400).json({ status: 400, error: 'An error occured' }));
  }
};

// Get single bucket list
exports.get_bucketlist = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ status: 404, error: 'Invalid Id' });
  }
  Bucketlist.findById(id, { __v: 0 }).then((bucketlist) => {
    if (bucketlist) {
      res.status(200).json({
        status: 200,
        message: 'Success',
        bucketlist,
      });
    } else {
      res.status(404).json({
        status: 404,
        error: 'No bucket list found',
      });
    }
  }).catch(() => res.status(500).json({
    status: 500,
    error: 'Unable to process request',
  }));
};

// Update a bucket list
exports.update_bucketlist = (req, res) => {
  const { id } = req.params;
  let { name } = req.body;
  const current_user_id = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: 404, error: 'Invalid Id' });
  }
  Bucketlist.findById(id).then((bucketlist) => {
    name = (!name) ? bucketlist.name : name;
    if (!bucketlist) {
      return res.status(404).json({ status: 404, error: 'Bucketlist does not exist' });
    }
    if (current_user_id !== (bucketlist.created_by).toString()) {
      res.status(401).json({ status: 401, error: 'Not Authorized' });
    } else {
      Bucketlist.updateOne(
        { _id: id },
        { $set: { name } },
      ).then(() => res.status(200).json({
        status: 200,
        message: 'Bucketlist updated successfuly',
      })).catch(() => res.status(400).json({ status: 400, error: 'Unable to update bucketlist at the moment' }));
    }
  }).catch(() => res.status(500).json({
    status: 500,
    error: 'Unable to process request',
  }));
};

// Delete single bucket list
exports.delete_bucketlist = (req, res) => {
  const { bucket_id } = req.params;
  const current_user_id = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(bucket_id)) {
    res.status(404).json({ status: 404, error: 'Invalid Id' });
  }
  Bucketlist.findById(bucket_id).then((bucketlist) => {
    if (!bucketlist) {
      return res.status(404).json({ status: 404, error: 'Bucketlist does not exist' });
    }
    if (current_user_id === (bucketlist.created_by).toString()) {
      Bucketlist.deleteOne({ _id: bucket_id }).then(() => {
        res.status(200).json({
          status: 200,
          message: 'Bucketlist deleted',
        });
      }).catch(() => {
        res.status(500).json({
          status: 500,
          error: 'Unable to delete bucketlist at the moment',
        });
      });
    }
  }).catch(() => {
    res.status(404).json({ status: 404, error: 'Cannot find requested bucketlist' });
  });
};

// Create a new bucket list item.
exports.add_bucketlist_item = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const current_user_id = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: 404, error: 'Invalid Id' });
  }
  if (!name) {
    return res.status(400).json({ status: 400, error: 'Please give a name to your item' });
  }
  Bucketlist.findById(id).then((bucketlist) => {
    if (!bucketlist) {
      return res.status(404).json({ status: 404, error: 'Bucket list does not exist' });
    }
    if (current_user_id === (bucketlist.created_by).toString()) {
      const newItem = new Item({ name, bucket_list: id });
      bucketlist.items.push(newItem);
      bucketlist.save().then(() => {
        newItem.save().then((item) => {
          res.status(200).json({
            status: 200,
            message: 'Item added to bucket list',
            item,
          });
        });
      }).catch(() => res.status(400).json({ status: 400, error: 'Unable to add item to your bucketlist' }));
    } else {
      res.status(401).json({ status: 401, error: 'You can only add items to your bucketlist' });
    }
  }).catch(() => res.status(400).json({ status: 400, error: 'An error occured' }));
};

// List all items in a bucket list.
exports.list_all_items = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ status: 404, error: 'Invalid Id' });
  }
  Bucketlist.findById(id, { __v: 0 }).then((bucketlist) => {
    if (bucketlist) {
      res.status(200).json({
        status: 200,
        message: 'Success',
        items: bucketlist.items,
      });
    } else {
      res.status(404).json({
        status: 404,
        error: 'There are no items in this bucket list',
      });
    }
  }).catch(() => res.status(500).json({
    status: 500,
    error: 'Unable to process request',
  }));
};

// Get a single item in a bucket list.
exports.list_item = (req, res) => {
  const { id } = req.params;
  const { item_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(item_id)) {
    return res.status(404).json({ status: 404, error: 'Invalid Id' });
  }
  Bucketlist.findById(id).then((bucketlist) => {
    if (!bucketlist) {
      return res.status(404).json({ status: 404, error: 'Bucketlist does not exist' });
    }
    Item.findById(item_id, { __v: 0 }).then((item) => {
      if (!item || (item.bucket_list).toString() !== id.toString()) {
        return res.status(404).json({ status: 404, error: 'Item does not exist' });
      }
      res.status(200).json({
        status: 200,
        message: 'Success',
        item,
      });
    });
  }).catch(() => res.status(500).json({
    status: 500,
    error: 'Unable to process request',
  }));
};

// Update a bucket list
exports.update_item = (req, res) => {
  const { id } = req.params;
  const { item_id } = req.params;
  let { name, done } = req.body;
  const current_user_id = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(item_id)) {
    return res.status(404).json({ status: 404, error: 'Invalid Id' });
  }
  Bucketlist.findById(id).then((bucketlist) => {
    if (!bucketlist) {
      return res.status(404).json({ status: 404, error: 'Bucketlist does not exist' });
    }
    Item.findById(item_id).then((item) => {
      name = (!name) ? item.name : name;
      done = (!done) ? item.done : done.toLowerCase();
      if (!item) {
        return res.status(404).json({ status: 404, error: 'Item does not exist' });
      }
      if ((item.bucket_list).toString() !== id.toString()) {
        return res.status(404).json({ status: 404, error: 'Item does not belong to bucketlist' });
      }
      if (current_user_id !== (bucketlist.created_by).toString()) {
        res.status(401).json({ status: 401, error: 'Not Authorized' });
      } else {
        Item.updateOne(
          { _id: item_id },
          { $set: { name, done } },
        ).then(() => res.status(200).json({
          status: 200,
          message: 'Item updated successfuly',
        })).catch(() => res.status(400).json({
          status: 400,
          error: 'Unable to update item. "done" should be true or false',
        }));
      }
    });
  }).catch(() => res.status(500).json({
    status: 500,
    error: 'Unable to process request',
  }));
};

// Delete a single item in a bucket list.
exports.delete_item = (req, res) => {
  const { bucket_id } = req.params;
  const { item_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bucket_id) || !mongoose.Types.ObjectId.isValid(item_id)) {
    return res.status(404).json({ status: 404, error: 'Invalid Id' });
  }
  Bucketlist.findById(bucket_id).then((bucketlist) => {
    if (!bucketlist) {
      return res.status(404).json({ status: 404, error: 'Bucketlist does not exist' });
    }
    Item.findById(item_id).then((item) => {
      if (!item || (item.bucket_list).toString() !== bucket_id.toString()) {
        return res.status(404).json({ status: 404, error: 'Item does not exist' });
      }
      Item.deleteOne({ _id: item_id }).then(() => {
        res.status(200).json({
          status: 200,
          message: 'Item deleted',
        });
      }).catch(() => {
        res.status(500).json({
          status: 500,
          error: 'Unable to delete item at the moment',
        });
      });
    });
  }).catch(() => res.status(500).json({
    status: 500,
    error: 'Unable to process request',
  }));
};