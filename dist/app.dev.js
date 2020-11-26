"use strict";

var express = require('express'),
    controller = require('./controllers/blogController'),
    methodOverride = require('method-override'),
    app = express();

app.set('view engine', 'ejs');
app.use(express["static"]('./public'));
app.use(methodOverride('_method'));
controller(app);
app.listen(3000, function (err) {
  if (err) {
    console.log("error exists");
  } else {
    console.log("Server Running");
  }
});