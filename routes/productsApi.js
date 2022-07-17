const { application } = require("express");
const express = require("express");
const { model } = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Product route");
})

module.exports = router;