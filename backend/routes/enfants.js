var express = require('express');
var router = express.Router();
const Enfant = require("../models/Enfant");

/* GET users listing. */
router.get('/', function(req, res, next) {
    Enfant.find({})
    .then((data) => {
        res.json({data : data})
    })
});

router.get('/getOne/:id', function(req, res, next) {
    Enfant.findById(req.params.id)
    .then((data) => {
        res.json({data : data})
    })
});

router.put('/update', function (req,res,next){
    Enfant.updateOne({
         _id : req.body.enfantID},
     {  Prénom :req.body.prenom,
        Heures : req.body.heures,
        Classe : req.body.classe, 
        Prof : req.body.prof })
    .then((data) => {res.json({data})})

    })

module.exports = router;
