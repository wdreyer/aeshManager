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
        Prof : req.body.prof
       })
    .then((data) => {res.json({data})})
    })

    
router.put('/updateHeures', function (req,res,next){
  console.log("routing",req.body)
    Enfant.updateOne({
         _id : req.body.enfantID},
     {  HeuresReels :req.body.HeuresReels,
       })
    .then((data) => {res.json({data})})

    })





    router.post('/post', async function (req, res, next) {
        try {
          const newKid = new Enfant({
            Prénom: req.body.prenom,
            Classe: req.body.classe,
            Prof: req.body.prof,
            Heures: req.body.heures,
            HeuresReels: req.body.hReel,
          });
          const result = await newKid.save();
          const insertedKid = await Enfant.findById(result._id);
          res.status(201).json({ kid: insertedKid });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      });

      router.delete("/deleteone/:id", async function (req, res, next) {
        try {
          const result = await Enfant.deleteOne({ _id: req.params.id });
          res.status(201).json({ deletedKid: result });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error" });
        }
      });

      module.exports = router;
