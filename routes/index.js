var express = require('express');
var router = express.Router();
var Todo = require('../model/modelNotelist.js');
var mongoose = require('mongoose'); 
var url = 'mongodb://localhost:27017/notelist';

mongoose.connect(url, function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

// var todo = new Todo({title: 'title', priorty: 'normal', content: 'content', completed: false});
/* GET home page. */
router.get('/', function(req, res, next) {

});

module.exports = router;


