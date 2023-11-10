const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Posts');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const auth = require("./middleware/auth");
const createPostController = require('./controllers/createPost');




mongoose.connect('mongodb://127.0.0.1/manab', {
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});




const app = express();


//Storing Sessions In MongoDB// this is supposed to be at the end but code doesnt work there
// Setup view engine
app.use(expressEdge);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'edge');


// Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.render('index', { posts });
});

app.use(express.static('public'));

app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/contact.html'));
});

app.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            // Handle the case where the post with the given ID is not found
            return res.status(404).send('Post not found');
        }
        res.render('post', { post });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/posts/new', (req, res) => {
    res.render('create');
});

app.use(fileUpload());
app.post("/posts/store", async (req, res) => {
    try {
        const { image } = req.files;

        if (!image) {
            return res.status(400).send('No file uploaded');
        }

        const post = await Post.create({ ...req.body, image: `/posts/${image.name}` });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(4000, () => {
    console.log('App listening on port 4000');
});


// Handle user registration and authentication routes...


const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)


//this is upto user registration everything is done like adding posts image blog from now on its for user auth//
