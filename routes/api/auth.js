// Handle getting JSON webtoken for authentication 

const express = require('express');
// Use express router
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken'); 
const config = require('config');
const bcrypt = require('bcryptjs');


// @route GET  api/auth 
// @desc Test  route
// @access     Public 
router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        console.error( err.message );
        res.status(500).send('server error');
    }
});

// @route POST  api/auth 
// @desc   Authenticate User and get token / Logging in 
// @access      Public 
router.post('/',[ 
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()
],
async (req, res) => {
    const errors = validationResult(req);
    // check for errors
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    // Decunstruct req.body. Usually name can be found req.body.name but it is not deconstructed
    const { email, password } = req.body;

    try{
        // See if user exists and save to 'user' 
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]}); 
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),{ expiresIn: 360000 }, 
        (err, token) => {
            if(err) throw err;
            res.json({ token });
        }
        );

    } catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }



});

module.exports = router;