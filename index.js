const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

const path = require('path');

const app = express();

const Posts = require('./Posts.js');

mongoose.connect('mongodb+srv://root:Pass1234@cluster0.zjhm1.mongodb.net/cctnews?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(function () {
    console.log('Connected to database');
}).catch(function (err) {
    console.log(err.message);
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/', (req, res) => {

    if (req.query.search == null) {

        Posts.find({}).sort({ '_id': -1 }).exec(function (err, posts) {
            // console.log(posts[0]);
                posts = posts.map(function (val) {
                        return {
                            title: val.title,
                            context: val.context,
                            //shortDescription: val.context.shortDescription.substr(0,100),
                            image: val.image,
                            slug: val.slug,
                            categorie: val.categorie
                            
                        }
                })


            Posts.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop){
                // console.log(posts[0]);
                 postsTop = postsTop.map(function(val){
                         return {
                            title: val.title,
                            context: val.context,
                            //shortDescription: val.context.shortDescription.substr(0,100),
                            image: val.image,
                            slug: val.slug,
                            categorie: val.categorie,
                            views: val.views
                             
                         }
                 })
                 
                 res.render('home',{posts:posts,postsTop:postsTop});
                
             })

             

            
        })
        
    }else{

        Posts.find({title: {$regex: req.query.search,$options:"i"}},function(err,posts){
            console.log(posts);
            posts = posts.map(function(val){
                return {
                    title: val.title,
                    context: val.context,
                    //shortDescription: val.context.shortDescription.substr(0,100),
                    image: val.image,
                    slug: val.slug,
                    categorie: val.categorie,
                    views: val.views
                     
                    
                }
        })
            res.render('search',{posts:posts,count:posts.length});
        })


        
    }

  
});


app.get('/:slug',(req,res)=>{
    //res.send(req.params.slug);
    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc : {views: 1}}, {new: true},function(err,answers) {
       // console.log(answers);
       if(answers != null){

        Posts.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop){
            // console.log(posts[0]);
             postsTop = postsTop.map(function(val){
                     return {
                        title: val.title,
                        context: val.context,
                        //shortDescription: val.context.shortDescription.substr(0,100),
                        image: val.image,
                        slug: val.slug,
                        categorie: val.categorie,
                        views: val.views
                         
                     }
             })

             res.render('single',{news:answers,postsTop:postsTop});

            })


        
       }else{
           res.redirect('/');
       }
    })
    
})


app.listen(5000,()=>{
    console.log('server connect!');
})