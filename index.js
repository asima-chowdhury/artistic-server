const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('addpost'))
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send('Hi! DB is working!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.86ciu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const addPostCollection = client.db("artisticDatabase").collection("customerAddPost");
    const addUserCollection = client.db("artisticDatabase").collection("allUsers");
    const designerProfileCollection = client.db("artisticDatabase").collection("designerProfile");
    const feedbackCollection = client.db("artisticDatabase").collection("feedback");

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

    app.post('/designerProfile', (req, res) => {
        const designer = req.body;
        console.log(designer)

        designerProfileCollection.insertOne(designer)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    //----------- Customer feedback start ---------
    app.post('/addReview', (req, res) => {
        const name = req.body.name;
        const projectName = req.body.projectName;
        const projectReview = req.body.projectReview;
        // console.log(name,projectName,projectReview);

        feedbackCollection.insertOne({ name, projectName, projectReview })
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/feedback', (req, res) => {
        feedbackCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })
    //------------ Customer feedback end  ----------

    // app.post('/customerAddPost', (req, res) => {
    //     const addPost = req.body;
    //     console.log(addPost)

    //     addPostCollection.insertOne(addPost)
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })
    // })
    //-----------  customer add post start ---------
    app.post('/customerAddPost', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const project = req.body.project;
        const details = req.body.details;
        const price = req.body.price;

        // const filePath = `${__dirname}/addpost/${file.name}`;

        console.log( name, email, project, details, price, image);

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimType,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        addPostCollection.insertOne({ name, email, project, details, price, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    //-----------  customer add post end ---------

    //-----------  customer all project post start ---------

    app.get('/customerProjectList', (req, res) => {
        addPostCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })

    //-----------  customer all project post end ---------

});
app.listen(process.env.PORT || port);
