/* eslint-disable eol-last */
/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Cors middleware
app.use(cors());

// Environment variable middleware
require('dotenv').config();

// Database connection
const db = require('./config/dbconnection');

db.connect();

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route Files
const auth = require('./routes/api/v1/auth');
const bucketlists = require('./routes/api/v1/bucketlists');


// Home Page
app.get('/', (req, res) => {
  res.send('BucketList API');
});

// Use Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/bucketlists', bucketlists);

const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`App running on port ${port}`));