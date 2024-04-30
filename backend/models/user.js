const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// const { TOKEN_KEY } = process.env

const userSchema = mongoose.Schema({
    name : String,
    email : {type : String, required : true, unique : true},
    userType : String,
    password : String,
    token : String,
    wishlist : [{productId : {type: mongoose.Schema.Types.ObjectId, ref : "product"}, quantity : Number}],
    resetCode: String,
    tessera: {type: mongoose.Schema.Types.ObjectId, ref : "Tessera"},
    partecipazione: {type : Number, default: 0},
    partecipazione5: {type: Number, default: 0},
    tesseraGratis: {type: Boolean, default: false},
    scontoGratis: {type: Boolean, default: false},
    numTessera: {type: String},
},{timestamps: true})


// userSchema.methods.generateAuthToken = function () {
//     this.token = jwt.sign({ userID: this._id, email: this.email }, TOKEN_KEY, { expiresIn: '10h' })
// }

module.exports = mongoose.model('User',userSchema)