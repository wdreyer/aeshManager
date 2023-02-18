const mongoose = require('mongoose');

const EnfantSchema = mongoose.Schema({
    Prénom : String,
    Heures : Number,
    Classe : String, 
    Prof : String ,
 })

const Enfant = mongoose.model('Enfant', EnfantSchema);

module.exports = Enfant;

