const mongoose = require('mongoose');

const EnfantSchema = mongoose.Schema({
    Prénom : String,
    Heures : String,
    Classe : String, 
    Prof : String ,
    HeuresReels : String , 
 })

const Enfant = mongoose.model('Enfant', EnfantSchema);

module.exports = Enfant;

