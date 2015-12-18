var express = require('express');
var router = express.Router();
var model = require('../model/modelNotelist.js');
// var mongoose = require('mongoose'); 
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/notelist';

var notelist;
// var notelistSchema = mongoose.Schema({
//     username: String,
//     email: String
// });

// var notelist = mongoose.model('notelist', notelistSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'homepage' });
});

// router.get('/userlist', function(req, res) {
//     res.render('userlist', { title: 'User List' });
// });

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");

        notelist = db.collection('notelist');
        notelist.find({}, function(err, list) {
            if (err) {
                res.send(err);
            }
            console.log('Searching data...');
            res.json(list);
            console.log('Sending data...');
        });

        db.close();
        console.log('DB closed');
    });


    // var notelist = mongoose.model('notelist');
    // notelist.find(function(err, list) {
    //     if (err) {
    //         res.send(err);
    //     }
    //     res.json(list);
    // });
    // res.render('userlist', { title: 'User List' });
});

    // router.post('/userlist', function(req, res) {

    //     notelist.create({
    //         text : req.body.text,
    //         done : false
    //     }, function(err, list) {
    //         if (err)
    //             res.send(err);

    //         list.find(function(err, lists) {
    //             if (err)
    //                 res.send(err)
    //             res.json(lists);
    //         });
    //     });

    // });

    // router.delete('/userlist', function(req, res) {
    //     notelist.remove({
    //         _id : req.params.todo_id
    //     }, function(err, list) {
    //         if (err)
    //             res.send(err);

    //         list.find(function(err, lists) {
    //             if (err)
    //                 res.send(err)
    //             res.json(lists);
    //         });
    //     });
    // });

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

module.exports = router;


