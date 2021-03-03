const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send('Hi! DB is working!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.86ciu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const addPostCollection = client.db("artisticDatabase").collection("customerAddPost");
    const addUserCollection = client.db("artisticDatabase").collection("allUsers");

    app.post('/clientAddPost', (req, res) => {
        const addPost = req.body;
        console.log(addPost)

        addPostCollection.insertOne(addPost)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addAllUsers', (req, res) => {
        const addUser = req.body;
        console.log(addUser)

        addUserCollection.insertOne(addUser)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/allUsers', (req, res) => {
        addUserCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })
});
app.listen(process.env.PORT || port);
