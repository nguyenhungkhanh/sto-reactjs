var mongoose = require('mongoose');

var Product = mongoose.Schema({
    name: {type: String, unique: true},
    category: [String],
    images: [
        {
            data: '',
            isMainImage: Boolean
        }
    ],
    description: {type: String},
    version: {type: String, default: '1.0.0'},
    dateCreated: {type: String},
    dateUpdated: {type: String},
    status: {type: Boolean, default: true},
    companies: [String]
});

module.exports = mongoose.model('Product', Product);
