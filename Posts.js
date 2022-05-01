var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: String,
    image: String,
    categories: String,
    context: String,
    slug: String,
    author: String,
    views: Number

},{collection: 'posts'});

var Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;