var express = require('express');
var app = express();
var mongojs = require('mongojs');
var dbTododay = mongojs('tododay', ['tododay']);
var dbTododate = mongojs('tododate', ['tododate']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname +"/public"));
app.use(bodyParser.json());

//Search all data in the tododay for one day notes
app.post('/tododay', function(req,res) {
  // console.log("got it");
    console.log("searching...");
  dbTododay.tododay.find({year: req.body.year, month: req.body.month, date: req.body.date}, function(err, docs) {
    // console.log(docs);
    res.json(docs);
    console.log("sending...");
  });
});

//Search the information for that month in tododate
app.post('/tododate', function(req, res) {
  // console.log(req.body);
  console.log("searching...");
  dbTododate.tododate.find({year: req.body.year, month: req.body.month}, function(err, docs) {
    res.json(docs[0]);
    // console.log(docs[0]);
    console.log("sending...");
  })
})

function updateNoteAmount(docs, action) {
  // console.log("addNewNote(docs)");
  // console.log(docs);
  dbTododate.tododate.find({date: docs.date}, function(err, doc) {
    // console.log(doc);
    // console.log(doc.length);
    // console.log(docs);
    if (doc.length==0) { 
      if (action=="add") {
        console.log("adding one date note...");
        dbTododate.tododate.insert({date: docs.date, month: docs.month, year: docs.year, weather: "sunny", color: "none", news: "news links", amount: 1}, function(err, doc1) {
          // console.log(doc1);
        });
      } else if (action=="delete") {
        console.log("can not find any notes in this date..."); 
      } else {
        console.log("the action is not defined...")
      }
    } else {
      if (action=="add") {
        console.log("adding note amount...");
        // console.log(doc[0]);
        var newAmount = parseInt(doc[0].amount)+1;
        // console.log(newAmount);
        //Update the data in tododate
        dbTododate.tododate.findAndModify({
          query: {date: docs.date, month: docs.month, year: docs.year},
          update: {$set: {amount: newAmount}},
          new: true
        }, function(err, doc2) {
            // console.log(doc2);
        });
      } else if (action=="delete") {
        console.log("deleting all the data for that date...")
        if (parseInt(doc[0].amount)==1) {
          dbTododate.tododate.remove({_id: doc[0]._id}, function(err, doc) {
          });
        } else {
          console.log("decreasing note amount...");
          // console.log(doc[0]);
          var newAmount = parseInt(doc[0].amount)-1;
          // console.log(newAmount);
          //Update the data in tododate
          dbTododate.tododate.findAndModify({
            query: {date: docs.date},
            update: {$set: {amount: newAmount}},
            new: true
          }, function(err, doc2) {
              // console.log(doc2);
          });
        }
      }
    }
  });
}


//Add new one day note to database tododay
app.post('/tododay', function(req, res) {
  // console.log(req.body);
  dbTododay.tododay.insert(req.body, function(err, docs) {
    res.json(docs);
    //Add the same day note to the database tododate
    // dbTododate.tododate.insert({dayid: docs._id, date: date, title: docs.title, class: docs.class, complete: docs.complete, alarm: docs.alarm, weather: "sunny", news: "holiday"}, function(err, doc) {
    //   console.log(doc);
    updateNoteAmount(docs, "add");
    console.log("sending...");
  })
})


//Delete the data from tododay
app.delete('/tododay/:id', function(req,res) {
  var id = req.params.id;
  console.log("deleting...");
  //Find the date of deleting item 
  dbTododay.tododay.find({_id: mongojs.ObjectId(id)}, function(err, doc2) {
    console.log(doc2[0]);
    //Delete the data from tododate
    updateNoteAmount(doc2[0], "delete");
    console.log("sending...");
  });
  // console.log(id);
  dbTododay.tododay.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
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