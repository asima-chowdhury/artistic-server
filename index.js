const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
const ObjectId = require('mongodb').ObjectID;

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
    const postApplyCollection = client.db("artisticDatabase").collection("postApply");
    const allAdmin = client.db("artisticDatabase").collection("admin");
    const approvedPostCollection = client.db("artisticDatabase").collection("approvedPost");
    const rejectedPostCollection = client.db("artisticDatabase").collection("rejectedPost");
    const adminAllPostCollection = client.db("artisticDatabase").collection("adminAllPost");

    // all users info start
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

    app.get('/allUsers/:email', (req, res) => {
        addUserCollection.find({ email: req.params.email })
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })
    // all users info end

    // all designers info start
    app.post('/designerProfile', (req, res) => {
        const designer = req.body;
        console.log(designer)

        designerProfileCollection.insertOne(designer)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/allDesignersProfile', (req, res) => {
        designerProfileCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })
    // all designers info end

    //post apply start
    app.post('/postApply', (req, res) => {
        const postApply = req.body;
        console.log(postApply)

        postApplyCollection.insertOne(postApply)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/singlePostApply', (req, res) => {
        postApplyCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })
    //post apply ends

    // Customer feedback start 
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
    // Customer feedback end  

    // app.post('/customerAddPost', (req, res) => {
    //     const addPost = req.body;
    //     console.log(addPost)

    //     addPostCollection.insertOne(addPost)
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })
    // })

    // customer add post start
    app.post('/customerAddPost', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const project = req.body.project;
        const details = req.body.details;
        const price = req.body.price;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;

        // const filePath = `${__dirname}/addpost/${file.name}`;

        console.log(name, email, project, details, price, startDate, endDate, image);

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimType,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        addPostCollection.insertOne({ name, email, project, details, price, startDate, endDate, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/customerProjectList', (req, res) => {
        addPostCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })
    // customer add post end

    // customer all project post start

    app.get('/customerProjectList/:email', (req, res) => {
        addPostCollection.find({ email: req.params.email })
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })

    // customer all project post end

    app.get('/postApply/:mainId', (req, res) => {
        postApplyCollection.find({ mainId: req.params.mainId })
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })
    //for designer activity
    // app.get('/postApply/:email', (req, res) => {
    //     postApplyCollection.find({ { email: req.params.email })
    //         .toArray((err, documents) => {
    //             return res.send(documents);
    //         })
    // })

    app.get('/allDesignersProfile/:email', (req, res) => {
        designerProfileCollection.find({ email: req.params.email })
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })

    //single Pending Post
    app.get('/singlePendingPost/:id', (req, res) => {
        console.log(req.params.id);
        // let id = req.params.id;

        adminAllPostCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })

    //approve post
    app.post('/approvedPost', (req, res) => {
        const approvedPost = req.body;
        console.log(approvedPost)

        approvedPostCollection.insertOne(approvedPost)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/getApprovedPost', (req, res) => {
        approvedPostCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })

    //admin all requested post
    app.post('/adminAllPost', (req, res) => {
        const adminAllPost = req.body;
        console.log(adminAllPost)

        adminAllPostCollection.insertOne(adminAllPost)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/getAdminAllPost', (req, res) => {
        adminAllPostCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })

    //approved projects by admin
    app.get('/approvedPostList/:customerEmail', (req, res) => {
        approvedPostCollection.find({ customerEmail: req.params.customerEmail })
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })

    //designer view approved post
    app.get('/approvedPostList', (req, res) => {
        approvedPostCollection.find({})
            .toArray((err, documents) => {
                return res.send(documents);
            })
    })

    //admin delete approved post
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);

        adminAllPostCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
                res.send(result.deletedCount > 0);
            })
    })
});
app.listen(process.env.PORT || port);