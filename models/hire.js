var mongoose = require('mongoose');

var Hire = mongoose.Schema({
    title: { type: String, unique: true},
    dateCreated: {type: String, default: new Date()},
    dateExpire: {type: String},
    status: { type: Boolean, default: true},
    thumbnail: String,
    requireHire: String
});

module.exports = mongoose.model('hire', Hire);