//Express configuration options
const express = require('express');
const app = express();
const port = 3000;

//Database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const crypto = require('crypto')


// Set some defaults (required if your JSON file is empty)
db.defaults({ urls: []})
  .write()


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/shorten/:url', function (req, res) {
    let baseName = "shortener.tratnayake.com/"
    console.log(req.params)
    // console.log("The URL is: " + req.params.url)
    // res.send("The URL you want to shorten is: " + req.params.url);

    //0. First, get the URL to shorten
    let url = req.params.url

    //Check: Make sure it's a legitimate URL to shorten
    //Legitimate == a URL (figure this out through regex)
    regexp = /^(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if(!regexp.test(url)){
        console.log('URL: ' + url + ' is a bad URL. Swat it down.')
        return res.status(400).send('Bad Request');
    }


    //1. Once we have the URL, shorten it
    let hash = crypto.createHash('md5').update(url).digest('hex');

    //Check if this already exists in the database
    results = db.get('urls').find({hash, url}).value()
    console.log('Checking if exists:')
    console.log(results)

    //If it doesn't, add to the database
    if (results === undefined){
        let entry = { hash, url}
        console.log(entry)
        db.get('urls').push(entry).write();
    }

    //2. Send back the shortened URL
    fullUrl = baseName + hash
    res.send(fullUrl)
});

//TODO: Add generic 404 handler

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
