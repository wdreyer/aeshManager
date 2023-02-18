var express = require("express");
var router = express.Router();
const Aesh = require("../models/Aesh");
const Enfant = require("../models/Enfant");

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

router.put("/:id", async (req, res) => {
  try {
    const updatedAesh = await Aesh.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
    res.status(200).json(updatedAesh);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
