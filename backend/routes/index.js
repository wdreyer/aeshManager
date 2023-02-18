var express = require('express');
var router = express.Router();
const Setting = require("../models/setting");

/* GET home page. */
router.get('/settings', function(req, res, next) {

  Setting.find({})
    .then((data) => {
        res.json({data : data})
    })

  
});

module.exports = router;
