import mongoose from 'mongoose';

var Blog = mongoose.Schema({
    name: { type: String, unique: true},
    thumbnail: String,
    content: String,
    status: { type: Boolean, default: true},
    dateCreated: {type: String, default: new Date()}
});

module.exports = mongoose.model('blogs', Blog);
