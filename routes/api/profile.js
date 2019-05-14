// Routes for fetching and updating profiles and other 

const express = require('express');
// Use express router
const router = express.Router();

// @route GET  api/profile 
// @desc Test  route
// @access     Public 
router.get('/', (req, res) => res.send('Profile Route'));

module.exports = router;