var express = require('express');
var app = express();
var mongojs = require('mongojs');
var dbTododay = mongojs('tododay', ['tododay']);
var dbTododate = mongojs('tododate', ['tododate']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname +"/public"));
app.use(bodyParser.json());

//Search all data in the tododay for one day notes
app.get('/tododay', function(req,res) {
  // console.log("got it");
    console.log("searching...");
  dbTododay.tododay.find(function(err, docs) {
    // console.log(docs);
    res.json(docs);
    console.log("sending...");
  });
});


//Add new one day note to database tododay
app.post('/tododay', function(req, res) {
  // console.log(req.body);
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd+"-"+mm+"-"+yyyy;
  console.log("updating...");
  dbTododay.tododay.insert(req.body, function(err, docs) {
    res.json(docs);
    //Add the same day note to the database tododate
    dbTododate.tododate.insert({dayid: docs._id, date: date, title: docs.title, class: docs.class, complete: docs.complete, alarm: docs.alarm, weather: "sunny", news: "holiday"}, function(err, doc) {
      console.log(doc);
    });
    console.log("sending...");
  })
})


//Delete the data from tododay
app.delete('/tododay/:id', function(req,res) {
  var id = req.params.id;
  console.log("deleting...");
  // console.log(id);
  dbTododay.tododay.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
    //Delete the data from tododate
    dbTododate.tododate.remove({dayid: mongojs.ObjectId(id)}, function(err, docs) {
      console.log(docs);
    })
    console.log("sending...");
  });
});


//Update the data in tododay
app.put('/tododay/:id', function(req,res) {
  var id = req.params.id;
  console.log("saving...");
  // console.log(id);
  dbTododay.tododay.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {title: req.body.title, class: req.body.class, todo: req.body.todo, complete: req.body.complete, alarm: req.body.alarm}},
    new: true
  }, function(err, doc) {
    res.json(doc);
    //Update the data in tododate
    dbTododate.tododate.findAndModify({
      query: {dayid: mongojs.ObjectId(id)},
      update: {$set: {title: req.body.title, class: req.body.class, todo: req.body.todo, complete: req.body.complete, alarm: req.body.alarm}},
      new: true
    }, function(err, docs) {
      console.log(docs);
    })
    console.log("sending...");
  });
});

app.listen(3000);
console.log("Server running on port 3000");