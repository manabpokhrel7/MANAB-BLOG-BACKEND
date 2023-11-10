const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Posts');
const fileUpload = require("express-fileupload");

mongoose.connect('mongodb://127.0.0.1/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const app = new express();

app.use(expressEdge);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'edge');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
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
        res.render('post', {
            post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/posts/new', (req, res) => {
    res.render('create')
});
app.use(fileUpload());
app.post("/posts/store", async (req, res) => {
    try {
        const { image } = req.files;

        if (!image) {
            // Handle the case where the file is not provided
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


const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)


//this is upto user registration everything is done like adding posts image blog from now on its for user auth//


const createUserController = require("./controllers/createUser");

app.get("/auth/register", createUserController);