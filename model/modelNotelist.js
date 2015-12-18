//Set mongo db
var mongoose = require('mongoose'); 

var notelistSchema = mongoose.Schema({
    username: String,
    email: String
});

var notelist = mongoose.model('notelist', notelistSchema);