//Set mongo db
var mongoose = require('mongoose'); 

var noteSchema = mongoose.Schema({
    title: String,
    priority: String,
    content: String,
    complete: Boolean,
    updated_at: {type:Date, default: Date.now},
});

var notelist = mongoose.model('notelist', notelistSchema);