const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");

router.get("/", auth,async(req, res) => {
    try{
        console.log(req.user);
        const user = await User.findById(
            req.user.id
        ).select("-password");
        console.log(user);
        res.json(user);
    } catch (error) {
        console.log(error.message)
    }
});

router.post("/", 
[
    check("email","Please enter a valid email").isEmail(),
    check(
        "password",
        "Password is required"
        ).exists(),
],   
async (req, res) => {
    const errors = validationResult(req);
    // console.log(req.body);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const { email,password } = req.body;
    
        let user  = await User.findOne({
            email:email
        });
        if(!user){
            return res
            .status(400)
            .json({
                errors:[{
                    msg: "Invalid email or password"
                }]
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res
            .status(400)
            .json({
                errors:[{
                    msg: "Invalid email or password"
                }]
            });
        }
        
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