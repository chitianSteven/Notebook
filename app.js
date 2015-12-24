var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// app.use(express.static(__dirname +"/public"));
// app.use(bodyParser.json());


var todos = require('./routes/index')
app.use('/index', todos);

app.listen(3000);
console.log("Server running on port 3000");