// variable declarations
const mongoose = require('mongoose'),
expressSanitizer = require('express-sanitizer'),
bodyParser = require('body-parser');



// setup mongooe and database
// connect to database
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true});
// create schema
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    rating: Number,
    created: {type: Date, default: Date.now},
    releaseDate:{type: Date},
    topSongs: [String, String, String]
});
// create model 
const blogPost = mongoose.model("blogPost", blogSchema);
// export controller function
module.exports = function(app){
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(expressSanitizer());
    app.get('/', (req, res)=>{
        res.redirect('/blogs');
    });

    //RESTFUL ROUTES
    // INDEX ROUTE
    app.get('/blogs', (req, res)=>{
        blogPost.find({}, (err,blogposts)=>{
            if (err){
                console.log("error exists" + err);
            }
            else{
                res.render('index', {blogposts: blogposts})  
            }
        })
         
    });
    // NEW ROUTE
    app.get('/blogs/new', (req,res) =>
    {
        res.render('new');
    });
    // CREATE ROUTE
    app.post('/blogs', (req, res)=> {
        req.body.blogPost.body = req.sanitize(req.body.blogPost.body)
        blogPost.create(req.body.blogPost, (err, blog) => {
            if (err){
                console.log("error exists" + err);
            }
            else{
                res.redirect('/blogs')  
            }
        });
    });   

    //SHOW ROUTE
    app.get('/blogs/:id', (req,res)=>{
        blogPost.findById(req.params.id, (err, blog)=>{
            if (err){
                res.redirect('/blogs') ;
            }
            else{
                res.render('show', {blogPost: blog}); 
            }

        });

    });

    //EDIT ROUTE
    app.get('/blogs/:id/edit', (req,res)=>{
        blogPost.findById(req.params.id, (err, blog)=>{
            if (err){
                res.redirect('/blogs') ;
            }
            else{
                res.render('edit', {post: blog}); 
            }

        });
    }); 

    //UPDATE ROUTE
    app.put('/blogs/:id', (req,res) =>{
        req.body.blogPost.body = req.sanitize(req.body.blogPost.body)
        blogPost.findByIdAndUpdate(req.params.id, req.body.blogPost, (err, blog)=>{
            if (err){
                res.redirect('/blogs') ;
            }
            else{
                res.redirect(`/blogs/${req.params.id}`) 
            }

        }); 
    });

    //DESTROY ROUTE
    app.delete('/blogs/:id',  (req,res) =>{
        blogPost.findByIdAndRemove(req.params.id, err=>{
            if (err){
                res.redirect('/blogs') ;
            }
            else{
                res.redirect(`/blogs`) 
            }

        }); 
    });
} 