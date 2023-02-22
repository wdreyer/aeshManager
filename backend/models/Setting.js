const mongoose = require('mongoose');

const SettingSchema = mongoose.Schema({
    Ecole : String,
    Matin1 : { hStart : String, hEnd : String },
    Matin2 : { hStart : String, hEnd : String }, 
    AMidi1 : { hStart : String, hEnd : String } ,
    AMidi2 : { hStart : String, hEnd : String },
    username : String,
    Classes : Array,
 })

const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;

