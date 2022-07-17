const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");

router.get("/", (req, res) => {
    res.send("Users route");
})

router.post("/", 
[
    check("fullname","Full name is required").not().isEmpty(), 
    check("phone","Phone number is required").isMobilePhone(), 
    check("email","Please enter a valid email").isEmail(),
    check(
        "password",
        "Please password should have at least 5 characters"
        ).isLength({ min:5 }),
],   
async (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const { fullname,phone,email,password } = req.body;
    
        let user  = await User.findOne({
            email:email
        });
        if(user){
            return res.status(400).json({
                errors:[{
                    msg:"User already exists"
                }]
            });
        }
        user = new User({
            fullname, 
            phone, 
            email, 
            password,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.save();
        const payload = {
            user:{
                id: user.id,
            },
        }
    ;
    jwt.sign(
        payload, 
        config.jwtSecret, 
        {expiresIn: 3600 * 24 },
        (err, token) => {
            if(err) throw err
            res.json({token});
        }
    );
        // res.send("User Created");
    }catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
    
});


module.exports = router;