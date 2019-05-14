// Handle registering and adding users and other functions

const express = require('express');
// Use express router
const router = express.Router();

// @route GET  api/users 
// @desc Test  route
// @access     Public 
router.get('/', (req, res) => res.send('User Route'));

module.exports = router;
