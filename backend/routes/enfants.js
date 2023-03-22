var express = require('express');
var router = express.Router();
const Enfant = require("../models/Enfant");
const Aesh = require("../models/Aesh");

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
  console.log('ici',req.body)
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
        console.log('Start of the route');
        try {
          
          const fixedId = "63ee549d4b6de7f8cedfcb46";
          console.log('Before Enfant.deleteOne');
          const result = await Enfant.deleteOne({ _id: req.params.id });
          console.log('After Enfant.deleteOne');
      
          console.log('Before Aesh.find');
          const aeshDocuments = await Aesh.find({});
          console.log('After Aesh.find');
          console.log(aeshDocuments);
          // Loop through each Aesh document
          for (const aesh of aeshDocuments) {
           console.log("delete in aesh",aesh.Planning)
            // Loop through the days in the Planning object
            for (const day in aesh.Planning) {

              // Loop through the cells in each day
              for (const cell in aesh.Planning[day]) {
                // Check if the current cell's _id matches the req.params.id
                if (aesh.Planning[day][cell]._id === req.params.id) {
                  // Replace the _id with the fixedId
                  console.log(aesh.Planning[day][cell])
                  aesh.Planning[day][cell]._id = fixedId;
                }
              }
            }        
             await aesh.save();   
      
            // Save the updated Aesh document
     
          }
                
            res.status(201).json({ deletedKid: result });
        }   
       catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error" });
        }
      });


      router.post('/postAndEdit', async function (req, res, next) {
        console.log(req.body)
        try {
          const { prenom, classe, prof, heures, hReel, planning } = req.body;
          const newEnfant = new Enfant({
            Prénom: prenom,
            Classe: classe,
            Prof: prof,
            Heures: heures,
            HeuresReels: hReel,
          });
          const result = await newEnfant.save();
          console.log("New Enfant saved:", result); // Add this log
          const idNewKid = result._id;
          const promises = planning.map(cell => {
            const { day, shift, addTo } = cell;
            cell.value = idNewKid;
            return Aesh.updateOne(
              { _id: addTo},
              { $set: { [`Planning.${day}.${shift}`]: idNewKid } }
            );
          });
          await Promise.all(promises);
      
          res.status(201).json({ kid: result});
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      });

      module.exports = router;
