const express = require('express');
const bodyParser = require('body-parser')
const path = require("path")
require("dotenv").config()

//Mongo Connection
var mongoose = require('mongoose');
const api = require('./routes/user.routes')
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost/dbphotogallery',{
    useNewUrlParser: true,
    useUnifiedTopology : true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, "client", "build")))
app.use(express.static(__dirname + '/client/public'));

app.use('/', api)
// Upload Endpoint
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log('Server Started...'));

app.use((req, res, next) => {
    // Error goes via `next()` method
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});