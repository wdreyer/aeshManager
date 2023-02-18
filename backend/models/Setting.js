const mongoose = require('mongoose');

const SettingSchema = mongoose.Schema({
    Ecole : String,
    Matin1 : { hStart : String, hEnd : String },
    Matin2 : { hStart : String, hEnd : String }, 
    AMidi1 : { hStart : String, hEnd : String } ,
    AMidi2 : { hStart : String, hEnd : String },
    CP : Array,
    CPteachers : Array,
    CPCEI : Array,
    CE1 : Array,
    CE1CE2 : Array,
    CE2 : Array,
    CE2CM1 : Array,
    CM1 : Array,
    CM1CM2 : Array,
    CM2: Array,
    Autres : Array,
    AutresTeachers : Array,
 })

const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;

