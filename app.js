var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
const express = require('express');
const server = express();
const port = 4000;
const { exec } = require('child_process');
var bodyParser = require('body-parser')
const path = require('path')
server.use( bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
const functions = require('./functions.js')
var fs = require('fs');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cloud-ba7c0.firebaseio.com"
})
var db = admin.database()

server.get('/', (req,res)=>{
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

server.get('/new', (req,res)=>{
  const id = req.query.id
  functions.new(id).then((r)=>{
    res.status(201).send(r)
  })
})

server.post("/clone", (req, res) => {
  const body = req.body
  var ref = db.ref(`${body.id}`);
  try{
    ref.on("value", function(snapshot) {
      const data = snapshot.val()
      if(data.token == body.token){
        process.chdir(body.id)
        functions.clone(body.url, body.id).then((c)=>{
          res.status(201).send('Repository Cloned')
        })
      }else{
        res.status(401).send('Failed')
      }
    }, function (errorObject) {
      res.status(500).send('Error')
    });
  }catch(err){
    res.status(404).send('Could not locate ID')
  }
})

server.post("/install", (req, res) => {
  const body = req.body
  var ref = db.ref(`${body.id}`);
  try{
    ref.on("value", function(snapshot) {
      const data = snapshot.val()
      if(data.token == body.token){
        process.chdir(body.name)
        functions.install(body.url, body.id, body.name).then((c)=>{
          res.status(201).send('Packages Installed')
        })
      }else{
        res.status(401).send('Failed')
      }
    }, function (errorObject) {
      res.status(500).send('Error')
    });
  }catch(err){
    res.status(404).send('Could not locate ID')
  }
})

server.post("/build", (req, res) => {
  const body = req.body
  var ref = db.ref(`${body.id}`);
  try{
    ref.on("value", function(snapshot) {
      const data = snapshot.val()
      if(data.token == body.token){
        functions.build(body.id, body.name).then((c)=>{
          res.status(201).send('Build Complete')
        })
      }else{
        res.status(401).send('Failed')
      }
    }, function (errorObject) {
      res.status(500).send('Error')
    });
  }catch(err){
    res.status(404).send('Could not locate ID')
  }
})

server.post("/logs", (req, res) => {
  const body = req.body
  try{
    fs.appendFile('./logs.txt', body.msg, function (err) {
      if (err) throw err;
      console.log('log added');
      res.status(201).send('log added')
    });
  }catch(err){
    res.status(404).send('Could not locate ID')
  }
})

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
