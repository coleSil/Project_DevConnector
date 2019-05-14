// Handle registering and adding users and other functions

const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router(); // Use express router
const {check, validationResult} = require('express-validator/check');
const User = require('../../models/User'); // Bring in User model 

// @route POST  api/users 
// @desc Test   Register user
// @access      Public 
router.post('/',[ 
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter password with six or more characters').isLength({min: 6 })
],
async (req, res) => {
    const errors = validationResult(req);
    // check for errors
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    // Decunstruct req.body. Usually name can be found req.body.name but it is not deconstructed
    const {name, email, password } = req.body;

    try{
        // See if user exists
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exists' }]});
        }

        // Get user's gravatar 
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrypt Password
        const salt = await bcrypt.genSalt(10); // 10 rounds is recommended 
        user.password = await bcrypt.hash(password, salt);

        // Save user to database 
        await user.save();

        // Return jsonwebtoken
        res.send('User registered');
    } catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }



});

module.exports = router;
