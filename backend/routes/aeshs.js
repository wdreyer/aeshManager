var express = require("express");
var router = express.Router();
const Aesh = require("../models/Aesh");
const Enfant = require("../models/Enfant");
const ObjectId = require('mongodb').ObjectId;

router.get("/", function (req, res, next) {
  Aesh.find({})
    .populate("Planning.lundi.Matin1 Planning.lundi.Matin2 Planning.lundi.Amidi1 Planning.lundi.Amidi2")
    .populate("Planning.mardi.Matin1 Planning.mardi.Matin2 Planning.mardi.Amidi1 Planning.mardi.Amidi2")
    .populate("Planning.jeudi.Matin1 Planning.jeudi.Matin2 Planning.jeudi.Amidi1 Planning.jeudi.Amidi2")
    .populate("Planning.vendredi.Matin1 Planning.vendredi.Matin2 Planning.vendredi.Amidi1 Planning.vendredi.Amidi2")
    .then((data) => {     
      res.json(data);
    });
});

router.get("/getOne/:id", async function (req, res, next) {
  try {
    const data = await Aesh.findById(req.params.id) .populate("Planning.lundi.Matin1 Planning.lundi.Matin2 Planning.lundi.Amidi1 Planning.lundi.Amidi2")
    .populate("Planning.mardi.Matin1 Planning.mardi.Matin2 Planning.mardi.Amidi1 Planning.mardi.Amidi2")
    .populate("Planning.jeudi.Matin1 Planning.jeudi.Matin2 Planning.jeudi.Amidi1 Planning.jeudi.Amidi2")
    .populate("Planning.vendredi.Matin1 Planning.vendredi.Matin2 Planning.vendredi.Amidi1 Planning.vendredi.Amidi2")
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data");
  }
});

router.put('/update', function (req,res,next){
  Aesh.updateOne({
       _id : req.body.aeshID},
   {  Prénom :req.body.prenom,
      Contrat : req.body.heures,
     })
  .then((data) => {res.json({data})})
  })

  router.put("/:id", async (req, res) => {
    const { Planning, prenom, contrat } = req.body; // destructure prenom and contrat from req.body
    try {
      const aesh = await Aesh.findOne({ _id: req.params.id });
      if (!aesh) {
        return res.status(404).json({ message: "Aesh not found" });
      }
      // Update prenom and contrat fields
      if (prenom) {
        aesh.Prénom = prenom;
      }
      if (contrat) {
        aesh.Contrat = contrat;
      }
      // Loop through each object in the Planning array and update the corresponding field in the document
      Planning.forEach(({ day, shift, value }) => {
        const path = `Planning.${day}.${shift}`;
        aesh.set(path, value);
      });   
      const updatedAesh = await aesh.save();
      console.log(updatedAesh.Planning)
      res.status(200).json(updatedAesh);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.put("/updateHours/:id", async (req, res) => {
  Aesh.updateOne({_id :  req.params.id},
    {
      HeuresReels :req.body.HeuresReels,
    })
    .then((data) => {res.json({data})})
 }
)


router.put("/editKid/:id", async (req, res) => {
  console.log("Received request at /editKid/:id");
  const { day, shift, value } = req.body.Planning;
  const addTo = req.body.Planning.addTo;
  console.log("in the router",req.body)
  try {
    // Find the Aesh document to update
    const aesh = await Aesh.findById(addTo);
    if (!aesh) {
      return res.status(404).json({ message: "Aesh not found" });
    }
    aesh.set(`Planning.${day}.${shift}`, value);
    const updatedAesh = await aesh.save();
    res.status(200).json(updatedAesh);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/post', async function (req, res, next) {
  try {
    console.log(req.body)
    const { Planning } = req.body;
    const newAesh = new Aesh({
      Prénom: req.body.prenom,
      Contrat : req.body.contrat,    
      HeuresReels : req.body.HeuresReels,
    });
    Planning.forEach(({ day, shift, value }) => {
      const path = `Planning.${day}.${shift}`;
      newAesh.set(path, value);
    });
    const result = await newAesh.save();   
    res.status(201).json({ result: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete("/deleteone/:id", async function (req, res, next) {
  try {
    const result = await Aesh.deleteOne({ _id: req.params.id });
    res.status(201).json({ deleteaesh: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
