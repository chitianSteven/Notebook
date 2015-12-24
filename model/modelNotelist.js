//Set mongo db
var mongoose = require('mongoose'); 

var NoteSchema = new mongoose.Schema({
    title: String,
    priorty: String,
    content: String,
    complete: Boolean,
    date: {type:Date, default: Date.now},
});

module.exports = mongoose.model('Note', NoteSchema);