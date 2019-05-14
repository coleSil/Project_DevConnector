// Handle getting JSON webtoken for authentication 

const express = require('express');
// Use express router
const router = express.Router();

// @route GET  api/auth 
// @desc Test  route
// @access     Public 
router.get('/', (req, res) => res.send('Auth Route'));

module.exports = router;