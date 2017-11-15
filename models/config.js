var mongoose = require('mongoose');

var Config = mongoose.Schema({
    idVideoBanner: {type: String},
    skills: {
        web: {type: Number},
        ios: {type: Number},
        android: {type: Number},
        design: {type: Number}
    },
    customers: [
        {
            name: String,
            logo: String,
            address: String,
            email: String,
            telephone: String,
            feedback: String
        }
    ],
    stats: {
        projects: {type: Number},
        clients: {type: Number},
        lineCodes: {type: Number},
        cupOfCoffee: {type: Number}
    }
});

module.exports = mongoose.model('configs', Config);