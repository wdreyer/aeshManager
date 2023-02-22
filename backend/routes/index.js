var express = require('express');
var router = express.Router();
const Setting = require("../models/setting");

/* GET home page. */
router.get('/settings/:id', function(req, res, next) {

  Setting.findById({_id : req.params.id})
    .then((data) => {
        res.json({data : data})
    })

  
});

module.exports = router;
