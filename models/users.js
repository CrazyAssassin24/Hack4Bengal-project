//const { name } = require('ejs');
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/textapp1");


const userSchema = mongoose.Schema({
    email:String,
    locality:String,
    name:String,
    common:String,
    rooms:String,
    fees:String,
    contact:String,
    other:String,
    password:String
})


module.exports = mongoose.model('user',userSchema);
