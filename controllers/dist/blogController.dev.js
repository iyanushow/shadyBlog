"use strict";

// variable declarations
var mongoose = require('mongoose'),
    expressSanitizer = require('express-sanitizer'),
    bodyParser = require('body-parser'); // setup mongooe and database
// connect to database


mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); // create schema

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  rating: Number,
  created: {
    type: Date,
    "default": Date.now
  },
  releaseDate: {
    type: Date
  },
  topSongs: [String, String, String]
}); // create model 

var blogPost = mongoose.model("blogPost", blogSchema); // export controller function

module.exports = function (app) {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(expressSanitizer());
  app.get('/', function (req, res) {
    res.redirect('/blogs');
  }); //RESTFUL ROUTES
  // INDEX ROUTE

  app.get('/blogs', function (req, res) {
    blogPost.find({}, function (err, blogposts) {
      if (err) {
        console.log("error exists" + err);
      } else {
        res.render('index', {
          blogposts: blogposts
        });
      }
    });
  }); // NEW ROUTE

  app.get('/blogs/new', function (req, res) {
    res.render('new');
  }); // CREATE ROUTE

  app.post('/blogs', function (req, res) {
    req.body.blogPost.body = req.sanitize(req.body.blogPost.body);
    blogPost.create(req.body.blogPost, function (err, blog) {
      if (err) {
        console.log("error exists" + err);
      } else {
        res.redirect('/blogs');
      }
    });
  }); //SHOW ROUTE

  app.get('/blogs/:id', function (req, res) {
    blogPost.findById(req.params.id, function (err, blog) {
      if (err) {
        res.redirect('/blogs');
      } else {
        res.render('show', {
          blogPost: blog
        });
      }
    });
  }); //EDIT ROUTE

  app.get('/blogs/:id/edit', function (req, res) {
    blogPost.findById(req.params.id, function (err, blog) {
      if (err) {
        res.redirect('/blogs');
      } else {
        res.render('edit', {
          post: blog
        });
      }
    });
  }); //UPDATE ROUTE

  app.put('/blogs/:id', function (req, res) {
    req.body.blogPost.body = req.sanitize(req.body.blogPost.body);
    blogPost.findByIdAndUpdate(req.params.id, req.body.blogPost, function (err, blog) {
      if (err) {
        res.redirect('/blogs');
      } else {
        res.redirect("/blogs/".concat(req.params.id));
      }
    });
  }); //DESTROY ROUTE

  app["delete"]('/blogs/:id', function (req, res) {
    blogPost.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.redirect('/blogs');
      } else {
        res.redirect("/blogs");
      }
    });
  });
};