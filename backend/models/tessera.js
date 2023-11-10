const mongoose = require('mongoose');

const tesseraSchema = mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
    email : {type : String},
    name: {type: String},
    dataNascita : String,
    residenza : String,
    codiceFiscale : String,
    cellulare : String,
    dataScadenza: String,
    numeroTessera: String,
},{timestamps: true})

module.exports = mongoose.model('Tessera', tesseraSchema)